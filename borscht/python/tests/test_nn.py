"""Composite ops: softmax, cross_entropy, the norms, GELU, attention.

These are all expressible from the primitives, so a failure here after the
primitive suites pass points at the composition (numerical stability, the wrong
variance convention, the wrong GELU branch) rather than the kernels.
"""

import math
import pytest
import torch
import torch.nn.functional as F
from conftest import assert_close, intpair, pair, randpair, requires
import borscht

RTOL, ATOL = 1e-5, 1e-6


# --------------------------------------------------------------------------
# softmax
# --------------------------------------------------------------------------

@requires("softmax")
@pytest.mark.parametrize("shape,dim", [
    ((4, 10), 1),        # 3.1: F.softmax(logits, dim=1)
    ((4, 10), -1),       # 3.5: F.softmax(logits_BV, dim=-1)
    ((2, 4, 6, 6), -1),  # 3.5: attention scores
])
def test_softmax(shape, dim):
    b, t = randpair(*shape)
    assert_close(borscht.softmax(b, dim=dim), F.softmax(t, dim=dim), rtol=RTOL, atol=ATOL)


# [deferred] one test per op for now -- re-enable when that op lands
# @requires("softmax")
# def test_softmax_rows_sum_to_one():
#     b, t = randpair(4, 10)
#     got = torch.tensor(borscht.softmax(b, dim=-1).tolist())
#     assert torch.allclose(got.sum(-1), torch.ones(4), atol=1e-5)


# [deferred] one test per op for now -- re-enable when that op lands
# @requires("softmax")
# def test_softmax_is_numerically_stable():
#     """Without the max-subtraction, exp(1000) overflows to inf and the result is
#     nan.  torch handles it; borscht must too."""
#     b, t = pair([[1000.0, 1001.0, 1002.0]])
#     out = borscht.softmax(b, dim=-1)
#     got = torch.tensor(out.tolist())
#     assert torch.isfinite(got).all(), f"softmax overflowed: {got.tolist()}"
#     assert_close(out, F.softmax(t, dim=-1), rtol=RTOL, atol=ATOL)


# [deferred] one test per op for now -- re-enable when that op lands
# @requires("softmax")
# def test_softmax_with_neg_inf_mask():
#     """Masked positions must come out as exactly 0, not nan."""
#     b, t = pair([[1.0, 2.0, float("-inf"), float("-inf")]])
#     out = torch.tensor(borscht.softmax(b, dim=-1).tolist())
#     assert torch.isfinite(out).all(), f"masked softmax produced {out.tolist()}"
#     assert out[0, 2] == 0.0 and out[0, 3] == 0.0
#     assert_close(borscht.softmax(b, dim=-1), F.softmax(t, dim=-1), rtol=RTOL, atol=ATOL)


# --------------------------------------------------------------------------
# cross entropy
# --------------------------------------------------------------------------

@requires("cross_entropy")
@pytest.mark.parametrize("N,V", [(32, 27), (8, 50), (64, 100)])
def test_cross_entropy(N, V):
    bx, tx = randpair(N, V, seed=1)
    by, ty = intpair(N, low=0, high=V, seed=2)
    assert_close(borscht.cross_entropy(bx, by), F.cross_entropy(tx, ty), rtol=RTOL, atol=ATOL)


# [deferred] one test per op for now -- re-enable when that op lands
# @requires("cross_entropy")
# def test_cross_entropy_at_uniform_logits_is_log_V():
#     """3.1's sanity check: an untrained model should start at -log(1/V)."""
#     V = 27
#     bx, tx = pair([[0.0] * V])
#     by, ty = borscht.tensor([3]), torch.tensor([3])
#     loss = float(borscht.cross_entropy(bx, by).item())
#     assert abs(loss - math.log(V)) < 1e-4, f"{loss} != log({V}) = {math.log(V):.4f}"


# [deferred] one test per op for now -- re-enable when that op lands
# @requires("cross_entropy")
# def test_cross_entropy_gradient():
#     bx, tx = randpair(16, 27, seed=1, requires_grad=True)
#     by, ty = intpair(16, low=0, high=27, seed=2)
#     borscht.cross_entropy(bx, by).backward()
#     F.cross_entropy(tx, ty).backward()
#     assert_close(bx.grad, tx.grad, rtol=1e-4, atol=1e-5)


# [deferred] one test per op for now -- re-enable when that op lands
# @requires("cross_entropy")
# def test_cross_entropy_on_flattened_sequence():
#     """3.5: F.cross_entropy(logits.view(B*T, V), targets.view(B*T))."""
#     B, T, V = 2, 8, 50
#     bx, tx = randpair(B, T, V, seed=1)
#     by, ty = intpair(B, T, low=0, high=V, seed=2)
#     assert_close(
#         borscht.cross_entropy(bx.view(B * T, V), by.view(B * T)),
#         F.cross_entropy(tx.view(B * T, V), ty.view(B * T)),
#         rtol=RTOL, atol=ATOL,
#     )


# --------------------------------------------------------------------------
# normalisation
# --------------------------------------------------------------------------

@requires("layer_norm")
@pytest.mark.parametrize("shape", [(4, 8), (2, 6, 12), (2, 16, 768)])
def test_layer_norm(shape):
    b, t = randpair(*shape)
    D = shape[-1]
    bw, tw = randpair(D, seed=3)
    bb, tb = randpair(D, seed=4)
    assert_close(
        borscht.layer_norm(b, (D,), bw, bb),
        F.layer_norm(t, (D,), tw, tb),
        rtol=1e-4, atol=1e-5,
    )


# [deferred] one test per op for now -- re-enable when that op lands
# @requires("layer_norm")
# def test_layer_norm_normalises_last_dim():
#     b, _ = randpair(4, 16)
#     D = 16
#     ones, zeros = borscht.ones(D), borscht.zeros(D)
#     out = torch.tensor(borscht.layer_norm(b, (D,), ones, zeros).tolist())
#     assert torch.allclose(out.mean(-1), torch.zeros(4), atol=1e-4), "mean should be 0"
#     assert torch.allclose(out.std(-1, unbiased=False), torch.ones(4), atol=1e-3), "std should be 1"


# [deferred] one test per op for now -- re-enable when that op lands
# def test_batchnorm_forward_matches_torch():
#     """3.1's BatchNorm1D, assembled from primitives, against F.batch_norm.
#     Note torch's *forward* normalises with the biased variance even though
#     x.var() defaults to the corrected one -- 3.1 uses x.var(0, keepdim=True),
#     so it is the corrected form that must land in running_var."""
#     B, D, eps = 32, 16, 1e-5
#     b, t = randpair(B, D)
#     bg, tg = randpair(D, seed=3)
#     bb, tb = randpair(D, seed=4)
#
#     xmean, xvar = b.mean(0, keepdim=True), b.var(0, keepdim=True)
#     xhat = (b - xmean) / (xvar + eps).sqrt()
#     got = bg * xhat + bb
#
#     tmean, tvar = t.mean(0, keepdim=True), t.var(0, keepdim=True)
#     want = tg * ((t - tmean) / torch.sqrt(tvar + eps)) + tb
#     assert_close(got, want, rtol=1e-4, atol=1e-5)


# --------------------------------------------------------------------------
# activations
# --------------------------------------------------------------------------

@requires("gelu")
def test_gelu_tanh_approximation():
    """3.5 uses nn.GELU(approximate='tanh') -- the erf-exact form is a different
    function and will not match."""
    b, t = randpair(4, 16)
    assert_close(borscht.gelu(b, approximate="tanh"), F.gelu(t, approximate="tanh"),
                 rtol=1e-5, atol=1e-6)


# [deferred] one test per op for now -- re-enable when that op lands
# @requires("gelu")
# def test_gelu_matches_closed_form():
#     """0.5x(1 + tanh(sqrt(2/pi)(x + 0.044715 x^3)))"""
#     b, t = pair([[-2.0, -0.5, 0.0, 0.5, 2.0]])
#     want = 0.5 * t * (1.0 + torch.tanh(math.sqrt(2.0 / math.pi) * (t + 0.044715 * t ** 3)))
#     assert_close(borscht.gelu(b, approximate="tanh"), want, rtol=1e-5, atol=1e-6)


# [deferred] one test per op for now -- re-enable when that op lands
# @requires("gelu")
# def test_gelu_gradient():
#     b, t = randpair(4, 16, requires_grad=True)
#     borscht.gelu(b, approximate="tanh").sum().backward()
#     F.gelu(t, approximate="tanh").sum().backward()
#     assert_close(b.grad, t.grad, rtol=1e-4, atol=1e-5)


# --------------------------------------------------------------------------
# attention
# --------------------------------------------------------------------------

def _manual_attention(q, k, v, T, *, torch_ns):
    """The commented-out path in MHA.forward, written once for both frameworks."""
    ns = torch_ns
    scores = (q @ k.transpose(-2, -1)) * (1.0 / math.sqrt(q.size(-1)))
    if ns is torch:
        mask = torch.tril(torch.ones(T, T)).view(1, 1, T, T)
        scores = scores.masked_fill(mask[:, :, :T, :T] == 0, float("-inf"))
        return F.softmax(scores, dim=-1) @ v
    mask = borscht.tril(borscht.ones(T, T)).view(1, 1, T, T)
    scores = scores.masked_fill(mask[:, :, :T, :T] == 0, float("-inf"))
    return borscht.softmax(scores, dim=-1) @ v


@requires("softmax", "tril", "ones")
def test_manual_causal_attention_matches_torch_sdpa():
    """Pins borscht's from-primitives attention against torch's fused kernel --
    the equivalence 3.5 relies on when it swaps the manual block for SDPA."""
    B, H, T, K = 2, 4, 6, 16
    bq, tq = randpair(B, H, T, K, seed=1)
    bk, tk = randpair(B, H, T, K, seed=2)
    bv, tv = randpair(B, H, T, K, seed=3)

    got = _manual_attention(bq, bk, bv, T, torch_ns=borscht)
    want = F.scaled_dot_product_attention(tq, tk, tv, is_causal=True)
    assert_close(got, want, rtol=1e-4, atol=1e-5)


# [deferred] one test per op for now -- re-enable when that op lands
# @requires("softmax", "tril", "ones")
# def test_causal_mask_blocks_future_positions():
#     """Position 0's output must be exactly V[0] -- it can only attend to itself."""
#     B, H, T, K = 1, 1, 5, 8
#     bq, tq = randpair(B, H, T, K, seed=1)
#     bk, tk = randpair(B, H, T, K, seed=2)
#     bv, tv = randpair(B, H, T, K, seed=3)
#     got = torch.tensor(_manual_attention(bq, bk, bv, T, torch_ns=borscht).tolist())
#     assert torch.allclose(got[0, 0, 0], tv[0, 0, 0], atol=1e-5), (
#         "output at t=0 must equal V at t=0; a leaking mask breaks this"
#     )
