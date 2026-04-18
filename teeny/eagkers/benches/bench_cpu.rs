#![feature(test)]
extern crate test;

#[cfg(test)]
#[rustfmt::skip]
mod benches {
  use test::Bencher;

  fn inputs(size: usize) -> (Vec<f32>, Vec<f32>, Vec<f32>) {
    (vec![1.0f32; size * size], vec![1.0f32; size * size], vec![0.0f32; size * size])
  }

  fn bench_eagkers_gemm(bench: &mut Bencher, size: usize) {
    let (a, bm, mut c) = inputs(size);
    bench.iter(|| eagkers::cpu::sgemmrs(false, false, size, size, size, 1.0, 0.0, &a, size, &bm, size, &mut c, size));
  }

  #[cfg(feature = "cpudev")]
  fn bench_cpudev_gemm(bench: &mut Bencher, size: usize) {
    let (a, bm, mut c) = inputs(size);
    bench.iter(|| {
      unsafe {
        cblas::sgemm(
          cblas::Layout::RowMajor,
          cblas::Transpose::None, cblas::Transpose::None,
          size as i32, size as i32, size as i32,
          1.0, &a, size as i32, &bm, size as i32,
          0.0, &mut c, size as i32,
        )
      }
    });
  }

  #[bench] fn bench_eagkers_gemm_256(b: &mut Bencher) { bench_eagkers_gemm(b, 256) }

  #[cfg(feature = "cpudev")]
  #[bench] fn bench_cpudev_gemm_256(b: &mut Bencher) { bench_cpudev_gemm(b, 256) }
}
