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

print("\n\n--- DATA ---")
import torch
import torch.nn.functional as F
dataset = open('./examples/data/names.txt', 'r').read().splitlines()
D = len(dataset)                            # D is the length of the dataset. N is reserved for the number of examples, in which each di can comprise many of
vocab = sorted(list(set(''.join(dataset)))) # construct vocab
c2i = {c:i+1 for i,c in enumerate(vocab)}   # construct map<char,usize>
c2i['.'] = 0                                # with . as the start token and end token, to remove counting freq of (<E>*) and (*<S>) which are all 0
V = len(c2i)                                # evaluate the vocab len V

xindicesraw, yindicesraw = [], []
for di in dataset:                                                 # change to dataset[:1] when debugging to limit the number of N examples
  di_normalized = ['.'] + list(di) + ['.']                         # normalize each word di
  for x_char,y_char in zip(di_normalized, di_normalized[1:]):      # loop through the (x,y) "self-supervised" bigrams of each word di with zip
    x_index, y_index = c2i[x_char], c2i[y_char]                    # use map<char, usize> to map representation from discrete characters to discrete integers (ords)
    xindicesraw.append(x_index), yindicesraw.append(y_index)       # append

N = len(xindicesraw)
xindices_N, yindices_N = torch.tensor(xindicesraw), torch.tensor(yindicesraw)   # then, convert python lists into torch tensors
print(f'inputs (usize): {xindices_N}'); print(f'outputs (usize): {yindices_N}')

                                                                   # finally, map representation once again from discrete integers to continuous (but local) one hot vectors
x1hots_NV, y1hots_NV = F.one_hot(xindices_N,num_classes=V).float(), F.one_hot(yindices_N,num_classes=V).float()
print(f'inputs (1hot): {x1hots_NV.shape} {x1hots_NV}'); print(f'outputs (1hot): {x1hots_NV.shape} {x1hots_NV}')





print("\n\n--- ARCH ---")
g = torch.Generator().manual_seed(1337+1)                          # avgnll: 3.5 -> 4.9
W_VV = torch.randn((V, V), generator=g, requires_grad=True)        # V neurons

print("\n\n--- TRAINING ---")
K = 100
lr = 50
print(f'{D=}, {N=}, {K=}')
for k in range(K): # gradient descent
  # TRAINING FORWARD {k} --- (including softmax) with N examples from dataset D')
  logits_NV = x1hots_NV @ W_VV                                     # batch matmul print(f'logits_NV: {logits_NV.shape}, {logits_NV}');
  counts_NV = logits_NV.exp()                                      # equivalent to C_VV print(f'counts_NV: {counts_NV.shape}, {counts_NV}')
  probsycondx_NV = counts_NV / counts_NV.sum(dim=1, keepdims=True) # normalize, completing the evaluation of softmax
  # print(f'(forward) probsycondx_NV: {probsycondx_NV.shape}\n {probsycondx_NV}')

                                                                   # vectorized evaluation of loss in TEST section below
  indices_N = torch.arange(N)                                      # in order to evaluate loss of first N examples, use torch.arange(N) NOT xindices_N
  loss = -probsycondx_NV[indices_N, yindices_N].log().mean()       # however we do use yindices_N to find the corresponding likelihood predictions of the *targets*
  print(f'{k=}, {loss=}')                                          # pluck the likelihoods, then eval the log, average it, and take the inverse
                                                                   # ...to get negative log likelihood

  # TRAINING BACKWARD {k} --- (including softmax) with N examples from dataset D')
  W_VV.grad = None                                                 # same as zeroing gradients
  loss.backward()                                                  # eval f'(x)
  # print(f'(backward): {W_VV.grad.shape}, {W_VV.grad}')

  # TRAINING STEP {k} ---\n')
  W_VV.data += -lr*W_VV.grad







print("\n\n--- INFERENCE ---")





print("\n\n--- TEST ---")
i2c = {i:c for c,i in c2i.items()}                               # invert map<char, ord> to map<ord, char> for decoding

# logpD,n = 0.0, 0
# nlls = torch.zeros(N)                                            # replace sum and count tracking for average with .mean() (we won't be pushing logpycondx though only -logpycondx)
# for i in range(N):                                               # loop through the 5 input-outputs (x^(i), y^(i)) of the first word di in dataset
#   xord, yord = xindices_N[i].item(), yindices_N[i].item()        # map (x^(i), y^(i))'s index to ordinal
#   xchar, ychar = i2c[xord], i2c[yord]                            # map (x^(i), y^(i))'s ordinal to char

#   pYcondx_V = probsycondx_NV[i]
#   pycondx_ = pYcondx_V[yord]
#   logpycondx_ = torch.log(pycondx_)
#   nll = -logpycondx_
#   print(f'(x(^{i}),y(^{i})): ({xchar},{ychar}) ---> py(^{i})condx(^{i})hat: {pycondx_:.4f}, logpy(^{i})condx(^{i}): {logpycondx_:.4f}, nll: {nll:.4f}')

#   nlls[i] = nll
  # logpD += logpycondx
  # n += 1

# nllD = nlls.sum()
# avgnllD = nlls.mean()
# print(f'{nllD=}, {avgnllD=}')