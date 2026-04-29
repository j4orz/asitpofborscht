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

print("--- DATA ---")
import torch
import torch.nn.functional as F
dataset = open('./examples/data/names.txt', 'r').read().splitlines()
N = len(dataset)
vocab = sorted(list(set(''.join(dataset)))) # construct vocab
c2i = {c:i+1 for i,c in enumerate(vocab)}   # construct map<char,ord>
c2i['.'] = 0                                # with . as the start token and end token, to remove counting freq of (<E>*) and (*<S>) which are all 0
V = len(c2i)                                # evaluate the vocab len V

xsordpy, ysordpy = [], []
for di in dataset[:1]:
  di_normalized = ['.'] + list(di) + ['.']                              # normalize each word di
  for x_char,y_char in zip(di_normalized, di_normalized[1:]):           # loop through the (x,y) "self-supervised" bigrams of each word di with zip
    x_index, y_index = c2i[x_char], c2i[y_char]                         # use map<char, ord> to map representation from discrete characters to discrete integers (ords)
    xsordpy.append(x_index), ysordpy.append(y_index)                    # append

xsordtorch, ysordtorch = torch.tensor(xsordpy), torch.tensor(ysordpy)   # then, convert python lists into torch tensors
print(f'inputs (ord): {xsordtorch}')
print(f'outputs (ord): {ysordtorch}')

                                                                        # finally, map representation once again from discrete integers to continuous (but local) one hot vectors
xshot_NV, yshot_NV = F.one_hot(xsordtorch,num_classes=V).float(), F.one_hot(ysordtorch,num_classes=V).float()
print(f'inputs (1hot): {xshot_NV.shape} {xshot_NV}')
print(f'outputs (1hot): {xshot_NV.shape} {xshot_NV}')





# --- "ARCH" ---
print("--- ARCH ---")
g = torch.Generator().manual_seed(1337+1)                        # avgnll: 3.5 -> 4.9
W_VV = torch.randn((V, V), generator=g)                          # V neurons
logits_NV = xshot_NV @ W_VV                                      # batch matmul
counts_NV = logits_NV.exp()                                      # equivalent to C_VV
probsycondx_NV = counts_NV / counts_NV.sum(dim=1, keepdims=True) # normalize, completing the evaluation of softmax
# print(f'logits_NV: {logits_NV.shape}, {logits_NV}')
# print(f'counts_NV: {counts_NV.shape}, {counts_NV}')
print(f'probs_NV: {probsycondx_NV.shape}, {probsycondx_NV}')

print("--- ARCH UNTRAINED ---")
i2c = {i:c for c,i in c2i.items()}                               # invert map<char, ord> to map<ord, char> for decoding

# logpD,n = 0.0, 0
nlls = torch.zeros(5)                                            # replace sum and count tracking for average with .mean() (we won't be pushing logpycondx though only -logpycondx)
for i in range(5):                                               # loop through the 5 input-outputs (x^(i), y^(i)) of the first word di in dataset
  xord, yord = xsordtorch[i].item(), ysordtorch[i].item()        # map (x^(i), y^(i))'s index to ordinal
  xchar, ychar = i2c[xord], i2c[yord]                            # map (x^(i), y^(i))'s ordinal to char

  pYcondx_V = probsycondx_NV[i]
  pycondx = pYcondx_V[yord]
  logpycondx = torch.log(pycondx)
  nll = -logpycondx
  print(f'(x(^{i}),y(^{i})): ({xchar},{ychar}) ---> py(^{i})condx(^{i})hat: {pycondx:.4f}, logpy(^{i})condx(^{i}): {logpycondx:.4f}, nll: {nll:.4f}')

  nlls[i] = nll
  # logpD += logpycondx
  # n += 1

nllD = nlls.sum()
avgnllD = nlls.mean()
print(f'{nllD=}, {avgnllD=}')





# --- "TRAINING" ---
print("--- TRAINING ---")





# --- INFERENCE ---
print("\n\n--- INFERENCE ---")


# --- TEST ---
print("\n\n--- TEST ---")
# loglikelihooddataset,n = 0.0, 0
# for di in dataset[:3]:
#   di_normalized = ['.'] + list(di) + ['.']
#   for x_char,y_char in zip(di_normalized, di_normalized[1:]):
#     x_index, y_index = c2i[x_char], c2i[y_char] # use map<char, ord> to lookup the coordinate index needed for D_VV
#     pycondx = P_VV[x_index, y_index]
#     logpycondx = torch.log(pycondx)

#     loglikelihooddataset += logpycondx
#     n += 1
#     # print(f'{x_char}{y_char}: {pycondx:.4f} {logpycondx:.4f}')

# # maximize likelihood
# # maximize loglikelihood
# # minimize -loglikelihood
# # minimize -1/n loglikelihood
# nlldataset = -loglikelihooddataset
# avgnlldataset = nlldataset / n
# print(f'{loglikelihooddataset=}')
# print(f'{nlldataset=}')
# print(f'{avgnlldataset=}')