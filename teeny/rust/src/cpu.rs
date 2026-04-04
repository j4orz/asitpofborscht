// level 1
pub fn saxpy(n: usize, alpha: f32, x: &[f32], y: &mut [f32]) { for i in 0..n { y[i] = alpha * x[i] + y[i] } }
pub fn smul(n: usize, x: &[f32], y: &[f32], z: &mut [f32]) { for i in 0..n { z[i] = x[i] * y[i] } }
pub fn stanh(n: usize, x: &[f32], y: &mut [f32]) { for i in 0..n { y[i] = x[i].tanh() } }

// level 2
pub fn gemv() { todo!() }

// level 3
pub fn sgemmrs(
  transa: bool, transb: bool, m: usize, n: usize, p: usize, alpha: f32, beta: f32,
  a: &[f32], lda: usize, b: &[f32], ldb: usize, c: &mut [f32], ldc: usize)
{
  for i in 0..m {
    for j in 0..n {
      let mut ab = 0.0f32;
      for k in 0..p {
        let a_val = if transa { a[k*lda+i] } else { a[i*lda+k] };
        let b_val = if transb { b[j*ldb+k] } else { b[k*ldb+j] };
        ab += a_val * b_val;
      }
      c[i*ldc+j] = alpha * ab + beta * c[i*ldc+j];
    }
  }
}