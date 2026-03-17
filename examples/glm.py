import torch
def f(x: torch.Tensor, w: torch.Tensor) -> torch.Tensor:
  return torch.dot(x, w)

import torch
def f_shapesuffixed(x_D: torch.Tensor, w_D: torch.Tensor) -> torch.Tensor:
  return torch.dot(x_D, w_D)

import torch
from jaxtyping import Float, jaxtyped
from beartype import beartype

@jaxtyped(typechecker=beartype)
def f_typechecked(
  x_D: Float[torch.Tensor, "D"],
  w_D: Float[torch.Tensor, "D"]
) -> Float[torch.Tensor, ""]:
  # return X_ND
  return torch.dot(x_D, w_D)

import torch
@jaxtyped(typechecker=beartype)
def f_batched(
  X_ND: Float[torch.Tensor, "N D"],
  w_D: Float[torch.Tensor, "D"]
) -> Float[torch.Tensor, ""]:
  return X_ND@w_D

import torch
if __name__ == "__main__":
  X_ND = torch.tensor([
    [1500, 10, 3, 0.8],  # house 1
    [2100, 2,  4, 0.9],  # house 2
    [800,  50, 2, 0.3]   # house 3
  ], dtype=torch.float32)
  Y_N = torch.tensor([500000, 800000, 250000], dtype=torch.float32)

  w_D = torch.randn(4); print(f"random weight vector: {w_D}")
  for (xi_D,yi_1) in zip(X_ND,Y_N):
    yihat_1 = f_typechecked(xi_D,w_D)
    print(f"expected: ${yi_1}, actual: ${yihat_1:.2f}")

  yhat_N = f_batched(X_ND, w_D)