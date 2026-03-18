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