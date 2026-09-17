import Mathlib.Algebra.Field.Basic

variable {F : Type*} [Field F] {n : ℕ}

example (α : F) (m n : ℕ) : (α ^ m) ^ n = α ^ (m * n) := (pow_mul α m n).symm
example (α β : F) (m : ℕ) : (α * β) ^ m = α ^ m * β ^ m := mul_pow α β m
