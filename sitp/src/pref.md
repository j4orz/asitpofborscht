![](./assets/pref.jpeg)
*Myself, presenting an early outline of SITP at [Toronto School of Foundation Modeling Season 1](https://tsfm.ca/schedule)*

# Preface

## I Teach: The Structure and Interpretation of Tensor Programs

This book is aspirationally titled [*The Structure and Interpretation of Tensor Programs*](./front.md), (from here on in abbreviated as SITP)
as it's goal is to serve a similar role for software 2.0 as
[*The Structure and Interpretation of Computer Programs*](https://mitp-content-server.mit.edu/books/content/sectbyfn/books_pres_0/6515/sicp.zip/full-text/book/book.html)
(from here on in abbreviated as SICP) did for software 1.0.
Written by Harold Abelson and Gerald Sussman with Julie Sussman, SICP has reached consensus amongst many to be integral to the programmer canon,
providing a whirlwind tour on the essence of computation through a logically unbroken yet informal sequence, starting from programming, all the way to programming languages.
<!-- themselves<span class="sidenote-number"></span><span class="sidenote">*this curriculum went on to influence other texts such as it's [dual](https://cs.brown.edu/~sk/Publications/Papers/Published/fffk-htdp-vs-sicp-journal/paper.pdf) [HtDP](https://htdp.org/) (introduced at Waterloo by [Prabhakar Ragde](https://cs.uwaterloo.ca/~plragde/flaneries/FICS/Introduction.html)) it's typed counterpart [OCEB](https://cs3110.github.io/textbook/cover.html), and the [recent](https://cs.brown.edu/~sk/Publications/Papers/Published/kf-data-centric/paper.pdf) addition of [DCIC](https://dcic-world.org/) spawning from it's phylogenetic cousin [PAPL](https://papl.cs.brown.edu/2020/).*</span>. -->
<!-- 
In this wonderful whimsical whirwild tour called *[The Structure and Interpretation of Tensor Programs]()*,
we will explore both the *continuous objects* and *stochastic descriptions*
which are used to program deep neural networks and deep learning frameworks such as ChatGPT and PyTorch respectively.
Over the course of three booklets we will build from scratch our own chat assistant following **[karpathy/nanogpt]()**  and our own deep learning framework following **[j4orz/teenygrad]()**.

Because of this, from the beginning this book assumes basic competence with the art of computer programming.
That is, you must absolutely be very comfortable with the *principled and systematic design* of elementary programs using
languages features such as numbers, strings, variables, conditionals, loops, functions, lists, and sets covered in a CS1 course.
In addition, being familiar with the foundational data structures including maps, trees, and graphs will help, especially throughout the implementation of [teenygrad](). -->

<!-- (todo, conversational style)
> Unlike some other textbooks, this one does not follow a top-down narrative. Rather it has the flow of a conversation, with backtracking. We will often build up programs incrementally, just as a pair of programmers would. We will include mistakes, not because we don’t know better, but because this is the best way for you to learn. Including mistakes makes it impossible for you to read passively: you must instead engage with the material, because you can never be sure of the veracity of what you’re reading.

> At the end, you’ll always get to the right answer. However, this non-linear path is more frustrating in the short term (you will often be tempted to say, “Just tell me the answer, already!”), and it makes the book a poor reference guide (you can’t open up to a random page and be sure what it says is correct). However, that feeling of frustration is the sensation of learning. We don’t know of a way around it.

(todo: DCIC is where data science ends and computer science begins)
(SITP is where computer science ends, and data science begins)

(todo: SITP is really SICP + PH/CS:APP because of the newfound importance of systems in deep learning)

(todo: canon. stepanov canon. compiler) -->
<!-- A compiler gathers material from earlier sources and arranges it into a new work. They may not create totally original ideas, but they do produce a new structure or synthesis. A medieval chronicler who assembled earlier records into one history could be called a compiler. -->

Programmers who love to diving deeper into the souls of their machine went on to develop industrial languages and
runtimes<span class="sidenote-number"></span><span class="sidenote">*"There is only one project, architecture, operating system and languages, compiler, it's only one project. It's all together." -- Boris Babayan*</span>.
For myself, that looked like working on [domain specific cloud compilers](https://www.infoq.com/presentations/deploy-pipelines-coinbase/)
as well as [cloud provisioners and garbage collectors](https://www.infoq.com/presentations/coinbase-terraform-earth/).
After the invention and discovery of ChatGPT, I set out to transition from domain specific cloud compilers to domain specific tensor compilers, which began in earnest in 2025 with a
[tweet](https://x.com/j4orz/status/1907452857248350421/) showcasing a deep learning framework written from scratch to run the nets from Karpathy's [Neural Networks: Zero to Hero](https://karpathy.ai/zero-to-hero.html) series. This work turned out in retrospect to be the seeds of SITP's core with [Part II. Neural Networks]()
which covers the 2012-2020 "era of research" consisting of two chapters:
- [Chapter 4. Learning *Sequences* from Data with Deep Neural Networks](./2.md#4-learning-sequences-from-data-with-deep-neural-networks-in-torch)
- [Chapter 5. Accelerating *Sequence Models* on `GPU`](./2.md#5-accelerating-sequence-models-on-gpu-in-teenygrad-with-cuda-rust)

<!-- <span class="sidenote-number"></span><span class="sidenote">*Following [Hwu et al. (2010)](), but also following and compiling many performance oriented web blogs and articles such as [He (2022)](https://horace.io/brrr_intro.html) [Boehm (2022)](https://siboehm.com/articles/22/CUDA-MMM), [Spector et al. (2024)](https://hazyresearch.stanford.edu/blog/2024-05-12-tk), [Armbruster (2024)](https://alexarmbr.github.io/2024/08/10/How-To-Write-A-Fast-Matrix-Multiplication-From-Scratch-With-Tensor-Cores.html#roofline-charts), [Patterson 2024](https://www.spatters.ca/mma-matmul), [Shankhdhar (2024)](https://cudaforfun.substack.com/p/outperforming-cublas-on-h100-a-worklog), [Gordić (2024)](https://www.aleksagordic.com/blog/matmul), [Salykov (2025)](https://salykova.github.io/gemm-gpu), [Li (2025)](https://lubits.ch/flash/), [Tran (2025)](https://gau-nernst.github.io/fa-5090/), and [Vega-Myhre (2026)](https://danielvegamyhre.github.io/2026/03/29/mxfp8-gemm.html)*</span> -->

While it was illuminating to implement each individual torch call that the nets from `makemore` were making, my knowledge felt
fragmented<span class="sidenote-number"></span><span class="sidenote">*More coloquially, the knowledge of a neural network script kiddie.*</span> with respect to the foundations and frontiers.
It was at this point in time that my aspirations grew to write a book which replicated the *form* of SICP but with the *substance* of deep learning and deep learning systems.
That is, to prepend a [Part I. Elements of Networks](./1.md) and append a [Part III. Scaling Networks]() which covers preliminary machine learning, as well as deep learning languages and runtimes respectively.
But arguably most important of all, to understand and teach the
**semantics of software 2.0 to programmers of software 1.0**.
Because although SITP as a book develops the `teenygrad` framework with a myriad of languages with `Python`, `Rust`, `CUDA Rust`, and `cuTile Rust`,
tomorrow for all we know everything can be rewritten in Julia or Mojo. I wanted to write a deep learning book for myself and others which prioritized semantics.

So in [Part I. Elements of Networks](./1.md), readers learn the prelimaniries for "pre-historic" machine learning:
<!-- <span class="sidenote-number"></span><span class="sidenote">*The exposition in Part I heavily relies on existing canon such as [Strang (1993)](), [Axler (1995)]() for preliminary linear algebra, [Hastie, Tibshirani, Friedman (2001)]() for machine learning, [Trefethen and Bau (1997)](), and finally [Demmel (1997)](), [Bryant, O’hallaron (2011)]() for high performance numerical linear algebra  but it adds a few stylistic elements.</br></br>Namely that of infusing guiding motivation more relevant to the current regime of autoregressive sequence models inspired by [Jurafsky (2026)](), and frontloading the unsupervised learning of lower dimensional subspaces with principal component analysis inspired by [Kang and Cho (2024)]() before fitting any linear or logistic regression model.*</span>: -->
- [Chapter 1. Representing *Data* with High Dimensional Stochasticity](./1.md#1-representing-data-with-high-dimensional-stochasticity-in-torch)
- [Chapter 2. Learning *Functions* from *Data* with Parameter Estimation](./1.md#2-learning-functions-from-data-with-optimization-in-torch)
- [Chapter 3. Accelerating *Functions* and *Data* on `CPU`](./1.md#3-accelerating-functions-and-data-with-basic-linear-algebra-subroutines-in-teenygrad)

And in [Part III. Scaling Networks](./3.md), readers learn about the 2020-2025 era of scaling:
- [Chapter 6. Large Language Models]()
- [Chapter 7. Reasoning Models]()
- [Chapter 8. Fusion Compilers]()
- [Chapter 9. Inference Engines ]()

However, once I had enough curriculum "clay" laid out my aspirations grew secondfold to make SITP the highest quality education that I was capable of producing.
This is when my attitude transitioned from an n=1 with "I am teaching" to an n=many with "they are learning".
That is, I started treating curriculum design as an engineering problem, when the book transitioned from an opinion-driven book to a research-driven one.

## They Learn: The Structure and Interpretation of the Data Science Curriculum


                  programs = algorithms + data structures
                  programs = data science +(temporal, not commutative) data structures. first data science, then data structures.
                                                                                    where data science ends, computer science begins
                                                                                    the problem: parallel tracks of data science + computer science
                                                                                    at brown, we want a unified DS+CS1. THEN students can branch
                                                                                    reformulate CS1 to DS+CS1

                                                        hash tables
                                                        state
                                                        trees
                                                        lists
                                        ----------------tables----------------
                                                        images
                                                        probabilities
                                                        vectors
                                                        matrices
                                                        tensors
                                                        neural networks
                meets bootstrap/dcic at the TABLE/tabular/csv data (probability is ARRAY oriennted programming)
                                            1. rich structure (paper ^^) 2. already parsed (no need to introduce probability theory: reducing one problem to a harder problem)
                SITP takes the TABLE, and starts with probability/stats, linear algebra, and optimization
                SITP is a unified DS+CS2

CS1 (blank screen. design recipe)
- sicp
  - syntax -> semantics
- htdp drives not by syntax, by increasing complexity of datas
  - matthias https://www.youtube.com/watch?v=JwgGPGbw1d0
  - https://www.youtube.com/watch?v=9REURTUJR_I&t=2680s
  - https://www.youtube.com/watch?v=ODOI-qbvkwE&t=3218s
- dcic (shriram) https://www.youtube.com/watch?v=HwPM0xMdiNU
  - data science + data structures
  - "computer science starts where data science ends"
  - shriram drives by motivation (tables)
  - limitations of tables
  - https://www.youtube.com/watch?v=5c0BvOlR5gs
- bootstrap
  - emmanuel schanzer https://www.youtube.com/watch?v=turBxnXqIls
      1985: SICP https://www.youtube.com/playlist?list=PLE18841CABEA24090
      1995: HtDP (principled design using untyped languages)
      https://www.youtube.com/watch?v=B1yZGVc42kE&list=PLEoM_i-3sen_Gc-AAiK3N1HZPW9tlg7zj&index=1&t=1396s

      2021/2022: Bootstrap/DCIC: https://cs.brown.edu/people/sk/Publications/Papers/Published/spddplfk-integ-ds-desn-assm-curric/paper.pdf
                                https://cs.brown.edu/people/sk/Publications/Papers/Published/kf-data-centric/paper.pdf
                
      2027: SITP (CS2 HtDC/CS3 1-5kloc "pattern and systems")
                (CS4          10k-20kloc student-chosen language) TCP,JSON,GUI
                                          -> dumping IR text so they can hack their own tensor compilers?
                                          -> runs everyone tests against everyone's implementations
                                          -> (write milestones, and fail)
                                          -> (present design to panel and accept criticism)
                                          -> (server on panel and critique code)
                                          -> like cs6120


CS2
rust brown book (will) https://www.youtube.com/watch?v=R0dP-QR5wQo

CS3/CS4: (patterns/system development.) (10-20k loc), student chosen language

For those interested in other books about deep learning systems, you can check out the excellent courses
of [minitorch](https://minitorch.github.io/) developed by Sasha Rush at Cornell and [needl](https://dlsyscourse.org/) developed by Tianqi Chen at Carnegie Mellon.

With that said, if you empathize with some of my frustrations, you may benefit from the book too.</br>
If you are looking for reading groups checkout the `#teenygrad` channel in [![](https://dcbadge.limes.pink/api/server/gpumode?style=flat)](https://discord.com/channels/1189498204333543425/1373414141427191809)</br>
Good luck on your journey.</br>
Are you ready to begin?</br>

## Acknowledgements
*Errata*
- [Jashanpreet Singh](https://github.com/Jashanpreet2)