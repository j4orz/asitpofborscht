use eagkers::lapack::{sgesv, sgesvd};

fn sgesv_ref(n: usize, nrhs: usize, a: &[f32], b: &[f32]) -> Vec<f32> {
  let mut a = a.to_vec();
  let mut b = b.to_vec();
  let mut ipiv = vec![0i32; n];
  unsafe { lapacke::sgesv(lapacke::Layout::RowMajor, n as i32, nrhs as i32, &mut a, n as i32, &mut ipiv, &mut b, nrhs as i32) };
  b
}

fn assert_close(a: &[f32], b: &[f32], eps: f32) {
  assert_eq!(a.len(), b.len());
  for (i, (x, y)) in a.iter().zip(b).enumerate() {
    assert!((x - y).abs() <= eps, "index {i}: {x} vs {y}");
  }
}

// 5x3 data matrix: singular values only (jobu='N', jobvt='N') — principal magnitudes for PCA
#[test]
fn sgesvd_5x3_singular_values() {
  let (m, n) = (5, 3);
  let k = m.min(n);
  #[rustfmt::skip]
  let a: Vec<f32> = vec![
    1.0, 2.0, 3.0,
    4.0, 5.0, 6.0,
    7.0, 8.0, 9.0,
    2.0, 0.0, 1.0,
    3.0, 1.0, 4.0,
  ];

  let expected = {
    let mut a_ref = a.clone();
    let mut s = vec![0.0f32; k];
    let mut u = vec![0.0f32; 1];
    let mut vt = vec![0.0f32; 1];
    let mut superb = vec![0.0f32; k - 1];
    unsafe { lapacke::sgesvd(lapacke::Layout::RowMajor, b'N', b'N', m as i32, n as i32, &mut a_ref, n as i32, &mut s, &mut u, 1, &mut vt, 1, &mut superb) };
    s
  };

  let mut a_actual = a.clone();
  let mut s_actual = vec![0.0f32; k];
  let mut u = vec![0.0f32; 1];
  let mut vt = vec![0.0f32; 1];
  sgesvd(b'N', b'N', m as i32, n as i32, &mut a_actual, n as i32, &mut s_actual, &mut u, 1, &mut vt, 1);

  assert_close(&s_actual, &expected, 1e-4);
}

// 3x3, single rhs: well-conditioned system from a diagonally dominant matrix
#[test]
fn sgesv_3x3_1rhs() {
  let n = 3;
  #[rustfmt::skip]
  let a: Vec<f32> = vec![
     4.0, -1.0,  0.0,
    -1.0,  4.0, -1.0,
     0.0, -1.0,  4.0,
  ];
  let b: Vec<f32> = vec![1.0, 2.0, 3.0];

  let expected = sgesv_ref(n, 1, &a, &b);

  let mut a_actual = a.clone();
  let mut b_actual = b.clone();
  let mut ipiv = vec![0i32; n];
  sgesv(n as i32, 1, &mut a_actual, n as i32, &mut ipiv, &mut b_actual, 1);

  assert_close(&b_actual, &expected, 1e-5);
}

// 4x4, two rhs columns: representative of normal equations A^T A x = A^T b
#[test]
fn sgesv_4x4_2rhs() {
  let n = 4;
  #[rustfmt::skip]
  let a: Vec<f32> = vec![
    10.0,  2.0,  1.0,  0.0,
     2.0,  8.0,  1.0,  1.0,
     1.0,  1.0,  6.0,  2.0,
     0.0,  1.0,  2.0,  7.0,
  ];
  let b: Vec<f32> = vec![
    1.0, 0.0,
    0.0, 1.0,
    1.0, 0.0,
    0.0, 1.0,
  ];

  let expected = sgesv_ref(n, 2, &a, &b);

  let mut a_actual = a.clone();
  let mut b_actual = b.clone();
  let mut ipiv = vec![0i32; n];
  sgesv(n as i32, 2, &mut a_actual, n as i32, &mut ipiv, &mut b_actual, 2);

  assert_close(&b_actual, &expected, 1e-5);
}