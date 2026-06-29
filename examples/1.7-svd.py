import torch

if __name__ == "__main__":
  # eigendecomposition: Av = λv  =>  A = V diag(L) V⁻¹
  A_DD = torch.tensor([[4., 2.], [1., 3.]])
  L_D, V_DD = torch.linalg.eig(A_DD)
  print(f"eigenvalues:    {L_D.real}")
  print(f"A = VΛV⁻¹:     {(V_DD @ torch.diag(L_D) @ torch.linalg.inv(V_DD)).real}")

  # SVD: X = U diag(S) Vᵀ  (generalizes eig to rectangular matrices)
  torch.manual_seed(0)
  X_ND = torch.randn(8, 50)
  U_NK, S_K, Vh_KD = torch.linalg.svd(X_ND, full_matrices=False)
  print(f"singular values: {S_K}")
  print(f"X = USVᵀ error: {(X_ND - U_NK @ torch.diag(S_K) @ Vh_KD).norm():.6f}")