#[cfg(feature = "gpu")] use eagkers::gpu_host;

fn main() -> Result<(), Box<dyn std::error::Error>> {
  #[cfg(feature = "gpu")]
  gpu_host::cudars_helloworld()?;

  Ok(())
}