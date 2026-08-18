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
#[kernel] pub unsafe fn saxpy<T>(alpha: T, a: *const T, b: *const T, c: *mut T, n: usize)
where
    T : Copy + Mul<Output = T> + Add<Output = T>,
 {
  let stride = cuda_std::thread::num_threads_1d() as usize;
   let mut i = cuda_std::thread::index_1d() as usize;
   while i < n {
        *c.add(i) = *a.add(i) * alpha + *b.add(i);
        i += stride;
    }
}

#[allow(improper_ctypes_definitions)]
#[kernel] pub unsafe fn smul(a: &[T], b: &[T], c: *mut T) {
  let i = cuda_std::thread::index_1d() as usize;
  if i < a.len() && i < b.len(){
    let elem = &mut *c.add(i);
    *elem = a[i] * b[i];
  }

}

#[allow(improper_ctypes_definitions)]
#[kernel] pub unsafe fn stanh(a: &[T], b: &[T], c: *mut T) {
  let i = cuda_std::thread::index_1d() as usize;
  todo!()
}
