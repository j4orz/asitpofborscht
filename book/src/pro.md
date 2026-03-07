![](./assets/babel.jpg)
<small>*Tower of Babel, Genesis 11:1–9*</small></br>

# Prologue

In some sense, the 21st century truly began only after the first 20 years past the second millenium,
for it was not until the creation of ChatGPT where humanity traded in their so-called bicycles of mind for motorcycle upgrades.
From 2020 to 2025, programmers (just like you) discovered [The Scaling Laws](https://gwern.net/scaling-hypothesis),
where pouring internet-scale data into the weights of transformer neural networks with massively parallel and distributed compute
produces large language models which in turn enable communication between biological humans and artificial machines through the means of natural language.
This has always been a long standing dream<span class="sidenote-number"></span><span class="sidenote">*argubally started with Descartes denial of [dualism](https://plato.stanford.edu/entries/dualism/), extended by La Mettrie's [Man A Machine](https://en.wikipedia.org/wiki/Man_a_Machine), initiated by Leibniz's [Universal Calculus](https://en.wikipedia.org/wiki/Characteristica_universalis), and applied computationally with Wittgenstein's [Tractatus Logico-Philosophicus](https://plato.stanford.edu/entries/wittgenstein/#EarlWitt) and [Philosophical Investigations](https://plato.stanford.edu/entries/wittgenstein/#LateWitt).*</span> in the science of the mind we call artificial intelligence.

The story of artificial intelligence is tightly interconnected with computation,
given that the field as we know it today started in earnest during the 20th century
at the 1956 Dartmouth Summer Research Project on Artificial Intelligence.
There, a group of resesearchers interested in the science of the mind
went on to establish the field of "artificial intelligence" a rebranding of the science of
mind<span class="sidenote-number"></span><span class="sidenote">*tainted by the [hermaneuticism](https://plato.stanford.edu/entries/hermeneutics/) of psychoanalysis*</span>
with computational methods<span class="sidenote-number"></span><span class="sidenote">*effectively operationalizing the notion of [computationalism](https://plato.stanford.edu/entries/computational-mind/)*</span>
rather than the correlative methods of neuroscience and the observational methods of psychology's behaviorism.
Their reasoning, (roughly and reductively) consists of the following:
> Since [Gödel's Incompleteness Theorems](https://plato.stanford.edu/entries/goedel-incompleteness/) state that there exist propositions unprovable, and the [Church-Turing Thesis](https://plato.stanford.edu/entries/church-turing/)<span class="sidenote-number"></span><span class="sidenote">*which SITP's spiritual predecessor [SICP smuggles in through a footnote](https://mitp-content-server.mit.edu/books/content/sectbyfn/books_pres_0/6515/sicp.zip/full-text/book/book-Z-H-26.html#footnote_Temp_553) in chapter 4.1 The Metacircular Evaluator*</span> states that all representable languages implementable with computation have the same expressivity, if we ever wanted to physically realize non-biological artificial intelligence, the constructive stateful mathematics on Turing Machines implemented with von Neumann Architectures via electricity and semiconductors are the correct substrate to conduct and construct the science of the mind, as opposed to classical stateless mathematics.

Although united by the idea of using computation to mechanize the mind and thus serve as the basis of artificial intelligence,
they were divided between which exact computational techniques and to employ.
The two prominent ones<span class="sidenote-number"></span><span class="sidenote">*others include embodimentalists, dynamicalists, and self-organizers*</span>
being the *symbolists* and the *connectionists* which in some sense are the primordial *"software 1.0"* and *"software 2.0"* we now know today,
and in fact date back to *Aristotle* and *Laplace*, in which Baye's Theorem generalizes Aristotelian Logic as a corner case
with the probability of some belief given evidence is 1.

<!-- (embed eliza) <iframe loading="lazy" src="https://www.masswerk.at/elizabot/"></iframe>
(reword the way in which the field played out. it's because people valued theoretical arguments over empirical experiments.) -->

With the way in which the field played out,
the logical approach with symbolic techniques to artificial intelligence started out as the favorite school of thought<span class="sidenote-number"></span><span class="sidenote">*thus known as "classical" AI or "good-old-fashioned" AI*</span>
as opposed to the probabilistic approach largely due to the 1969 book Perceptrons by Marvin Minsky and Seymour Papert.
The logical approach used logical tools from logicians<span class="sidenote-number"></span><span class="sidenote">*like Frege, Tarski, Brouwer, Gentzen, Curry-Howard, Martin Löf, Girard, and so on*</span> to create expert systems such as [ELIZA](https://www.masswerk.at/elizabot/).
Overtime however, and largely due to the continually increasing capability of hardware, the probabilistic approach with machine learning techniques
started to see some more success.

Ironically enough, although these people were united in the idea of using probabilistic learning 
methods<span class="sidenote-number"></span><span class="sidenote">*following the same principle of modeling phenomena with mathematical models where the system minimizes free energy which experienced large success in the 19th century when physicists such as Helmholtz, Gibbs, and Boltzmann modeled energy, enthalpy, and entropy*</span>,
they themselves were divided between which exact models $y=f_{\theta}(\mathbf{x})$ to employ.
The three prominent ones being *gaussian processes*, *kernel machines*, and *neural networks*.
Theoretically, (kernel machines todo), but practically neural networks when made *deep*
are able to learn representations...the true watershed moment
was during 2012 when a neural network named [AlexNet](https://proceedings.neurips.cc/paper_files/paper/2012/file/c399862d3b9d6b76c8436e924a68c45b-Paper.pdf) trained on
a parallel graphics processor was released, scoring a loss on the [ImageNet](https://www.image-net.org/) dataset 10.8% better than the next runner-up.

The 2012-2019 period in deep learning is now becoming known as *the era of research*,
as diverse and various inductive biases were explored through the means of network architectures,
resulting in different neural networks such as feedforward neural networks,
convolutional neural networks, recurrent neural networks, long-short-term-memory neural networks, and so on,
up until the scaling the attention mechanism and feedforward nets inside the transformer archicture started gaining dominance
in the 2020-2025 period, now known as the *the era of scaling*, which brings us back to the present day.