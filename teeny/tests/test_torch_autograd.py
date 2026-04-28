import sys, os, unittest
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

import numpy as np
import torch
from teenygrad.eager.tensor import InterpretedTensor
from teenygrad.eager.nn import Linear

class TestForward(unittest.TestCase):
  def test_zeros(self):
    t, t_np = InterpretedTensor.zeros((2, 3)), np.zeros((2, 3))
    self.assertEqual(t.shape, (2, 3))
    self.assertEqual(t.storage, [float(x) for x in t_np.flatten()])

  def test_add(self):
    a, b = InterpretedTensor.ones((3, 4)), InterpretedTensor.ones((3, 4))
    a_np, b_np = np.ones((3, 4)), np.ones((3, 4))
    c, c_np = a + b, a_np + b_np

    self.assertEqual(c.shape, (3, 4))
    self.assertEqual(c.storage, [float(x) for x in c_np.flatten()])

  def test_gemm_forward(self):
    a, b = InterpretedTensor.arange(12).reshape((3,4)), InterpretedTensor.arange(20).reshape((4,5))
    a_np, b_np = np.arange(12.0).reshape((3,4)), np.arange(20.0).reshape((4,5))
    c, c_np = a @ b, a_np @ b_np

    self.assertEqual(c.shape, (3, 5))
    self.assertEqual(c.storage, [float(x) for x in c_np.flatten()])

  def test_tanh(self):
    x, x_np = InterpretedTensor.arange(12).reshape((3,4)), np.arange(12.0, dtype=np.float32).reshape((3,4))
    y, y_np = x.tanh(), np.tanh(x_np)

    self.assertEqual(y.storage, [float(x) for x in y_np.flatten()])

  def test_linear_forward(self):
    torch.manual_seed(42)
    n, m, b = 4, 3, 2

    linear_NMpt = torch.nn.Linear(n, m, bias=False)
    x_BNpt = torch.randn(b, n)
    y_BMpt = linear_NMpt(x_BNpt)

    weight = InterpretedTensor((m,n), linear_NMpt.weight.detach().numpy().flatten().tolist())
    linear_NM = Linear(n, m, weight=weight, bias=False)
    x_BN = InterpretedTensor((b,n), x_BNpt.detach().numpy().flatten().tolist())
    y_BM = linear_NM(x_BN)

    np.testing.assert_allclose(y_BM.storage, [float(v) for v in y_BMpt.detach().numpy().flatten()], rtol=1e-5, atol=1e-5)


class TestBackward(unittest.TestCase):
  def test_backward_scalar(self):
    x_pt = torch.tensor(3.0, requires_grad=True)
    y_pt = x_pt * x_pt
    y_pt.backward()

    x = InterpretedTensor((1,), [3.0], requires_grad=True)
    y = x * x
    y.backward()

    self.assertEqual(x.grad.storage, [x_pt.grad.item()])

  def test_gemm_backward(self):
    a_pt = torch.arange(12.0).reshape(3,4).requires_grad_(True)
    b_pt = torch.arange(20.0).reshape(4,5).requires_grad_(True)
    c_pt = a_pt @ b_pt
    c_pt.sum().backward()

    a, b = InterpretedTensor.arange(12, requires_grad=True).reshape((3,4)), InterpretedTensor.arange(20, requires_grad=True).reshape((4,5))
    c = a @ b
    c.backward()

    self.assertEqual(a.grad.storage, [float(x) for x in a_pt.grad.flatten()])
    self.assertEqual(b.grad.storage, [float(x) for x in b_pt.grad.flatten()])

  def test_tanh_backward(self):
    x_pt = torch.arange(12.0, dtype=torch.float32).reshape(3,4).requires_grad_(True)
    y_pt = x_pt.tanh()
    y_pt.sum().backward()

    x = InterpretedTensor.arange(12, requires_grad=True).reshape((3,4))
    y = x.tanh()
    y.backward()

    np.testing.assert_allclose(x.grad.storage, [float(v) for v in x_pt.grad.flatten()], rtol=1e-5, atol=1e-6)


if __name__ == "__main__":
  unittest.main()
