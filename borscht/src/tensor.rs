#![allow(dead_code)]

/// An n-dimensional array: a flat `storage` buffer viewed through `shape`/`stride`.
///
/// Keeping stride explicit (rather than assuming contiguity) is what lets
/// `view`/`transpose`/`unsqueeze` be zero-copy, and is why `contiguous()` has to
/// exist at all -- see `MHA.forward` in sitp/notebooks/3.5_gpt2.ipynb.
pub struct Tensor {
    shape: Vec<usize>,
    stride: Vec<usize>,
    storage: Vec<f32>,
}

// ---------------------------------------------------------------------------
// op surface required by 3.1_fnn.ipynb and 3.5_gpt2.ipynb
// (see python/tests/ for the executable spec of each)
//
// creation:    tensor, zeros, ones, arange, tril, randn, randint
// movement:    view, transpose, unsqueeze, contiguous, split, cat, repeat, t
// unary:       neg, exp, log, log10, sqrt, tanh, abs
// binary:      add, sub, mul, div, pow, cmp   (all broadcasting)
// reduce:      sum, max, mean, var            (over dim, keepdim)
// matmul:      batched @
// indexing:    index_select, gather, scatter_add, masked_fill
// autograd:    backward, grad, no_grad, retain_grad
// ---------------------------------------------------------------------------

impl Tensor {
    pub fn sum(&self) -> Self {
        todo!()
    }

    pub fn mul(&self, _rhs: &Self) -> Self {
        todo!()
    }

    pub fn backward(&self) -> Self {
        todo!()
    }
}

#[cfg(test)]
mod tests {
    #[test]
    fn placeholder() {}
}
