use pyo3::prelude::*;
use cudarc::driver::{CudaContext, LaunchConfig, PushKernelArg};
use cudarc::nvrtc::Ptx;
use gpu_device::T;

// Embed the PTX code as a static string.
static PTX: &str = include_str!(concat!(env!("OUT_DIR"), "/device_kernels.ptx"));

#[pyfunction]
#[pyo3(name = "cudars_helloworld")]
pub fn cudars_helloworld_py() -> PyResult<()> {
  let _ = cudars_helloworld();
  Ok(())
}

pub fn cudars_helloworld() -> Result<(), Box<dyn std::error::Error>> {
  let ctx = CudaContext::new(0)?;
  let stream = ctx.default_stream();

  let module = ctx.load_module(Ptx::from_src(PTX))?;
  let add_kernel = module.load_function("add")?;

  let (a, b): ([T; _], [T; _]) = ([1.0, 2.0, 3.0, 4.0], [2.0, 3.0, 4.0, 5.0]);

  // Allocate memory on the GPU and copy the contents from the CPU memory.
  let a_gpu = stream.clone_htod(&a)?;
  let b_gpu = stream.clone_htod(&b)?;
  let mut c_gpu = stream.alloc_zeros::<T>(a.len())?;

  // Launch the kernel: 1 block of 4 threads.
  // Mismatch between this call and the kernel signature can cause undefined behaviour.
  let cfg = LaunchConfig {
    grid_dim: (1, 1, 1),
    block_dim: (4, 1, 1),
    shared_mem_bytes: 0,
  };
  let (a_len, b_len) = (a_gpu.len(), b_gpu.len());
  unsafe {
    stream
      .launch_builder(&add_kernel)
      .arg(&a_gpu)
      .arg(&a_len)
      .arg(&b_gpu)
      .arg(&b_len)
      .arg(&mut c_gpu)
      .launch(cfg)?;
  }

  stream.synchronize()?;

  let c = stream.clone_dtoh(&c_gpu)?;
  println!("c from cuda is = {:?}", c);

  Ok(())
}