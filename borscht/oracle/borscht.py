"""Oracle shim: a fake `borscht` that is just torch wearing borscht's name.

Put this directory first on PYTHONPATH and `import borscht` resolves here
instead of to the compiled extension:

    cd borscht
    PYTHONPATH=oracle BORSCHT_STRICT=1 pytest -q     # expect 231 passed

Why this exists
---------------
The suite in python/tests/ is differential -- it asserts that borscht agrees
with torch.  That leaves an obvious hole: a test can be *wrong* (asserting
something torch does not actually do) and nobody notices, because borscht has
not implemented the op yet and the test just skips.

Running the suite against this shim closes that hole.  If a test fails here,
the test is wrong, not borscht.  It is the only gate with teeth while borscht
is still mostly `todo!()`, and it stays useful afterwards as a check on new
tests.

Keep this file a pure re-export.  The moment it contains real logic it stops
being an independent oracle.
"""

from torch import *  # noqa: F403  (tensor ops, dtypes, Tensor itself)

import torch as _t
import torch.nn.functional as _F

# creation / rng
Generator = _t.Generator
tensor, zeros, ones, arange, tril = _t.tensor, _t.zeros, _t.ones, _t.arange, _t.tril
randn, randint, multinomial, topk = _t.randn, _t.randint, _t.multinomial, _t.topk

# movement / indexing / autograd
gather, cat, no_grad = _t.gather, _t.cat, _t.no_grad

# composites that live under torch.nn.functional in torch but are top-level in
# borscht (borscht has no nn namespace -- the notebooks build layers by hand)
softmax, cross_entropy = _F.softmax, _F.cross_entropy
layer_norm, gelu = _F.layer_norm, _F.gelu
