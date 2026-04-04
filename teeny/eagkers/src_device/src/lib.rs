pub type T = f32; // Input/output type shared with the `rustc-cuda-basic` crate.

mod gpu_device;
pub use gpu_device::add;