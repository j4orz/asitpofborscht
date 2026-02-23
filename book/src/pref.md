# Preface

As a compiler writer for domain specific cloud languages (Terraform HCL),
I became interested in compiler implementations for domain specific tensor languages
such as PyTorch 2 after the software 3.0 unlock of natural language programming from large language models such as ChatGPT.

However, I became frustrated with the *non-constructiveness* and *disjointedness* of
my learning experience in the discipline of machine learning systems,
as I preferred a style of pedagody similar to the introductory computer science canon created by Schemers
taught to first years at Waterloo, which consists of two books that secretly masquerade as one
— [SICP](https://mitp-content-server.mit.edu/books/content/sectbyfn/books_pres_0/6515/sicp.zip/index.html) and it's [dual](https://cs.brown.edu/~sk/Publications/Papers/Published/fffk-htdp-vs-sicp-journal/paper.pdf), [HTDP](https://htdp.org/), teach programming
and programming languages by taking readers through an unbroken logical sequence in a [flânnerie](https://cs.uwaterloo.ca/~plragde/flaneries/)-like style. The recent addition of [DCIC](https://dcic-world.org/), spawning from it's phylogenetic cousin [PAPL](https://papl.cs.brown.edu/2020/), was created to adjust the curriculum to the recent [shift in data science](https://cs.brown.edu/~sk/Publications/Papers/Published/kf-data-centric/paper.pdf) by focusing the *tabular/table* data structure.
Given the generality of the attention mechanism autoregressively predicing the next-token on internet data,
this book follows suit (*aspirationally* titled SITP),
and focuses on the stochastically continuous computational mathematics
and low level systems programming necessary for training deep neural networks.

If you are more experienced, you may benefit in jumping straight to part three of the book
which develops a "graph mode" fusion compiler and inference engine with tinygrad's RISCy IR,
borrowing ideas from ThunderKitten's tile registers, MegaKernels, and Halide/TVM schedules.
Beyond helping those like myself interested in the systems of deep learning,
developing the low level performance primitives of deep neural networks will shed light on the open research question of
how domain specific tensor languages of deep learning frameworks can best support the development and compilation of accelerated kernels for novel network architectures (inductive biases) beyond the attention mechanism of transformers.

If you empathize with some of my motivations, you may benefit from the book too[^0].</br>
Good luck on your journey.</br>
Are you ready to begin?</br>

---
[^0]: *And if not, I hope this book poses as a good counterexample for what you have in mind.*