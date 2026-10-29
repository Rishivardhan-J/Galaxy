import { describe, expect, it } from 'vitest'
import { shortestTarget } from './angle'

describe('shortestTarget', () => {
  it('takes the short way across the wrap', () => {
    const step = (Math.PI * 2) / 6
    expect(shortestTarget(5 * step, 0)).toBeCloseTo(6 * step) // 5 → 0 goes forward one step
    expect(shortestTarget(0, 5 * step)).toBeCloseTo(-step) // 0 → 5 goes back one step
  })
  it('is a no-op when already there', () => expect(shortestTarget(1.2, 1.2)).toBeCloseTo(1.2))
})
