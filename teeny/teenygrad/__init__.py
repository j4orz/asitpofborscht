"""
                                                                            ,,  
  mm         Rest in Pure Land Dr. Thomas Zhang ND., R.TCMP, R.Ac.        `7MM  
  MM                                                                        MM  
mmMMmm .gP"Ya   .gP"Ya `7MMpMMMb.`7M'   `MF'.P"Ybmmm `7Mb,od8 ,6"Yb.   ,M""bMM  
  MM  ,M'   Yb ,M'   Yb  MM    MM  VA   ,V :MI  I8     MM' "'8)   MM ,AP    MM  
  MM  8M"""""" 8M""""""  MM    MM   VA ,V   WmmmP"     MM     ,pm9MM 8MI    MM  
  MM  YM.    , YM.    ,  MM    MM    VVV   8M          MM    8M   MM `Mb    MM  
  `Mbmo`Mbmmd'  `Mbmmd'.JMML  JMML.  ,V     YMMMMMb  .JMML.  `Moo9^Yo.`Wbmd"MML.
                                    ,V     6'     dP                            
                                 OOb"      Ybmmmd'
"""
from .frontend import nn
from .frontend import optim
from .frontend.tensor import InterpretedTensor
__all__ = ["optim", "nn", "InterpretedTensor"]

from importlib import import_module as _import_module
eagkers = _import_module("teenygrad.eagkers")
print("importing eagkers. a cpython extension module (binded by pyo3 and built with maturin)")
print(dir(eagkers))