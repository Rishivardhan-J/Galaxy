import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useStore } from './store'
import { buildHash, parseHash } from './route'

describe('route', () => {
  it('parses stops and defaults to launchpad', () => {
    expect(parseHash('').index).toBe(0)
    expect(parseHash('#constellations').index).toBe(3)
    expect(parseHash('#bogus').index).toBe(0)
  })
  it('parses case studies', () => {
    expect(parseHash('#star-systems/crime-analytics/architecture')).toEqual({ index: 2, slug: 'crime-analytics', page: 2 })
    expect(parseHash('#star-systems/nope')).toEqual({ index: 2 })
  })
  it('round-trips', () => {
    const r = { index: 2, slug: 'transit', page: 3 }
    expect(parseHash(buildHash(r))).toEqual(r)
  })
})

describe('store', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    useStore.setState({ index: 0, status: 'idle', queued: null, caseStudy: null })
    location.hash = ''
  })
  it('locks input while transitioning and keeps one queued target', () => {
    const s = useStore.getState()
    s.applyRoute({ index: 1 })
    expect(useStore.getState().status).toBe('transitioning')
    s.travel(3)
    s.travel(4)
    expect(useStore.getState().queued).toBe(4)
    expect(useStore.getState().index).toBe(1)
  })
  it('sets direction and unlocks after the transition', () => {
    useStore.getState().applyRoute({ index: 3 })
    expect(useStore.getState().direction).toBe(1)
    vi.advanceTimersByTime(700)
    expect(useStore.getState().status).toBe('idle')
    useStore.getState().applyRoute({ index: 1 })
    expect(useStore.getState().direction).toBe(-1)
  })
})
