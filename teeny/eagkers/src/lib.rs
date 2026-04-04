//! eagkers

use pyo3::{buffer::PyBuffer, prelude::*};
pub mod cpu;
#[cfg(feature = "gpu")] pub mod gpu_host;

#[pymodule]
fn eagkers(m: &Bound<'_, PyModule>) -> PyResult<()> {
  println!("initializing teenygrad.eagkers python module from rust");

  let cpu = PyModule::new(m.py(), "cpu")?;
  cpu.add_function(wrap_pyfunction!(saxpypy, &cpu)?)?;
  cpu.add_function(wrap_pyfunction!(smulpy, &cpu)?)?;
  cpu.add_function(wrap_pyfunction!(stanhpy, &cpu)?)?;
  cpu.add_function(wrap_pyfunction!(sgemmpy, &cpu)?)?;
  m.add_submodule(&cpu)?;

  #[cfg(feature = "gpu")] {
  let gpu = PyModule::new(m.py(), "gpu")?;
  gpu.add_function(wrap_pyfunction!(cudars_helloworld_py, &gpu)?)?;
  m.add_submodule(&gpu)?; }

  Ok(())
}

// gpu ######################################################################################

#[pyfunction]
#[pyo3(name = "cudars_helloworld")]
pub fn cudars_helloworld_py() -> PyResult<()> {
  let _ = gpu_host::cudars_helloworld();
  Ok(())
}

// cpu ######################################################################################

#[pyfunction]
#[pyo3(name = "saxpy")]
pub fn saxpypy(n: usize, alpha: f32, x: PyBuffer<f32>, y: PyBuffer<f32>) -> PyResult<()> {
  let x = unsafe { std::slice::from_raw_parts(x.buf_ptr() as *const f32, n) };
  let y = unsafe { std::slice::from_raw_parts_mut(y.buf_ptr() as *mut f32, n) };
  cpu::saxpy(n, alpha, x, y);
  Ok(())
}

#[pyfunction]
#[pyo3(name = "smul")]
pub fn smulpy(n: usize, x: PyBuffer<f32>, y: PyBuffer<f32>, z: PyBuffer<f32>) -> PyResult<()> {
  let x = unsafe { std::slice::from_raw_parts(x.buf_ptr() as *const f32, n) };
  let y = unsafe { std::slice::from_raw_parts(y.buf_ptr() as *mut f32, n) };
  let z = unsafe { std::slice::from_raw_parts_mut(z.buf_ptr() as *mut f32, n) };
  cpu::smul(n, x, y, z);
  Ok(())
}

#[pyfunction]
#[pyo3(name = "stanh")]
pub fn stanhpy(n: usize, x: PyBuffer<f32>, y: PyBuffer<f32>) -> PyResult<()> {
  // SAFETY: x, y are array.array('f') buffers from Python with length n.
  let x = unsafe { std::slice::from_raw_parts(x.buf_ptr() as *const f32, n) };
  let y = unsafe { std::slice::from_raw_parts_mut(y.buf_ptr() as *mut f32, n) };
  cpu::stanh(n, x, y);
  Ok(())
}

#[pyfunction]
#[pyo3(name = "sgemm")]
pub fn sgemmpy(
  transa: bool, transb: bool, m: usize, n: usize, p: usize, alpha: f32, beta: f32,
  a: PyBuffer<f32>, lda: usize, b: PyBuffer<f32>, ldb: usize, c: PyBuffer<f32>, ldc: usize,
) -> PyResult<()> {
  // SAFETY: a, b, c are array.array('f') buffers from Python.
  // The buffer protocol guarantees the pointer is valid and the data is contiguous f32.
  // SAFETY: a, b, c are array.array('f') buffers from Python.
  // The buffer protocol guarantees the pointer is valid and the data is contiguous f32.
  let a_len = if transa { p * lda } else { m * lda }; // stored as (p,lda) or (m,lda)
  let b_len = if transb { n * ldb } else { p * ldb }; // stored as (n,ldb) or (p,ldb)
  let a = unsafe { std::slice::from_raw_parts(a.buf_ptr() as *const f32, a_len) };
  let b = unsafe { std::slice::from_raw_parts(b.buf_ptr() as *const f32, b_len) };
  let c = unsafe { std::slice::from_raw_parts_mut(c.buf_ptr() as *mut f32, m * ldc) };
  cpu::sgemmrs(transa, transb, m, n, p, alpha, beta, a, lda, b, ldb, c, ldc);
  Ok(())
}