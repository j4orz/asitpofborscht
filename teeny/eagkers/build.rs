fn main() {
  println!("cargo::rerun-if-changed=build.rs");

  // if cfg!(target_os = "macos") { println!("cargo:rustc-link-search=/opt/homebrew/opt/openblas/lib"); } // https://doc.rust-lang.org/cargo/reference/build-scripts.html#rustc-link-search
  // println!("cargo:rustc-link-lib=openblas"); // https://doc.rust-lang.org/cargo/reference/build-scripts.html#rustc-link-lib

  #[cfg(feature = "gpu")] {
  use std::env;
  use std::path;
  use cuda_builder::CudaBuilder;

  println!("cargo::rerun-if-changed=src_device");

  let out_dir = path::PathBuf::from(env::var("OUT_DIR").unwrap());
  let manifest_dir = path::PathBuf::from(env::var("CARGO_MANIFEST_DIR").unwrap());

  // Compile the `kernels` crate to `$OUT_DIR/kernels.ptx`.
  CudaBuilder::new(manifest_dir.join("src_device"))
    .copy_to(out_dir.join("gpu_device.ptx"))
    .build()
    .unwrap();
  }

  #[cfg(not(feature = "gpu"))] { println!("cargo:warning=Building without CUDA support. Enable with --features cuda"); }
}
