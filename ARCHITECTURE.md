# ARCHITECTURE.md

This `ARCHITECTURE` document describes the high-level architecture of SITP book and `teenygrad` codebase
with the goal of providing contributors (both humans and llms) with "what" and "where" knowledge of the "physical architecture" of the project,
as described by matklad, the creator and core maintainer of rustanalyzer: https://matklad.github.io/2021/02/06/ARCHITECTURE.md.html
A non-goal of this document is to provide "how", which is better served by reading the book itself as a student (https://sitp.ai) or external documentation (i.e PTX documentation)

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
          │   │       /examples         │                              │
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
