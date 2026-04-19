#[derive(Clone, Copy, Debug, PartialEq, Eq)] pub enum Layout    { RowMajor = 101, ColumnMajor = 102 }
#[derive(Clone, Copy, Debug, PartialEq, Eq)] pub enum Transpose { None = 111, Ordinary = 112, Conjugate = 113 }
#[derive(Clone, Copy, Debug, PartialEq, Eq)] pub enum Part      { Upper = 121, Lower = 122 }
#[derive(Clone, Copy, Debug, PartialEq, Eq)] pub enum Diagonal  { Generic = 131, Unit = 132 }
#[derive(Clone, Copy, Debug, PartialEq, Eq)] pub enum Side      { Left = 141, Right = 142 }

// ── Level 1 — s (f32) ───────────────────────────────────────────────────────

pub fn sasum (n: i32, x: &[f32], incx: i32) -> f32                                                                          { todo!() }
pub fn saxpy (n: i32, alpha: f32, x: &[f32], incx: i32, y: &mut [f32], incy: i32)                                          { let (n, incx, incy) = (n as usize, incx as usize, incy as usize); for i in 0..n { y[i*incy] = alpha * x[i*incx] + y[i*incy] } }
pub fn scopy (n: i32, x: &[f32], incx: i32, y: &mut [f32], incy: i32)                                                      { todo!() }
pub fn sdot  (n: i32, x: &[f32], incx: i32, y: &[f32], incy: i32) -> f32                                                   { todo!() }
pub fn sdsdot(n: i32, sb: f32, x: &[f32], incx: i32, y: &[f32], incy: i32) -> f32                                          { todo!() }
pub fn snrm2 (n: i32, x: &[f32], incx: i32) -> f32                                                                         { todo!() }
pub fn srot  (n: i32, x: &mut [f32], incx: i32, y: &mut [f32], incy: i32, c: f32, s: f32)                                  { todo!() }
pub fn srotg (a: &mut f32, b: &mut f32, c: &mut f32, s: &mut f32)                                                          { todo!() }
pub fn srotm (n: i32, x: &mut [f32], incx: i32, y: &mut [f32], incy: i32, param: &[f32])                                   { todo!() }
pub fn srotmg(d1: &mut f32, d2: &mut f32, x1: &mut f32, y1: f32, param: &mut [f32])                                        { todo!() }
pub fn sscal (n: i32, alpha: f32, x: &mut [f32], incx: i32)                                                                 { todo!() }
pub fn sswap (n: i32, x: &mut [f32], incx: i32, y: &mut [f32], incy: i32)                                                  { todo!() }
pub fn isamax(n: i32, x: &[f32], incx: i32) -> i32                                                                          { todo!() }

// ── Level 1 — d (f64) ───────────────────────────────────────────────────────

pub fn dasum (n: i32, x: &[f64], incx: i32) -> f64                                                                          { todo!() }
pub fn daxpy (n: i32, alpha: f64, x: &[f64], incx: i32, y: &mut [f64], incy: i32)                                          { todo!() }
pub fn dcopy (n: i32, x: &[f64], incx: i32, y: &mut [f64], incy: i32)                                                      { todo!() }
pub fn ddot  (n: i32, x: &[f64], incx: i32, y: &[f64], incy: i32) -> f64                                                   { todo!() }
pub fn dsdot (n: i32, x: &[f32], incx: i32, y: &[f32], incy: i32) -> f64                                                   { todo!() }
pub fn dnrm2 (n: i32, x: &[f64], incx: i32) -> f64                                                                         { todo!() }
pub fn drot  (n: i32, x: &mut [f64], incx: i32, y: &mut [f64], incy: i32, c: f64, s: f64)                                  { todo!() }
pub fn drotg (a: &mut f64, b: &mut f64, c: &mut f64, s: &mut f64)                                                          { todo!() }
pub fn drotm (n: i32, x: &mut [f64], incx: i32, y: &mut [f64], incy: i32, param: &[f64])                                   { todo!() }
pub fn drotmg(d1: &mut f64, d2: &mut f64, x1: &mut f64, y1: f64, param: &mut [f64])                                        { todo!() }
pub fn dscal (n: i32, alpha: f64, x: &mut [f64], incx: i32)                                                                 { todo!() }
pub fn dswap (n: i32, x: &mut [f64], incx: i32, y: &mut [f64], incy: i32)                                                  { todo!() }
pub fn idamax(n: i32, x: &[f64], incx: i32) -> i32                                                                          { todo!() }

// ── Level 2 — s (f32) ───────────────────────────────────────────────────────

pub fn sgbmv(layout: Layout, trans: Transpose, m: i32, n: i32, kl: i32, ku: i32, alpha: f32, a: &[f32], lda: i32, x: &[f32], incx: i32, beta: f32, y: &mut [f32], incy: i32) { todo!() }
pub fn sgemv(layout: Layout, trans: Transpose, m: i32, n: i32, alpha: f32, a: &[f32], lda: i32, x: &[f32], incx: i32, beta: f32, y: &mut [f32], incy: i32)                   { todo!() }
pub fn sger (layout: Layout, m: i32, n: i32, alpha: f32, x: &[f32], incx: i32, y: &[f32], incy: i32, a: &mut [f32], lda: i32)                                                 { todo!() }
pub fn ssbmv(layout: Layout, uplo: Part, n: i32, k: i32, alpha: f32, a: &[f32], lda: i32, x: &[f32], incx: i32, beta: f32, y: &mut [f32], incy: i32)                         { todo!() }
pub fn sspmv(layout: Layout, uplo: Part, n: i32, alpha: f32, ap: &[f32], x: &[f32], incx: i32, beta: f32, y: &mut [f32], incy: i32)                                           { todo!() }
pub fn sspr (layout: Layout, uplo: Part, n: i32, alpha: f32, x: &[f32], incx: i32, ap: &mut [f32])                                                                             { todo!() }
pub fn sspr2(layout: Layout, uplo: Part, n: i32, alpha: f32, x: &[f32], incx: i32, y: &[f32], incy: i32, ap: &mut [f32])                                                      { todo!() }
pub fn ssymv(layout: Layout, uplo: Part, n: i32, alpha: f32, a: &[f32], lda: i32, x: &[f32], incx: i32, beta: f32, y: &mut [f32], incy: i32)                                  { todo!() }
pub fn ssyr (layout: Layout, uplo: Part, n: i32, alpha: f32, x: &[f32], incx: i32, a: &mut [f32], lda: i32)                                                                    { todo!() }
pub fn ssyr2(layout: Layout, uplo: Part, n: i32, alpha: f32, x: &[f32], incx: i32, y: &[f32], incy: i32, a: &mut [f32], lda: i32)                                             { todo!() }
pub fn stbmv(layout: Layout, uplo: Part, trans: Transpose, diag: Diagonal, n: i32, k: i32, a: &[f32], lda: i32, x: &mut [f32], incx: i32)                                     { todo!() }
pub fn stbsv(layout: Layout, uplo: Part, trans: Transpose, diag: Diagonal, n: i32, k: i32, a: &[f32], lda: i32, x: &mut [f32], incx: i32)                                     { todo!() }
pub fn stpmv(layout: Layout, uplo: Part, trans: Transpose, diag: Diagonal, n: i32, ap: &[f32], x: &mut [f32], incx: i32)                                                       { todo!() }
pub fn stpsv(layout: Layout, uplo: Part, trans: Transpose, diag: Diagonal, n: i32, ap: &[f32], x: &mut [f32], incx: i32)                                                       { todo!() }
pub fn strmv(layout: Layout, uplo: Part, trans: Transpose, diag: Diagonal, n: i32, a: &[f32], lda: i32, x: &mut [f32], incx: i32)                                             { todo!() }
pub fn strsv(layout: Layout, uplo: Part, trans: Transpose, diag: Diagonal, n: i32, a: &[f32], lda: i32, x: &mut [f32], incx: i32)                                             { todo!() }

// ── Level 2 — d (f64) ───────────────────────────────────────────────────────

pub fn dgbmv(layout: Layout, trans: Transpose, m: i32, n: i32, kl: i32, ku: i32, alpha: f64, a: &[f64], lda: i32, x: &[f64], incx: i32, beta: f64, y: &mut [f64], incy: i32) { todo!() }
pub fn dgemv(layout: Layout, trans: Transpose, m: i32, n: i32, alpha: f64, a: &[f64], lda: i32, x: &[f64], incx: i32, beta: f64, y: &mut [f64], incy: i32)                   { todo!() }
pub fn dger (layout: Layout, m: i32, n: i32, alpha: f64, x: &[f64], incx: i32, y: &[f64], incy: i32, a: &mut [f64], lda: i32)                                                 { todo!() }
pub fn dsbmv(layout: Layout, uplo: Part, n: i32, k: i32, alpha: f64, a: &[f64], lda: i32, x: &[f64], incx: i32, beta: f64, y: &mut [f64], incy: i32)                         { todo!() }
pub fn dspmv(layout: Layout, uplo: Part, n: i32, alpha: f64, ap: &[f64], x: &[f64], incx: i32, beta: f64, y: &mut [f64], incy: i32)                                           { todo!() }
pub fn dspr (layout: Layout, uplo: Part, n: i32, alpha: f64, x: &[f64], incx: i32, ap: &mut [f64])                                                                             { todo!() }
pub fn dspr2(layout: Layout, uplo: Part, n: i32, alpha: f64, x: &[f64], incx: i32, y: &[f64], incy: i32, ap: &mut [f64])                                                      { todo!() }
pub fn dsymv(layout: Layout, uplo: Part, n: i32, alpha: f64, a: &[f64], lda: i32, x: &[f64], incx: i32, beta: f64, y: &mut [f64], incy: i32)                                  { todo!() }
pub fn dsyr (layout: Layout, uplo: Part, n: i32, alpha: f64, x: &[f64], incx: i32, a: &mut [f64], lda: i32)                                                                    { todo!() }
pub fn dsyr2(layout: Layout, uplo: Part, n: i32, alpha: f64, x: &[f64], incx: i32, y: &[f64], incy: i32, a: &mut [f64], lda: i32)                                             { todo!() }
pub fn dtbmv(layout: Layout, uplo: Part, trans: Transpose, diag: Diagonal, n: i32, k: i32, a: &[f64], lda: i32, x: &mut [f64], incx: i32)                                     { todo!() }
pub fn dtbsv(layout: Layout, uplo: Part, trans: Transpose, diag: Diagonal, n: i32, k: i32, a: &[f64], lda: i32, x: &mut [f64], incx: i32)                                     { todo!() }
pub fn dtpmv(layout: Layout, uplo: Part, trans: Transpose, diag: Diagonal, n: i32, ap: &[f64], x: &mut [f64], incx: i32)                                                       { todo!() }
pub fn dtpsv(layout: Layout, uplo: Part, trans: Transpose, diag: Diagonal, n: i32, ap: &[f64], x: &mut [f64], incx: i32)                                                       { todo!() }
pub fn dtrmv(layout: Layout, uplo: Part, trans: Transpose, diag: Diagonal, n: i32, a: &[f64], lda: i32, x: &mut [f64], incx: i32)                                             { todo!() }
pub fn dtrsv(layout: Layout, uplo: Part, trans: Transpose, diag: Diagonal, n: i32, a: &[f64], lda: i32, x: &mut [f64], incx: i32)                                             { todo!() }

// ── Level 3 — s (f32) ───────────────────────────────────────────────────────

pub fn sgemm(layout: Layout, transa: Transpose, transb: Transpose, m: i32, n: i32, k: i32, alpha: f32, a: &[f32], lda: i32, b: &[f32], ldb: i32, beta: f32, c: &mut [f32], ldc: i32) {
  sgemm1(layout, transa, transb, m, n, k, alpha, a, lda, b, ldb, beta, c, ldc)
}
pub fn ssymm (layout: Layout, side: Side, uplo: Part, m: i32, n: i32, alpha: f32, a: &[f32], lda: i32, b: &[f32], ldb: i32, beta: f32, c: &mut [f32], ldc: i32)               { todo!() }
pub fn ssyr2k(layout: Layout, uplo: Part, trans: Transpose, n: i32, k: i32, alpha: f32, a: &[f32], lda: i32, b: &[f32], ldb: i32, beta: f32, c: &mut [f32], ldc: i32)         { todo!() }
pub fn ssyrk (layout: Layout, uplo: Part, trans: Transpose, n: i32, k: i32, alpha: f32, a: &[f32], lda: i32, beta: f32, c: &mut [f32], ldc: i32)                              { todo!() }
pub fn strmm (layout: Layout, side: Side, uplo: Part, transa: Transpose, diag: Diagonal, m: i32, n: i32, alpha: f32, a: &[f32], lda: i32, b: &mut [f32], ldb: i32)            { todo!() }
pub fn strsm (layout: Layout, side: Side, uplo: Part, transa: Transpose, diag: Diagonal, m: i32, n: i32, alpha: f32, a: &[f32], lda: i32, b: &mut [f32], ldb: i32)            { todo!() }

// ── Level 3 — d (f64) ───────────────────────────────────────────────────────

pub fn dgemm (layout: Layout, transa: Transpose, transb: Transpose, m: i32, n: i32, k: i32, alpha: f64, a: &[f64], lda: i32, b: &[f64], ldb: i32, beta: f64, c: &mut [f64], ldc: i32) { todo!() }
pub fn dsymm (layout: Layout, side: Side, uplo: Part, m: i32, n: i32, alpha: f64, a: &[f64], lda: i32, b: &[f64], ldb: i32, beta: f64, c: &mut [f64], ldc: i32)               { todo!() }
pub fn dsyr2k(layout: Layout, uplo: Part, trans: Transpose, n: i32, k: i32, alpha: f64, a: &[f64], lda: i32, b: &[f64], ldb: i32, beta: f64, c: &mut [f64], ldc: i32)         { todo!() }
pub fn dsyrk (layout: Layout, uplo: Part, trans: Transpose, n: i32, k: i32, alpha: f64, a: &[f64], lda: i32, beta: f64, c: &mut [f64], ldc: i32)                              { todo!() }
pub fn dtrmm (layout: Layout, side: Side, uplo: Part, transa: Transpose, diag: Diagonal, m: i32, n: i32, alpha: f64, a: &[f64], lda: i32, b: &mut [f64], ldb: i32)            { todo!() }
pub fn dtrsm (layout: Layout, side: Side, uplo: Part, transa: Transpose, diag: Diagonal, m: i32, n: i32, alpha: f64, a: &[f64], lda: i32, b: &mut [f64], ldb: i32)            { todo!() }

// ── Custom (non-BLAS) ────────────────────────────────────────────────────────

pub fn smul (n: usize, x: &[f32], y: &[f32], z: &mut [f32]) { for i in 0..n { z[i] = x[i] * y[i] } }
pub fn stanh(n: usize, x: &[f32], y: &mut [f32])             { for i in 0..n { y[i] = x[i].tanh() } }

fn sgemm1(layout: Layout, transa: Transpose, transb: Transpose, m: i32, n: i32, k: i32, alpha: f32, a: &[f32], lda: i32, b: &[f32], ldb: i32, beta: f32, c: &mut [f32], ldc: i32) {
    // column-major C=A*B ≡ row-major C^T=B^T*A^T, so swap a/b and invert transpose flags
  let (ta, tb, m, n, a, lda, b, ldb) = match layout {
    Layout::RowMajor    => (transa, transb, m as usize, n as usize, a, lda as usize, b, ldb as usize),
    Layout::ColumnMajor => (transb, transa, n as usize, m as usize, b, ldb as usize, a, lda as usize),
  };
  let (k, ldc) = (k as usize, ldc as usize);
  let ta = matches!(ta, Transpose::Ordinary | Transpose::Conjugate);
  let tb = matches!(tb, Transpose::Ordinary | Transpose::Conjugate);

  for i in 0..m {
    for j in 0..n {
      let mut ab = 0.0f32;
      for kk in 0..k {
        ab += (if ta { a[kk*lda+i] } else { a[i*lda+kk] })
            * (if tb { b[j*ldb+kk] } else { b[kk*ldb+j] });
      }
      c[i*ldc+j] = alpha * ab + beta * c[i*ldc+j];
    }
  }
}

fn sgemm2(layout: Layout, transa: Transpose, transb: Transpose, m: i32, n: i32, k: i32, alpha: f32, a: &[f32], lda: i32, b: &[f32], ldb: i32, beta: f32, c: &mut [f32], ldc: i32) { todo!() }
fn sgemm3(layout: Layout, transa: Transpose, transb: Transpose, m: i32, n: i32, k: i32, alpha: f32, a: &[f32], lda: i32, b: &[f32], ldb: i32, beta: f32, c: &mut [f32], ldc: i32) { todo!() }
fn sgemm4(layout: Layout, transa: Transpose, transb: Transpose, m: i32, n: i32, k: i32, alpha: f32, a: &[f32], lda: i32, b: &[f32], ldb: i32, beta: f32, c: &mut [f32], ldc: i32) { todo!() }
fn sgemm5(layout: Layout, transa: Transpose, transb: Transpose, m: i32, n: i32, k: i32, alpha: f32, a: &[f32], lda: i32, b: &[f32], ldb: i32, beta: f32, c: &mut [f32], ldc: i32) { todo!() }