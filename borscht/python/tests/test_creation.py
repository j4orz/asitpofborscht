"""Tensor construction: borscht.{tensor,zeros,ones,arange,tril} vs torch."""

import pytest
import torch
from conftest import assert_close, assert_shape, requires
import borscht


@requires("tensor")
@pytest.mark.parametrize("data", [
    3.0,
    [1.0, 2.0, 3.0],
    [[1.0, 2.0], [3.0, 4.0]],
    [[[1.0], [2.0]], [[3.0], [4.0]]],
    [],
])
def test_tensor_from_nested_list(data):
    assert_close(borscht.tensor(data), torch.tensor(data, dtype=torch.float32))


# [deferred] one test per op for now -- re-enable when that op lands
# @requires("tensor")
# def test_tensor_preserves_integer_dtype():
#     """3.1 builds index tensors with torch.tensor(list_of_int); they must not
#     silently become floats or C[X_B] cannot index with them."""
#     b = borscht.tensor([[0, 1, 2], [3, 4, 5]])
#     assert_close(b, torch.tensor([[0, 1, 2], [3, 4, 5]]))


@requires("zeros", "ones")
@pytest.mark.parametrize("shape", [(5,), (2, 3), (2, 3, 4), (1, 1, 8, 8)])
def test_zeros_ones(shape):
    assert_close(borscht.zeros(*shape), torch.zeros(*shape))
    assert_close(borscht.ones(*shape), torch.ones(*shape))


@requires("arange")
@pytest.mark.parametrize("args", [(5,), (0, 5), (0, 10), (2, 7)])
def test_arange(args):
    assert_close(borscht.arange(*args), torch.arange(*args))


# [deferred] one test per op for now -- re-enable when that op lands
# @requires("arange")
# def test_arange_is_the_position_index():
#     """3.5: wpe(torch.arange(0, T)) -- must be 0..T-1, integral, 1-D."""
#     T = 16
#     assert_close(borscht.arange(0, T), torch.arange(0, T, dtype=torch.long))


@requires("tril", "ones")
@pytest.mark.parametrize("n", [1, 4, 16])
def test_tril_causal_mask(n):
    """3.5: torch.tril(torch.ones(T, T)) is the causal mask."""
    assert_close(borscht.tril(borscht.ones(n, n)), torch.tril(torch.ones(n, n)))


# [deferred] one test per op for now -- re-enable when that op lands
# @requires("tril", "ones")
# def test_tril_is_lower_triangular_inclusive_of_diagonal():
#     m = torch.tensor(borscht.tril(borscht.ones(5, 5)).tolist())
#     assert m[0].tolist() == [1, 0, 0, 0, 0], "row 0 must attend to itself only"
#     assert m[4].tolist() == [1, 1, 1, 1, 1], "last row must attend to everything"


@requires("zeros")
def test_shape_attribute():
    assert tuple(borscht.zeros(2, 3, 4).shape) == (2, 3, 4)
