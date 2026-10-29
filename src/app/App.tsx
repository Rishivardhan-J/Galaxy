import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { Starfield } from '../features/starfield/Starfield'
import { BootSequence, Hud } from '../features/hud/Hud'
import { BottomBar, ProgressLine, TopBar } from '../components/Bars'
import { Launchpad } from '../screens/Launchpad'
import { Origin } from '../screens/Origin'
import { StarSystems } from '../screens/StarSystems'
import { Constellations } from '../screens/Constellations'
import { Transmission } from '../screens/Transmission'
import { STOPS } from '../state/route'
import { syncFromHash, useStore } from '../state/store'
import { startHum, stopHum, whoosh } from '../features/sound/audio'
import { useInput } from './useInput'

const CaseStudyLayer = lazy(() => import('../features/case-study/CaseStudyLayer'))
const BriefOverlay = lazy(() => import('../features/brief/BriefOverlay'))
const CommandPalette = lazy(() => import('../features/palette/CommandPalette'))
const Cursor = lazy(() => import('../features/cursor/Cursor'))

const SCREENS = [Launchpad, Origin, StarSystems, Constellations, Transmission]
const BOOT_KEY = 'galaxy-booted'
const seen = () => { try { return sessionStorage.getItem(BOOT_KEY) === '1' } catch { return true } }

export default function App() {
  const index = useStore((s) => s.index)
  const status = useStore((s) => s.status)
  const overlay = useStore((s) => s.overlay)
  const caseStudy = useStore((s) => s.caseStudy)
  const direction = useStore((s) => s.direction)
  const reduced = useStore((s) => s.reducedMotion)
  const sound = useStore((s) => s.sound)
  const announce = useStore((s) => s.announce)
  const [booting, setBooting] = useState(() => !seen() && !matchMedia('(prefers-reduced-motion: reduce)').matches && !location.hash)
  const [fine] = useState(() => matchMedia('(pointer: fine)').matches)

  useInput()
  useInitState()

  const doneBoot = useCallback(() => { setBooting(false); try { sessionStorage.setItem(BOOT_KEY, '1') } catch { /* private mode */ } }, [])

  // after each transition: title, focus the new heading, live-region announcement
  useEffect(() => {
    if (status !== 'idle' || booting) return
    const label = STOPS[index].title
    document.title = `${label} · Rishivardhan J`
    useStore.setState({ announce: `${label}, stop ${index + 1} of 5` })
    if (!useStore.getState().caseStudy) document.querySelector<HTMLElement>('.screen [data-heading]')?.focus({ preventScroll: true })
  }, [status, index, booting])

  useEffect(() => { document.documentElement.classList.toggle('rm', reduced) }, [reduced])
  useEffect(() => { if (sound) startHum(); else stopHum() }, [sound])
  useEffect(() => { if (sound && status === 'transitioning') whoosh(direction) }, [sound, status, direction])

  const Current = SCREENS[index]
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Starfield />
      <div className="vignette" aria-hidden="true" />
      {booting && <BootSequence onDone={doneBoot} />}
      <div className="app">
        <TopBar />
        <Hud />
        <main className="stage" id="main" aria-label="Portfolio" inert={!!(overlay || caseStudy) || undefined}>
          <p className="sr-only">Background: animated white stars drift in space and streak outward when you travel between sections.</p>
          <AnimatePresence mode="wait" custom={direction}>
            {!booting && <Current key={index} />}
          </AnimatePresence>
        </main>
        <BottomBar />
      </div>
      <ProgressLine />
      <Suspense fallback={null}>
        <AnimatePresence>{caseStudy && <CaseStudyLayer key="cs" cs={caseStudy} />}</AnimatePresence>
        <AnimatePresence>{overlay === 'brief' && <BriefOverlay key="brief" />}</AnimatePresence>
        <AnimatePresence>{overlay === 'palette' && <CommandPalette key="pal" />}</AnimatePresence>
        {fine && !reduced && <Cursor />}
      </Suspense>
      <div className="sr-only" role="status" aria-live="polite">{announce}</div>
    </>
  )
}

function useInitState() {
  useEffect(() => {
    const mq = matchMedia('(prefers-reduced-motion: reduce)')
    useStore.setState({ reducedMotion: mq.matches })
    const onMq = () => useStore.setState({ reducedMotion: mq.matches })
    mq.addEventListener('change', onMq)
    syncFromHash()
    window.addEventListener('hashchange', syncFromHash)
    return () => { mq.removeEventListener('change', onMq); window.removeEventListener('hashchange', syncFromHash) }
  }, [])
}
