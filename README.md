# Motivation

The SITP and `teenygrad` project is trying to fill a pedagogical gap in the discipline of deep learning systems.
With traditional software 1.0, the languages and runtimes that makeup production-grade systems such as LLVM and Linux
have way too much tail-end complexity (both fundamental and accidental) which make them inappropriate as learning vehicles.
Instead, there exists teaching compilers and operating systems — to name a few,
- a mini Lisp-like interpreter, a [metacircular evaluator](https://mitp-content-server.mit.edu/books/content/sectbyfn/books_pres_0/6515/sicp.zip/full-text/book/book-Z-H-26.html#%_sec_4.1)
- a mini C-like compiler [chibicc](https://github.com/rui314/chibicc) (in turn inspired by tcc and lcc),
- a mini LLVM-like SSA instruction set [Bril](https://www.cs.cornell.edu/~asampson/blog/bril.html)
- a mini Unix-like operating system [xv6](https://pdos.csail.mit.edu/6.828/2025/xv6/book-riscv-rev5.pdf)
- a mini x86-like instruction set [LC3](https://en.wikipedia.org/wiki/Little_Computer_3)

For deep learning systems, given that the discpline is relatively new (the 2020-2025? era of scaling has just passed), the pedagogical material is quite nascent.
While there are some great resources such as Sasha Rush's [minitorch](https://minitorch.github.io/) course at Cornell and
Tianqi Chen's [needl](https://dlsyscourse.org/) course at Carnegie Mellon,
there are a few gaps that I personally would like to see filled, which is what SITP and `teenygrad` trying to do.

# Installation

## Eager Mode
`teenygrad` eager mode (developed in part [1](https://book.j4orz.ai/1.html) and [2](https://book.j4orz.ai/2.html) of the book)
has a mixed source of Python, Rust, and CUDA Rust in order to support CPU and GPU acceleration.
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
To enable GPU acceleration, teenygrad uses [CUDA Rust](https://github.com/Rust-GPU/rust-cuda),
which in turn requires a specific version matrix required (notably the LLVM subset NVVM pinned to LLVM 7.x,
because [CUDA Rust targets NVVM rather than using LLVM's PTX codegen](https://rust-gpu.github.io/rust-cuda/faq.html))
and so [docker containers and shell scripts provided by CUDA Rust](https://rust-gpu.github.io/rust-cuda/guide/getting_started.html#docker)
are reused for `teenygrad` development.

1. Install [NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html) on your machine
2. Then run the following in your shell:
    ```sh
    sudo nvidia-ctk runtime configure --runtime=docker # set nvidia's container runtime to docker
    sudo systemctl restart docker                      # restart docker
    ./dcr.sh                                           # create container with old version of llvm for cuda rust
    ./dex.sh "cd rust && cargo run --features gpu"     # run gpu accelerated gemm kernel
    ./dex.sh "maturin develop"                         # build the shared object for cpython's extension modules
    ./dex.sh "uv run examples/abstractions.py"         # run gpu accelerated gemm kernel from python
    ```
    Also note that `./dcr.sh` is the production container, so that any commands to run the Rust with `cargo`, build the Rust with `maturin`, or run the Python with `uv` must be qualified with `./dex.sh`.
3. For VSCode development, when you open the project with VS Code you will be prompted with
   `"Folder contains a Dev Container configuration file. Reopen folde to develop in a container"` in which you press the button `Reopen Container`,
   which will restart vscode with the [development container](https://code.visualstudio.com/docs/devcontainers/containers) specified at `.devcontainer`
   with the CUDA Rust provided containers in order to enable `rustanalyzer`. The final step is to point `rustanalyzer` to the Rust and CUDA Rust source in `settings.json`:
    ```json
    {
      <!-- other fields in settings.json -->
      "rust-analyzer.linkedProjects": ["teeny/rust/Cargo.toml"],
      "rust-analyzer.cargo.features": ["gpu"],
    }
    ```
    Note that when VSCode opening the project's development container, none of the `./dex.sh` commands from step 2 will work, since the development container doesn't have docker.
    For that, either enter those commands in the shell of a second VSCode editor, or simply different shell software.

## Graph Mode
`teenygrad` graph mode (developed in part [3](https://book.j4orz.ai/3.html) of the book) is a pure Python Tensor compiler.