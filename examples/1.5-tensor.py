import torch

(v,w) = (torch.tensor([1.0, 2.0, 3.0]), torch.tensor([4.0, 5.0, 6.0]))
print(2*v)
print(v+w)
print(0.3*v + 0.7*w)

import torch
A = torch.tensor([[1.0, 2.0],
                  [3.0, 4.0]])
x = torch.tensor([1.0, 2.0])

print(A@x)
print(A@A)

# determinant: scalar measure of how much A scales volume
print(torch.linalg.det(A))

# rank: number of linearly independent rows/columns
B = torch.tensor([[1.0, 2.0, 3.0],
                  [2.0, 4.0, 6.0],  # linearly dependent row
                  [0.0, 1.0, 0.0]])
print(torch.linalg.matrix_rank(B))  # 2, not 3