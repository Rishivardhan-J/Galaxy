const TAU = Math.PI * 2

// Nearest equivalent of `target` to `current`, so the orbit never spins the long way round.
export function shortestTarget(current: number, target: number): number {
  let d = (target - current) % TAU
  if (d > Math.PI) d -= TAU
  if (d < -Math.PI) d += TAU
  return current + d
}
