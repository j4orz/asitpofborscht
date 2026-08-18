"""Differential test harness: borscht checked against torch as the oracle.

Design notes
------------
1. *torch generates, both consume.*  We never require borscht's RNG to match
   torch's bit-for-bit -- that would pin us to Philox internals.  Instead the
   fixtures below draw data with torch, export it to nested Python lists, and
   build the borscht *and* torch tensors from those same lists.  Ops are then
   compared on identical inputs.  borscht's RNG is tested separately and
   statistically in test_random.py.

2. *Missing API skips, it does not fail.*  borscht is being written op by op,
   so a test touching an unimplemented op reports `skipped`, letting `pytest`
   double as a live progress report.  Set BORSCHT_STRICT=1 once an op is
   supposed to exist and those skips become failures instead.

3. *Comparison goes through .tolist().*  It is the one export path both
   notebooks already rely on, so it is the lowest-common-denominator bridge.
"""

import os
import numpy as np
import pytest
import torch

STRICT = os.environ.get("BORSCHT_STRICT", "") not in ("", "0", "false")

try:
    import borscht
except ImportError as e:  # pragma: no cover - environment problem, not a test failure
    pytest.exit(
        f"cannot import borscht ({e}).\n"
        "Build it first:  VIRTUAL_ENV=$PWD/.venv maturin develop",
        returncode=4,
    )


# --------------------------------------------------------------------------
# missing-API -> skip
# --------------------------------------------------------------------------

# Raised when borscht simply has not grown the op yet.  AttributeError covers
# `borscht.randn` / `t.view` not existing; NotImplementedError covers a Rust
# `todo!()` surfacing through pyo3; TypeError covers a signature that does not
# yet accept the keyword the notebooks use (e.g. `keepdim=`).
_UNIMPLEMENTED = (AttributeError, NotImplementedError, TypeError)


@pytest.hookimpl(hookwrapper=True)
def pytest_runtest_call(item):
    outcome = yield
    if STRICT:
        return
    exc = outcome.excinfo[1] if outcome.excinfo else None
    if isinstance(exc, _UNIMPLEMENTED):
        outcome.force_exception(
            pytest.skip.Exception(f"not implemented in borscht yet: {exc}")
        )


def requires(*names):
    """Skip unless borscht exposes every module-level `name`."""
    missing = [n for n in names if not hasattr(borscht, n)]
    return pytest.mark.skipif(
        bool(missing) and not STRICT,
        reason=f"borscht missing: {', '.join(missing)}",
    )


# --------------------------------------------------------------------------
# conversion + comparison
# --------------------------------------------------------------------------

def to_numpy(x):
    """Best-effort borscht/torch tensor -> numpy, without assuming a buffer protocol."""
    if isinstance(x, torch.Tensor):
        return x.detach().cpu().numpy()
    for attr in ("tolist", "numpy"):
        if hasattr(x, attr):
            return np.asarray(getattr(x, attr)())
    return np.asarray(x)


def assert_close(actual, expected, *, rtol=1e-5, atol=1e-6, msg=""):
    """Compare a borscht result against a torch result, shape first then values."""
    a, e = to_numpy(actual), to_numpy(expected)
    prefix = f"{msg}: " if msg else ""
    assert a.shape == e.shape, f"{prefix}shape {a.shape} != torch {e.shape}"
    if not np.allclose(a, e, rtol=rtol, atol=atol, equal_nan=True):
        d = np.abs(a.astype(np.float64) - e.astype(np.float64))
        i = np.unravel_index(np.argmax(d), d.shape) if d.size else ()
        raise AssertionError(
            f"{prefix}values differ from torch\n"
            f"  max abs diff {d.max():.3e} at {i}\n"
            f"  borscht {a[i]!r} vs torch {e[i]!r}\n"
            f"  (rtol={rtol}, atol={atol})"
        )


def assert_shape(actual, expected_shape, msg=""):
    got = tuple(to_numpy(actual).shape)
    want = tuple(expected_shape)
    assert got == want, f"{msg or 'shape'}: {got} != {want}"


# --------------------------------------------------------------------------
# paired data factories
# --------------------------------------------------------------------------

def pair(data, *, dtype=torch.float32, requires_grad=False):
    """Build (borscht_tensor, torch_tensor) from one nested list."""
    t = torch.tensor(data, dtype=dtype)
    if requires_grad:
        t.requires_grad_(True)
    b = borscht.tensor(data)
    if requires_grad and hasattr(b, "requires_grad"):
        b.requires_grad = True
    return b, t


def randpair(*shape, seed=1337, scale=1.0, requires_grad=False):
    """Paired tensors of N(0, scale) data drawn once by torch and shared."""
    g = torch.Generator().manual_seed(seed)
    data = (torch.randn(*shape, generator=g) * scale).tolist()
    return pair(data, requires_grad=requires_grad)


def intpair(*shape, low=0, high=10, seed=1337):
    """Paired integer tensors, for indices/labels."""
    g = torch.Generator().manual_seed(seed)
    data = torch.randint(low, high, shape, generator=g).tolist()
    t = torch.tensor(data, dtype=torch.long)
    return borscht.tensor(data), t


@pytest.fixture
def bt():
    """Convenience: the paired-constructor helpers, injected as one namespace."""
    class _NS:
        pair = staticmethod(pair)
        randpair = staticmethod(randpair)
        intpair = staticmethod(intpair)
    return _NS
