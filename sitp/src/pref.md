![](./assets/pref.jpeg)
<small>*Presenting an early outline of SITP at [Toronto School of Foundation Modeling Season 1](https://tsfm.ca/schedule) (November 2025)*</small>

# Preface

## The Structure and Interpretation of Tensor Programs

This book is aspirationally titled [*The Structure and Interpretation of Tensor Programs*](./front.md), (henceforth SITP)
as it's goal is to serve a similar role for software 2.0 as
[*The Structure and Interpretation of Computer Programs*](https://mitp-content-server.mit.edu/books/content/sectbyfn/books_pres_0/6515/sicp.zip/full-text/book/book.html)
(henceforth SICP) did for software 1.0.
Written by Harold Abelson and Gerald Sussman with Julie Sussman, SICP took learners on a whimsical whirlwind tour throughout the essence of computation
starting with the elements of programs with functional programming, higher order functions, data abstraction, streams,
and ending with programming their own programming languages with interpreters, compilers, and register machines.

My alma matter was amongst those which took the SICP approach, and as intended,
for someone coming into first year college with high school computer science, it blew my mind.
After graduating college in 2022, I followed my curiosity for diving deeper into the souls of our machine by going on to developing industrial languages and
runtimes.<span class="sidenote-number"></span><span class="sidenote">*"There is only one project, architecture, operating system and languages, compiler, it's only one project. It's all together." -- Boris Babayan*</span>.
Particularly, I hacked on languages with [domain specific cloud compilers](https://www.infoq.com/presentations/deploy-pipelines-coinbase/)
and runtimes with [cloud provisioners, and cloud garbage collectors](https://www.infoq.com/presentations/coinbase-terraform-earth/).
At the end of 2022 though, when ChatGPT was released by OpenAI my mind was blown twice more.
As someone programming since high school, I could not believe this at all.
After two more years of hacking on cloud languages and runtimes, I started my transition from
domain specific cloud compilers from GPS to Terraform to to domain specific tensor compilers from PyTorch to Triton.

<div class="sidenote sidenote-float" data-n="2"><blockquote class="twitter-tweet" data-width="300"><p lang="en" dir="ltr">1.5k lines of rust and 100 commits later, we can now inference the FFN neural language model from (Bengio et al. 2003) straight from Karpathy&#39;s Zero to Hero. all you have to do is replace the single &quot;import torch&quot; line with &quot;import picograd&quot; 😎 <a href="https://t.co/8paCERz3ry">https://t.co/8paCERz3ry</a> <a href="https://t.co/iVKOCsg0zC">pic.twitter.com/iVKOCsg0zC</a></p>&mdash; Jeffrey Zhang (@j4orz) <a href="https://twitter.com/j4orz/status/1907452857248350421?ref_src=twsrc%5Etfw">April 2, 2025</a></blockquote></div>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

The transition started with a tweet<span class="sidenote-ref" data-n="2"></span> showcasing the beginnings of a tensor library evaluating the forward pass of a feed forward network
from Andrej Karpathy's [Neural Networks: Zero to Hero](https://karpathy.ai/zero-to-hero.html) course.
While it was illuminating to start implementing each individual torch call that the nets from `makemore` were making,
my knowledge felt quite fragmented as I forgot a lot of the foundational mathematics I saw in a single semester,
and I wasn't sure how to bridge myself to industrial deep learning systems like `tinygrad`, `torch`, `jax`, `vllm`, and `sglang`.
Coloquially speaking, I was a neural network script kiddie.

Shortly after, I decided to take the plunge and started drinking from the firehose all the mathematical foundation I've since forgotten.
While revisting preliminary foundation like [Strang (1988)](), [Nocedal, Wright (1999)](), [Boyd, Lieven, Vandenberghe (2004)]() and
reading deep learning cannon like [Russel, Norvig 1995](), [Sutton, Barto (1992)](), [Hastie Tibshirani (2001)](), [Goodfellow, Bengio, Courtville (2016)](), [Murphy (2022)](),
the one thought I could not get out of my head was *where is the SICP for software 2.0*?
While I found two excellent resources on building your own torch-like autograd by Tianqi Chen at Carnegie Mellon and Sasha Rush at Cornell,
I personally would have enjoyed a unified resource that took me from math, to deep learning, to deep learning systems in a single unbroken sequence of thought,
and perhaps others would feel similarly. That is the genesis story for this book, whose central research question is the following: **What does the SICP for Deep Learning look like**?<span class="sidenote-ref" data-n="3"></span>

<div class="defnote defnote-float" data-n="3"><blockquote class="twitter-tweet" data-conversation="none" data-width="300"><p lang="en" dir="ltr">We really could use a SICP for DL. We have the Little Lisper for DL (<a href="https://t.co/su31hFJeUe">https://t.co/su31hFJeUe</a>) but that&#39;s a different type of book entirely.</p>&mdash; Shriram Krishnamurthi (primary: Bluesky) (@ShriramKMurthi) <a href="https://twitter.com/ShriramKMurthi/status/2051049923617968353?ref_src=twsrc%5Etfw">May 3, 2026</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script></div>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

## The Structure and Interpretation of the AI Curriculum



<!-- I recalled stumbling along a post by Greg Brockman
on how he [became a machine learning practitioner]() -->
<!-- After the invention and discovery of ChatGPT, I set out to transition from domain specific cloud compilers to domain specific tensor compilers, which began in earnest in 2025 with a
[tweet](https://x.com/j4orz/status/1907452857248350421/) showcasing a deep learning framework written from scratch to run the nets from Karpathy's [Neural Networks: Zero to Hero](https://karpathy.ai/zero-to-hero.html) series. This work turned out in retrospect to be the seeds of SITP's core with [Part II. Neural Networks]()
which covers the 2012-2020 "era of research" consisting of two chapters:
- [Chapter 4. Learning *Sequences* from Data with Deep Neural Networks](./2.md#4-learning-sequences-from-data-with-deep-neural-networks-in-torch)
- [Chapter 5. Accelerating *Sequence Models* on `GPU`](./2.md#5-accelerating-sequence-models-on-gpu-in-teenygrad-with-cuda-rust) -->

<iframe width="698" height="393" loading="lazy" src="https://www.youtube.com/embed/5c0BvOlR5gs?si=2FGMK6TjZRiKlSdF" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

goal: teach software 1.0 programmers software 2.0 with software 3.0
<span class="sidenote-number"></span>

<div class="sidenote sidenote-float" data-n="2">

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">An interesting data point is that Codex 5.5 cannot be trusted to design good data structures purely from behavioral prompting. (I&#39;m sure it can come up with good ideas if you prompt it, but not if it&#39;s incidental.)</p>&mdash; difficultyang (@difficultyang) <a href="https://twitter.com/difficultyang/status/2055390560660152595?ref_src=twsrc%5Etfw">May 15, 2026</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet" data-conversation="none"><p lang="en" dir="ltr">This post was prompted by Codex coming up with a terrible internal data representation for an autograd tape with some special checkpointing behavior</p>&mdash; difficultyang (@difficultyang) <a href="https://twitter.com/difficultyang/status/2055391951600468360?ref_src=twsrc%5Etfw">May 15, 2026</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Developing GPT is also highly non-trivial, but being able to develop PyTorch requires knowledge of a lot of math and science: calculus, linear algebra, statistics, optimization theory, neural network architecture, electrical engineering, software design, hardware programming,…</p>&mdash; Sebastian Raschka (@rasbt) <a href="https://twitter.com/rasbt/status/1989807985045246391?ref_src=twsrc%5Etfw">November 15, 2025</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

</div>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>




constraints
- sicp style
- runs nanochat
- consolidates gpu mode lectures
- compiles a subset of tinygrad IR

methods
- curriculum
- pedagogy
- language

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

<!-- <span class="sidenote-number"></span><span class="sidenote">*Following [Hwu et al. (2010)](), but also following and compiling many performance oriented web blogs and articles such as [He (2022)](https://horace.io/brrr_intro.html) [Boehm (2022)](https://siboehm.com/articles/22/CUDA-MMM), [Spector et al. (2024)](https://hazyresearch.stanford.edu/blog/2024-05-12-tk), [Armbruster (2024)](https://alexarmbr.github.io/2024/08/10/How-To-Write-A-Fast-Matrix-Multiplication-From-Scratch-With-Tensor-Cores.html#roofline-charts), [Patterson 2024](https://www.spatters.ca/mma-matmul), [Shankhdhar (2024)](https://cudaforfun.substack.com/p/outperforming-cublas-on-h100-a-worklog), [Gordić (2024)](https://www.aleksagordic.com/blog/matmul), [Salykov (2025)](https://salykova.github.io/gemm-gpu), [Li (2025)](https://lubits.ch/flash/), [Tran (2025)](https://gau-nernst.github.io/fa-5090/), and [Vega-Myhre (2026)](https://danielvegamyhre.github.io/2026/03/29/mxfp8-gemm.html)*</span> -->

<!-- While it was illuminating to implement each individual torch call that the nets from `makemore` were making, my knowledge felt
fragmented<span class="sidenote-number"></span><span class="sidenote">*More coloquially, the knowledge of a neural network script kiddie.*</span> with respect to the foundations and frontiers.
It was at this point in time that my aspirations grew to write a book which replicated the *form* of SICP but with the *substance* of deep learning and deep learning systems.
That is, to prepend a [Part I. Elements of Networks](./1.md) and append a [Part III. Scaling Networks]() which covers preliminary machine learning, as well as deep learning languages and runtimes respectively.
But arguably most important of all, to understand and teach the
**semantics of software 2.0 to programmers of software 1.0**.
Because although SITP as a book develops the `teenygrad` framework with a myriad of languages with `Python`, `Rust`, `CUDA Rust`, and `cuTile Rust`,
tomorrow for all we know everything can be rewritten in Julia or Mojo. I wanted to write a deep learning book for myself and others which prioritized semantics. -->

This work turned out in retrospect to be the seeds of SITP's core with [Part II. Neural Networks]()
which covers the 2012-2020 "era of research" consisting of two chapters:
- [Chapter 4. Learning *Sequences* from Data with Deep Neural Networks](./2.md#4-learning-sequences-from-data-with-deep-neural-networks-in-torch)
- [Chapter 5. Accelerating *Sequence Models* on `GPU`](./2.md#5-accelerating-sequence-models-on-gpu-in-teenygrad-with-cuda-rust) -->

So in [Part I. Elements of Networks](./1.md), readers learn the prelimaniries for "pre-historic" machine learning:
<!-- <span class="sidenote-number"></span><span class="sidenote">*The exposition in Part I heavily relies on existing canon such as [Strang (1993)](), [Axler (1995)]() for preliminary linear algebra, [Hastie, Tibshirani, Friedman (2001)]() for machine learning, [Trefethen and Bau (1997)](), and finally [Demmel (1997)](), [Bryant, O’hallaron (2011)]() for high performance numerical linear algebra  but it adds a few stylistic elements.<br><br>Namely that of infusing guiding motivation more relevant to the current regime of autoregressive sequence models inspired by [Jurafsky (2026)](), and frontloading the unsupervised learning of lower dimensional subspaces with principal component analysis inspired by [Kang and Cho (2024)]() before fitting any linear or logistic regression model.*</span>: -->
- [Chapter 1. Representing *Data* with High Dimensional Stochasticity](./1.md#1-representing-data-with-high-dimensional-stochasticity-in-torch)
- [Chapter 2. Learning *Functions* from *Data* with Parameter Estimation](./1.md#2-learning-functions-from-data-with-optimization-in-torch)
- [Chapter 3. Accelerating *Functions* and *Data* on `CPU`](./1.md#3-accelerating-functions-and-data-with-basic-linear-algebra-subroutines-in-teenygrad)

And in [Part III. Scaling Networks](./3.md), readers learn about the 2020-2025 era of scaling:
- [Chapter 6. Large Language Models]()
- [Chapter 7. Reasoning Models]()
- [Chapter 8. Fusion Compilers]()
- [Chapter 9. Inference Engines ]()

<!-- However, once I had enough curriculum "clay" laid out my aspirations grew secondfold to make SITP the highest quality education that I was capable of producing.
This is when my attitude transitioned from an n=1 with "I am teaching" to an n=many with "they are learning".
That is, I started treating curriculum design as an engineering problem, when the book transitioned from an opinion-driven book to a research-driven one.

## They Learn: The Structure and Interpretation of the Data Science Curriculum -->


## Acknowledgements
Thank you to Lambda Labs for the [Lambda Labs Research Grant](https://lambda.ai/research).
Thank you to a [Cloud-V 10X Engineers](https://cloud-v.co/) and [(RISC-V Labs)](https://riscv.org/developers/labs/).