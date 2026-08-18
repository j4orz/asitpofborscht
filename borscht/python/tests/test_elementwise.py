"""Unary/binary elementwise ops and broadcasting."""

import pytest
import torch
from conftest import assert_close, pair, randpair, requires
import borscht

# ops that are safe on negative inputs
UNARY = [
    ("neg", lambda x: -x),
    ("exp", lambda x: x.exp()),
    ("tanh", lambda x: x.tanh()),
    ("abs", lambda x: x.abs()),
]


@pytest.mark.parametrize("name,fn", UNARY, ids=[n for n, _ in UNARY])
def test_unary(name, fn):
    b, t = randpair(4, 5, scale=0.5)
    assert_close(fn(b), fn(t), msg=name)


def test_sqrt_on_positive():
    b, t = randpair(4, 5)
    assert_close((b.abs() + 1e-3).sqrt(), (t.abs() + 1e-3).sqrt())


def test_log_and_log10_on_positive():
    data = [[0.5, 1.0, 2.0], [3.0, 4.5, 10.0]]
    b, t = pair(data)
    assert_close(b.log(), t.log(), msg="log")
    assert_close(b.log10(), t.log10(), msg="log10")


# [deferred] one test per op for now -- re-enable when that op lands
# def test_tanh_saturates_like_torch():
#     """3.1 plots |tanh| > 0.99 to show vanishing gradients, so the tails matter."""
#     b, t = pair([[-30.0, -3.0, 0.0, 3.0, 30.0]])
#     assert_close(b.tanh(), t.tanh())


BINARY = [
    ("add", lambda a, b: a + b),
    ("sub", lambda a, b: a - b),
    ("mul", lambda a, b: a * b),
    ("div", lambda a, b: a / b),
]
BINARY_IDS = [n for n, _ in BINARY]


@pytest.mark.parametrize("name,fn", BINARY, ids=BINARY_IDS)
def test_binary_same_shape(name, fn):
    b1, t1 = randpair(3, 4, seed=1)
    b2, t2 = randpair(3, 4, seed=2)
    b2, t2 = b2.abs() + 1.0, t2.abs() + 1.0   # keep the divisor away from zero
    assert_close(fn(b1, b2), fn(t1, t2), msg=name)


BROADCAST = [
    ((3, 4), (4,)),                 # 3.1: bias add, gamma/beta affine
    ((3, 4), (1, 4)),               # 3.1: BatchNorm mean/var with keepdim
    ((3, 4), (3, 1)),               # 3.5: LayerNorm stats over last dim
    ((2, 3, 4), (4,)),
    ((2, 3, 4), (3, 4)),            # 3.5: Xtok_BTD + Xpos_TD
    ((2, 1, 4), (2, 3, 4)),
    ((1, 1, 8, 8), (2, 4, 8, 8)),   # 3.5: causal mask against scores
]
BROADCAST_IDS = [f"{a}x{b}" for a, b in BROADCAST]


@pytest.mark.parametrize("name,fn", BINARY, ids=BINARY_IDS)
@pytest.mark.parametrize("s1,s2", BROADCAST, ids=BROADCAST_IDS)
def test_broadcasting(name, fn, s1, s2):
    b1, t1 = randpair(*s1, seed=1)
    b2, t2 = randpair(*s2, seed=2)
    b2, t2 = b2.abs() + 1.0, t2.abs() + 1.0
    assert_close(fn(b1, b2), fn(t1, t2), msg=f"{name} {s1}x{s2}")


# [deferred] one test per op for now -- re-enable when that op lands
# def test_broadcast_is_symmetric():
#     b1, t1 = randpair(3, 4, seed=1)
#     b2, t2 = randpair(4, seed=2)
#     assert_close(b1 + b2, t1 + t2)
#     assert_close(b2 + b1, t2 + t1)


# [deferred] one test per op for now -- re-enable when that op lands
# def test_incompatible_broadcast_raises():
#     b1, t1 = randpair(3, 4, seed=1)
#     b2, t2 = randpair(5, seed=2)
#     with pytest.raises(RuntimeError):
#         t1 + t2
#     with pytest.raises(RuntimeError):
#         b1 + b2


@pytest.mark.parametrize("s", [0.0, 1.0, -0.01, 2.5, 1e-5])
def test_scalar_on_the_right(s):
    b, t = randpair(3, 4)
    assert_close(b + s, t + s, msg="add")
    assert_close(b * s, t * s, msg="mul")
    assert_close(b - s, t - s, msg="sub")


# [deferred] one test per op for now -- re-enable when that op lands
# @pytest.mark.parametrize("s", [1.0, -0.01, 2.5])
# def test_scalar_on_the_left(s):
#     """3.1: (1 - momentum) * running_mean needs __rmul__/__rsub__."""
#     b, t = randpair(3, 4)
#     assert_close(s * b, s * t, msg="rmul")
#     assert_close(s - b, s - t, msg="rsub")


def test_pow():
    b, t = randpair(3, 4)
    b, t = b.abs() + 0.5, t.abs() + 0.5
    assert_close(b ** 2, t ** 2, msg="square")
    assert_close(b ** 0.5, t ** 0.5, msg="sqrt via pow")


def test_inplace_add_matches_out_of_place():
    """3.1: self.X_Do += self.b_Do, and p.data += -lr * p.grad."""
    b, t = randpair(3, 4, seed=1)
    bb, tt = randpair(4, seed=2)
    b += bb
    t += tt
    assert_close(b, t)


def test_comparison_produces_mask():
    b, t = randpair(4, 5)
    assert_close(b > 0.0, t > 0.0)


@requires("tril", "ones")
def test_masked_fill_with_neg_inf():
    """3.5 (manual attention path): scores.masked_fill(mask == 0, -inf)."""
    T = 5
    b, t = randpair(1, 1, T, T)
    bmask = borscht.tril(borscht.ones(T, T)).view(1, 1, T, T)
    tmask = torch.tril(torch.ones(T, T)).view(1, 1, T, T)
    assert_close(
        b.masked_fill(bmask == 0, float("-inf")),
        t.masked_fill(tmask == 0, float("-inf")),
    )
