use cuda_std::kernel;
use crate::T;

#[allow(improper_ctypes_definitions)]
#[kernel] pub unsafe fn add(a: &[T], b: &[T], c: *mut T) {
  let i = cuda_std::thread::index_1d() as usize;
  if i < a.len() {
    let elem = unsafe { &mut *c.add(i) };
    *elem = a[i] + b[i];
  }
}

#[allow(improper_ctypes_definitions)]
#[kernel] pub unsafe fn saxpy(a: &[T], b: &[T], c: *mut T) {
  let i = cuda_std::thread::index_1d() as usize;
  todo!()
}

#[allow(improper_ctypes_definitions)]
#[kernel] pub unsafe fn smul(a: &[T], b: &[T], c: *mut T) {
  let i = cuda_std::thread::index_1d() as usize;
  todo!()
}

#[allow(improper_ctypes_definitions)]
#[kernel] pub unsafe fn stanh(a: &[T], b: &[T], c: *mut T) {
  let i = cuda_std::thread::index_1d() as usize;
  todo!()
}