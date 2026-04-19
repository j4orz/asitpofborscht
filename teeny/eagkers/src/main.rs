#[cfg(feature = "gpu")] use eagkers::gpu_host;

fn main() -> Result<(), Box<dyn std::error::Error>> {
  #[cfg(feature = "gpu")]
  gpu_host::cudars_helloworld()?;

  #[cfg(feature = "cpu")] {
    let n = 8;
    let (alpha, x, mut y) = (1.0f32, vec![1.0f32; n], vec![1.0f32; n]);
    eagkers::cpu::saxpy(n as i32, alpha, &x, 1, &mut y, 1);
    println!("{:?}", y);
  }

  Ok(())
}