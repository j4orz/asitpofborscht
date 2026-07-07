/-- Doubles a natural number. -/
def double (n : Nat) : Nat := n + n

theorem double_eq (n : Nat) : double n = 2 * n := by
  simp [double, Nat.two_mul]

#eval double 21
