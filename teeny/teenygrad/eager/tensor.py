# inspired by https://github.com/karpathy/micrograd/blob/master/micrograd/engine.py
#          and https://github.com/tinygrad/tinygrad/blob/master/tinygrad/tensor.py
from typing import Self
import array, math
import teenygrad

class InterpretedTensor:
  @classmethod
  def arange(cls, end: int, requires_grad: bool=False) -> Self: return InterpretedTensor((end,), list(range(end)), requires_grad=requires_grad)
  @classmethod
  def zeros(cls, shape: tuple[int, ...]) -> Self:
    numel = math.prod(shape)
    tensor = InterpretedTensor((numel,), [0.0]*numel).reshape(shape)
    return tensor
  @classmethod
  def ones(cls, shape: tuple[int, ...]) -> Self:
    numel = math.prod(shape)
    tensor = InterpretedTensor((numel,), [1.0]*numel).reshape(shape)
    return tensor
  
  def __init__(self, shape: tuple[int, ...], storage: list[float], inputs: tuple[Self, ...]=(), requires_grad: bool=False) -> None:
    self.shape: tuple[int, ...] = shape
    self.stride: tuple[int, ...] = [math.prod(shape[i+1:]) for i in range(len(shape))] # row major, and math.prod([]) produces 1
    self.storage: list[float] = storage

    self.inputs: tuple[Self, ...] = inputs
    self._backward = lambda: None # callers override after init with self captured in closure
    self.grad: InterpretedTensor = InterpretedTensor.zeros(shape) if requires_grad else None # python can recursively type (no need for Box<_>) bc everything is a heap-allocated reference
  @property
  def numel(self): return math.prod(self.shape) # np (and thus jax) call this .size
  @property
  def ndim(self): return len(self.shape)
  @property
  def T(self) -> Self:
    assert self.ndim == 2
    m, n = self.shape
    t = InterpretedTensor((n, m), self.storage)
    t.stride = [self.stride[1], self.stride[0]]
    return t

  def reshape(self, shape: tuple[int, ...]) -> Self:
    self.shape = shape
    self.stride = [math.prod(shape[i+1:]) for i in range(len(shape))] # math.prod([]) produces 1
    return self
  
  def __repr__(self) -> str:
    return f"InterpretedTensor({self.chunk(self.storage, self.shape)})"
  @staticmethod
  def chunk(flat, shape):
    if len(shape) == 1: return flat[:shape[0]]
    size = len(flat) // shape[0]
    return [InterpretedTensor.chunk(flat[i*size:(i+1)*size], shape[1:]) for i in range(shape[0])]
  
  # backward f'(x)
  @staticmethod
  def topo(node: InterpretedTensor, seen: set[InterpretedTensor], output: list[InterpretedTensor]) -> None:
    if node in seen: return
    seen.add(node)
    for input in node.inputs: InterpretedTensor.topo(input, seen, output)
    output.append(node)

  def backward(self) -> None:
    seen, topologically_sorted_expression_graph = set(), []
    InterpretedTensor.topo(self, seen, topologically_sorted_expression_graph)

    self.grad = InterpretedTensor.ones(self.shape) # base case
    for tensor in reversed(topologically_sorted_expression_graph): tensor._backward()
  
  # forwards f(x)
  def __radd__(self, other: Self) -> Self: return self.__add__(other)
  def __add__(self, other: Self) -> Self:
    n, alpha = self.numel, 1
    x, y, z = array.array('f', self.storage), array.array('f', other.storage), array.array('f', [0.0]*(n))
    teenygrad.eagkers.blas.saxpy(n, alpha, x, y) # y=axpy
    requires_grad = self.grad is not None or other.grad is not None
    output_tensor = InterpretedTensor(self.shape, list(y), (self, other), requires_grad=requires_grad)
    def _backward():
      self.grad += output_tensor.grad
      other.grad += output_tensor.grad
    output_tensor._backward = _backward
    return output_tensor

  def __rmul__(self, other: Self) -> Self: return  self.__mul__(other)
  def __mul__(self, other: Self) -> Self:
    n = self.numel
    x, y, z = array.array('f', self.storage), array.array('f', other.storage), array.array('f', [0.0]*n)
    teenygrad.eagkers.blas.smul(n, x, y, z)
    requires_grad = self.grad is not None or other.grad is not None
    output_tensor = InterpretedTensor(self.shape, list(z), (self, other), requires_grad=requires_grad)
    def _backward():
      self.grad += output_tensor.grad * other
      other.grad += output_tensor.grad * self
    output_tensor._backward = _backward
    return output_tensor

  def __neg__(self) -> Self:
    n = self.numel
    x, y = array.array('f', self.storage), array.array('f', [0.0]*n)
    teenygrad.eagkers.blas.saxpy(n, -1, x, y)
    requires_grad = self.grad is not None
    output_tensor = InterpretedTensor(self.shape, list(y), (self,), requires_grad=requires_grad)
    def _backward():
      self.grad += -output_tensor.grad
    output_tensor._backward = _backward
    return output_tensor

  def __sub__(self, other: Self) -> Self:
    n = self.numel
    x, y = array.array('f', other.storage), array.array('f', self.storage)
    teenygrad.eagkers.blas.saxpy(n, -1, x, y)
    requires_grad = self.grad is not None or other.grad is not None
    output_tensor = InterpretedTensor(self.shape, list(y), (self, other), requires_grad=requires_grad)
    def _backward():
      self.grad += output_tensor.grad
      other.grad += -output_tensor.grad
    output_tensor._backward = _backward
    return output_tensor

  def tanh(self) -> Self:
    n = self.numel
    x, y = array.array('f', self.storage), array.array('f', [0.0]*n)
    teenygrad.eagkers.blas.stanh(n, x, y)
    requires_grad = self.grad is not None
    output_tensor = InterpretedTensor(self.shape, list(y), (self,), requires_grad=requires_grad)
    def _backward():
      self.grad += output_tensor.grad * (InterpretedTensor.ones(self.shape) - output_tensor * output_tensor) # f(x) = tanh(x) ==> f'(x) = 1 - tanh(x)^2
    output_tensor._backward = _backward
    return output_tensor

  def __rmatmul__(self, other: Self) -> Self: return other.__matmul__(self) # GEMM does not commute: AB != BA
  def __matmul__(self, other: Self) -> Self:
    if other.ndim == 1: # gemv
      import sys
      sys.stdout.flush()
      m, n = self.shape[0], self.shape[1]
      alpha, beta = 1, 1
      a, x, y = array.array('f', self.storage), array.array('f', other.storage), array.array('f', [0.0]*m)
      teenygrad.eagkers.blas_kernels.sgemv(m, n, alpha, beta, a, x, y)
      sys.stdout.flush()
      requires_grad = self.grad is not None or other.grad is not None
      return InterpretedTensor((m,), list(y), (self, other), requires_grad=requires_grad)
    elif other.ndim == 2: # gemm
      m, n, p = self.shape[0], other.shape[1], self.shape[1]
      atr, btr = self.stride[1] != 1, other.stride[1] != 1
      lda, ldb = self.stride[1] if atr else self.stride[0], other.stride[1] if btr else other.stride[0]
      a, b, c = array.array('f', self.storage), array.array('f', other.storage), array.array('f', [0.0]*(m * n))
      teenygrad.eagkers.blas.sgemm(atr, btr, m, n, p, 1, 0, a, lda, b, ldb, c, n)
      requires_grad = self.grad is not None or other.grad is not None
      output_tensor = InterpretedTensor((m,n), list(c), (self, other), requires_grad=requires_grad)
      def _backward():
        self.grad += output_tensor.grad @ other.T # dL/dA = dL/dC @ B^T
        other.grad += self.T @ output_tensor.grad # dL/dB = A^T @ dL/dC
      output_tensor._backward = _backward
      return output_tensor
    else:
      raise NotImplementedError("todo")