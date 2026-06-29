import torch
from jaxtyping import Float, jaxtyped
from beartype import beartype

# maximization: eigenvectors of covariance = directions of maximum variance
@jaxtyped(typechecker=beartype)
def f_maximize(X_ND: Float[torch.Tensor, "N D"], K: int) -> Float[torch.Tensor, "N K"]:
  X_ND = X_ND - X_ND.mean(dim=0)
  C_DD = X_ND.T @ X_ND / (X_ND.shape[0] - 1)
  L_D, V_DD = torch.linalg.eig(C_DD)
  V_DK = V_DD[:, L_D.real.argsort(descending=True)[:K]].real
  return X_ND @ V_DK

# minimization: top-K right singular vectors = best rank-K reconstruction (Eckart-Young)
@jaxtyped(typechecker=beartype)
def f_minimize(X_ND: Float[torch.Tensor, "N D"], K: int) -> Float[torch.Tensor, "N K"]:
  X_ND = X_ND - X_ND.mean(dim=0)
  _, _, Vh_KD = torch.linalg.svd(X_ND, full_matrices=False)
  return X_ND @ Vh_KD[:K].T

if __name__ == "__main__":
  words = ["king", "queen", "man", "woman", "paris", "france", "london", "england"]
  torch.manual_seed(0)
  X_ND = torch.randn(len(words), 50)  # placeholder for real word embeddings

  Z_maximize_N2 = f_maximize(X_ND, K=2)
  Z_minimize_N2 = f_minimize(X_ND, K=2)

  # both perspectives yield the same subspace (eigenvectors defined up to sign)
  assert torch.allclose(Z_maximize_N2.abs(), Z_minimize_N2.abs(), atol=1e-4)

  for word, z_2 in zip(words, Z_minimize_N2):
    print(f"{word}: {z_2.tolist()}")