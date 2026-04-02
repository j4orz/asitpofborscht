# ARCHITECTURE.md

This `ARCHITECTURE` document describes the high-level architecture of SITP book and `teenygrad` codebase
with the goal of providing contributors (both humans and llms) with "what" and "where" knowledge of the "physical architecture" of the project,
as [described by matklad](https://matklad.github.io/2021/02/06/ARCHITECTURE.md.html), the creator and core maintainer of rustanalyzer.
A non-goal of this document is to provide "how", which is better served by reading the book itself https://sitp.ai or external documentation (i.e PTX documentation)

**Contents**
- [Bird's Eye View](#birds-eye-view)
  - [SITP Book](#sitp-book)
  - [`teenygrad` Codebase](#teenygrad-codebase)
- [Code Map](#code-map)
  - [Level 0 (SITP Book and `teenygrad` Codebase)](#level-0-the-sitp-book-and-teenygrad-codebase)
  - [Level 1 (`teenygrad`'s Build Configuration and Development Environment](#level-1-teenygrads-build-configuration-and-development-environment)
  - [Level 2 (`teenygrad`'s Python Core and Rust Kernels)](#level-2-teenygrads-python-core-and-rust-kernels)

## Bird's Eye View

At the highest level, there are two components to the project — namely, the *SITP book* living under `/sitp` and the *`teenygrad` codebase* living under `/teeny`.
They bridge together with code examples living under `/examples`, which executes locally for development, and in the online book with Pyodide.

### SITP Book

```
                    │ served as static HTML/JS
          ┌─────────▼──────────────────────────────────────────────────┐
          │   mdbook  /sitp                                             │
          │                                                             │
          │   ┌─────────────────────────┐                              │
          │   │    /teeny/examples        │                              │
          │   └────────────┬────────────┘                              │
          │                │                                           │
          │   ┌────────────▼────────────┐                              │
          │   │   mdbook preprocessor   │                              │
          │   │   (injects ACE Editor)  │                              │
          │   └────────────┬────────────┘                              │
          │                │ injects                                   │
          │   ┌────────────▼────────────┐  executes  ┌─────────────┐  │
          │   │      ACE Editor         ├───────────►│   Pyodide   │  │
          │   │    (code input UI)      │            │   (WASM)    │  │
          │   └─────────────────────────┘            └─────────────┘  │
          │                                                             │
          └─────────────────────────────────────────────────────────────┘
```

The `teenygrad` codebase follows the classic "~~three~~four language problem" architecture of deep learning frameworks.
with Python for productivity, Rust for native CPU performance, and CUDA Rust/cuTile Rust for native GPU performance.

### `teenygrad` codebase
```
┌───────────────────────────────────┐
│            /python                │
└────────────────┬──────────────────┘
                 │ PyO3
        ┌────────▼────────────┐
        │  /rust/src/lib.rs   │
        └───────┬─────────┬───┘
                │         │
┌───────────────▼───┐  ┌──▼──────────────────────────┐       ┌────────────────────────────────────┐
│                   │  │                              │       │                                    │
│  /rust/src/cpu.rs │  │  /rust/src/gpu_host.rs       ├──────►│  /rust/gpu_device/src/lib.rs       │
│                   │  │                              │       │  cuTile TODO                       │
└───────────────────┘  └──────────────────────────────┘       └────────────────────────────────────┘
  Rust CPU Kernels        Rust GPU Kernels (Host)                 Rust GPU Device (Device)

```

## Code Map

Let's iteratively deepen our physical understanding of the block diagram above with the project's code `tree`.

### Level 0 (The SITP Book and `teenygrad` Codebase)

```
└── teenygrad
    ├── .devcontainer                (X)
    │    ... (OMITTED)
    ├── .github                      (Y)
    │    ... (OMITTED)
    ├── ARCHITECTURE.md           (A)
    ├── LICENSE                   (B)
    ├── README.md                 (C)
    ├── sitp                  (1)
    │    ... (OMITTED)          
    └── teeny                 (2)
    │    ... (OMITTED)
```

The project's root directory for the `teenygrad` repository has roughly speaking three primary functions in which all files at the fall under:
1. **`(1), (2)` makeup the SITP book and `teenygrad` codebase**</br>
    - The SITP book uses Rust's [mdbook](https://rust-lang.github.io/mdBook/), which is the Rust version of jupyter notebooks.
      For instance, [here is a list of both official and unofficial Rust books](https://lborb.github.io/book/official.html) which all use the mdbook software.
    - The `teenygrad` codebase under `teeny/` is the primary directory we will focus on understanding in the subsequent levels of the project's code `tree`
2. **`(A), (B), (C)` makeup the the repository's metadata**</br>
  Other files including metadata such as `README.md`, `ARCHITECTURE.md`, and the `LICENSE` live at the project's root directory.
3. **`(X), (Y)` makeup local development and CI/CD**</br>
  This consists of [`.devcontainer/`](https://code.visualstudio.com/docs/devcontainers/containers) and `.github/`.
  This `.devcontainer` is specifically for VSCode development which creates a container with specific [`CUDA Rust`](https://rust-gpu.github.io/rust-cuda/) dependencies solely for the purpose of
  enabling intellisense/language-server-protocol capability with [rustanalyzer](https://rust-analyzer.github.io/).
  Although this directory can arguably be placed under `/teeny`, it's placed in the project root "monorepo" to enable
  the simultaneous development of GPU kernels under `/teeny` while also having access to the `sitp/` book in your tree.

We will now focus our attention specifically on the `teenygrad` codebase (2) under `teeny/`

### Level 1 (`teenygrad`'s Build Configuration and Development Environment)

In `teeny/`, roughly speaking there are three primary functions in which all files fall under:
1. **`(1), (2), (3)` makeup the source of `teenygrad`**
2. **`(A), (B), (C)` makeup the build configuration for `maturin` and `PyO3`**
3. **`(X), (Y), (Z)` makeup the development environment for [`CUDA Rust`](https://rust-gpu.github.io/rust-cuda/)**

```
└── teeny
    ├── Dockerfile                     (X)
    ├── dcr.sh                         (Y)
    ├── dex.sh                         (Z)
    ├── examples
    │    ... (OMITTED)          (1)
    ├── pyproject.toml              (A)
    ├── python                  (2)
    │    ... (OMITTED)
    ├── rust                    (3)
    │    ... (OMITTED)
    ├── rust-toolchain.toml         (B)
    └── uv.lock                     (C)
```

In more detail,
1. **`(1), (2), (3)` makeup the source of `teenygrad`**</br>
  As mentioned previously, `teenygrad` follows the classic "three language problem" (now four with CuteDSL) architecture of deep learning frameworks.
  That is, there is a Python package for the researcher scientist's productivity (2) and a Rust crate for the performance engineer's CPU and GPU acceleration (3).
  The way `teenygrad` implements it's Python <-> Rust interop is with [PyO3](https://pyo3.rs/main/index.html)'s CPython bindings, driven by it's build tool [maturin](https://www.maturin.rs/index.html). Speaking of build tools..
2. **`(A), (B), (C)` makeup the build configuration for `maturin` and `PyO3`**</br>
  If you open the linked PyO3 book, you'll learn that it's CPython bindings offer both the capability of calling Rust *from* Python and calling Python *from* Rust.
  While the former is definitely more common in the context of Python packages (i.e numpy, pandas, matplotlib "rewrite the hotspots of Python in C/Rust"),
  the latter is also used, namely in the context of performance first, productivity second (i.e game engines offering the capability of customizations via scripting languages such as Luascript, and Python).
  In fact, PyTorch originates from [LuaTorch](https://torch.ch/), which was implemented with LuaJIT specifically for it's first-class interopability with C.
  Returning specifically to `teenygrad`, it follows the many scientific/hpc-focused Python packages and calls Rust *from* Python.</br></br>
  If you look at the `pyproject.toml` (A), there are three main tables of `[project]`, `[build-system]`, and `[tool]`, as mentioned in the Python Packaging User Guide.
    - `[project]` specifies the basic metadata of the project
    - [`[build-system]`](https://packaging.python.org/en/latest/specifications/pyproject-toml/#pyproject-build-system-table) specifies `maturin`,
      which in fact happens to be one of the examples mentioned in the Python Packaging User Guide¨
      — this should be no surprise given that the [number of PyPi packages with Rust are starting to match those with C++](https://youtu.be/KTQn_PTHNCw?t=96)
      and that there exist PEPs on [adding Rust extension modules, and the core CPython interpreter itself](https://discuss.python.org/t/pre-pep-rust-for-cpython/104906),
      following the [Python Language Summit in 2025](https://pyfound.blogspot.com/2025/06/python-language-summit-2025-what-do-core-developers-want-from-rust.html).
    - `[tool]` specifies the configuration for `uv` and `maturin`
  (todo uv.lock)
3. **`(X), (Y), (Z)` makeup the development environment for [`CUDA Rust`](https://rust-gpu.github.io/rust-cuda/)**</br>
  As mentioned in the [Level 0](#level-0-the-sitp-book-and-teenygrad-codebase) section, [`CUDA Rust`](https://rust-gpu.github.io/rust-cuda/) requires
  [a specific version of LLVM (namely, 7.x while latest is 22.x)](https://rust-gpu.github.io/rust-cuda/guide/getting_started.html#required-libraries),
  because [the instruction set which CUDA Rust's codegen targets is NVVM](https://rust-gpu.github.io/rust-cuda/faq.html#why-not-use-rustc-with-the-llvm-ptx-backend).
  The `.devcontainer` in the project root (at level 0) is just for *static analysis* by rustanalyzer to enable development while having your editor open at the project root,
  whereas `(X), (Y), (Z)` are for the actual *dynamic runtime* to launch and execute CUDA kernels on device.
  ```sh
    cd teeny                                           # cd into teeny/
    ./dcr.sh                                           # create container with old version of llvm for cuda rust
    ./dex.sh "cd rust && cargo run --features gpu"     # run gpu accelerated gemm kernel
    ./dex.sh "maturin develop"                         # build the shared object for cpython's extension modules
    ./dex.sh "uv run examples/abstractions.py"         # run gpu accelerated gemm kernel from python
  ```

Let's now dive down to level 2 of teenygrad,
namely `(1), (2), and (3)` which makeup the source of `teenygrad`.

### Level 2 (`teenygrad`'s Python Core and Rust Kernels)

As mentioned briefly in [Level 1](#level-1-teenygrads-build-configuration-and-development-environment),
`teenygrad`'s source contains a Python package for the researcher scientist's productivity (2)
and a Rust crate for the performance engineer's CPU and GPU acceleration (3).


#### Python Core

As of now, you should ignore `compiler/` and `runtime/` and treat them as spikes for Part 3 of the SITP book
which will cover distributed training and inference. For now, all development will primarily occur in `frontend/`

```
└── teeny
    ├── Dockerfil
    ├── dcr.sh
    ├── dex.sh
    ├── examples
    │    ... (OMITTED)
    ├── pyproject.toml
    ├── python                                       (2)  <------------------------------
    │   ├── teenygrad
    │   │   ├── __init__.py
    │   │   ├── compiler
    │   │   │   ├── __init__.py
    │   │   │   ├── compiler.py
    │   │   │   ├── dslir.py
    │   │   │   └── opnode.py
    │   │   ├── dtype.py
    │   │   ├── eagker.py
    │   │   ├── frontend
    │   │   │   ├── nn.py
    │   │   │   ├── optim.py
    │   │   │   └── tensor.py
    │   │   ├── helpers.py
    │   │   ├── runtime
    │   │   │   ├── __init__.py
    │   │   │   ├── cpu_runtime.py
    │   │   │   ├── cuda_runtime.py
    │   │   │   ├── device.py
    │   │   │   ├── hip_runtime.py
    │   │   │   └── host_runtime.py
    │   │   └── tests
    │   │       ├── test_correct.py
    │   │       └── test_speed.py
    │   └── tests
    │       └── test_tensor.py
    ├── rust
    │    ... (OMITTED)
```

#### Rust Kernels

```
└── teeny
    ├── Dockerfile
    ├── dcr.sh
    ├── dex.sh
    ├── pyproject.toml
    ├── examples
    │    ... (OMITTED)
    ├── python
    │    ... (OMITTED)
    ├── rust                                         (3) <------------------------------
    │   ├── Cargo.lock
    │   ├── Cargo.toml
    │   ├── benches
    │   │   ├── bench_cpu.rs
    │   │   └── bench_gpu.rs
    │   ├── build.rs
    │   ├── gpu_device
    │   │   ├── Cargo.lock
    │   │   ├── Cargo.toml
    │   │   └── src
    │   │       └── lib.rs
    │   ├── rust-toolchain.toml
    │   ├── rustfmt.toml
    │   ├── src
    │   │   ├── cpu.rs
    │   │   ├── gpu_host.rs
    │   │   ├── lib.rs
    │   │   └── main.rs
    │   │   └── main.rs
    ├── rust-toolchain.toml
    └── uv.lock
```