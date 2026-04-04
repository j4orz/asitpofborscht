use cudarc::{driver::{self, PushKernelArg}, nvrtc};
use gpu_device::T; // shared type with device code
static PTX: &str = include_str!(concat!(env!("OUT_DIR"), "/gpu_device.ptx")); // Embed the PTX code as a static string.

pub fn cudars_helloworld() -> Result<(), Box<dyn std::error::Error>> {
  // initialize device context and stream via driver api
  let process = driver::CudaContext::new(0)?; // device 0
  let queue = process.default_stream();
  
  // load ptx via nvrtc
  let dylib = process.load_module(nvrtc::Ptx::from_src(PTX))?;
  let add_kernel = dylib.load_function("add")?;

  // allocate on device
  let (a, b): ([T; _], [T; _]) = ([1.0, 2.0, 3.0, 4.0], [2.0, 3.0, 4.0, 5.0]);
  let (a_gpu, b_gpu, mut c_gpu) = (queue.clone_htod(&a)?, queue.clone_htod(&b)?, queue.alloc_zeros::<T>(a.len())?);
  let (a_len, b_len) = (a_gpu.len(), b_gpu.len());

  let cfg = driver::LaunchConfig { grid_dim: (1, 1, 1), block_dim: (4, 1, 1), shared_mem_bytes: 0, };
  unsafe {
    queue
    .launch_builder(&add_kernel).arg(&a_gpu).arg(&a_len).arg(&b_gpu).arg(&b_len).arg(&mut c_gpu)
    .launch(cfg)?;
  }
  queue.synchronize()?;

  let c = queue.clone_dtoh(&c_gpu)?;
  println!("c from cuda is = {:?}", c);
  Ok(())
}