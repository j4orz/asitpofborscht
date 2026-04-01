#[cfg(feature = "gpu")]
use rs::gpu_host;

fn main() -> Result<(), Box<dyn std::error::Error>> {
  #[cfg(feature = "gpu")]
  gpu_host::cudars_helloworld()?;

  println!("hello from rust!");
  Ok(())
}