use divan::counter::ItemsCount;
use eagkers::cpu::{Layout, Transpose};
// roughly speaking,
// rust's divan is to criterion as
// cpp's nanobench is to google benchmark as
// python's richbench is to pytest-benchmark/pyperf

fn main() { divan::main(); }

fn inputs(n: usize) -> (Vec<f32>, Vec<f32>, Vec<f32>) {
  (vec![1.0f32; n * n], vec![1.0f32; n * n], vec![0.0f32; n * n])
}

#[divan::bench]
fn eagkers_gemm_256(b: divan::Bencher) {
  const N: usize = 256;
  let (a, bm, mut c) = inputs(N);
  b.counter(ItemsCount::new(2 * N * N * N))
   .bench_local(|| eagkers::cpu::sgemm(Layout::RowMajor, Transpose::None, Transpose::None, N as i32, N as i32, N as i32, 1.0, &a, N as i32, &bm, N as i32, 0.0, &mut c, N as i32));
}

#[cfg(feature = "cpudev")]
#[divan::bench]
fn openblas_gemm_256(b: divan::Bencher) {
  const N: usize = 256;
  let (a, bm, mut c) = inputs(N);
  b.counter(ItemsCount::new(2 * N * N * N))
   .bench_local(|| unsafe {
     cblas::sgemm(
       cblas::Layout::RowMajor,
       cblas::Transpose::None, cblas::Transpose::None,
       N as i32, N as i32, N as i32,
       1.0, &a, N as i32, &bm, N as i32,
       0.0, &mut c, N as i32,
     );
   });
}
