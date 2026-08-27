![](https://sitp.ai/assets/flammarion_borscht.png)

# a sitpofborscht

If you want to read the book in order to develop `nanochat` and `borscht` from scratch, head on over to https://sitp.ai/ on your preferred reading device. It looks great on all displays! Additionally, if you try out the `borscht` autograd in order to run training and inference for neural nets,
install `borscht` with your preferred package manager:

```sh
uv add borscht
```

If you are looking to *contribute* or *modify* the SITP book or `borscht` teaching language, continue reading the quick start instructions found below.

## Quick Start: `borscht` Teaching Language

```sh
cd borscht
maturin develop
python (todo)
import borscht
device=gpu (todo)
```

## Quick Start: SITP Book

If you want to *modify* the SITP book, follow the installation instructions below:

The book is built with [mdbook](https://rust-lang.github.io/mdBook/), the Rust ecosystem's standard static site generator for markdown. The steps below install the whole set, and mirror the Netlify
build in `netlify.toml` — that file is the source of truth for what production uses, so keep the two
in sync when you change either.

```sh
# asitpofborscht vendors aquascope, an mdbook preprocessor from the Cognitive Engineering Lab
# (see https://willcrichton.net/#cgk:ownership-conceptual-model) which conceptually visualizes Rust ownership.
# Specifically, it vendors aquascope as git submodule in order to pin SITP's mdbook rust toolchain to aquascope's
# (currently `nightly-2026-05-01`) via symlink asitpofborscht/sitp/rust-toolchain.toml -> asitpofborscht/vendor/aquascope/rust-toolchain.toml

git clone --recurse-submodules https://github.com/j4orz/asitpofborscht.git # git submodule
git submodule update --init sitp/vendor/aquascope # (or use this if you've already cloned)

cd asitpofborscht
cd sitp/ && rustup toolchain install # installs the toolchain pinned by rust-toolchain.toml

cargo install mdbook --version 0.5.2 --locked
cargo install mdbook-katex --git https://github.com/lzanini/mdbook-katex
cargo install mdbook-aquascope --locked
cargo install mdbook-quiz --locked
cargo install aquascope_front --git https://github.com/cognitive-engineering-lab/aquascope

mdbook serve # make your edits to markdown
             # preview with http://localhost:3000/
             # and cut a PR
```

Expect the first build to be slow: aquascope runs every annotated Rust block through Miri, and Lean
elaborates every `{{#lean}}` example. Both cache afterwards, aquascope in `sitp/.aquascope-cache`.

## License

Following [GPU MODE](https://x.com/marksaroufim/status/2064442386374369597),
this project is licensed under the June 9 Researcher Reciprocity License.

The license adapts the Open RAIL-S structure and adds one specific use restriction: training, fine-tuning, distillation, synthetic-data generation for training, embedding for training, or otherwise using this project to improve an AI model or AI service requires Researcher Reciprocity.

If you train on it, you let us generate.

Covered AI model and service providers may not use this project while imposing terms that prevent SITP and borscht project contributors, or authorized researchers from generating outputs, evaluating models, benchmarking, publishing research, or exploring their own research ideas on materially equal terms to ordinary users.