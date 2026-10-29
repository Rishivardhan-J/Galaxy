import { describe, expect, it } from 'vitest'
import { fuzzy } from './fuzzy'

describe('fuzzy', () => {
  it('matches subsequences and rejects others', () => {
    expect(fuzzy('cns', 'Constellations')).toBeGreaterThan(0)
    expect(fuzzy('zzz', 'Constellations')).toBe(-1)
  })
  it('prefers tighter matches', () => {
    expect(fuzzy('tran', 'Transit')).toBeGreaterThan(fuzzy('tran', 'Star Navigation'))
  })
  it('empty query matches everything', () => expect(fuzzy('', 'x')).toBe(0))
})
