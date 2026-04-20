use pyo3::{buffer::PyBuffer, prelude::*};

#[pyfunction]
#[pyo3(name = "saxpy")]
pub fn saxpypy(n: usize, alpha: f32, x: PyBuffer<f32>, y: PyBuffer<f32>) -> PyResult<()> {
  let x = unsafe { std::slice::from_raw_parts(x.buf_ptr() as *const f32, n) };
  let y = unsafe { std::slice::from_raw_parts_mut(y.buf_ptr() as *mut f32, n) };
  crate::cblas::saxpy(n as i32, alpha, x, 1, y, 1);
  Ok(())
}

#[pyfunction]
#[pyo3(name = "smul")]
pub fn smulpy(n: usize, x: PyBuffer<f32>, y: PyBuffer<f32>, z: PyBuffer<f32>) -> PyResult<()> {
  let x = unsafe { std::slice::from_raw_parts(x.buf_ptr() as *const f32, n) };
  let y = unsafe { std::slice::from_raw_parts(y.buf_ptr() as *mut f32, n) };
  let z = unsafe { std::slice::from_raw_parts_mut(z.buf_ptr() as *mut f32, n) };
  crate::cblas::_smul(n, x, y, z);
  Ok(())
}

#[pyfunction]
#[pyo3(name = "stanh")]
pub fn stanhpy(n: usize, x: PyBuffer<f32>, y: PyBuffer<f32>) -> PyResult<()> {
  // SAFETY: x, y are array.array('f') buffers from Python with length n.
  let x = unsafe { std::slice::from_raw_parts(x.buf_ptr() as *const f32, n) };
  let y = unsafe { std::slice::from_raw_parts_mut(y.buf_ptr() as *mut f32, n) };
  crate::cblas::_stanh(n, x, y);
  Ok(())
}

#[pyfunction]
#[pyo3(name = "sgemm")]
pub fn sgemmpy(
  transa: bool, transb: bool, m: usize, n: usize, p: usize, alpha: f32, beta: f32,
  a: PyBuffer<f32>, lda: usize, b: PyBuffer<f32>, ldb: usize, c: PyBuffer<f32>, ldc: usize,
) -> PyResult<()> {
  let a_len = if transa { p * lda } else { m * lda };
  let b_len = if transb { n * ldb } else { p * ldb };
  let a = unsafe { std::slice::from_raw_parts(a.buf_ptr() as *const f32, a_len) };
  let b = unsafe { std::slice::from_raw_parts(b.buf_ptr() as *const f32, b_len) };
  let c = unsafe { std::slice::from_raw_parts_mut(c.buf_ptr() as *mut f32, m * ldc) };
  let ta = if transa { crate::cblas::Transpose::Ordinary } else { crate::cblas::Transpose::None };
  let tb = if transb { crate::cblas::Transpose::Ordinary } else { crate::cblas::Transpose::None };
  crate::cblas::sgemm(crate::cblas::Layout::RowMajor, ta, tb, m as i32, n as i32, p as i32, alpha, a, lda as i32, b, ldb as i32, beta, c, ldc as i32);
  Ok(())
}

#[derive(Clone, Copy, Debug, PartialEq, Eq)] pub enum Layout    { RowMajor = 101, ColumnMajor = 102 }
#[derive(Clone, Copy, Debug, PartialEq, Eq)] pub enum Transpose { None = 111, Ordinary = 112, Conjugate = 113 }
#[derive(Clone, Copy, Debug, PartialEq, Eq)] pub enum Part      { Upper = 121, Lower = 122 }
#[derive(Clone, Copy, Debug, PartialEq, Eq)] pub enum Diagonal  { Generic = 131, Unit = 132 }
#[derive(Clone, Copy, Debug, PartialEq, Eq)] pub enum Side      { Left = 141, Right = 142 }

// ── Level 1 — s (f32) ───────────────────────────────────────────────────────

fn _sasum (_n: i32, _x: &[f32], _incx: i32) -> f32                                                                          { todo!() }
pub fn saxpy (n: i32, alpha: f32, x: &[f32], incx: i32, y: &mut [f32], incy: i32)                                          { let (n, incx, incy) = (n as usize, incx as usize, incy as usize); for i in 0..n { y[i*incy] = alpha * x[i*incx] + y[i*incy] } }
fn _scopy (_n: i32, _x: &[f32], _incx: i32, _y: &mut [f32], _incy: i32)                                                    { todo!() }
fn _sdot  (_n: i32, _x: &[f32], _incx: i32, _y: &[f32], _incy: i32) -> f32                                                 { todo!() }
fn _sdsdot(_n: i32, _sb: f32, _x: &[f32], _incx: i32, _y: &[f32], _incy: i32) -> f32                                      { todo!() }
fn _snrm2 (_n: i32, _x: &[f32], _incx: i32) -> f32                                                                         { todo!() }
fn _srot  (_n: i32, _x: &mut [f32], _incx: i32, _y: &mut [f32], _incy: i32, _c: f32, _s: f32)                             { todo!() }
fn _srotg (_a: &mut f32, _b: &mut f32, _c: &mut f32, _s: &mut f32)                                                         { todo!() }
fn _srotm (_n: i32, _x: &mut [f32], _incx: i32, _y: &mut [f32], _incy: i32, _param: &[f32])                               { todo!() }
fn _srotmg(_d1: &mut f32, _d2: &mut f32, _x1: &mut f32, _y1: f32, _param: &mut [f32])                                     { todo!() }
fn _sscal (_n: i32, _alpha: f32, _x: &mut [f32], _incx: i32)                                                               { todo!() }
fn _sswap (_n: i32, _x: &mut [f32], _incx: i32, _y: &mut [f32], _incy: i32)                                               { todo!() }
fn _isamax(_n: i32, _x: &[f32], _incx: i32) -> i32                                                                          { todo!() }

// ── Level 1 — d (f64) ───────────────────────────────────────────────────────

fn _dasum (_n: i32, _x: &[f64], _incx: i32) -> f64                                                                          { todo!() }
pub fn daxpy (n: i32, alpha: f64, x: &[f64], incx: i32, y: &mut [f64], incy: i32)                                          { todo!() }
fn _dcopy (_n: i32, _x: &[f64], _incx: i32, _y: &mut [f64], _incy: i32)                                                    { todo!() }
fn _ddot  (_n: i32, _x: &[f64], _incx: i32, _y: &[f64], _incy: i32) -> f64                                                 { todo!() }
fn _dsdot (_n: i32, _x: &[f32], _incx: i32, _y: &[f32], _incy: i32) -> f64                                                 { todo!() }
fn _dnrm2 (_n: i32, _x: &[f64], _incx: i32) -> f64                                                                         { todo!() }
fn _drot  (_n: i32, _x: &mut [f64], _incx: i32, _y: &mut [f64], _incy: i32, _c: f64, _s: f64)                             { todo!() }
fn _drotg (_a: &mut f64, _b: &mut f64, _c: &mut f64, _s: &mut f64)                                                         { todo!() }
fn _drotm (_n: i32, _x: &mut [f64], _incx: i32, _y: &mut [f64], _incy: i32, _param: &[f64])                               { todo!() }
fn _drotmg(_d1: &mut f64, _d2: &mut f64, _x1: &mut f64, _y1: f64, _param: &mut [f64])                                     { todo!() }
fn _dscal (_n: i32, _alpha: f64, _x: &mut [f64], _incx: i32)                                                               { todo!() }
fn _dswap (_n: i32, _x: &mut [f64], _incx: i32, _y: &mut [f64], _incy: i32)                                               { todo!() }
fn _idamax(_n: i32, _x: &[f64], _incx: i32) -> i32                                                                          { todo!() }

// ── Level 2 — s (f32) ───────────────────────────────────────────────────────

fn _sgbmv(_layout: Layout, _trans: Transpose, _m: i32, _n: i32, _kl: i32, _ku: i32, _alpha: f32, _a: &[f32], _lda: i32, _x: &[f32], _incx: i32, _beta: f32, _y: &mut [f32], _incy: i32) { todo!() }
pub fn sgemv(layout: Layout, trans: Transpose, m: i32, n: i32, alpha: f32, a: &[f32], lda: i32, x: &[f32], incx: i32, beta: f32, y: &mut [f32], incy: i32) {
  let (m, n, lda, incx, incy) = (m as usize, n as usize, lda as usize, incx as usize, incy as usize);
  let (rows, cols, t) = match layout {
    Layout::RowMajor    => (m, n, matches!(trans, Transpose::Ordinary | Transpose::Conjugate)),
    Layout::ColumnMajor => (n, m, !matches!(trans, Transpose::Ordinary | Transpose::Conjugate)),
  };
  let (out_len, in_len) = if t { (cols, rows) } else { (rows, cols) };
  for i in 0..out_len {
    let mut dot = 0.0f32;
    for j in 0..in_len {
      dot += (if t { a[j*lda+i] } else { a[i*lda+j] }) * x[j*incx];
    }
    y[i*incy] = alpha * dot + beta * y[i*incy];
  }
}
fn _sger (_layout: Layout, _m: i32, _n: i32, _alpha: f32, _x: &[f32], _incx: i32, _y: &[f32], _incy: i32, _a: &mut [f32], _lda: i32)                                             { todo!() }
fn _ssbmv(_layout: Layout, _uplo: Part, _n: i32, _k: i32, _alpha: f32, _a: &[f32], _lda: i32, _x: &[f32], _incx: i32, _beta: f32, _y: &mut [f32], _incy: i32)                   { todo!() }
fn _sspmv(_layout: Layout, _uplo: Part, _n: i32, _alpha: f32, _ap: &[f32], _x: &[f32], _incx: i32, _beta: f32, _y: &mut [f32], _incy: i32)                                       { todo!() }
fn _sspr (_layout: Layout, _uplo: Part, _n: i32, _alpha: f32, _x: &[f32], _incx: i32, _ap: &mut [f32])                                                                           { todo!() }
fn _sspr2(_layout: Layout, _uplo: Part, _n: i32, _alpha: f32, _x: &[f32], _incx: i32, _y: &[f32], _incy: i32, _ap: &mut [f32])                                                   { todo!() }
fn _ssymv(_layout: Layout, _uplo: Part, _n: i32, _alpha: f32, _a: &[f32], _lda: i32, _x: &[f32], _incx: i32, _beta: f32, _y: &mut [f32], _incy: i32)                            { todo!() }
fn _ssyr (_layout: Layout, _uplo: Part, _n: i32, _alpha: f32, _x: &[f32], _incx: i32, _a: &mut [f32], _lda: i32)                                                                 { todo!() }
fn _ssyr2(_layout: Layout, _uplo: Part, _n: i32, _alpha: f32, _x: &[f32], _incx: i32, _y: &[f32], _incy: i32, _a: &mut [f32], _lda: i32)                                        { todo!() }
fn _stbmv(_layout: Layout, _uplo: Part, _trans: Transpose, _diag: Diagonal, _n: i32, _k: i32, _a: &[f32], _lda: i32, _x: &mut [f32], _incx: i32)                                { todo!() }
fn _stbsv(_layout: Layout, _uplo: Part, _trans: Transpose, _diag: Diagonal, _n: i32, _k: i32, _a: &[f32], _lda: i32, _x: &mut [f32], _incx: i32)                                { todo!() }
fn _stpmv(_layout: Layout, _uplo: Part, _trans: Transpose, _diag: Diagonal, _n: i32, _ap: &[f32], _x: &mut [f32], _incx: i32)                                                    { todo!() }
fn _stpsv(_layout: Layout, _uplo: Part, _trans: Transpose, _diag: Diagonal, _n: i32, _ap: &[f32], _x: &mut [f32], _incx: i32)                                                    { todo!() }
fn _strmv(_layout: Layout, _uplo: Part, _trans: Transpose, _diag: Diagonal, _n: i32, _a: &[f32], _lda: i32, _x: &mut [f32], _incx: i32)                                         { todo!() }
fn _strsv(_layout: Layout, _uplo: Part, _trans: Transpose, _diag: Diagonal, _n: i32, _a: &[f32], _lda: i32, _x: &mut [f32], _incx: i32)                                         { todo!() }

// ── Level 2 — d (f64) ───────────────────────────────────────────────────────

fn _dgbmv(_layout: Layout, _trans: Transpose, _m: i32, _n: i32, _kl: i32, _ku: i32, _alpha: f64, _a: &[f64], _lda: i32, _x: &[f64], _incx: i32, _beta: f64, _y: &mut [f64], _incy: i32) { todo!() }
pub fn dgemv(layout: Layout, trans: Transpose, m: i32, n: i32, alpha: f64, a: &[f64], lda: i32, x: &[f64], incx: i32, beta: f64, y: &mut [f64], incy: i32)                     { todo!() }
fn _dger (_layout: Layout, _m: i32, _n: i32, _alpha: f64, _x: &[f64], _incx: i32, _y: &[f64], _incy: i32, _a: &mut [f64], _lda: i32)                                             { todo!() }
fn _dsbmv(_layout: Layout, _uplo: Part, _n: i32, _k: i32, _alpha: f64, _a: &[f64], _lda: i32, _x: &[f64], _incx: i32, _beta: f64, _y: &mut [f64], _incy: i32)                   { todo!() }
fn _dspmv(_layout: Layout, _uplo: Part, _n: i32, _alpha: f64, _ap: &[f64], _x: &[f64], _incx: i32, _beta: f64, _y: &mut [f64], _incy: i32)                                       { todo!() }
fn _dspr (_layout: Layout, _uplo: Part, _n: i32, _alpha: f64, _x: &[f64], _incx: i32, _ap: &mut [f64])                                                                           { todo!() }
fn _dspr2(_layout: Layout, _uplo: Part, _n: i32, _alpha: f64, _x: &[f64], _incx: i32, _y: &[f64], _incy: i32, _ap: &mut [f64])                                                   { todo!() }
fn _dsymv(_layout: Layout, _uplo: Part, _n: i32, _alpha: f64, _a: &[f64], _lda: i32, _x: &[f64], _incx: i32, _beta: f64, _y: &mut [f64], _incy: i32)                            { todo!() }
fn _dsyr (_layout: Layout, _uplo: Part, _n: i32, _alpha: f64, _x: &[f64], _incx: i32, _a: &mut [f64], _lda: i32)                                                                 { todo!() }
fn _dsyr2(_layout: Layout, _uplo: Part, _n: i32, _alpha: f64, _x: &[f64], _incx: i32, _y: &[f64], _incy: i32, _a: &mut [f64], _lda: i32)                                        { todo!() }
fn _dtbmv(_layout: Layout, _uplo: Part, _trans: Transpose, _diag: Diagonal, _n: i32, _k: i32, _a: &[f64], _lda: i32, _x: &mut [f64], _incx: i32)                                { todo!() }
fn _dtbsv(_layout: Layout, _uplo: Part, _trans: Transpose, _diag: Diagonal, _n: i32, _k: i32, _a: &[f64], _lda: i32, _x: &mut [f64], _incx: i32)                                { todo!() }
fn _dtpmv(_layout: Layout, _uplo: Part, _trans: Transpose, _diag: Diagonal, _n: i32, _ap: &[f64], _x: &mut [f64], _incx: i32)                                                    { todo!() }
fn _dtpsv(_layout: Layout, _uplo: Part, _trans: Transpose, _diag: Diagonal, _n: i32, _ap: &[f64], _x: &mut [f64], _incx: i32)                                                    { todo!() }
fn _dtrmv(_layout: Layout, _uplo: Part, _trans: Transpose, _diag: Diagonal, _n: i32, _a: &[f64], _lda: i32, _x: &mut [f64], _incx: i32)                                         { todo!() }
fn _dtrsv(_layout: Layout, _uplo: Part, _trans: Transpose, _diag: Diagonal, _n: i32, _a: &[f64], _lda: i32, _x: &mut [f64], _incx: i32)                                         { todo!() }

// ── Level 3 — s (f32) ───────────────────────────────────────────────────────

pub fn sgemm(layout: Layout, transa: Transpose, transb: Transpose, m: i32, n: i32, k: i32, alpha: f32, a: &[f32], lda: i32, b: &[f32], ldb: i32, beta: f32, c: &mut [f32], ldc: i32) {
  _sgemm1(layout, transa, transb, m, n, k, alpha, a, lda, b, ldb, beta, c, ldc)
}
fn _ssymm (_layout: Layout, _side: Side, _uplo: Part, _m: i32, _n: i32, _alpha: f32, _a: &[f32], _lda: i32, _b: &[f32], _ldb: i32, _beta: f32, _c: &mut [f32], _ldc: i32)       { todo!() }
fn _ssyr2k(_layout: Layout, _uplo: Part, _trans: Transpose, _n: i32, _k: i32, _alpha: f32, _a: &[f32], _lda: i32, _b: &[f32], _ldb: i32, _beta: f32, _c: &mut [f32], _ldc: i32) { todo!() }
fn _ssyrk (_layout: Layout, _uplo: Part, _trans: Transpose, _n: i32, _k: i32, _alpha: f32, _a: &[f32], _lda: i32, _beta: f32, _c: &mut [f32], _ldc: i32)                         { todo!() }
fn _strmm (_layout: Layout, _side: Side, _uplo: Part, _transa: Transpose, _diag: Diagonal, _m: i32, _n: i32, _alpha: f32, _a: &[f32], _lda: i32, _b: &mut [f32], _ldb: i32)     { todo!() }
fn _strsm (_layout: Layout, _side: Side, _uplo: Part, _transa: Transpose, _diag: Diagonal, _m: i32, _n: i32, _alpha: f32, _a: &[f32], _lda: i32, _b: &mut [f32], _ldb: i32)     { todo!() }

// ── Level 3 — d (f64) ───────────────────────────────────────────────────────

pub fn dgemm(layout: Layout, transa: Transpose, transb: Transpose, m: i32, n: i32, k: i32, alpha: f64, a: &[f64], lda: i32, b: &[f64], ldb: i32, beta: f64, c: &mut [f64], ldc: i32) { todo!() }
fn _dsymm (_layout: Layout, _side: Side, _uplo: Part, _m: i32, _n: i32, _alpha: f64, _a: &[f64], _lda: i32, _b: &[f64], _ldb: i32, _beta: f64, _c: &mut [f64], _ldc: i32)       { todo!() }
fn _dsyr2k(_layout: Layout, _uplo: Part, _trans: Transpose, _n: i32, _k: i32, _alpha: f64, _a: &[f64], _lda: i32, _b: &[f64], _ldb: i32, _beta: f64, _c: &mut [f64], _ldc: i32) { todo!() }
fn _dsyrk (_layout: Layout, _uplo: Part, _trans: Transpose, _n: i32, _k: i32, _alpha: f64, _a: &[f64], _lda: i32, _beta: f64, _c: &mut [f64], _ldc: i32)                         { todo!() }
fn _dtrmm (_layout: Layout, _side: Side, _uplo: Part, _transa: Transpose, _diag: Diagonal, _m: i32, _n: i32, _alpha: f64, _a: &[f64], _lda: i32, _b: &mut [f64], _ldb: i32)     { todo!() }
fn _dtrsm (_layout: Layout, _side: Side, _uplo: Part, _transa: Transpose, _diag: Diagonal, _m: i32, _n: i32, _alpha: f64, _a: &[f64], _lda: i32, _b: &mut [f64], _ldb: i32)     { todo!() }

// ── Custom (non-BLAS) ────────────────────────────────────────────────────────

fn _smul (n: usize, x: &[f32], y: &[f32], z: &mut [f32]) { for i in 0..n { z[i] = x[i] * y[i] } }
fn _stanh(n: usize, x: &[f32], y: &mut [f32])             { for i in 0..n { y[i] = x[i].tanh() } }

fn _sgemm1(layout: Layout, transa: Transpose, transb: Transpose, m: i32, n: i32, k: i32, alpha: f32, a: &[f32], lda: i32, b: &[f32], ldb: i32, beta: f32, c: &mut [f32], ldc: i32) {
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

fn _sgemm2(_layout: Layout, _transa: Transpose, _transb: Transpose, _m: i32, _n: i32, _k: i32, _alpha: f32, _a: &[f32], _lda: i32, _b: &[f32], _ldb: i32, _beta: f32, _c: &mut [f32], _ldc: i32) { todo!() }
fn _sgemm3(_layout: Layout, _transa: Transpose, _transb: Transpose, _m: i32, _n: i32, _k: i32, _alpha: f32, _a: &[f32], _lda: i32, _b: &[f32], _ldb: i32, _beta: f32, _c: &mut [f32], _ldc: i32) { todo!() }
fn _sgemm4(_layout: Layout, _transa: Transpose, _transb: Transpose, _m: i32, _n: i32, _k: i32, _alpha: f32, _a: &[f32], _lda: i32, _b: &[f32], _ldb: i32, _beta: f32, _c: &mut [f32], _ldc: i32) { todo!() }
fn _sgemm5(_layout: Layout, _transa: Transpose, _transb: Transpose, _m: i32, _n: i32, _k: i32, _alpha: f32, _a: &[f32], _lda: i32, _b: &[f32], _ldb: i32, _beta: f32, _c: &mut [f32], _ldc: i32) { todo!() }
