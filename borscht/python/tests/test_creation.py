"""Creation ops -- borscht.{tensor,zeros,ones,arange,randn} -- checked against torch.

torch is the oracle: every case builds the same tensor both ways and asserts
borscht agrees.  `randn` is the exception -- matching torch bit-for-bit means
reimplementing MT19937 *and* picking the right one of ATen's two Box-Muller
paths (numel < 16 vs >= 16), and float32 randn is not even bit-stable across
torch's own SIMD capabilities -- so it is checked on shape and on sample
moments instead.

Run from `borscht/`, against a `maturin develop`-ed borscht:

    python -m unittest discover -s python/tests
"""

import unittest
import borscht
import torch


class OracleTestCase(unittest.TestCase):
    """Compares borscht tensors to torch tensors through `.shape` / `.tolist()`."""

    def assertMatches(self, actual, expected, msg=None):
        self.assertEqual(
            tuple(actual.shape), tuple(expected.shape), msg or "shape != torch"
        )
        got = torch.tensor(actual.tolist(), dtype=torch.float64).reshape(expected.shape)
        want = expected.to(torch.float64)
        self.assertTrue(
            torch.equal(got, want) or torch.allclose(got, want, rtol=1e-6, atol=1e-7),
            msg or f"values differ from torch\n  borscht {got}\n  torch   {want}",
        )


class TestTensor(OracleTestCase):
    CASES = [
        3.0,
        [],
        [1.0, 2.0, 3.0],
        [-1.5, 0.0, 2.5],
        [[1.0, 2.0], [3.0, 4.0]],
        [[[1.0], [2.0]], [[3.0], [4.0]]],
    ]

    def test_from_nested_list(self):
        for data in self.CASES:
            with self.subTest(data=data):
                self.assertMatches(borscht.tensor(data), torch.tensor(data))

    def test_tolist_round_trips(self):
        data = [[1.0, 2.0], [3.0, 4.0]]
        self.assertEqual(borscht.tensor(data).tolist(), data)


class TestZerosOnes(OracleTestCase):
    SHAPES = [(1,), (5,), (2, 3), (2, 3, 4), (1, 1, 8, 8)]

    def test_zeros(self):
        for shape in self.SHAPES:
            with self.subTest(shape=shape):
                self.assertMatches(borscht.zeros(*shape), torch.zeros(*shape))

    def test_ones(self):
        for shape in self.SHAPES:
            with self.subTest(shape=shape):
                self.assertMatches(borscht.ones(*shape), torch.ones(*shape))

    def test_shape_attribute(self):
        self.assertEqual(tuple(borscht.zeros(2, 3, 4).shape), (2, 3, 4))


class TestArange(OracleTestCase):
    CASES = [(0,), (1,), (5,), (0, 5), (2, 7), (0, 16)]

    def test_arange(self):
        for args in self.CASES:
            with self.subTest(args=args):
                self.assertMatches(borscht.arange(*args), torch.arange(*args))


class TestRandn(OracleTestCase):
    """borscht's RNG is its own; only the shape and the distribution are the spec."""

    SHAPES = [(7,), (2, 3), (2, 3, 4)]

    def test_shape_matches_torch(self):
        for shape in self.SHAPES:
            with self.subTest(shape=shape):
                self.assertEqual(
                    tuple(borscht.randn(*shape).shape),
                    tuple(torch.randn(*shape).shape),
                )

    def test_is_standard_normal(self):
        x = torch.tensor(borscht.randn(100_000).tolist(), dtype=torch.float64)
        # 5 sigma on the sample moments of n = 1e5 draws.
        self.assertLess(abs(x.mean().item()), 0.016, "mean is not 0")
        self.assertLess(abs(x.std().item() - 1.0), 0.012, "std is not 1")

    def test_draws_are_not_repeated(self):
        self.assertNotEqual(borscht.randn(64).tolist(), borscht.randn(64).tolist())


if __name__ == "__main__":
    unittest.main()
