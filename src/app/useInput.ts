import { useEffect } from 'react'
import { CASE_PAGES, getProject } from '../content/projects'
import { useStore } from '../state/store'

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
const typing = (t: EventTarget | null) => t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))

export function useInput() {
  useEffect(() => {
    let seq: string[] = []
    let wheelLock = 0

    const onKey = (e: KeyboardEvent) => {
      const s = useStore.getState()
      if (s.phase !== 'site') return
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); s.setOverlay(s.overlay === 'palette' ? null : 'palette'); return }
      if (e.metaKey || e.ctrlKey || e.altKey || typing(e.target)) return
      if (s.overlay === 'palette') return
      if (e.key === 'Escape') {
        if (s.overlay) s.setOverlay(null)
        else if (s.caseStudy) s.closeCase()
        return
      }
      seq = [...seq, e.key.length === 1 ? e.key.toLowerCase() : e.key].slice(-KONAMI.length)
      if (seq.join() === KONAMI.join()) { s.hyperspace(); seq = []; return }
      if (s.overlay === 'brief') return
      if (e.key === 'b') { s.setOverlay('brief'); return }
      if (e.key === '/') { e.preventDefault(); s.setOverlay('palette'); return }
      if (/^[1-5]$/.test(e.key)) { s.travel(Number(e.key) - 1); return }
      const fwd = e.key === 'ArrowRight' || e.key === 'ArrowDown'
      const back = e.key === 'ArrowLeft' || e.key === 'ArrowUp'
      if (!fwd && !back) return
      if (s.caseStudy) {
        const total = getProject(s.caseStudy.slug) ? CASE_PAGES.length : 1
        const next = s.caseStudy.page + (fwd ? 1 : -1)
        if (next >= 0 && next < total) { e.preventDefault(); s.openCase(s.caseStudy.slug, next) }
        return
      }
      if (e.target instanceof HTMLElement && e.target.closest('.scroll-panel') && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) return
      e.preventDefault()
      s.travel(s.index + (fwd ? 1 : -1))
    }

    const onWheel = (e: WheelEvent) => {
      const s = useStore.getState()
      if (s.phase !== 'site') return
      if (!s.wheelTravel || s.overlay || s.caseStudy || !matchMedia('(pointer: fine)').matches) return
      if ((e.target as HTMLElement).closest?.('.scroll-panel')) return
      const now = performance.now()
      if (Math.abs(e.deltaY) < 30 || now < wheelLock) return
      wheelLock = now + 1000
      s.travel(s.index + (e.deltaY > 0 ? 1 : -1))
    }

    let sx = 0, sy = 0
    const onStart = (e: TouchEvent) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY }
    const onEnd = (e: TouchEvent) => {
      const s = useStore.getState()
      if (s.overlay || s.phase !== 'site') return
      const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy
      const horiz = Math.abs(dx) > Math.abs(dy)
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 60) return
      if (!horiz && (e.target as HTMLElement).closest?.('.scroll-panel')) return
      if (horiz && (e.target as HTMLElement).closest?.('.h-scroll')) return
      const fwd = horiz ? dx < 0 : dy < 0
      if (s.caseStudy) {
        const next = s.caseStudy.page + (fwd ? 1 : -1)
        if (horiz && next >= 0 && next < CASE_PAGES.length) s.openCase(s.caseStudy.slug, next)
        return
      }
      s.travel(s.index + (fwd ? 1 : -1))
    }

    window.addEventListener('keydown', onKey)
    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('touchstart', onStart, { passive: true })
    window.addEventListener('touchend', onEnd, { passive: true })
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onStart)
      window.removeEventListener('touchend', onEnd)
    }
  }, [])
}
