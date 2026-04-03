use pyo3::prelude::*;
pub mod cpu;
#[cfg(feature = "gpu")] pub mod gpu_host;

#[pymodule]
fn eagkers(m: &Bound<'_, PyModule>) -> PyResult<()> {
  println!("initializing teenygrad.eagkers python module from rust");

  let cpu = PyModule::new(m.py(), "cpu")?;
  cpu.add_function(wrap_pyfunction!(cpu::saxpypy, &cpu)?)?;
  cpu.add_function(wrap_pyfunction!(cpu::smulpy, &cpu)?)?;
  cpu.add_function(wrap_pyfunction!(cpu::stanhpy, &cpu)?)?;
  cpu.add_function(wrap_pyfunction!(cpu::sgemmpy, &cpu)?)?;
  m.add_submodule(&cpu)?;

  #[cfg(feature = "gpu")] {
  let gpu = PyModule::new(m.py(), "gpu")?;
  gpu.add_function(wrap_pyfunction!(cudars_helloworld_py, &gpu)?)?;
  m.add_submodule(&gpu)?; }

  Ok(())
}

#[pyfunction]
#[pyo3(name = "cudars_helloworld")]
pub fn cudars_helloworld_py() -> PyResult<()> {
  let _ = gpu_host::cudars_helloworld();
  Ok(())
}