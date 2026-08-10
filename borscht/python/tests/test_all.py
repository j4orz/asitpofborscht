import pytest
import borscht


def test_sum_as_string():
    assert borscht.sum_as_string(1, 1) == "2"
