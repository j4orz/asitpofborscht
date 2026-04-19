use divan::counter::ItemsCount;
use eagkers::cblas::{Layout, Transpose};

fn main() { divan::main(); }

fn inputs(n: usize) -> (Vec<f32>, Vec<f32>, Vec<f32>) {
  (vec![1.0f32; n * n], vec![1.0f32; n * n], vec![0.0f32; n * n])
}

#[divan::bench_group]
mod gemm {
  use super::*;

  #[divan::bench(args = [16, 32, 64, 128, 256, 512, 1024])] //, 2048, 4096, 8192])]
  fn eagkers(b: divan::Bencher, n: usize) {
    let (a, bm, mut c) = inputs(n);
    b.counter(ItemsCount::new(2 * n * n * n))
     .bench_local(||
      eagkers::cblas::sgemm(
        Layout::RowMajor, Transpose::None, Transpose::None, 
        n as i32, n as i32, n as i32, 
        1.0, &a, n as i32, &bm, n as i32, 
        0.0, &mut c, n as i32
      )
    );
  }

  #[cfg(feature = "cpudev")]
  #[divan::bench(args = [16, 32, 64, 128, 256, 512, 1024])] //, 2048, 4096, 8192])]
  fn cblas(b: divan::Bencher, n: usize) {
    let (a, bm, mut c) = inputs(n);
    b.counter(ItemsCount::new(2 * n * n * n))
     .bench_local(|| unsafe {
       cblas::sgemm(
         cblas::Layout::RowMajor, cblas::Transpose::None, cblas::Transpose::None,
         n as i32, n as i32, n as i32,
         1.0, &a, n as i32, &bm, n as i32,
         0.0, &mut c, n as i32,
       );
     });
  }
}