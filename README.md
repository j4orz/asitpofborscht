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

## Installing the `borscht` Teaching Language

## Installing the SITP book

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