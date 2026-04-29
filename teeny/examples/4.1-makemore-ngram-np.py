# this is an SITP adapted bigram character-level language model taken from karpathy's zero to hero curriculum
# - syllabus: https://karpathy.ai/zero-to-hero.html
# - lecture: https://www.youtube.com/watch?v=PaCmpygFfXo
# - lecture notebook: https://github.com/karpathy/nn-zero-to-hero/blob/master/lectures/makemore/makemore_part1_bigrams.ipynb
# - makemore: https://github.com/karpathy/makemore/blob/master/makemore.py#L399

# We implement a bigram character-level language model,
# which we will further complexify in followup videos into a modern Transformer language model, like GPT.
# In the lecture above, the focus is on (1) introducing torch.Tensor and its subtleties and use in efficiently
# evaluating neural networks and (2) the overall framework of language modeling that includes model training,
# sampling, and the evaluation of a loss (e.g. the negative log likelihood for classification).

dataset = open('./examples/data/names.txt', 'r').read().splitlines()
N = len(dataset)

# Adding some more context to Karpathy's lecture code, the bigram language model is our first software 2.0 "program"
# that describes language probabilistically following the principle of distributional semantics (Harris 1954).
# That is, rather than represent language deterministically with classic GOFAI systems like ELIZA and WordNet,
# the bigram language model represents language stochastically as a random variable Y|X endowed with a conditional probability distribution p(y|x),
# and of course an underlying probability space with the sample space (set of all outcomes) and event space (the set of all possible outocmes).

# Of course, if the stochastic phenomena being described is admits equally likely sample spaces (i.e coin, dice, and cards)
# we can reason, argue, and justify the construction of the associated probability distribution a priori.
# However, it's not so clear what the distribution of *language* is.
# So, we must construct such conditional probabilities *from* data X^(1), X^(2),...,X^(n) by recovering the distribution via *parameter estimation*,
# which is an optimzation problem via maximizing likelihood, which you know from Chapter 2 is equivalent to minimizing empirical risk.

# The goal of the bigram language model is to *recover* such
# autoregressive sequence models (classification likelihood)
# x|y <- (peter abeel/unsupervised/self-supervised)





# ...Histogram (counting frequencies) is the most precise model for training set. it *is* the training set. but it generalizes poorly.
# ...Below, we are building...
conditional_counts_dict = {}
for di in dataset:
  di_normalized = ['<S>'] + list(di) + ['<E>']
  for x_char,y_char in zip(di_normalized, di_normalized[1:]): # here we
    conditional_counts_dict[(x_char,y_char)] = conditional_counts_dict.get((x_char,y_char), 0) + 1
sorted_conditional_counts_dict = sorted(conditional_counts_dict.items(), key = lambda x: -x[1])
# print("2D (char,char) histogram using python's dict:\n", sorted_conditional_counts_dict)




# --- "TRAINING" ---
print("--- TRAINING ---")
# We will now construct the same 2d histogram, but with numpy's ndarray instead of python's dict
import numpy as np # we use numpy rather than torch to emphasize that the bigram model does NOT required any deep learning functionality
vocab = sorted(list(set(''.join(dataset)))) # construct vocab
c2i = {c:i+1 for i,c in enumerate(vocab)}   # construct map<char,ord>
c2i['.'] = 0                                # with . as the start token and end token, to remove counting freq of (<E>*) and (*<S>) which are all 0
V = len(c2i)                                # evaluate the vocab len V
C_VV = np.zeros((V,V), dtype=np.int32)      # and use V to construct C_VV

for di in dataset:
  di_normalized = ['.'] + list(di) + ['.']
  for x_char,y_char in zip(di_normalized, di_normalized[1:]):
    x_index, y_index = c2i[x_char], c2i[y_char] # use map<char, ord> to lookup the coordinate index needed for C_VV
    C_VV[x_index, y_index] += 1                 # update C_VV

# normalize counts C_VV to probs P_VV
C_VVf32 = (C_VV+1).astype(np.float32)    # inductive bias (locally smooth)
s_V1 = C_VVf32.sum(axis=1,keepdims=True) # reduce along axis=1 because we want p(y|x) not p(x|y)
P_VV = C_VVf32 / s_V1                    # (V, V) / (V, 1) broadcasts

# because the data matrix D_VV is 2 dimensional, we can print it.
# the way to semantically interpret the table is that is to first understand which axis of the ndarray represents which semantic information
# for D_VV, the elements are the counts of bigrams (c1,c2) which is acessed by ord(c1) with axis=0 and ord(c2) with axis=2
# now, since numpy's ndarray's are row major order, axis=0 gets printed vertically from up to down while axis=1 gets printed horizontally from left to right  
i2c = {i:c for c,i in c2i.items()}  # invert map<char, ord> to map<ord, char> because looping with enumerate provides access to indices
header = '    ' + ' '.join(f'{i2c[y_index]:>4}' for y_index in range(V))
print("2D (ord, ord) histogram using numpy ndarray")
print(header)
for x_index, row in enumerate(C_VV+1):
  x_char = f'{i2c[x_index]:>4}'
  print(x_char, ' '.join(f'{count:>4}' for count in row))



# --- INFERENCE ---
print("\n\n--- INFERENCE ---")
rng = np.random.default_rng(1337)
sample_count = 10

for _ in range(sample_count):
  output, sample_index = [], 0
  while True:
    # 1. get p(Y|X)
    pYcondX_V = P_VV[sample_index].squeeze()

    # 2. sample p(Y|X)
    sample_index = rng.choice(len(pYcondX_V), size=1, replace=True, p=pYcondX_V)
    sample_char = i2c[sample_index.item()]
    output.append(sample_char)

    # 3. if sampled end token, break
    if sample_index == 0: break
  print(''.join(output))


# --- TEST ---
print("\n\n--- TEST ---")
loglikelihooddataset,n = 0.0, 0
for di in dataset:
  di_normalized = ['.'] + list(di) + ['.']
  for x_char,y_char in zip(di_normalized, di_normalized[1:]):
    x_index, y_index = c2i[x_char], c2i[y_char] # use map<char, ord> to lookup the coordinate index needed for D_VV
    pycondx = P_VV[x_index, y_index] # maximize likelihood
    logpycondx = np.log(pycondx)     # maximize loglikelihood

    loglikelihooddataset += logpycondx
    n += 1
    # print(f'{x_char}{y_char}: {pycondx:.4f} {logpycondx:.4f}')



nlldataset = -loglikelihooddataset   # minimize -loglikelihood
avgnlldataset = nlldataset / n       # minimize -1/n loglikelihood
print(f'{loglikelihooddataset=}')
print(f'{nlldataset=}')
print(f'{avgnlldataset=}')