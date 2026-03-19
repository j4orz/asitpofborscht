import torch

u = torch.tensor([1.0, 2.0, 3.0])
v = torch.tensor([4.0, 5.0, 6.0])

# inner product: u·v = sum of elementwise products
print(u @ v)               # 32.0
print((u * v).sum())       # same

# L2 norm: length/magnitude of a vector
print(torch.linalg.norm(u))          # sqrt(1+4+9) = 3.742
print(torch.linalg.norm(u, ord=2))   # same

# L1 norm: sum of absolute values
print(torch.linalg.norm(u, ord=1))   # 1+2+3 = 6.0

# distance: L2 norm of the difference
print(torch.linalg.norm(u - v))      # Euclidean distance

# angle between vectors via cosine similarity
cos_theta = (u @ v) / (torch.linalg.norm(u) * torch.linalg.norm(v))
theta = torch.acos(cos_theta)
print(cos_theta)   # ~0.9746
print(theta)       # ~0.2257 radians (~12.9 degrees)

# projection of u onto v: scalar and vector forms
scalar_proj = (u @ v) / torch.linalg.norm(v)         # length of shadow
vector_proj = scalar_proj * (v / torch.linalg.norm(v))  # shadow as vector
print(scalar_proj)
print(vector_proj)