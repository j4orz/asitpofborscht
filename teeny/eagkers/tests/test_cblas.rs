use eagkers::cblas::{sgemm, Layout, Transpose};

fn cblas_sgemm_ref(transa: Transpose, transb: Transpose, m: usize, n: usize, k: usize, alpha: f32, a: &[f32], b: &[f32], beta: f32, c: &mut [f32]) {
  let ta = if matches!(transa, Transpose::Ordinary | Transpose::Conjugate) { cblas::Transpose::Ordinary } else { cblas::Transpose::None };
  let tb = if matches!(transb, Transpose::Ordinary | Transpose::Conjugate) { cblas::Transpose::Ordinary } else { cblas::Transpose::None };
  let lda = if matches!(transa, Transpose::Ordinary | Transpose::Conjugate) { m as i32 } else { k as i32 };
  let ldb = if matches!(transb, Transpose::Ordinary | Transpose::Conjugate) { k as i32 } else { n as i32 };
  unsafe { cblas::sgemm(cblas::Layout::RowMajor, ta, tb, m as i32, n as i32, k as i32, alpha, a, lda, b, ldb, beta, c, n as i32) };
}

fn assert_close(a: &[f32], b: &[f32], eps: f32) {
  assert_eq!(a.len(), b.len());
  for (i, (x, y)) in a.iter().zip(b).enumerate() {
    assert!((x - y).abs() <= eps, "index {i}: {x} vs {y}");
  }
}

#[test]
fn sgemm_nn() {
  let (m, n, k) = (4, 5, 3);
  let a: Vec<f32> = (0..m*k).map(|i| i as f32).collect();
  let b: Vec<f32> = (0..k*n).map(|i| i as f32 * 0.5).collect();
  let mut actual  = vec![0.0f32; m * n];
  let mut expected = vec![0.0f32; m * n];
  sgemm(Layout::RowMajor, Transpose::None, Transpose::None, m as i32, n as i32, k as i32, 1.0, &a, k as i32, &b, n as i32, 0.0, &mut actual, n as i32);
  cblas_sgemm_ref(Transpose::None, Transpose::None, m, n, k, 1.0, &a, &b, 0.0, &mut expected);
  assert_close(&actual, &expected, 1e-4);
}

#[test]
fn sgemm_tn() {
  let (m, n, k) = (4, 5, 3);
  let a: Vec<f32> = (0..k*m).map(|i| i as f32).collect();
  let b: Vec<f32> = (0..k*n).map(|i| i as f32 * 0.5).collect();
  let mut actual  = vec![0.0f32; m * n];
  let mut expected = vec![0.0f32; m * n];
  sgemm(Layout::RowMajor, Transpose::Ordinary, Transpose::None, m as i32, n as i32, k as i32, 1.0, &a, m as i32, &b, n as i32, 0.0, &mut actual, n as i32);
  cblas_sgemm_ref(Transpose::Ordinary, Transpose::None, m, n, k, 1.0, &a, &b, 0.0, &mut expected);
  assert_close(&actual, &expected, 1e-4);
}

#[test]
fn sgemm_nt() {
  let (m, n, k) = (4, 5, 3);
  let a: Vec<f32> = (0..m*k).map(|i| i as f32).collect();
  let b: Vec<f32> = (0..n*k).map(|i| i as f32 * 0.5).collect();
  let mut actual  = vec![0.0f32; m * n];
  let mut expected = vec![0.0f32; m * n];
  sgemm(Layout::RowMajor, Transpose::None, Transpose::Ordinary, m as i32, n as i32, k as i32, 1.0, &a, k as i32, &b, k as i32, 0.0, &mut actual, n as i32);
  cblas_sgemm_ref(Transpose::None, Transpose::Ordinary, m, n, k, 1.0, &a, &b, 0.0, &mut expected);
  assert_close(&actual, &expected, 1e-4);
}

#[test]
fn sgemm_tt() {
  let (m, n, k) = (4, 5, 3);
  let a: Vec<f32> = (0..k*m).map(|i| i as f32).collect();
  let b: Vec<f32> = (0..n*k).map(|i| i as f32 * 0.5).collect();
  let mut actual  = vec![0.0f32; m * n];
  let mut expected = vec![0.0f32; m * n];
  sgemm(Layout::RowMajor, Transpose::Ordinary, Transpose::Ordinary, m as i32, n as i32, k as i32, 1.0, &a, m as i32, &b, k as i32, 0.0, &mut actual, n as i32);
  cblas_sgemm_ref(Transpose::Ordinary, Transpose::Ordinary, m, n, k, 1.0, &a, &b, 0.0, &mut expected);
  assert_close(&actual, &expected, 1e-4);
}