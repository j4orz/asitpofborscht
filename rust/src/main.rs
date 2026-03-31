#[cfg(feature = "gpu")]
use rs::gpu;

fn main() -> Result<(), Box<dyn std::error::Error>> {
  #[cfg(feature = "gpu")]
  gpu::cudars_helloworld()?;

  println!("hello from rust!");
  Ok(())
}