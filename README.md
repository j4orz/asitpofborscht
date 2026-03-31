# Installation

## Eager Mode
`teenygrad` eager mode (developed in part [1](https://book.j4orz.ai/1.html) and [2](https://book.j4orz.ai/2.html) of the book) has a mixed source of Python, Rust, and CUDA Rust in order to support CPU and GPU acceleration.
The Python to Rust interop is implemented using CPython Extension Modules via [`PyO3`](https://pyo3.rs/),
with the shared object files compiled by driving `cargo` via PyO3's build tool [`maturin`](https://www.maturin.rs/).

**CPU kernels (RISC-V)**
1. CPU kernels do not use the docker container (for now).
    ```sh
    uv pip install maturin                             # install maturin (which drives pyo3)
    cd rust && cargo run                               # run cpu acccelerated gemm kernel
    maturin develop                                    # build shared object for cpython's extension modules
    uv run examples/abstractions.py                    # run cpu accelerated gemm kernel from python
    ```

**GPU kernels (PTX)**
To enable GPU acceleration, teenygrad uses [CUDA Rust](https://github.com/Rust-GPU/rust-cuda), which in turn requires a specific version matrix required (notably an old version of LLVM) and so CUDA Rust's provided docker containers and shell scripts are used.
1. Install [NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html) on your machine
2. Run the following in your shell:
    ```sh
    sudo nvidia-ctk runtime configure --runtime=docker # configure container runtime to docker
    sudo systemctl restart docker                      # restart docker
    ./dcr.sh                                           # create container with old version of llvm for cuda rust
    ./dex.sh "cd rust && cargo run --features cuda"    # run gpu accelerated gemm kernel
    ./dex.sh "maturin develop"                         # build the shared object for cpython's extension modules
    ./dex.sh "uv run examples/abstractions.py"         # run gpu accelerated gemm kernel from python
    ```
3. Point `rustanalyzer` to the Rust and CUDA Rust source:
    ```json
    {
      <!-- other fields in settings.json -->
      "rust-analyzer.linkedProjects": ["rust/Cargo.toml"]
    }
    ```

## Graph Mode
`teenygrad` graph mode (developed in part [3](https://book.j4orz.ai/3.html) of the book) is a pure Python Tensor compiler.