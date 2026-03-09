![](./assets/pref.jpeg)
*Myself, presenting an early outline of SITP at [Toronto School of Foundation Modeling Season 1](https://tsfm.ca/schedule)*

# Preface

This book is aspirationally titled *The Structure and Interpretation of Tensor Programs*, (abbreviated as SITP)
as it's goal is to serve the same role for software 2.0 as
[*The Structure and Interpretation of Computer Programs*](https://mitp-content-server.mit.edu/books/content/sectbyfn/books_pres_0/6515/sicp.zip/full-text/book/book.html)
(abbreviated as SICP) did for software 1.0.
Written by Harold Abelson and Gerald Sussman with Julie Sussman, SICP has reached consensus amongst many to be integral to the programmer's classic canon,
providing an introductory whirlwind tour on the essence of computation through a logically unbroken yet informal sequence from programming, to
programming languages<span class="sidenote-number"></span><span class="sidenote">*SICP influenced other texts such as it's [dual](https://cs.brown.edu/~sk/Publications/Papers/Published/fffk-htdp-vs-sicp-journal/paper.pdf) [HtDP](https://htdp.org/) (introduced at Waterloo by [Prabhakar Ragde](https://cs.uwaterloo.ca/~plragde/flaneries/FICS/Introduction.html)) it's typed counterpart [OCEB](https://cs3110.github.io/textbook/cover.html), and the [recent](https://cs.brown.edu/~sk/Publications/Papers/Published/kf-data-centric/paper.pdf) addition of [DCIC](https://dcic-world.org/) spawning from it's phylogenetic cousin [PAPL](https://papl.cs.brown.edu/2020/).*</span>.
The primary reason why this format is loved by many (and to be fair, equally disliked by a few),
is because of the somewhat challenging learning curve for beginners, as it's not a book which teaches *syntax* such as "How to Learn X in Y Minute Handbook",
but rather the *semantics* of a programming with programming languages<span class="sidenote-number"></span><span class="sidenote">*The difficulty of teaching has always been semantics: [Matthias Felleisen's](https://felleisen.org/matthias/OnHtDP/what_is_ts.html) TeachScheme!, [Shriram Krishnamurthi's](https://cs.brown.edu/~sk/Publications/Papers/Published/sk-teach-pl-post-linnaean/) Standard Model of Programming Languages, [Will Crichton's](https://willcrichton.net/#sec-cognition) Profiling Programming Language Learning (something on SITP's roadmap).*</span>.

This book is open source and the book text/code are released under the MIT License unless otherwise noted.
Some chapters may include embedded third-party videos, images, tweets, or other media for educational reference. Such embedded content remains the property of its original creators and licensors and is **not** released under this book’s MIT License unless explicitly stated.
Embedded media is shown from its original source and is not claimed as original work of this project.
- https://d2l.ai/chapter_preface/index.html#one-medium-combining-code-math-and-html
- https://willcrichton.net/#sec-communication
- https://distill.pub/2021/distill-hiatus/

Before the success of large
language models<span class="sidenote-number"></span><span class="sidenote">*notably the supervised finetuning and reinforcement learning from human feedback on top of a pretrainted transformer*</span>
the pedagogical return on investment in an introductory book on artificial intelligence following the same form as SICP was low,
as readers would build their own pytorch from scratch just to classify MNIST or ImageNet.
However now that deep learning systems are becoming as important if not more than the
models themselves<span class="sidenote-number"></span><span class="sidenote">
*especially in the period of research in artificial intelligence dubbed the era of scaling, characterized by the heavy engineering of pouring internet-scale data into the weights of transformer neural networks with massively parallel and distributed compute.*</span>,
that return on investment is higher,
as the frontier of deep learning systems increasingly becomes ever more out of reach from the grasp of the
beginner<span class="sidenote-number"></span><span class="sidenote">*the massively parallel processors now have dedicated hardware units evaluating matrix instructions called tensor cores, which in turn have precipitated the need for fusion compilers. Even language-runtime codesign/cooptimization like profile-guided optimizations are repeating themselves with languages such as `torch.compile()` and runtimes like `vllm`/`sglang`.*</span>.
This is at least how *I* personally felt as a professional engineer transitioning to the world of domain specific tensor compilers,
coming from [domain specific cloud compilers](https://www.infoq.com/presentations/deploy-pipelines-coinbase/) and [distributed infrastructure provisioners](https://www.infoq.com/presentations/coinbase-terraform-earth/).

So in [part one](./1.md) of the book,
you will train your generalized linear models with `numpy`
and then start developing [`teenygrad`](https://github.com/j4orz/teenygrad) by implementing your own multidimensional array abstraction
to train those models once again.
Then, in [part two](./2.md) of the book, you will train deep neural networks with `pytorch` following the *age of research* and then update
the implementation of [`teenygrad`](https://github.com/j4orz/teenygrad) to support gpu-accelerated "eager mode" evaluation for neural network primitives for both forward and backward passes.
Finally, in [part three](./3.md)<span class="sidenote-number"></span><span class="sidenote">
*which if you are more experienced, you may benefit in jumping straight to, to better understand what something like `torch.compile()` is doing for you*</span> of the book,
you will update [`teenygrad`](https://github.com/j4orz/teenygrad) for the last time for the *age of scaling* by developing a "graph mode" compilation and inference engine with tinygrad's RISCy IR,
borrowing ideas from ThunderKitten's tile registers, MegaKernels, and Halide/TVM schedules. To continue deeping your knowledge, more resources are provided in the [afterword](./after.md).

If you empathize with some of my frustrations, you may benefit from the book too.</br>
If you are looking for reading groups checkout the `#teenygrad` channel in [![](https://dcbadge.limes.pink/api/server/gpumode?style=flat)](https://discord.com/channels/1189498204333543425/1373414141427191809)</br>
Good luck on your journey.</br>
Are you ready to begin?</br>