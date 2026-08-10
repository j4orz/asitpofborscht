![](https://sitp.ai/assets/flammarion_borscht.png)

# a sitpofborscht

The source for the Structure and Interpretation of Tensor Programs (SITP) book at [https://sitp.ai/](https://sitp.ai/)
which implements the `borscht` teaching autograd from scratch, whose source is also included in tree.
This provides a smooth graduation path for both users and producers of `torch`.
By the end of the book, readers will have a working implementation of `borscht` capable of running
distributed training and inference for [`nanochat`](http://github.com/karpathy/nanochat/),
which can be easily modified, extended, and hacked on thereafter.

Such extension of `borscht` is being dogfed at the Singularity Systems (singsys) blog at [https://j4orz.ai/](https://j4orz.ai/),
which covers frontier state of the art concepts that are out of SITP's scope
given that `nanochat` doesn't require any advanced parallelism strategies past data parallelism.
The blog explores, the excellent scaling books by the [Jax](https://jax-ml.github.io/scaling-book/) and [HuggingFace](https://huggingface.co/spaces/nanotron/ultrascale-playbook) teams with
newer abstractions for distributed, namely `borscht.DTensor` and `borscht.DeviceMesh`.
Perhaps such blog can turn into a follow up book to SITP complementing the aforementioned books. Similar to how
LLVM has [Cornell's 6120](https://www.cs.cornell.edu/courses/cs6120/) with [Bril](https://capra.cs.cornell.edu/bril/),
and the way Linux has [MIT's 6.1810](https://pdos.csail.mit.edu/6.1810/2025/overview.html) with [xv6](https://pdos.csail.mit.edu/6.1810/2024/xv6.html).


**Contents**
- [`borscht` Teaching Autograd Installation](#autograd-installation-borscht)
  - [Eager](#eager)
  - [Graph](#graph)
  - [Distributed](#distributed)
- [SITP Book Installation](#book-installation-sitp)

## `borscht` Teaching Autograd Installation

Follow these instructions for a quick setup.
To understand the physical layout of the project repo, refer to the [`ARCHITECTURE.md`](./ARCHITECTURE.md)

### Eager
`teenygrad` eager mode (developed in part [1](https://sitp.ai/1.html) and [2](https://sitp.ai/2.html) of the book)
has a mixed source of Python, Rust, and CUDA Rust in order to support CPU and GPU acceleration.
The Python to Rust interop is implemented using CPython Extension Modules via [`PyO3`](https://pyo3.rs/),
with the shared object files compiled by driving `cargo` via `PyO3`'s build tool [`maturin`](https://www.maturin.rs/).

**CPU kernels (RISC-V)**
1. CPU kernels do not require the docker container
    ```sh
    cd teeny/
    uv venv && source .venv/bin/activate               # create a venv through uv
    uv pip install maturin                             # install maturin (which drives pyo3)
    cd eagkers && cargo run --features cpu             # run cpu acccelerated gemm kernel
    cargo test --features cpu                          # run tests for cpu accelerated blas
    cargo bench --features cpu                         # run benchmarks cpu accelerated blas
    cd ../ && maturin develop                          # build shared object for cpython's extension modules
    uv run examples/abstractions.py                    # run cpu accelerated gemm kernel from python
    ```
2. Point `rustanalyzer` to the Rust source in `settings.json` with the `cpu` feature enabled: 
    ```json
    {
      <!-- other fields in settings.json -->
      "rust-analyzer.linkedProjects": ["teeny/eagkers/Cargo.toml"],
      "rust-analyzer.cargo.features": ["cpu", "cpudev"],
    }
    ```

**GPU kernels (PTX)**

To enable GPU acceleration, teenygrad uses [CUDA Rust](https://github.com/Rust-GPU/rust-cuda),
which in turn requires a specific version matrix required (notably the LLVM subset NVVM pinned to LLVM 7.x,
because [CUDA Rust targets NVVM rather than using LLVM's PTX codegen](https://rust-gpu.github.io/rust-cuda/faq.html#why-not-use-rustc-with-the-llvm-ptx-backend))
and so [docker containers and shell scripts provided by CUDA Rust](https://rust-gpu.github.io/rust-cuda/guide/getting_started.html#required-libraries)
are reused for `teenygrad` development.

1. Install [NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html) on your machine
2. Then run the following in your shell:
    ```sh
    cd teeny/
    sudo nvidia-ctk runtime configure --runtime=docker # set nvidia's container runtime to docker
    sudo systemctl restart docker                      # restart docker
    ./dcr.sh                                           # create container with old version of llvm for cuda rust
    ./dex.sh "cd eagkers && cargo run --features gpu"  # run gpu accelerated gemm kernel
    ./dex.sh "cd ../ && maturin develop"               # build the shared object for cpython's extension modules
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
      "rust-analyzer.linkedProjects": ["teeny/eagkers/Cargo.toml"],
      "rust-analyzer.cargo.features": ["gpu"],
    }
    ```
    Note that when VSCode opening the project's development container, none of the `./dex.sh` commands from step 2 will work, since the development container doesn't have docker.
    For that, either enter those commands in the shell of a second VSCode editor, or simply different shell software.

### Graph

### Distributed

## SITP Book Installation

1. Install [mdbook](https://rust-lang.github.io/mdBook/guide/installation.html), the Rust ecosystems static site generator for markdown.
2. ```sh
   cd sitp/
   mdbook serve
   ```

## License

Following [GPU MODE](https://x.com/marksaroufim/status/2064442386374369597),
this project is licensed under the June 9 Researcher Reciprocity License.

The license adapts the Open RAIL-S structure and adds one specific use restriction: training, fine-tuning, distillation, synthetic-data generation for training, embedding for training, or otherwise using this project to improve an AI model or AI service requires Researcher Reciprocity.

If you train on it, you let us generate.

Covered AI model and service providers may not use this project while imposing terms that prevent SITP and teenygrad project contributors, or authorized researchers from generating outputs, evaluating models, benchmarking, publishing research, or exploring their own research ideas on materially equal terms to ordinary users.