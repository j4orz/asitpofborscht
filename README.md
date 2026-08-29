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
in sync when you change either. Beyond the Rust and Lean toolchains below, you need `python3` on
PATH: the `nb`, `refine`, and `lean` preprocessors are Python scripts under `sitp/preprocessors/`
(standard library only, so there is nothing to `pip install`).

```sh
# asitpofborscht vendors aquascope, an mdbook preprocessor from the Cognitive Engineering Lab
# (see https://willcrichton.net/#cgk:ownership-conceptual-model) which conceptually visualizes Rust ownership.
# Specifically, it vendors aquascope as git submodule in order to pin SITP's mdbook rust toolchain to aquascope's
# (currently `nightly-2026-05-01`) via symlink asitpofborscht/sitp/rust-toolchain.toml -> asitpofborscht/vendor/aquascope/rust-toolchain.toml

git clone --recurse-submodules https://github.com/j4orz/asitpofborscht.git
cd asitpofborscht
git submodule update --init sitp/vendor/aquascope # (if you cloned without --recurse-submodules)

TOOLCHAIN=$(grep -m1 '^channel' sitp/rust-toolchain.toml | cut -d\" -f2)
(cd sitp && rustup toolchain install) # installs the toolchain pinned by rust-toolchain.toml

# the toolchain install above ran under sitp/'s override, which does not set a
# rustup default, so every cargo call below names its toolchain explicitly
rustup toolchain install --no-self-update stable
cargo +stable install mdbook --version 0.5.2 --locked
cargo +stable install mdbook-katex --git https://github.com/lzanini/mdbook-katex
cargo +stable install mdbook-aquascope --locked
cargo +stable install mdbook-quiz --locked
# only aquascope_front needs the rustc-dev nightly
cargo "+$TOOLCHAIN" install aquascope_front --git https://github.com/cognitive-engineering-lab/aquascope --tag v0.4.0

# Lean, for the {{#lean}} examples in src/ap.md. Without `lake` on PATH the
# lean preprocessor warns and no-ops, so the appendix renders with its
# directives unsubstituted rather than failing the build.
curl -sSf https://raw.githubusercontent.com/leanprover/elan/master/elan-init.sh | sh -s -- -y --default-toolchain none
export PATH="$HOME/.elan/bin:$PATH"

git config core.hooksPath .githooks # retheme matplotlib figures on commit

cd sitp && mdbook serve # make your edits to markdown
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