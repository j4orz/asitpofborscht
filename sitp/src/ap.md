# Appendix


## Table of Contents
<!-- 1. eigen value/singular value -->
<!-- 2. linear systems, least squares? -->
<!-- 3. BLAS -->

<div class="toc">

- [A. From Greece, to Göttingen, and finally the Valley](#a-from-greece-to-göttingen-and-finally-the-valley)
- [B. From Symbolic Software 1.0 to Stochastic Software 2.0](#b-from-symbolic-software-10-to-stochastic-software-20)
- [C. From Sequential to Parallel Processors](#c-from-sequential-to-parallel-processors)
  - [C.1 From Psychology to Artificial Intelligence](#01-from-psychology-to-artificial-intelligence)
  - [C.2 Weizenbaum's Turing Test Cheater](#02-weizenbaum-cheats-turings-test-with-the-pattern-matching-of-eliza) <!-- with the Pattern Matching of `ELIZA` -->
  - [C.3 Wood's Winograd Challenge](#03-woods-winograd-challenge-with-the-translation-of-lunar) <!-- with the Translation of `LUNAR` -->
  <!-- - [C.4 Feigenbaum's Narrow Expertise with the Heuristics of `DENDRAL`](#04-feigenbaums-narrow-expertise-with-the-heuristics-of-dendral) -->
  - [C.4 Lenat's Advice Taker](#04-lenats-advice-taker-with-the-frames-of-cyc) <!-- with the Frames of `CYC` -->
  - [C.5 From the Tractatus to Investigations]() <!-- logical to distributional semantics -->
  - [C.6 Summary](#06-summary)
  - [C.7 Bibliographic Notes](#07-bibiliographic-notes)
  - [C.8 Problems](#08-problems)

</div>

## A. From Greece, to Göttingen and finally the Valley

### A.1 Geometry

### A.2 Zermelo-Frankel

### A.3 Univalent Foundations

## B. From Symbolic Software 1.0 to Stochastic Software 2.0
<small>[$\hookleftarrow$ Table of Contents](#table-of-contents)</small>

> In which we retrace the development and failure of the discretely symbolic approach to build artificially intelligent machines with common sense and motivate the need to transition from logical and finitely discrete software 1.0 to stochastic and infintely continuous software 2.0.
<!-- $p(X=x)$ from $D=\{x^{(i)}\}_{i=1}^{n}$ -->

### 0.1 From Psychology to Artificial Intelligence

<br>

<div class="dropcap">

The study of the mind is no different from that of mathematics or music
— although their forms change throughout time, their substances remain eternal.
What do we mean by such high fallutin speak?
What we mean is that in mathematics, representations or notations for arithmetic have evolved
from dashes on cave walls, to roman numerals, and finally to modern position-based hindu arabic numerals;
In music, representations or also notation for pitch have evolved from neumes, relative staffs, and to the five-line staff;
And finally, with the mind, representations or model for intelligence have evolved from stimulus-response to neural networks.

</div>

The transition between the two representations happened relatively recently at a summer worshop at Dartmouth in 1956.
There, a group of researchers unsatisfied with the theories that the discipline of psychology were using
to explain the phenomena of the mind and it's intelligence came together to discuss a different approach,
namely, one where the computer is the instrument for conducting scientific experiment.
Although seemingly trivial from the modern perspective where most if not all sciences use the computer,
they were were arguably the first with motivation arisen from the epistemological:
using the computer as basis for the science of mind (and all sciences in general) strengthened it's explanations
from the *observationally simple* like stimulus-response to the *constructively complex* such as neural networks<span class="sidenote-number"></span><span class="sidenote">*Practical applications are often a result of inquiry that is philosophical and gradiose with no immediately obvious economic value. Namely, computers with Hilbert wanting to automate mathematics as beers, tables and mugs; language models with McCarthy, Minsky, Newell and Simon wanting to mechanize and naturalize the mind.*</span>.
That is, constructive because explaining via computer means *simulating* the phenomena by programming processes with procedures.
And, complex because computers allow for the *simulating* of many things at
once<span class="sidenote-number"></span><span class="sidenote">*Paraphrasing Minsky, "Under certain conditions mathematical analysis can describe complex phenomena where the parts of the system can be treated as individual and independently random (i.e statistical thermodynamics), but there is no reason to suspect that intelligence is the result of averaging out many events."*</span>.
The proposal for the workshop states:

> We propose that a (...) study of artificial intelligence be carried out (...) the study is to proceed on the basis of the conjecture that every aspect of learning or any other feature of intelligence can in principle be so precisely described that a machine can be made to simulate it.

Besides the intellectual pursuit of finding better explanations for a clearer picture of reality, using the computer also means something quite practically profound.
If the explanation it comes up with are accurate, we will have artificial systems that exhibit behavior which we would attribute intelligence to.
This is what the Turing Test posited and predicted in 195X (todo, read computing machinery and intelligence).
<span class="defnote">**artificial intelligence**</span>**artificial intelligence**
<span class="defnote">**natural language processing**</span>**natural language processing**
<span class="defnote">**computational linguistics**</span>**computational linguistics**. And this is why we have ChatGPT.

In this book we embark on a quest to build from scratch our own deep neural network like ChatGPT by implementing [`nanochat`](http://github.com/karpathy/nanochat)
and our own deep learning framework like PyTorch by implementing [`teenygrad`](https://github.com/j4orz/teenygrad) capable of running nanochat itself.
These systems by nature are *stochastic and infintely<span class="sidenote-number"></span><span class="sidenote">*Turns out not quite infinte, as we will see in chapter 3.*</span> continuous*
software 2.0 rather than the *logical and finitely discrete* software 1.0 and are implemented not by programming algorithms and their procedures line by line with sets, maps, lists, trees, and graphs,
but rather, by searching the space of programs by providing a goal to calculus, which then optimizes said goal — in the case of ChatGPT, producing a probability distribution over tokens — with the linear algebra of tensors.
However, there was a time where the dominant approach involved using software 1.0 and in chapter 0 we will build various systems using such techniques to display their shortcomings,
understanding the underlying philosophical principle, and ultimately motivating the need for
software 2.0<span class="sidenote-number"></span><span class="sidenote">*The art of programming software 1.0 is necessary however on your quest to learn software 2.0! PyTorch is embedded and implemented within Python afterall. For instance, to those who spent countless nights learning esotoric spells such as that of dynamic programming to enter the kingdoms of our feudal lords only to create web page buttons should not fret as it turns out that dynamic programming over a graph is in fact the beating heart of all deep learning frameworks.<br><br>If you'd like to revisit the fundamentals of programming, we recommend the [Data Centric Introduction to Computing](), which begins with the teaching language Pyret and graduates to Python. You can then take a look at the documentation of the [Python Tutorial](https://docs.python.org/3/tutorial/index.html), [Python Language Reference](https://docs.python.org/3/reference/index.html) and [Python Standard Library](https://docs.python.org/3/library/index.html#library-index).*</span>

briefly mention
intelligence must be told knowledge before learning it
and such knowledge should be represented a symbolic logic

- mccarthy's excerpts from "programs with common sense"
- minsky's "descriptive languages and problem solving"
- newell and simon's symbolic hypothesis
- newell knowledge level

Are you ready to begin?

### 0.2 Weizenbaum Cheats Turing's Test with the Pattern Matching of `ELIZA`

<script src="assets/elizabot/elizabot.js"></script>
<script src="assets/elizabot/elizadata.js"></script>
<div style="display: flex; gap: 1rem; align-items: flex-start; margin: 1.5rem 0;">
<div id="eliza-widget" style="
  flex: 1;
  min-width: 0;
  font-family: var(--mono-font, 'Source Code Pro', monospace);
  font-size: 0.85em;
  background: var(--quote-bg);
  border-radius: 6px;
  padding: 1rem;
">
  <div style="opacity:0.5;font-size:0.8em;margin-bottom:0.5rem;user-select:none;">ELIZA 1966</div>
  <div id="eliza-log" style="
    height: 260px;
    overflow-y: auto;
    margin-bottom: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  "></div>
  <form id="eliza-form" style="display: flex; gap: 0.5rem;">
    <input id="eliza-input" type="text" autocomplete="off" placeholder="say something…" style="
      flex: 1;
      background: var(--bg);
      color: var(--fg);
      border: 1px solid var(--quote-border, #444);
      border-radius: 4px;
      padding: 0.4rem 0.6rem;
      font: inherit;
      outline: none;
    ">
    <button type="submit" style="
      background: var(--quote-bg);
      color: var(--fg);
      border: 1px solid var(--quote-border, #444);
      border-radius: 4px;
      padding: 0.4rem 0.8rem;
      font: inherit;
      cursor: pointer;
    ">send</button>
  </form>
</div>
<script src="assets/elizabot/eliza-widget.js"></script>

<div id="qwen-widget" style="
  flex: 1;
  min-width: 0;
  font-family: var(--mono-font, 'Source Code Pro', monospace);
  font-size: 0.85em;
  background: var(--quote-bg);
  border-radius: 6px;
  padding: 1rem;
">
  <div style="opacity:0.5;font-size:0.8em;margin-bottom:0.5rem;user-select:none;">QWEN 2025</div>
  <div id="qwen-key-prompt" style="margin-bottom: 0.75rem; display: flex; gap: 0.5rem; align-items: center;">
    <input id="qwen-key" type="password" placeholder="OpenRouter API key…" style="
      flex: 1;
      background: var(--bg);
      color: var(--fg);
      border: 1px solid var(--quote-border, #444);
      border-radius: 4px;
      padding: 0.4rem 0.6rem;
      font: inherit;
      outline: none;
    ">
    <button id="qwen-key-save" type="button" style="
      background: var(--quote-bg);
      color: var(--fg);
      border: 1px solid var(--quote-border, #444);
      border-radius: 4px;
      padding: 0.4rem 0.8rem;
      font: inherit;
      cursor: pointer;
    ">save</button>
  </div>
  <div id="qwen-log" style="
    height: 260px;
    overflow-y: auto;
    margin-bottom: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  "></div>
  <form id="qwen-form" style="display: flex; gap: 0.5rem;">
    <input id="qwen-input" type="text" autocomplete="off" placeholder="say something…" style="
      flex: 1;
      background: var(--bg);
      color: var(--fg);
      border: 1px solid var(--quote-border, #444);
      border-radius: 4px;
      padding: 0.4rem 0.6rem;
      font: inherit;
      outline: none;
    ">
    <button type="submit" style="
      background: var(--quote-bg);
      color: var(--fg);
      border: 1px solid var(--quote-border, #444);
      border-radius: 4px;
      padding: 0.4rem 0.8rem;
      font: inherit;
      cursor: pointer;
    ">send</button>
  </form>
</div>
</div>
<script src="assets/elizabot/qwen-widget.js"></script>

Humans, it seems, know things: and what they know helps them do things.
The early approach to artificial intelligence using logical and finitely discrete techniques from software 1.0
focused on building systems that <span class="defnote">**reasoning**</span>**reasoned** over an internal <span class="defnote">**representation**</span>**representation** of knowledge.
Iteratively deepening software 1.0's symbolic perspective of such terms will be the focus of this first
chapter<span class="sidenote-number"></span><span class="sidenote">*By the end of the book you will have come to understand the software 2.0 perspective of such terms.*</span>.

Although there was various flavors of the symbolic approach to AI — game playing, puzzle solving, problem solving to name a few —
our focus is on building conversational machines within the realm of natural language processing and computational linguistics, to pass something like the aforementioned Turing Test.
With that said, **what is the simplest way to build a conversational machine with the logical and finitely discrete techniques from software 1.0?**

> [!WARNING]
> <img class="owl" src="./assets/owl.png" alt="" style="float: left; width: 140px; margin: 0 1em 0.5em 0;"> Pause and think!<br style="clear: both;">

**What if we represented words with `str`s and, produce answers as output with `if` statements conditioned on questions as input?**

That's effectively what the `ELIZA`<span class="sidenote-number"></span><span class="sidenote">*See [**A Computer Program For the Study of Natural Language Communication Between Man and Machine (Weizenbaum 1966)**](https://dl.acm.org/doi/epdf/10.1145/365153.365168)*</span>
system does<span class="sidenote-number"></span><span class="sidenote">*Do you feel dissapointed after learning ELIZA's trick? The trick with all explanations is that after the explanation, no trick remains. See [Matter, Mind, and Models (Minsky 1965)](), and [The Nature of Explanation (Craik 1952)](). You might feel the same way by the end of the book even after learning how [nanochat]() and [teenygrad]() work under the hood. Don't say we didn't warn you!*</span> to imitate a Rogerian psychotherapist.

For instance, a question that tends to get asked is the meaning of life.
Answering such question seems quite grandiose for now, so let's have our system produce some random string for now.
Let's document and interatively test our example<span class="sidenote-number"></span><span class="sidenote">*The implementation of all functions implemented in the book will start with examples, following the principled design of programs with the [How to Design Programs' Design Recipe](). We still find it useful in the era of agentic coding.*</span> with Python's convinent standard library module [`docttest`](https://docs.python.org/3/library/doctest.html):

```python
def eliza(input: str) -> str:
  """
  >>> eliza("What's the meaning of life?")
  '42'
  """
  if input == "What's the meaning of life?": return "42"
  else: raise NotImplementedError("")

  if __name__ == "__main__":
    import doctest
    doctest.testmod()
```

<!-- > The gross procedure of the program is quite simple. Input sentences are analyzed on the basis of *decomposition rules* which are *triggered* by key words appearing in the input text. Responses are generated by *reassembly rules* associated with selected decomposition rules. -->

Let's start with other questions that are perhaps less grandiose but as equally important
in which a patient might ask a psychotherapist.
For instance, a patient reporting to a therapist that they are unhappy or upset.
Given that ELIZA imitates a Rogerian psychotherapist which follows the principle of person-centered therapy
— that is, no immediate rejection (todo: read wiki) — we might
expect on an a priori basis<span class="sidenote-number"></span><span class="sidenote">*We can also empirically confirm the following question-answer pairs by consulting the appendix in [(Weizenbaum 1963)](https://dl.acm.org/doi/pdf/10.1145/365153.365168).*</span>
that our system responds like so:

```python
def eliza(input: str) -> str:
  """
  >>> eliza("What's the meaning of life?")
  '42'

  >>> eliza("I am unhappy")
  'Why do you say you are unhappy?'
  """
  if input == "What's the meaning of life?": return "42"
  else:                                       raise NotImplementedError("")

if __name__ == "__main__":
  import doctest
  doctest.testmod()
```

Evaluating the tests fails as expected. How should we implement the function body for `eliza()` so that they pass?

> [!WARNING]
> <img class="owl" src="./assets/owl.png" alt="" style="float: left; width: 140px; margin: 0 1em 0.5em 0;"> Pause and think!<br style="clear: both;">

The most naive way to make them pass is to add an if-then rule for each example,
following the question-answer pair for the meaning of life:

```python
def eliza(input: str) -> str:
  """
  >>> eliza("What's the meaning of life?")
  '42'

  >>> eliza("I am unhappy")
  'Why do you say you are unhappy?'
  """
  if input == "What's the meaning of life?": return "42"
  elif input == "I am unhappy":              return "Why do you say you are unhappy?"
  else:                                       raise NotImplementedError("")

if __name__ == "__main__":
  import doctest
  doctest.testmod()
```

Clearly `eliza` lacks any true understanding of word meaning found in natural language, for it's simply reflecting the prompt back to the user.
In the paper:

> The ELIZA program itself is merely a *translating processor* in the technical programming sense. Gorn [2] in a paper on language systems says: 'Given a language which already possesses <span class="defnote">**semantics**</span>**semantic** content, then a translating processor, even if it operates only <span class="defnote">**syntax**</span>**syntactically**, generates corresponding expressions of another language to which we can attribute as "meanings" (possibly multiple — the translator may not be one to one) the "semantic intents" of the generating source expressions; whether we find the result consistent or useful or both is, of course, another problem.'

The classic linguistics example to distinguish syntactic form and semantic meaning comes from Syntactic Structures (Chomsky 1957):

- *Furiously sleep ideas green colorless*
- *Colorless green ideas sleep furiously*

where the first sentence is gramatically incorrect whereas the second, while gramatically correct, is semantically
meaningless<span class="sidenote-number"></span><span class="sidenote">*(todo).*</span>.
With ELIZA however, it doesn't outright produce sentences that are *as* meaningless as the second sentence,
but as the interaction with the chatbot progresses, the mirage of such semantic understanding unveils itself,
and most people start to understand the gist of ELIZA's gimmicks.

But even if only operating syntactically speaking, another issue is that the implementation clearly does not scale,
for in the case where our patient prompts `eliza` with cases not handled — that they are upset for instance — our implementation immediately fails:

```python
def eliza(input: str) -> str:
  """
  >>> eliza("What's the meaning of life?")
  '42'

  >>> eliza("I am unhappy")
  'Why do you say you are unhappy?'

  >>> eliza("I am upset")
  'Why do you say you are upset?' # <-- FAIL

  >>> eliza("Why does Alice hate me?")
  'Why do you say Alice hates you?' # <-- FAIL
  """
  if input == "What's the meaning of life?": return "42"
  elif input == "I am unhappy":              return "Why do you say you are unhappy?"
  else:                                       raise NotImplementedError("")

if __name__ == "__main__":
  import doctest
  doctest.testmod()
```

We can add another conditional statement to handle such case, but then the the patient can come in reporting *yet another* sentiment after that.
Although enumerating through the entire space of possible questions a patient could ask is indeed intractable,
perhaps we could *collapse* said space with a few conditional statements that provided reuse *within* each branch.
For instance, in the case where a patient's prompt takes the syntactical form "I am BLAH",
`eliza` can respond with "Why do you say you are BLAH?" independent of BLAH's semantic meaning.
In another case with "BLAH hates me", `eliza` can respond with "Why do you say BLAH hates you?".

```python,norepl
def eliza(input: str) -> str:
  """
  >>> eliza("What's the meaning of life?")
  '42'

  >>> eliza("I am unhappy")
  'Why do you say you are unhappy?'

  >>> eliza("I am upset")
  'Why do you say you are upset?' # <-- FAIL

  >>> eliza("Why does Alice hate me?")
  'Why do you say Alice hates you?' # <-- FAIL
  """
  if input == "What's the meaning of life?": return "42"
  elif input == "I am BLAH":                 return "Why do you say you are BLAH?"
  elif input == "BLAH hates me":             return "Why do you say BLAH hates me?"
  else:                                       raise NotImplementedError("")

if __name__ == "__main__":
  import doctest
  doctest.testmod()
```

In order to implement the code sketch above, some formal language theory is needed.
The theory models <span class="defnote">**language**</span>**language** *as* a set of strings,
where each string is a sequence of elements from some finite <span class="defnote">**alphabet**</span>**alphabet**.
Even if such set is *infinite*, the set itself can be characterized with a *finite set* of rules.
The core interest of such theory are the syntactical aspects of languages, namely the <span class="defnote">**membership problem**</span>**membership problem**.
That is, to determine based off structural form whether a given string is in a language or not.
Given that ELIZA is merely operating with the syntactic structure of the "Rogerian psychotherapist language", that is not a problem.

In our case, we'd like to somehow define the language of all strings that take the form "I am BLAH",
and then match all strings that are inside that set. How do we characterize such a set?
We can do so with a <span class="defnote">**regular expression**</span>**regular expression**,
which defines the <span class="defnote">**regular language**</span>**regular language** of said strings, "I am BLAH".
A regular expression is one which can include the following elements
- a literal character drawn from some alphabet $\Sigma$
- the empty string $\epsilon$
- the Kleene star $R^{*}$, where $R$ is a regular expression
- concatenation $RS$, where $R$ and $S$ are regular expressions
- alternation $R|S$, where $R$ and $S$ are regular expressions
- and parentheses $(R)$, where $R$ is a regular expression

With Python particularly, regular expressions are available via standard library's [`re`](https://docs.python.org/3/library/re.html) module with a two step process.
1. The first step is passing a regular expression to [`re.compile()`](https://docs.python.org/3/library/re.html#re.compile)
to produce a [`re.Pattern`](https://docs.python.org/3/library/re.html#re.Pattern) object.
2. Then, the second step is to **match** against said **pattern** with an input string
via `Pattern.search(string)`, `Pattern.match(string)` or `Pattern.fullmatch(string)`
which returns a corresponding [`re.Match`](https://docs.python.org/3/library/re.html#re.Match) object or `None`.

However if the pattern is only going to be matched against a single time without any reuse,
you can evaluate the `re.Pattern` and `re.Match` objects with a single function invocation rather than two. For example:

```python
import re
pattern = re.compile(r"I am unhappy")
result1 = pattern.fullmatch(r"I am unhappy")    # match
result2 = pattern.fullmatch(r"foobar")          # no match
result3 = pattern.fullmatch(r"You are unhappy") # close, but still no match
print(f'{result1=}')
print(f'{result2=}')
print(f'{result3=}')

result1_singlestep = re.fullmatch(r"I am unhappy", "I am unhappy") # match, with a single call
```

In our case where we'd like to characterize all strings that take the form "I am BLAH", we need to use the Kleene star which effectively acts as a wildcard,
and subsequently capture the BLAH with [`Math.groups()`](https://docs.python.org/3/library/re.html#re.Match.groups)

```python
import re
result = re.fullmatch("I am (.*)", input)
print("captured: {0}?".format(*result.groups()))
```

Using our new machinery with regular expression in `eliza()`'s implementation, we now have:
```python
import re

def eliza(input: str) -> str:
  """
  >>> eliza("What's the meaning of life?")
  '42'

  >>> eliza("I am unhappy")
  'Why do you say you are unhappy?'

  >>> eliza("I am upset")
  'Why do you say you are upset?'
  
  >>> eliza("Why does Alice hate me?")
  'Why do you say Alice hates you?'
  """
  if match := re.fullmatch("What's the meaning of life?", input): return "42"
  elif match := re.fullmatch("I am (.*)", input):                 return "Why do you say you are {0}?".format(*m.groups())
  elif match := re.fullmatch("(.*) hate (.*)", input):            return "Why do you think {0} hates {1}?".format(*m.groups())
  else:                                                           raise NotImplementedError("")

print(eliza("I am very unhappy these days")) # Why do you say you are unhappy?
```

Tests pass! Let's add some more rules,
including a catchall rule in the `else` branch where any phrase uttered in which `eliza()` does not recognize
will be responded with `"Please go on."`. It's effectively an escape hatch for `eliza()`'s utter lack of semantic understanding with word meaning.


todo you -> me
     me -> you



```python
import re

def eliza(input: str) -> str:
  """
  >>> eliza("What's the meaning of life?")
  '42'

  >>> eliza("I am unhappy")
  'Why do you say you are unhappy?'

  >>> eliza("I am upset")
  'Why do you say you are upset?'
  """
  if match := re.fullmatch("What's the meaning of life?", input): return "42"
  elif match := re.fullmatch("I am (.*)", input):                 return "Why do you say you are {0}?".format(*m.groups())
  elif match := re.fullmatch("It seems that (.*)", input):        return "What makes you think {0}?".format(*m.groups())
  elif match := re.fullmatch("(.*) hate (.*)", input):            return "Why do you think {0} hates {1}?".format(*m.groups())
  else:                                                           return "Please go on." # <-- the magic trick

print(eliza("I am very unhappy these days")) # Why do you say you are unhappy?
print(eliza("I am very unhappy these days")) # How long have you been very unhappy these days?
print(eliza("It seems that you hate me"))    # What makes you think you hate me?
```

With the last transformation rule, you can see how brittle ELIZA's so-called "understanding", or semantics, truly is.
The primary reason a simple pattern matcher over strings can be endowed with human understanding (in other words, why the magic works)
is because of the psychiatric context — especially the Rogerian one with person-centered therapy — where users are effectively talking with
oneselves<span class="sidenote-number"></span><span class="sidenote">*In a [1978 interview](https://www.youtube.com/watch?v=GxSJQnWzJOs), "Well, I would deny that that there's any important sense, non-negligible sense in which the program understands. It certainly creates the illusion of understanding. there's no question about that. But we have to understand that that illusion is an attribution that the person conversing with the program contributes to the conversation. It's not a function of the program itself."*</span>.
The paper goes on to report that:

> This mode of conversation was chosen because the psychiatric interview is one of the few examples of categorized dyadic natural language communication in which one of the participating pair is free to assume the pose of *knowing almost nothing* of the real world. If, for example, one were to tell a psychiatrist "I went for a long boat ride" and he responded "Tell me about boats", one would not assume that he knew nothing about boats, *but that he had some purpose* in so directing the subsequent conversation. It is important to note that this *assumption is one made by the speaker*. Whether it is *realistic or not is an altogether separate question*. In any case, it has a crucial psychological utility in that it serves the speaker to maintain his sense of being heard and understood.<br><br>

> [!IMPORTANT]
> <img class="owl" src="./assets/owl.png" alt="" style="float: left; width: 140px; margin: 0 1em 0.5em 0;"> Our `eliza()` will not qualitatively improve it's breadth of common sense nor it's depth of understanding
> by simply adding another if-then rule. This is because it's trying to **describe a reality with too many parts to count**. <br style="clear: both;">

Describing a reality with too many parts is the philosophical principle and problem that
logical and finitely discrete techniques from software 1.0 ultimately run into.
But perhaps it's too soon to jump the software 1.0 ship to the stochastic and infintely continuous methods of software 2.0?
Afterall, ELIZA's **representation** are only `str`s, and it performs no **reasoning** whatsoever.
Maybe all we need to build a natural language processing system that can match the capability of `nanochat`
is with a stronger syntactic and semantic analysis?

### 0.3 Wood's Winograd Challenge with the Translation of `LUNAR`

(INSERT LUNAR EXAMPLE)

> Computers are being used today to take over many of our jobs. They can perform millions of calculations in a second,
> handle mountains of data, and perform routine office work much more efficiently and accurately than humans.
> But when it comes to telling them what to do, they are *tyrants*.
> They insist on being spoken to in special computer languages,  and act as though they can't even understand a simple English sentence.<br><br>
> Let us envision a new way of using computers so they can take instructions in a way suited to their jobs.
> We will talk to them just as we talk to a research asisstant, librarian, or secretary,
> and they will carry out our commands and provide us with the information we ask for.
> If our instructions aren't clear enough, they will ask for more information before they do what we want, and this dialog will all be in English.
>
> <small>*[Procedures as a Representation for Data in a Computer Program for Understanding Natural Language (Winograd's Dissertation 1971)]()*</small>

change segue to be more historical (minsky's semantic informationation processing, the intros to wood and winograd's dissertations)

Starting where the previous chapter left off,
**how can we build a natural language processing system with a stronger analysis of syntactic (grammar) and semantic (meaning) of the English language?**

> [!WARNING]
> <img class="owl" src="./assets/owl.png" alt="" style="float: left; width: 140px; margin: 0 1em 0.5em 0;"> Pause and think! When questions become more difficult to think about from first principles perhaps such as this one,
one heuristic is to use a combination of both history and theories from other disciplines as a guide. <br style="clear: both;">

<details>
<summary>Click to reveal answer</summary>

**What if we built a compiler for the English language?**

</details>

That's effectively what the `LUNAR` and `SHRDLU`
systems<span class="sidenote-number"></span><span class="sidenote">*Presented across a series of papers. See [(Woods 1969)](), [(Woods 1970)](), [(Woods 1971)](), [(Woods 1972)](), and [(Winograd 1971)](https://apps.dtic.mil/sti/tr/pdf/AD0721399.pdf), respectively.*</span>
do.
The former, implements a natural language processing system to interface with a database containing chemical analysis data on lunar rock and soil from the from the Apollo 11 moon missions
so that non-expert geologists could express their questions in the natural language of English rather than a formal one such as SQL.
The latter, implements the same but rather than interface with a database, it does so with a 3D graphically simulated world with
blocks<span class="sidenote-number"></span><span class="sidenote">*Called Blocks World, a toy environment which was home to many of MIT's symbolic AI projects.*</span>.
The `LUNAR` and `SHRDLU` systems were amongst the first natural language proecssing systems to implement a deeper level of word understanding via natural language compilers,
compared to systems like `ELIZA`.
Like many of the AI systems at the time, although seemingly applied to the narrow domains of toy environments, these researchers were after general principles.

> (quote something from woods, winograd, or minsky's semantic information processing)

#### 0.3.1 From Linguistics to Logic

Although we might not know *exactly* how that's done, we might be somewhat familiar with the distinction of
"lower level" vs "higher level" languages where the former are closer to the machine (whatever that may mean) such as C++
and the latter are English-like (whatever that may mean) like Python.
Whatever is going underneath there, it seems like these languages *understand* at least *some*thing about our intent
in order to *preserve* it through the *translation* from a higher level language to a lower level one.
Perhaps we can use the same techniques that formal programming languages use
but extend them one level "higher" by applying them to the natural language of English itself?

With the approach settled, the problem reduces down into answering the question of **how do we implement a compiler?**
Depending on your appetite, you *can* try to tackle this question from first principles as well.
We however don't have the ability nor time to perform such a feat, and so we will consult the existing
literature<span class="sidenote-number"></span><span class="sidenote">*We recommend [Programming Languages: Application and Interpretation (Krishmaurthi 2022)]()*</span>.

The first idea to understand is that a compiler is a function which takes a string in and produces a string out
(programs are written in text editors afterall)
where the input string is referred to as the *source program* and the output string as the *target program*.
While a traditional compiler might take in C as the source language and produce x86 as the target language,
`LUNAR` takes in a question expressed in English and produces a query expressed in SQL. (todo: remove SQL)
Just like a human translator, a compiler has a two step process:
1. First, a compiler needs to understand the message expressed in the source language
2. Then, said compiler can translate the message expressed in the target language

#### 0.3.1 Analysis: Understanding the Source
Starting with the first step, that awfully sounds like formal language theory's membership problem which we encountered in the [previous chapter](#membership-problem).
That is, determining whether a given string is in a language (subsequently modeled as a set of strings) or not.
Perhaps we can reuse regular expressions? Why not try the machinery we already have?

Clearly, regular expressions have no problem describing languages


*memory to model long range dependencies i.e a^nb^n* (push down, recursion (via stack))
a <span class="defnote">**lexical analysis**</span>**lexical analysis** are defined by context-free grammar
loremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsum
a <span class="defnote">**lexical grammar**</span>**lexical grammar** are defined by context-free grammar
loremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsum

a <span class="defnote">**syntactic analysis**</span>**syntactic analysis** are defined by context-free grammar
loremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsum
a <span class="defnote">**syntactic grammar**</span>**syntactic grammar** are defined by context-free grammar
loremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsum
a <span class="defnote">**syntax tree**</span>**syntax tree** are defined by context-free grammar
loremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsum
a <span class="defnote">**derivation**</span>**derivation**
loremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsum
a <span class="defnote">**parser**</span>**parsing** is the problem of finding a derivation for a string in a grammar (recognizer)

a <span class="defnote">**context-free language**</span>**context-free language** are defined by context-free grammar
loremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsum
a <span class="defnote">**context-free grammar**</span>**context-free grammar**
loremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsum

It first converts the source program from a <span class="defnote">**concrete syntax**</span>**concrete** `str` to
a more <span class="defnote">**abstract syntax**</span>**abstract** data structure that has more "understanding" of what's being spoken to it compared to a simple silly `str`. Because this abstract representation of the program is not the final representation (namely x86), it's referred to as the <span 

#### 0.3.2 Synthesis: Translating to the Target

While there do exist compilers that perform this translation in a single step,
most compilers (and interpreters for that matter) allocate
an <span class="defnote">**intermediate representation**</span>**intermediate representation** of the program
in order to better analyze, understand, and perhaps optimize said
program<span class="sidenote-number"></span><span class="sidenote">*Said compilers that translate in a single step are **single-pass compilers**, primarily from the past when memory bottlenecks prevented the allocation of data structures that represented the entire source program. This is why you can't invoke a function above it's definition in C, unless you explicitly provide a forward declaration.*</span>.
The translation step from source to intermediate representation and from intermediate representation to target are
called <span class="defnote">**parsing**</span>**parsing** and <span class="defnote">**generation**</span>**generation**
respectively<span class="sidenote-number"></span><span class="sidenote">*With all industrial language implementations, there is almost always a third step in between the two, which optimizes the program.*</span>

<div class="dual">

```python
def compile(source: str) -> str:
  """translates a source program expressed in C to a target program expressed in x86

  """
  ir = parse(source)
  target = generate(ir)
  return target

from dataclasses import dataclass
@dataclass
class IR():
  # ???
def parse(source: str) -> IR: raise NotImplementedError("")
def generate(ir: IR) -> str: raise NotImplementedError("")
```

```python
def lunar(english_source: str) -> str:
  """translates a source question expressed in english to a target question expressed in SQL
  (todo, examples)
  """
  ir = parse(source)
  target = generate(ir)
  return target

from dataclasses import dataclass
@dataclass
class IR():
  # ???

def parse(source: str) -> IR: raise NotImplementedError("")
def generate(ir: IR) -> str: raise NotImplementedError("")
```
</div>

Evaluating the code above fails as expected. Before implementing the respective function bodies of `parse()` and `generate()`, we need to design the `IR` data structure.

A compiler however is only a program <span class="defnote">**translator**</span>**translator**, namely from the C language to the x86 language.
In order to produce a final answer you will need a program <span class="defnote">**evaluator**</span>**evaluator** for x86, which is any Intel processor that understands x86. Similarly with `LUNAR`, after translating the query from English to SQL, a database that understands SQL is
needed<span class="sidenote-number"></span><span class="sidenote">*We will learn about the internals of the former evaluator (a hardware processor) in [Chapter 3](#3-from-ipls-array-to-apls-multidimensional-array) when accelerating linear algebra in order to implement `teenygrad`. The later evaluator (a database processor) however is unfortunately out of scope — if you'd like to learn more about database internals, we recommend [Andy Pavlo's CMU 15-445/645](https://15445.courses.cs.cmu.edu/).*</span>.
Following the [Design Recipe](https://docs.racket-lang.org/htdf/index.html), let's start with examples for `lunar()`.

```python
def lunar(english_source: str) -> str:
  """translates a source question expressed in english to a target question expressed in SQL

  """
  ir = parse(source)
  target = generate(ir)
  return target

from dataclasses import dataclass
@dataclass
class IR():
  # ???
def parse(source: str) -> IR: raise NotImplementedError("")
def generate(ir: IR) -> str: raise NotImplementedError("")
```


---

carnap, montague, frege (philosophical principles)

(Woods 1972 BBN Report)
> Although the goal of accepting an input request in any phrasing which a user might ask is one which will require
> additional grammar development and semantic work, the system has already achieved considerable progress towards this goal,
> and the components and organization which we have used in building the system permit *conditinoal gradual evolution* towards its achievement.

In [Progress in Natural Language Understanding — An Application to Lunar Geology (Woods 1973)]()
> The advent of computer networks such as the ARPA net has significantly increased the opportunity for access by a single researcher to a variety
> of different computer facilities and data bases, thus raising expectations of a day when it will be a common occurrence
> rather than an exception that a scientist will casually undertake to use a computer facility located 3000 miles away
> and whose languages, formats, and convetions are unknown to him. In this foreseeable future, learning and remembering the number of different
> languages and convetions that such a scientist would have to know will require significant effort — much greater than that now required to learn
> the conventions of his local computing center.

- end the chapter with lighthill
- end chapter with winograd's two phd students sergey brin and larry page duck semantics with information retrieval and search engine.
- motivate expert systems (feigenbaym)
- the other reaction is lenat with `CYC` (let's increase the knowledge base)

> [!IMPORTANT]
> <img class="owl" src="./assets/owl.png" alt="" style="float: left; width: 140px; margin: 0 1em 0.5em 0;"> Although `lunar()`'s depth of understanding the natural language of English is deeper than `eliza()`s, 
> it came at the cost of a shallower breadth in it's common sense.
> That is, simply adding more syntactic grammar or semantic interpretation rules will not
> enable `lunar()` to start helping patients in the psychiatric setting because 
> it will always be limited to the chemical analysis data in it's knowledge base from the Apollo 11 moon missions.
> Although in different ways, LUNAR too, like ELIZA, is trying to **describe a reality with too many parts to count**.


<!-- ### 0.4 Feigenbaum's Narrow Expertise with the Heuristics of `DENDRAL` -->


<!-- > [!IMPORTANT]
> expert systems failed because they break down in the face of uncertainty and cannot learn from experience.
in 1981 japanese government announced the fifth generation project, a 10 year plan to build massively parallel, intelligent computers running Prolog.
sidenote, today we have the same thing but running pytorch instead of prolog. -->

<!-- returning to minsky, programs with **common sense**
the expert systems did not have common sense.
cyc was a system where the common sense had to explicitly programmed in.
or at least 1 million rules to cover common sense (1984 meeting. minsky. newell. alan kay. feigenbaum.)
to "prime the pump"
required 100 to 1000 person years.
"will be done in a few years" leave from stanford
bad news is they were "off" by one or two orders of magnitude. need 10, to 100 million rules
going full circle. now that is has a "common sense" pyramid, they are programming in domain specific knowledge

Rather than settle with the word representation where the meaning of life is `"LIFE"`,
let's find another representation for words which is more in concordance
with the linguist's understanding of word meaning which is that a denotation of a single word can conote multiple senses depending on the context.

Looking up the definition for "life" in the Merriam Webster dictionary<span class="sidenote-number"></span><span class="sidenote">*The same activity can be with the Cambridge and Oxford dictionaries. Pick your favorite.*</span>, we get:
- the quality that distinguishes a vital and functional being from a dead body
- the sequence of physical and mental experiences that make up the existence of an individual
- spiritual existence transcending physical death

Another interesting dictionary is urbandictionary, a dictionary where younger generation innovate on the English language:
- the meaningless void between birth and death
- a timed multiple choice exam - which most people end up failing

Given that the problem with representing word meaning via strings is the lack of multiple *associations*
(i.e the meaning of life is trivially `"LIFE"`), perhaps we can change our representation from strings to associations.
We can use Python's `dict` which is *literally* named after word dictionaries.
Rather than seed our own dictionary however, we can use *WordNet*, available through the Natural Language Toolkit Python package `nltk`.
Let's look up the definition of the lemma "life" with `nltk`:

```python
import os, pyodide.http
url = "https://raw.githubusercontent.com/nltk/nltk_data/gh-pages/packages/corpora/wordnet.zip"
path = "/nltk_data/corpora"
os.makedirs(path, exist_ok=True)
response = await pyodide.http.pyfetch(url)
with open(path+"/wordnet.zip", "wb") as f: f.write(await response.bytes())
# use wasm-based pyodide.http to fetch wordnet instead of nltk.download() which uses urllib
# see: https://pyodide.org/en/stable/usage/api/python-api/http.html

from nltk.corpus import wordnet as wn
for sense in wn.synsets("life"):
    print(f"{sense.name()}: {sense.definition()}")
```

*Trees, Graphs*

In addition to the key-value dictionary-like capability of WordNet,
another desiderata for a useful representation of word meaning is to provide thesaurus-like capability
of evaluating linguistic relationships between word senses
such as equivalance relationships like <span class="defnote">**synonym**</span>**synonymy**<span class="sidenote-number"></span><span class="sidenote">*Moreso a rough approximate equivalence, since any difference in linguistic form implies difference in meaning, stated more formally as the principle of contrast (Girard 1718, Bréal 1897, Clark 1987).*</span>,
and hierarchical relationships like <span class="defnote">**hypernym**</span>**hypernymy**.
Again through `nltk`, we can evaluate WordNet's list of synonyms and hypernyms for the word "life":

```python
import os, pyodide.http
url = "https://raw.githubusercontent.com/nltk/nltk_data/gh-pages/packages/corpora/wordnet.zip"
path = "/nltk_data/corpora"
os.makedirs(path, exist_ok=True)
response = await pyodide.http.pyfetch(url)
with open(path+"/wordnet.zip", "wb") as f: f.write(await response.bytes())
# use wasm-based pyodide.http to fetch wordnet instead of nltk.download() which uses urllib
# see: https://pyodide.org/en/stable/usage/api/python-api/http.html

from nltk.corpus import wordnet as wn
life = wn.synsets("life")
hypernyms_of_life = [h for s in life for h in s.hypernyms()]
print("synonyms of life:", wn.synonyms("life"))
print("hypernyms of life:", [h.lemma_names() for h in hypernyms_of_life])
```

Another notion developed in the field of lexical semantics is that of <span class="defnote">**similarity**</span>**similarity**,
which is defined between words rather than word senses.
For instance, even though the senses of "life" and "love" are very different,
they are somewhat related as words.
Once more through `nltk`, we can evaluate how similar "life" and love" with `u.path_similarity(v)`,
which evaluates the distance of the shortest path between `u` and `v` in their hypernym taxonomy graphs:

```python
# use wasm-based pyodide.http to fetch wordnet instead of nltk.download() which uses urllib
# see: https://pyodide.org/en/stable/usage/api/python-api/http.html
import os, pyodide.http
url = "https://raw.githubusercontent.com/nltk/nltk_data/gh-pages/packages/corpora/wordnet.zip"
path = "/nltk_data/corpora"
os.makedirs(path, exist_ok=True)
response = await pyodide.http.pyfetch(url)
with open(path+"/wordnet.zip", "wb") as f: f.write(await response.bytes())

from nltk.corpus import wordnet as wn
life = wn.synset('life.n.01')
love = wn.synset('love.n.01')
print("similarity between life and love", life.path_similarity(love))
``` -->

<!-- ---

### The Meaning of a Word is its Use

Although representations such as WordNet are a major improvement over those such as string of characters like `"LIFE"`,
overall the localist symbolic representations used by rules-based expert systems like ELIZA
(known as good old fashioned artificially intelligence <span class="defnote">**GOFAI**</span>**GOFAI**)
are brittle and do not <span class="defnote">**generalization**</span>**generalize** well.

Instead of using software 1.0 data structures such as sequences with strings, associations with dictionaries, hierarchies with trees,
you must make the transition towards probabilities, random variables, and their distributions, vectors, matrices, and their decompositions.

wittgenstein (ch5 Meaning as Use: From Wittgenstein
to Google’s Word2vec)

<span class="defnote">**distributional semantics**</span>**distributional semantics** by (Harris 1954), and (Firth 1957) "You shall know a word by the company it keeps" <span class="defnote">**vector semantics**</span>**vector semantics** (Osgood 1957) using a basis of valence, arousal, dominance -->

### 0.4 Lenat's Advice Taker with the Frames of `CYC`
- minsky's programs with common sense
- mccarthy's ontology of frames

### 0.5 From A Logical to Distributional Semantics

feigenbaum's concept learning
lenat's bitter lesson: from the tractatus to the investigations

lighthill report (1973)

then expert systems in '80s (feigenbaum and raj reddy),
expert systems being abandoned in '90s,
creating the second winter.
Parallel Distributed Processing (Rumelhart and McClelland, 1986)

although obvious posthoc that neural networks,
this was all predicated with foresight by wittgenstein.

**vector semantics by (Osgood et al. 1957)**
**distributional semantics (Harris 1954)**


- from feigenbaum/reddy to pdp
- from the organon (knowledge representation and reasoning with upper ontologies and deductive inference) to norvum organon (occam's razor)
- from the tractatus to the investigations is effectively the transition from software 1.0 to sofware 2.0
- to understand the claude, we must return to claude
- data science begins where computer science begins

question answering systems eventually incorporated the web as it's knowledge base,
and the field of information retrieval emerged.
https://start.csail.mit.edu/index.php


### 0.6 Summary

One quick way to summarize the software 1.0 approach to AI is to list the first six Turing Award winners for AI:
Marvin Minsky (1969) and John McCarthy (1971) for defining the foundations of the field based on representation and reasoning;
Allen Newell and Herbert Simon (1975) for symbolic models of problem solving and human cognition;
Ed Feigenbaum and Raj Reddy (1994) for developing expert systems that encode human knowledge to solve real-world problems.
Although not comprehensive, we explored the flavor of logically and discretely finite methods that the software 1.0 approach to AI employed focused on natural language processing and computational linguistics
by implementing pattern matching with `ELIZA`, compilation with `LUNAR`, and inference with `CYC`.
There were many other earlier approaches to embedding machines with intelligence such as
game playing, solving math problems, and ___, which can be found in the secondary resources listed in the bibliographic notes.

The remainder of the book is spent focused on the software 2.0 approach to AI:
Judea Pearl (2011) for developing probabilistic reasoning techniques
that deal with uncertainty in a principled manner; Yoshua Bengio, Geoffrey Hinton, and
Yann LeCun (2019) for making “deep learning” (multilayer neural networks) a critical part
of modern computing; and finally, Richard Sutton, Andrew Barto (2024) for
pioneering reinforcement learning in which agents learn by maximizing reward via trial and error
in which we will implement `FFN`s, `CNN`, `RNNs`, and `GPT`s.

### 0.7 Bibiliographic Notes

- The primary resources used throughout this chapter, as listed on the sidenotes,
were [(Weizenbaum 1966)](https://dl.acm.org/doi/epdf/10.1145/365153.365168), a short paper on ELIZA;
[(Minsky 1968)]()'s anthology of dissertations from his doctoral students;
[(Winograd 1971)]() and [(Woods 1972)](), doctoral dissertations for SHRDLU and LUNAR (the latter is a BBN report, based off his PhD thesis)
- For a historical perspective, refer to
[(Gardner 1958)](https://monoskop.org/images/e/e6/Gardner_Martin_Logic_Machines_and_Diagrams.pdf)
and [(Nilsson 2010)'s](https://ai.stanford.edu/~nilsson/QAI/qai.pdf)
Part II (Chapter 6, 7), Part III (Chapter 11, 13), Part IV (Chapter 18), Part VII (Chapter 26);
- For classical natural language processing techniques including syntactic, semantic, and logical analysis,
refer to [(Eisenstein 2018)'s](https://github.com/jacobeisenstein/gt-nlp-class/blob/master/notes/eisenstein-nlp-notes.pdf) Chapter 9, 10, 11, 12, 13 and [(Jurafsky and Martin 2026)'s](https://web.stanford.edu/~jurafsky/slp3/) Appendix E, F, G, H and [(Russel and Norvig 2022)'s](https://aima.cs.berkeley.edu/) Part III (Chapter 7, 8, 9, 10) and Part VI (Chapter 24).

<!-- ### rough

In fact, we are in good company as the question was posed all the way back by Alan Turing in his paper
[**Computing Machinery and Intelligence (Turing 1950)**](https://www.cs.mcgill.ca/~dprecup/courses/AI/Materials/turing1950.pdf)
as a test to operationalize intelligence, seminating both the fields of artificial intelligence and computer science as we know it today.
That same decade marks the official branding of the field at the [**Dartmouth Workshop (1956)**](),
and later that year, a possible solution to build machines that could pass such Turing's test was proposed by John McCarthy<span class="sidenote-number"></span><span class="sidenote">*see [Oral History of John McCarthy](https://www.youtube.com/watch?v=KuU82i3hi8c)*</span> in his paper
[**Programs with Common Sense (McCarthy 1956)**](https://www-formal.stanford.edu/jmc/mcc59.pdf)
where he outlines a hypothetical advice taker program implemented with *logically symbolic* methods.

Although *probabilistically connectionist* methods were also explored early on
with the artificial neuron — the modelling of a neuron as a weighted sum and threshold function —
was invented by Warren McCulloch and Walter Pitts in [**A Logical Calculus of the Ideas Immanent in Nervous Activity (1943)**](),
studied by Marvin Minsky<span class="sidenote-number"></span><span class="sidenote">*see Oral History of Marvin Minsky shortly after [The Society of Mind](https://www.youtube.com/watch?v=DrmnH0xkzQ8) and [the Emotional Machine](https://www.youtube.com/watch?v=EI0NXTrS5Pw)*</span> in his PhD thesis [**Theory of Neural-Analog Reinforcement Systems and Its Application to the Brain Model Problem (1954)**]() (both before Turing proposed his test),
and followed up by Frank Rosenblatt's composition of such neurons within a single layer neural network i [**The Perceptron — A Perceiving and Recognizing Automaton (1973)**](),
historically speaking the first dominant approach to the artificial intelligence program was the logically symbolic methods espoused by McCarthy.

While it may be clear from today's vantage point that deep neural networks (more specifically large language models via generative pretrained transformers)
are the first systems with common sense that have arguably passsed the aforementioned Turing test,
the apriori argument from the logically symbolic school of thought is that
modelling individual neurons was similar to a programming model with individual transistors.
That is, the former is attempting to describe reality at the wrong abstraction level,
and instead, the correct approach is to go straight to the source (so to speak) by replicating the human ability to aquire **knowledge** through **reasoning**.
This was crisply posited into a single claim known as the physical system hypothesis
by Allen Newell and Herbert Simon in [**Completer Science as Empirical Inquiry: Symbols and Search (1976)**](https://dl.acm.org/doi/pdf/10.1145/360018.360022),
These divergent schools of thought to the program of artificial intelligence are respectively known
as <span class="defnote">**connectionism**</span>**connectionism** and <span class="defnote">**symbolism**</span>**symbolism**. 
with the latter now coloquially referred to (in a somewhat disparaging manner) <span class="defnote">**GOFAI**</span>**good old fashioned AI**
due to the fact that deep neural networks have been the dominant approach to the artificial intelligence program for the past decade.

As what tends to happen, the dichotomy is moreso a fuzzy spectrum, and their relationship is closer to that of fighting siblings borrowing ideas from one another. 
Two related tensions which we will explore and transition throughout the book (especially in [Part I. Elements of Networks]())
is in both the mathematical *objects* and *methods* used to implement the two different approaches.
Objects, meaning the transition from the <span class="defnote">**discrete**</span>**discrete** mathematics of *sets, lists, associations, trees, and graphs*,
to that of the <span class="defnote">**continuous**</span>**continuous** mathematics of *scalars, vectors, matrices, and tensors*.
And methods, meaning the continuous objects are in fact <span class="defnote">**non-constructive**</span>**non-constructive**,
and in order to implement them on computers we must <span class="defnote">**constructive**</span>**constructively** discretize them with numerical approximations..
By the end of this [Part I. Elements of Networks]() you may wonder if real numbers, are in fact, *real*.

(start here.)

Returning to the central question of *how can we build machines that can understand and produce natural language?*,
one of the earliest and simplest GOFAI symbolic attempts was that of **ELIZA**,
a computer chatbot implemented in 1966 which simulates a Rogerian psychotherapist conducting person-centered therapy

 Systems like ELIZA which followed GOFAI's approach ran into limitations, ultimately predicted by the philosopher Ludwig Wittgenstein even before the Dartmouth project took place in his book [**Philosophical Investigations (Wittgenstein 1953)**](https://static1.squarespace.com/static/54889e73e4b0a2c1f9891289/t/564b61a4e4b04eca59c4d232/1447780772744/Ludwig.Wittgenstein.-.Philosophical.Investigations.pdf) — namely, that of **describing a reality with too many parts to count**. This is precisely what the connectionist school of thought
also known as softwere 2.0 solves with neural networks, and the brain child of such tradition is none other than **ChatGPT**.
To overcome such limitations we'll need to follow software 2.0's continuous and stochastic methods following the other members (who also happened to participate in the Dartmouth workshop), which we'll cover in this [Chapter 1. Syntactic Sequence Learning via n-gram Models with `teenygrad`](#1-syntactic-sequence-learning-via-n-gram-models-with-teenygrad) and the next [Chapter 2. Semi-Automated Semantic Sequence Learning via Linear Models with `teenygrad`](#2-semi-automated-semantic-sequence-learning-via-linear-models-with-teenygrad).
But before diving into the continuous structures (scalars, vectors, matrices, tensors) and stochastic descriptions (probabilities, random variables, and distributions)
of software 2.0, let's review the symbolic and logical methods of GOFAI that were used in systems like ELIZA, and it's GOFAI successors. -->

### 0.8 Problems

## Intermezzo One: The Language of Sets, Functions, Logic

> ~~Fixed-Size Data~~<span class="sidenote-number"></span><span class="sidenote">*A modified excerpt from How to Design Programs (Felleisen et al., 2014) [Intermezzo 1: Beginning Student Language](https://htdp.org/2026-5-28//Book/i1-2.html#%28part._.B.S.L_.Meaning%29).*</span> <a href="">*Chapter 0*</a> deals with ~~BSL~~ <a href="">*formal language theory and set theory*</a> as if it were a natural language. It introduces the “basic words” of the language <a href="">*(which in turn, models natural language)*</a>, suggests how to compose “words” into “sentences,” and appeals to your knowledge of ~~algebra~~ <a href="">*sets as a collection of objects*</a> for an intuitive understanding of these “sentences.” While this kind of introduction works to some extent, truly effective communication requires some formal study.

<!-- > In many ways, the analogy of Fixed-Size Data is correct. A programming language does have a vocabulary and a grammar, though programmers use the word syntax for these elements. A sentence in BSL is an expression or a definition. The grammar of BSL dictates how to form these phrases. But not all grammatical sentences are meaningful—neither in English nor in a programming language. For example, the English sentence “the cat is round” is a meaningful sentence, but “the brick is a car” makes no sense even though it is completely grammatical. To determine whether a sentence is meaningful, we must know the meaning of a language; programmers call this semantics. -->

<br>

<div class="dropcap">

In [Chapter 0. From Symbolic Software 1.0 to Stochastic Software 2.0](#0-from-symbolic-software-10-to-stochastic-software-20),
we implemented some conversational machines that were fairly representative of early approaches to building artificial intelligence
from the subdisciplines computational linguistics and natural language processing.
For instance, `ELIZA` used *regular expressions* which defined a *regular language* in order to implement (todo)
`LUNAR` and `SHRDLU` used *context-free grammar* defining *context-free languages* in order to implement a stronger *syntactic* and *semantic analysis*;
finally, `CYC` used (todo) in order to (Todo)

</div>

Although these deterministic and finitely discrete methods of software 1.0 run into the Bitter Lesson — that is, describing a reality with too many parts to count —
we will need the machinery that *underlies* such techniques, namely that of sets, functions, logic
because the same machinery is the common unifying foundation for all of mathematics,
including the set of stochastic and infinitely continuous mathematics we need for our journey up ahead with software 2.0.
While we've introduced such languages of set theory, functions, and logic throughout chapter 0 by appealing to your intuition as a programmer,
as per the opening exercept, truly effective communication and understanding requires the <span class="defnote">**formal**</span>**formal** study of mathematics using the <span class="defnote">**axiom**</span>**axiomatic**  method.

Historically speaking, (elements of euclid...)

The good news as a programmer is that you have an advantage to learning mathematics, because the essence of both activities are in fact one and the same
with the Univalent Foundations<span class="sidenote-number"></span><span class="sidenote">*See [https://en.wikipedia.org/wiki/Univalent_foundations](https://en.wikipedia.org/wiki/Univalent_foundations), and [https://ncatlab.org/nlab/show/univalent+foundations+for+mathematics](https://ncatlab.org/nlab/show/univalent+foundations+for+mathematics)*</span>.

Let us begin.<br>
You will understand in due time.

<!-- This sets a very high standard: every rule of inference and every step of a calculation has to be justified by appealing to prior definitions and theorems, all the way down to basic axioms and rules. -->

<div class="definition" data-title="Definition: Set">

A set<span class="sidenote-number"></span><span class="sidenote"><span class="ref-list"><span class="ref-item"><a href="https://mathworld.wolfram.com/Set.html">https://mathworld.wolfram.com/Set.html</a></span><span class="ref-item"><a href="https://en.wikipedia.org/wiki/Set_theory">https://en.wikipedia.org/wiki/Set_theory</a></span><span class="ref-item"><a href="https://grokipedia.com/page/Set_theory">https://grokipedia.com/page/Set_theory</a></span><span class="ref-item"><a href="https://doi.org/10.1515/9781400830398.615">Princeton Companion to Mathematics §IV.22 Set Theory</a></span></span></span> is a collection of elements from a specified universe of discourse. The collection of everything in the universe of discourse is called the universal set denoted by $\mathscr{U}$ ($\LaTeX$ code: `\mathcal{U}`)

The expression $x \in X$ ($\LaTeX$ code: `\in`) denotes the statement that $x$ is an element of $X$;
we write $x \not\in X$ ($\LaTeX$ code: `\notin`) to mean $\neg(x\in X)$, that is that $x$ is not an element of $X$.

In Lean,

{{#lean SitpLean.Examples}}


```lean
variable {α : Type*}
variable (s t u : Set α)
open Set

example (h : s ⊆ t) : s ∩ u ⊆ t ∩ u := by
  rw [subset_def, inter_def, inter_def]
  rw [subset_def] at h
  simp only [mem_setOf]
  rintro x ⟨xs, xu⟩
  exact ⟨h _ xs, xu⟩

example (h : s ⊆ t) : s ∩ u ⊆ t ∩ u := by
  simp only [subset_def, mem_inter_iff] at *
  rintro x ⟨xs, xu⟩
  exact ⟨h _ xs, xu⟩
```


</div>

<div class="definition" data-title="Definition: Alphabet">

An **alphabet** is a finite, non-empty set, denoted by $\Sigma$ ($\LaTeX$ code: `\Sigma`), $\Delta$ ($\LaTeX$ code: `\Delta`).
The elements of an alphabet $\Sigma$ are referred to as **symbols**,
denoted by $a, b, c$.
</div>

<div class="definition" data-title="Definition: String">

A **string** over an alphabet is any *finite* sequence of symbols.
Strings are made up of symbols from $\Sigma$ and are denoted with $\mathbf{a}=(a1,a2,\cdots,a_t)$ where each $a_i \in \Sigma$.

</div>

> [!NOTE]
> <img class="owl" src="./assets/owl.png" alt="" style="float: left; width: 140px; margin: 0 1em 0.5em 0;"> Because we are dealing with the domain of language, we will denote alphabets of symbols and strings of symbols with $w \in V$ and $\mathbf{s} = (w1,w2,\cdots,w_t), w_i \in V$ respectively rather than $a \in \Sigma$ and $\mathbf{a}=(a1,a2,\cdots,a_t), a_i \in \Sigma$ to denote the fact that our alphabets and strings are modeling **vocabularies** and **sentences** of words within the domain of language. The alphabet and string formalism of formal language theory can be applied to other domains that admit **sequences** of **tokens** i.e biology with protein folding.

<div class="definition" data-title="Definition: Kleene Star">


</div>

<div class="definition" data-title="Definition: Language">


</div>


Chapter 0 deals with formal language theory and set theory as if it were a natural language.

It introduces the “basic words” of the language, suggests how to compose “words” into “sentences,” and appeals to your knowledge of algebra for an intuitive understanding of these “sentences.” While this kind of introduction works to some extent, truly effective communication requires some formal study.


<!-- expert systems were brittle (brick wall. dog tricks)
thus, let's encode all common sense into cyc (minsky once said everyone quit grad school and work on cyc)
but then knowledge aquisition bottleneck
elements of tensor programs with continuous structures and stochastic descriptions
from the tractatus to the investigations is effectively the transition from software 1.0 to sofware 2.0
**however, to understand the claude, we must return to claude**. -->

<!-- So in the next few sections of Chapter 1, we place our focus on probability theory,
which is used to represent uncertainty around non-deterministic — *stochastic* — data
following the principle of **distributional semantics by (Harris 1954) and (Firth 1957)**:
  - [1.2 Distributing Data Stochastically with Probabilities of Probability Spaces]()
  - [1.3 Composing Probabilities with Rules: Sum Rule, Product Rule, and Bayes Rule]()
  - [1.4 Random Variables with their Distributions, Expectations, and Variance]()
  - [1.5 Learning Probabilities from Data with Parameter Estimation via Maximum Likelihood]() -->

<!-- markov, shannon, language models
which will still learn syntactic facts but will be probabilistic
then in the part 2 will be semi-automated semantic sequence learning -->

<!-- compiler/sw1.0: lexical analysis, syntactic analysis, semantic analysis, program synthesis

- phonological analysis/tokenization
- morphological analysis: https://aclanthology.org/W13-3512.pdf
- syntactic analysis: https://aclanthology.org/D14-1082.pdf, https://research.google/blog/announcing-syntaxnet-the-worlds-most-accurate-parser-goes-open-source/
- semantic analysis: https://arxiv.org/pdf/1406.1827, https://nlp.stanford.edu/~socherr/EMNLP2013_RNTN.pdf
- q/a: https://aclanthology.org/D14-1070.pdf,
- translation: https://arxiv.org/abs/1409.3215, https://arxiv.org/pdf/1409.0473, https://aclanthology.org/P16-1100.pdf, https://arxiv.org/abs/1706.03762
- sequence: https://arxiv.org/abs/1810.04805, https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf -->


## C. From Sequential to Parallel Processors