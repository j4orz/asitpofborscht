//! eagkers

use pyo3::{prelude::*};
#[cfg(feature = "cpu")] pub mod cblas;
#[cfg(feature = "gpu")] pub mod gpu_host;

#[pymodule]
fn eagkers(m: &Bound<'_, PyModule>) -> PyResult<()> {
  println!("initializing teenygrad.eagkers python module from rust");

  #[cfg(feature = "cpu")] {
    let cpu = PyModule::new(m.py(), "cpu")?;
    cpu.add_function(wrap_pyfunction!(cblas::saxpypy, &cpu)?)?;
    cpu.add_function(wrap_pyfunction!(cblas::smulpy, &cpu)?)?;
    cpu.add_function(wrap_pyfunction!(cblas::stanhpy, &cpu)?)?;
    cpu.add_function(wrap_pyfunction!(cblas::sgemmpy, &cpu)?)?;
    m.add_submodule(&cpu)?;
  }

  #[cfg(feature = "gpu")] {
  let gpu = PyModule::new(m.py(), "gpu")?;
  gpu.add_function(wrap_pyfunction!(cudars_helloworld_py, &gpu)?)?;
  m.add_submodule(&gpu)?;
  }

  Ok(())
}