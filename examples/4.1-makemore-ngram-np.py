dataset = open('./examples/data/names.txt', 'r').read().splitlines()
N = len(dataset)

print("--- TRAINING (COUNTING p(w|h) ---")
# Histogram (counting frequencies) is the most precise model for training set. it *is* the training set. but it generalizes poorly.
counts_dict = {}
for di in dataset:
  di_normalized = ['<S>'] + list(di) + ['<E>']
  for h,w in zip(di_normalized, di_normalized[1:]): # in the case of bigrams h is a single character, so we can simply zip
    # print(h, w)
    counts_dict[(h,w)] = counts_dict.get((h,w), 0) + 1
sorted_counts_dict = sorted(counts_dict.items(), key = lambda x: -x[1])
print("2D (w,h) histogram using python's dict:\n", sorted_counts_dict)


# We will now construct the same 2d histogram, but with numpy's ndarray instead of python's dict
# Because numpy's ndarray uses numerical indices to index into, we need to create a dict[str,int]
# so that when we loop over (w,h) pairs within a word we can update the count at the correct location
import numpy as np
vocab = sorted(list(set(''.join(dataset)))) # construct vocab
c2i = {c:i+1 for i,c in enumerate(vocab)}                      # construct map<char,ord>
c2i['.'] = 0                                                                            # with . as the start token and end token, to remove counting freq of (<E>*) and (*<S>) which are all 0
V = len(c2i)                                                                   # evaluate the vocab len V
C_VV = np.zeros((V,V), dtype=np.int32)            # and use V to construct C_VV

# Now we can proceed
for di in dataset:
  di_normalized = ['.'] + list(di) + ['.']
  for h,w in zip(di_normalized, di_normalized[1:]):
    print(h,w)
    h_index, w_index = c2i[h], c2i[w]                                         # use map<char, ord> to lookup the coordinate index needed for C_VV
    C_VV[h_index, w_index] += 1                                                         # update C_VV
print("2D (xt,xt-1) histogram using numpy dict:\n", C_VV)

# normalize counts C_VV to probs P_VV
C_VVf32 = (C_VV+1).astype(np.float32)             # inductive bias (locally smooth)
s_V1 = C_VVf32.sum(axis=1,keepdims=True)                # reduce along axis=1 because we want p(y|x) not p(x|y)
P_VV = C_VVf32 / s_V1                                                                   # (V, V) / (V, 1) broadcasts

# for P_VV, the elements are the counts of bigrams (h,w) accessed by indexing with ord(h) at axis=0 and ord(w) at axis=1
# now, since numpy's ndarray's are row major order, axis=0 gets printed vertically from up to down while axis=1 gets printed horizontally from left to right
i2c = {i:c for c,i in c2i.items()}  # invert map<char, ord> to map<ord, char> because looping with enumerate provides access to indices
header = '    ' + ' '.join(f'{i2c[y_index]:>4}' for y_index in range(V))
print("2D (ord, ord) histogram using numpy ndarray")
print(header)
for w_index, row in enumerate(C_VV+1):
  h = f'{i2c[w_index]:>4}'
  print(h, ' '.join(f'{count:>4}' for count in row))



print("\n\n--- INFERENCE (GENERATING a name by 1. evaluating p(W=w|H=h), appending, and repeating ---")
rng = np.random.default_rng(1337)
sample_count = 10

for _ in range(sample_count):
  output, h = [], 0
  while True:
    # 1. evaluate p(W=w|h)
    pWcondH_V = P_VV[h].squeeze()

    # 2. sampling
    h = rng.choice(len(pWcondH_V), size=1, replace=True, p=pWcondH_V)
    sample_char = i2c[h.item()]

    # 3. appending the sample to history
    output.append (sample_char)
    if h == 0: break
  print(''.join(output))


loglikelihooddataset,n = 0.0, 0
for di in dataset:
  di_normalized = ['.'] + list(di) + ['.']
  for h,w in zip(di_normalized, di_normalized[1:]):
    w_index, h_index = c2i[h], c2i[w] # use map<char, ord> to lookup the coordinate index needed for P_VV
    pycondx = P_VV[w_index, h_index] # maximize likelihood
    logpycondx = np.log(pycondx)     # maximize loglikelihood

    loglikelihooddataset += logpycondx
    n += 1
    # print(f'{x_char}{y_char}: {pycondx:.4f} {logpycondx:.4f}')



nlldataset = -loglikelihooddataset   # minimize -loglikelihood
avgnlldataset = nlldataset / n       # minimize -1/n loglikelihood
print(f'{loglikelihooddataset=}')
print(f'{nlldataset=}')
print(f'{avgnlldataset=}')