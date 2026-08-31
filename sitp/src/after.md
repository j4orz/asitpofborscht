# Afterword

To continue deepening your knowledge on deep learning and deep learning systems,
the following provide explicit offramps from SITP bridging you from `nanochat` to `llama`
and from `borscht` to `torch`.
Once you feel comfortable, you should graduate towards contributing to
state of the art neural net architecture and deep learning systems at the frontier.

Good luck on your journey.<br>
I'll see you at work.

## Afterword Table of Contents

<div class="toc">

- [1. Architecture: From `nanochat` to `llama` and `deepseek`](#1-from-nanochat-to-llama-and-deepseek)
- [2. Systems: From `borscht` to `torch`](#2-from-borscht-to-torch)

</div>

## 1. Architecture: From `nanochat` to `llama` and `deepseek`

- moe

## 2. Systems: From `borscht` to `torch`

<div class="toc">

- [1. The Multidimensional Tensor](#1-the-multidimensional-tensor)
- [2. Standard Continuous Mathematics](#2-standard-continuous-mathematics)
- [3. Neural Network Primitives](#3-neural-network-primitives)

</div>

### 1. The Multidimensional Tensor

> In which we transition from the `borscht.Tensor` and `borscht.blas` to the [`torch.Tensor`](https://docs.pytorch.org/docs/2.13/tensors.html) and [`cuBLAS`](https://docs.nvidia.com/cuda/cublas/index.html)

#### From `borscht.Tensor` to [`torch.Tensor`](https://docs.pytorch.org/docs/2.13/tensors.html)

#### From `borscht.blas` to [`cuBLAS`](https://docs.nvidia.com/cuda/cublas/index.html)

### 2. Standard Continuous Mathematics

> In which we transition from `borscht.linalg`, `borscht.distributions`, `borscht.lapack` to [`torch.linalg`](https://docs.pytorch.org/docs/2.13/linalg.html), [`torch.distributions`](https://docs.pytorch.org/docs/2.13/generated/torch.dist.html) and [`cuSOLVER`](https://docs.nvidia.com/cuda/cusolver/index.html)

#### From `borscht.linalg` to [`torch.linalg`](https://docs.pytorch.org/docs/2.13/linalg.html)

**Solvers**
- [`torch.linalg.lstsq`](https://docs.pytorch.org/docs/2.13/generated/torch.linalg.lstsq.html)
- [`torch.linalg.solve_triangular`](https://docs.pytorch.org/docs/2.13/generated/torch.linalg.lu_solve.html)
- [`torch.linalg.lu_solve`](https://docs.pytorch.org/docs/2.13/generated/torch.linalg.lu_solve.html)

**Decompositions**

- [`torch.linalg.cholesky`](https://docs.pytorch.org/docs/2.13/generated/torch.linalg.cholesky.html)
- [`torch.linalg.qr`](https://docs.pytorch.org/docs/2.13/generated/torch.linalg.qr.html)
- [`torch.linalg.lu`](https://docs.pytorch.org/docs/2.13/generated/torch.linalg.lu.html)
- [`torch.linalg.svd`](https://docs.pytorch.org/docs/2.13/generated/torch.linalg.svd.html)
- [`torch.linalg.eig`](https://docs.pytorch.org/docs/2.13/generated/torch.linalg.eig.html)

#### From `borscht.lapack` to [`cuSOLVER`](https://docs.nvidia.com/cuda/cusolver/index.html)

#### From `borscht.distributions` to [`torch.distributions`](https://docs.pytorch.org/docs/2.13/generated/torch.dist.html)

- [`torch.distributions.Normal`](https://docs.pytorch.org/docs/2.13/distributions.html#normal)
- [`torch.distributions.Categorial`](https://docs.pytorch.org/docs/2.13/distributions.html#categorical)
- [`torch.distributions.Bernouilli`](https://docs.pytorch.org/docs/2.13/distributions.html#bernouilli)
- [`torch.distributions.Uniform`](https://docs.pytorch.org/docs/2.13/distributions.html#uniform)

### 3. Neural Network Primitives

> In which we transition from `borscht.nn`, `borscht.optim` and `borscht.dnn` to [`torch.nn`](https://docs.pytorch.org/docs/2.13/nn.html), [`torch.optim`](https://docs.pytorch.org/docs/2.13/optim.html) and [`cuDNN`](https://docs.nvidia.com/deeplearning/cudnn/latest/)

#### From `borscht.nn` to [`torch.nn`](https://docs.pytorch.org/docs/2.13/nn.html)

#### From `borscht.optim` to [`torch.optim`](https://docs.pytorch.org/docs/2.13/optim.html)

#### From `borscht.dnn` to [`cuDNN`](https://docs.nvidia.com/deeplearning/cudnn/latest/)