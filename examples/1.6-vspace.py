import numpy as np
from jaxtyping import Float, jaxtyped
from beartype import beartype

# GloVe 6B 50d vectors for a small vocabulary (extracted from the pre-trained model)
dict_string2dist: dict[str, np.ndarray] = {
  "king":    np.array([ 0.50451,  0.68607, -0.59517, -0.02280,  0.60046, -0.13498, -0.08813,  0.47377, -0.61798, -0.31012, -0.07667,  1.49300, -0.03419, -0.98173,  0.68229,  0.81722, -0.51874, -0.31503, -0.55809,  0.66421,  0.19610, -0.13495, -0.11476, -0.30344,  0.41177, -2.22300, -1.07560, -1.07830, -0.34354,  0.33505,  1.99270, -0.04234, -0.64319,  0.71125,  0.49159,  0.16754,  0.34344, -0.25663, -0.85230,  0.16610,  0.40102,  1.16850, -1.01370, -0.21585, -0.15155,  0.78321, -0.91241, -1.61060, -0.64426, -0.51042], dtype=np.float32),
  "queen":   np.array([ 0.37854,  1.82330, -1.26480, -0.10430,  0.35829,  0.60029, -0.17538,  0.83767, -0.05680, -0.75795,  0.22681,  0.98587,  0.60587, -0.31419,  0.28877,  0.56013, -0.77456,  0.07142, -0.57410,  0.21342,  0.57674,  0.38680, -0.12574,  0.28012,  0.28135, -1.80530, -1.04210, -0.19255, -0.55375, -0.05453,  1.55740,  0.39296, -0.24750,  0.34251,  0.45365,  0.16237,  0.52464, -0.07027, -0.83744, -1.03260,  0.45946,  0.25302, -0.17837, -0.73398, -0.20025,  0.23470, -0.56095, -2.28390,  0.00928, -0.60284], dtype=np.float32),
  "man":     np.array([-0.09439,  0.43007, -0.17224, -0.45529,  1.64470,  0.40335, -0.37263,  0.25071, -0.10588,  0.10778, -0.10848,  0.15181, -0.65396,  0.55054,  0.59591, -0.46278,  0.11847,  0.64448, -0.70948,  0.23947, -0.82905,  1.27200,  0.03302,  0.29350,  0.39110, -2.80940, -0.70745,  0.41060,  0.38940, -0.29130,  2.61240, -0.34576, -0.16832,  0.25154,  0.31216,  0.31639,  0.12539, -0.01265,  0.22297, -0.56585, -0.08626,  0.62549, -0.05760,  0.29375,  0.66005, -0.53115, -0.48233, -0.97925,  0.53135, -0.11725], dtype=np.float32),
  "woman":   np.array([-0.18153,  0.64827, -0.58210, -0.49451,  1.54150,  1.34500, -0.43305,  0.58059,  0.35556, -0.25184,  0.20254, -0.71643,  0.30610,  0.56127,  0.83928, -0.38085, -0.90875,  0.43326, -0.01444,  0.23725, -0.53799,  1.77730, -0.06643,  0.69795,  0.69291, -2.67390, -0.76805,  0.33929,  0.19695, -0.35245,  2.29200, -0.27411, -0.30169,  0.00085,  0.16923,  0.09143, -0.02361,  0.03624,  0.34488, -0.83947, -0.25174,  0.42123,  0.48616,  0.02232,  0.55760, -0.85223, -0.23073, -1.31380,  0.48764, -0.10467], dtype=np.float32),
  "paris":   np.array([ 0.76989,  1.18100, -1.12990, -0.74725, -0.59690, -1.05180, -0.46552,  0.27009, -0.99243, -0.04864,  0.28642, -0.75261, -1.05660, -0.19205,  0.57200, -0.24391, -0.36054, -0.70876, -0.91951, -0.27024,  1.51310,  1.03130, -0.55713,  0.52952, -0.71494, -1.09490, -0.60565,  0.31329, -0.44488,  0.55915,  2.14290,  0.43389, -0.55290, -0.24261, -0.43679, -0.96014,  0.25828,  0.79385,  0.37132,  0.49623,  0.84359, -0.25875,  1.56160, -1.11990,  0.09168,  0.07667, -0.45084, -0.86104,  0.97599, -0.35615], dtype=np.float32),
  "france":  np.array([ 0.66571,  0.29845, -1.04670, -0.66932, -0.78082, -0.00013, -0.17931,  0.37110, -0.18622, -0.40535,  0.98644, -0.60545, -0.94571, -0.69207,  0.56681, -0.38610,  0.02763, -1.24640, -0.73561, -0.52222, -0.06177,  0.16771, -0.37462,  0.42250, -0.63095, -1.63600, -0.25094,  0.04495, -0.39758,  0.98099,  2.62930,  0.83480, -0.77338,  0.39402, -0.57976, -1.02900, -0.26709,  0.98714, -0.51029, -0.42477,  1.39560, -0.02935,  2.22950, -1.70790,  0.02556,  0.69060, -0.57900, -0.17824,  0.42916, -0.53940], dtype=np.float32),
  "rome":    np.array([ 1.73280,  0.74491, -0.90946, -0.61916,  0.11515, -1.35280, -0.04493,  0.15027, -1.23330, -0.08556, -0.08827, -0.29123, -0.65817, -0.53225,  1.10050, -0.51414, -0.78475, -0.30087, -0.55898,  0.93097,  0.04599, -0.07754, -0.66556,  0.37530,  0.00249, -1.26410,  0.07802, -0.12052, -1.02920, -0.04742,  1.77110,  0.28545, -0.48243, -0.50638, -0.70630, -0.06720,  0.49704,  0.95463, -0.30081,  0.62246,  0.44981,  0.00454,  0.52488, -0.23153, -0.32818,  0.80113, -0.48159, -0.58455, -0.11393, -0.82938], dtype=np.float32),
  "italy":   np.array([ 1.77040, -0.77758, -0.95302,  0.32900,  0.04039, -0.08635, -0.09633, -0.14525, -0.85415, -0.09132,  0.71825, -0.83780, -0.71724, -0.30078,  1.25880, -0.72728, -0.26415, -0.17469, -0.57705,  0.33500, -0.51533, -0.43223, -0.80174,  0.94644,  0.00984, -1.32640,  0.59604, -0.12843, -1.01870,  0.25605,  2.60860,  0.87975, -0.30444,  0.31701, -0.66136, -0.15968, -0.28717,  1.44860, -0.60170, -0.64794,  0.37924,  0.18643,  1.27290, -1.22070, -0.20923,  1.19480, -0.18000, -0.35325,  0.44488, -0.83675], dtype=np.float32),
  "cat":     np.array([ 0.45281, -0.50108, -0.53714, -0.01570,  0.22191,  0.54602, -0.67301, -0.68910,  0.63493, -0.19726,  0.33685,  0.77350,  0.90094,  0.38488,  0.38367,  0.26570, -0.08057,  0.61089, -1.28940, -0.22313, -0.61578,  0.21697,  0.35614,  0.44499,  0.60885, -1.16330, -1.15790,  0.36118,  0.10466, -0.78325,  1.43520,  0.18629, -0.26112,  0.83275, -0.23123,  0.32481,  0.14485, -0.44552,  0.33497, -0.95946, -0.09748,  0.48138, -0.43352,  0.69455,  0.91043, -0.28173,  0.41637, -1.26090,  0.71278,  0.23782], dtype=np.float32),
  "dog":     np.array([ 0.11008, -0.38781, -0.57615, -0.27714,  0.70521,  0.53994, -1.07860, -0.40146,  1.15040, -0.56780,  0.00390,  0.52878,  0.64561,  0.47262,  0.48549, -0.18407,  0.18010,  0.91397, -1.19790, -0.57780, -0.37985,  0.33606,  0.77200,  0.75555,  0.45506, -1.76710, -1.05030,  0.42566,  0.41893, -0.68327,  1.56730,  0.27685, -0.61708,  0.64638, -0.07700,  0.37118,  0.13080, -0.45137,  0.25398, -0.74392, -0.08620,  0.24068, -0.64819,  0.83549,  1.25020, -0.51379,  0.04224, -0.88118,  0.71580,  0.38519], dtype=np.float32),
  "table":   np.array([-0.36661,  1.05840, -0.65378,  0.17674,  1.06050, -0.72541, -0.00972,  0.07969, -0.46490, -0.74347, -0.64147, -0.16837, -0.48926,  0.56673,  0.73102,  0.18387,  0.34366, -0.19158,  0.06605, -1.34340,  0.50813, -0.21998,  0.46182,  0.65796, -0.19109, -0.64280, -0.14994,  0.74716, -0.23347, -0.16557,  2.85930,  0.60577, -0.63465,  0.45448,  0.14856,  0.53445,  0.27442,  1.01040,  0.07951, -0.44915,  0.46796, -0.49001, -0.20323,  0.65496,  0.16845,  0.50674,  0.62557,  0.07134,  0.61898, -0.99744], dtype=np.float32),
  "actor":   np.array([-0.66174,  1.02000, -0.17757, -0.31617,  0.64970,  1.21230, -0.29988, -0.29923, -0.98751,  1.01280, -0.03405,  0.84036, -0.27772,  0.88494,  1.13280, -0.53964,  0.73731,  0.78316, -1.09730,  0.28425, -0.07298,  1.32130,  0.09270,  0.52691,  0.45766, -1.37440, -0.40462, -0.46926, -0.71024,  0.25893,  1.62280, -0.32048,  0.62823, -0.44291,  0.81836,  0.51277,  0.23652, -0.01136, -0.47835, -0.91881,  0.09903,  2.23040, -0.34550, -1.18170, -0.64932, -0.71242, -0.27322, -1.08920, -0.32238,  1.31010], dtype=np.float32),
  "actress": np.array([-0.50281,  1.36020, -0.79567,  0.17978,  0.30326,  2.00340, -0.29183, -0.13314, -0.22833,  0.74604,  0.29479,  0.05811,  0.08072,  0.60262,  1.38970, -0.49205, -0.12020,  0.46184, -0.25282,  0.60568,  0.10240,  2.16390,  0.52841,  0.73382,  0.68283, -1.20000, -0.59849, -0.15926, -1.11450, -0.49408,  1.14920,  0.23280,  0.85071, -0.28973,  0.60732, -0.05194, -0.14617,  0.34957, -0.50612, -1.56820, -0.07875,  1.73790,  0.46563, -1.99100, -0.69053, -1.06090, -0.37481, -1.71300, -0.14678,  0.94823], dtype=np.float32),
}

vocab = list(dict_string2dist.keys())
N = len(vocab)



# f: produces distributional embedding representations in R^D given localist one-hot representation in R^N
@jaxtyped(typechecker=beartype)
def f(x_N: Float[np.ndarray, "N"]) -> Float[np.ndarray, "D"]:
  # E_DV = np.stack([dict_string2dist[i] for i in vocab], axis=1)
  E_ND = np.stack([dict_string2dist[i] for i in vocab])
  y_D = E_ND.T @ x_N
  return y_D

xonehot_N = np.eye(N)[vocab.index("man")] # row-wise plucking basis vector from identity matrix I
yembedding_D = f(xonehot_N)
print("xonehot_N.shape", xonehot_N.shape)
print("xonehot_N.storage", xonehot_N)
print("f(xonehot_N) => yembedding_D.shape", yembedding_D.shape)
print("f(xonehot_N) => yembedding_D.storage", yembedding_D)
assert np.allclose(yembedding_D, dict_string2dist["man"])
print("\n\n")



# f_batched: produces batched distributional embedding representations in R^{BxD} given batched localist one-hot representation in R^{BxN}
@jaxtyped(typechecker=beartype)
def f_batched(X_BN: Float[np.ndarray, "B N"]) -> Float[np.ndarray, "B D"]:
  E_ND = np.stack([dict_string2dist[i] for i in vocab])
  y_BD = X_BN @ E_ND 
  return y_BD

Xonehot_BN = np.eye(N)[[vocab.index("king"), vocab.index("man"), vocab.index("woman")]]
Yembedding_BD = f_batched(Xonehot_BN)

print("Xonehot_BN.shape", Xonehot_BN.shape)
print("Xonehot_BN.storage", Xonehot_BN)
print("f_batched(Xonehot_BN) = Yembedding_3D.shape", Yembedding_BD.shape)
print("f_batched(Xonehot_BN) = Yembedding_3D.storage", Yembedding_BD)
assert np.allclose(Yembedding_BD[0], dict_string2dist["king"])
assert np.allclose(Yembedding_BD[1], dict_string2dist["man"])
assert np.allclose(Yembedding_BD[2], dict_string2dist["woman"])







@jaxtyped(typechecker=beartype)
def cosine(u_D: Float[np.ndarray, "D"], v_D: Float[np.ndarray, "D"]) -> float:
  return float(np.dot(u_D, v_D) / (np.linalg.norm(u_D) * np.linalg.norm(v_D)))

@jaxtyped(typechecker=beartype)
def nearest(target_D: Float[np.ndarray, "D"], exclude: tuple[str, ...] = ()) -> list[str]:
  scores = {w: cosine(target_D, dict_string2dist[w]) for w in vocab if w not in exclude}
  return sorted(scores, key=scores.get, reverse=True)[:3]

# --- represent/encode word meaning with coordinates of R^50 (mathematically vectors)
xqueen_D = dict_string2dist["king"] - dict_string2dist["man"] + dict_string2dist["woman"] # king - man + woman ≈ queen: the relationship "royalty" is a direction
xrome_D = dict_string2dist["paris"] - dict_string2dist["france"] + dict_string2dist["italy"] # paris - france + italy ≈ rome: capital-of is a consistent offset

print("nearest", nearest(xqueen_D, exclude=("king", "man", "woman")))  # ['queen', ...]
print(nearest(xrome_D, exclude=("paris", "france", "italy")))  # ['rome', ...]
# -----------------------------------------------------------------------------------
# -----------------------------------------------------------------------------------
# --- linear combinations ---
# any weighted sum of vectors is a linear combination: c0*v0 + c1*v1 + c2*v2
c_3 = np.array([1.0, -1.0, 1.0])
X_3D = np.stack([dict_string2dist["king"], dict_string2dist["man"], dict_string2dist["woman"]])  # (3, 50)
xqueen_D = c_3 @ X_3D  # (3,) @ (3, 50) → (50,)
print("xqueen_D.shape", xqueen_D.shape)
print("linear combination nearest:", nearest(xqueen_D, exclude=("king", "man", "woman")))  # queen

# midpoint: equal weight on man and woman → "generic human", equidistant from both
xhuman_D = 0.5 * dict_string2dist["man"] + 0.5 * dict_string2dist["woman"]
print("midpoint nearest:", nearest(xhuman_D))  # man and woman should top the list
# -----------------------------------------------------------------------------------



# -----------------------------------------------------------------------------------
# --- span ---
# is queen in the span of {king, man, woman}?
# find least-squares coefficients: queen ≈ c0*king + c1*man + c2*woman
A_D3 = np.stack([dict_string2dist["king"], dict_string2dist["man"], dict_string2dist["woman"]]).T  # (50, 3)
cqueen_3, _, _, _ = np.linalg.lstsq(A_D3, dict_string2dist["queen"], rcond=None)
xqueenapprox_D = A_D3 @ cqueen_3
print("cqueen_3.shape", cqueen_3.shape, "cqueen_3", cqueen_3)  # near (+1, -1, +1)
print("queen residual norm:", np.linalg.norm(dict_string2dist["queen"] - xqueenapprox_D))  # small

# is table in the span of {cat, dog}? (unrelated subspace — residual should be large)
A_D2 = np.stack([dict_string2dist["cat"], dict_string2dist["dog"]]).T  # (50, 2)
ctable_2, _, _, _ = np.linalg.lstsq(A_D2, dict_string2dist["table"], rcond=None)
xtableapprox_D = A_D2 @ ctable_2
print("table residual norm:", np.linalg.norm(dict_string2dist["table"] - xtableapprox_D))  # large

assert np.linalg.norm(dict_string2dist["queen"] - xqueenapprox_D) < np.linalg.norm(dict_string2dist["table"] - xtableapprox_D)
# -----------------------------------------------------------------------------------


def vec(word):
    return wv[word]

def cosine(u, v):
    return float(np.dot(u, v) / (np.linalg.norm(u) * np.linalg.norm(v)))

def nearest(target, exclude=()):
    scores = {w: cosine(target, vec(w)) for w in VOCAB if w not in exclude}
    return sorted(scores, key=scores.get, reverse=True)[:3]


# --- 4. Cosine similarity (analytic geometry with inner product spaces and normed spaces) ---
import torch
# similar words have vectors pointing in the same direction
print(cosine(vec("cat"), vec("dog")))    # high ~0.92
print(cosine(vec("cat"), vec("table"))) # low  ~0.31

# determinant: scalar measure of how much A scales volume
print(torch.linalg.det(A))

# rank: number of linearly independent rows/columns
B = torch.tensor([[1.0, 2.0, 3.0],
                  [2.0, 4.0, 6.0],  # linearly dependent row
                  [0.0, 1.0, 0.0]])
print(torch.linalg.matrix_rank(B))  # 2, not 3
u = torch.tensor([1.0, 2.0, 3.0])
v = torch.tensor([4.0, 5.0, 6.0])

# inner product: u·v = sum of elementwise products
print(u @ v)               # 32.0
print((u * v).sum())       # same

# L2 norm: length/magnitude of a vector
print(torch.linalg.norm(u))          # sqrt(1+4+9) = 3.742
print(torch.linalg.norm(u, ord=2))   # same

# L1 norm: sum of absolute values
print(torch.linalg.norm(u, ord=1))   # 1+2+3 = 6.0

# distance: L2 norm of the difference
print(torch.linalg.norm(u - v))      # Euclidean distance

# angle between vectors via cosine similarity
cos_theta = (u @ v) / (torch.linalg.norm(u) * torch.linalg.norm(v))
theta = torch.acos(cos_theta)
print(cos_theta)   # ~0.9746
print(theta)       # ~0.2257 radians (~12.9 degrees)

# projection of u onto v: scalar and vector forms
scalar_proj = (u @ v) / torch.linalg.norm(v)         # length of shadow
vector_proj = scalar_proj * (v / torch.linalg.norm(v))  # shadow as vector
print(scalar_proj)
print(vector_proj)