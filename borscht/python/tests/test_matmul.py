"""Batched matmul -- the one op where a naive implementation diverges from torch
by more than float noise, so tolerances here are deliberately looser."""

import pytest
import torch
from conftest import assert_close, randpair

# torch accumulates in a different order than a naive triple loop; over large K
# the drift is real but bounded.
RTOL, ATOL = 1e-4, 1e-5

CASES = [
    ((2, 3), (3, 4)),
    ((1, 5), (5, 1)),
    ((32, 30), (30, 200)),          # 3.1: Linear(T*E, D)
    ((32, 200), (200, 27)),         # 3.1: Linear(D, V)
    ((2, 4, 8), (2, 8, 16)),        # batched
    ((2, 12, 16, 64), (2, 12, 64, 16)),   # 3.5: QK^T per head
    ((2, 12, 16, 16), (2, 12, 16, 64)),   # 3.5: scores @ V
]


@pytest.mark.parametrize("s1,s2", CASES, ids=[f"{a}@{b}" for a, b in CASES])
def test_matmul(s1, s2):
    b1, t1 = randpair(*s1, seed=1)
    b2, t2 = randpair(*s2, seed=2)
    assert_close(b1 @ b2, t1 @ t2, rtol=RTOL, atol=ATOL)


# [deferred] one test per op for now -- re-enable when that op lands
# def test_matmul_against_transposed_operand():
#     """3.5: Q_BHTK @ K_BHTK.transpose(-2, -1) -- rhs is non-contiguous."""
#     b1, t1 = randpair(2, 4, 6, 8, seed=1)
#     b2, t2 = randpair(2, 4, 6, 8, seed=2)
#     assert_close(
#         b1 @ b2.transpose(-2, -1), t1 @ t2.transpose(-2, -1), rtol=RTOL, atol=ATOL
#     )


# [deferred] one test per op for now -- re-enable when that op lands
# def test_matmul_broadcasts_batch_dims():
#     b1, t1 = randpair(2, 3, 4, seed=1)
#     b2, t2 = randpair(4, 5, seed=2)
#     assert_close(b1 @ b2, t1 @ t2, rtol=RTOL, atol=ATOL)


# [deferred] one test per op for now -- re-enable when that op lands
# def test_matmul_shape_mismatch_raises():
#     b1, t1 = randpair(2, 3, seed=1)
#     b2, t2 = randpair(4, 5, seed=2)
#     with pytest.raises(RuntimeError):
#         t1 @ t2
#     with pytest.raises(RuntimeError):
#         b1 @ b2


# [deferred] one test per op for now -- re-enable when that op lands
# def test_matmul_identity_is_exact():
#     """A sanity anchor independent of torch: X @ I == X."""
#     b, t = randpair(6, 6)
#     eye = torch.eye(6).tolist()
#     import borscht
#     assert_close(b @ borscht.tensor(eye), t @ torch.tensor(eye), rtol=RTOL, atol=ATOL)
