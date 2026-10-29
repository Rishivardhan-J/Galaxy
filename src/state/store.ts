import { create } from 'zustand'
import { buildHash, parseHash, type Route } from './route'

export const TRANSITION_MS = 260
export const REDUCED_MS = 120

type Overlay = null | 'brief' | 'palette'

interface State {
  index: number
  direction: 1 | -1
  status: 'idle' | 'transitioning'
  queued: number | null
  transitionStart: number
  hyperAt: number
  overlay: Overlay
  caseStudy: { slug: string; page: number } | null
  selected: string
  reducedMotion: boolean
  wheelTravel: boolean
  sound: boolean
  quality: 0 | 1 | 2
  warps: number
  announce: string
  travel: (target: number) => void
  openCase: (slug: string, page?: number) => void
  closeCase: () => void
  applyRoute: (r: Route) => void
  finish: () => void
  select: (slug: string) => void
  setOverlay: (o: Overlay) => void
  hyperspace: () => void
}

let timer: ReturnType<typeof setTimeout> | undefined

const setHash = (r: Route) => {
  const h = buildHash(r)
  if (typeof location !== 'undefined' && location.hash !== h) location.hash = h
}

export const useStore = create<State>((set, get) => ({
  index: 0,
  direction: 1,
  status: 'idle',
  queued: null,
  transitionStart: 0,
  hyperAt: -1e9,
  overlay: null,
  caseStudy: null,
  selected: 'crime-analytics',
  reducedMotion: false,
  wheelTravel: true,
  sound: false,
  quality: 0,
  warps: 0,
  announce: '',

  travel: (target) => {
    const s = get()
    const t = Math.min(4, Math.max(0, target))
    if (s.status === 'transitioning') {
      // keep at most one queued input
      if (t !== s.index) set({ queued: t })
      return
    }
    if (t === s.index && !s.caseStudy) return
    set({ overlay: null })
    setHash({ index: t })
  },

  openCase: (slug, page = 0) => setHash({ index: 2, slug, page }),
  closeCase: () => setHash({ index: 2 }),

  applyRoute: (r) => {
    const s = get()
    const caseStudy = r.slug ? { slug: r.slug, page: r.page ?? 0 } : null
    if (r.index === s.index) {
      set({ caseStudy, selected: r.slug ?? s.selected })
      return
    }
    clearTimeout(timer)
    const ms = s.reducedMotion ? REDUCED_MS : TRANSITION_MS
    set({
      index: r.index,
      direction: r.index > s.index ? 1 : -1,
      status: 'transitioning',
      transitionStart: performance.now(),
      caseStudy,
      selected: r.slug ?? s.selected,
      warps: s.warps + 1,
    })
    timer = setTimeout(() => get().finish(), ms)
  },

  finish: () => {
    const q = get().queued
    set({ status: 'idle', queued: null })
    if (q !== null && q !== get().index) get().travel(q)
  },

  select: (slug) => set({ selected: slug }),
  setOverlay: (overlay) => set({ overlay }),
  hyperspace: () => set({ hyperAt: performance.now() }),
}))

export const syncFromHash = () => useStore.getState().applyRoute(parseHash(location.hash))
