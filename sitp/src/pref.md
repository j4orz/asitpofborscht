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