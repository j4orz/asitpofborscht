#check 9 + 10
#eval 9 + 10
#eval String.append "Hello, " "World!"

#check 9 + 10

namespace IntermezzoOne

inductive Nat where
  | zero: Nat
  | succ: Nat → Nat

instance Nat.instZero : Zero Nat := ⟨ zero ⟩

#check (0:Nat)

theorem Nat.succ_ne (n:Nat) : Nat.succ n ≠ 0 := sorry

theorem Nat.four_ne (n:Nat) : (Nat.succ (Nat.succ (Nat.succ (Nat.succ 0 : Nat)))) ≠ 0 := sorry


-- /-- Doubles a natural number. -/
-- def double (n : Nat) : Nat := n + n

-- theorem double_eq (n : Nat) : double n = 2 * n := by
--   simp [double, Nat.two_mul]

-- #check And
-- #check Or
-- #check Or

-- #eval double 21
