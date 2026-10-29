import { useEffect, useState } from 'react'
import { animate } from 'motion/react'
import { Item, Screen } from '../components/Motion'
import { SplitText } from '../components/SplitText'
import { launchStats, profile, roleCycle } from '../content/profile'
import { HeroSystem } from '../features/planet/HeroSystem'
import { useStore } from '../state/store'

function Count({ to, suffix }: { to: number; suffix: string }) {
  const reduced = useStore((s) => s.reducedMotion)
  const [v, setV] = useState(reduced ? to : 0)
  useEffect(() => {
    if (reduced) { setV(to); return }
    const c = animate(0, to, { duration: 1.2, ease: 'easeOut', delay: 0.4, onUpdate: (n) => setV(Math.round(n)) })
    return () => c.stop()
  }, [to, reduced])
  return <>{v}{suffix}</>
}

function Role() {
  const reduced = useStore((s) => s.reducedMotion)
  const [i, setI] = useState(0)
  useEffect(() => {
    if (reduced) return
    const t = setInterval(() => setI((n) => (n + 1) % roleCycle.length), 3800)
    return () => clearInterval(t)
  }, [reduced])
  return (
    <p className="role">
      <span className="sr-only">{profile.role}</span>
      <span key={i} className="role-cycle" aria-hidden="true">{roleCycle[reduced ? 0 : i]}</span>
    </p>
  )
}

export function Launchpad() {
  const travel = useStore((s) => s.travel)
  const setOverlay = useStore((s) => s.setOverlay)
  const size = typeof window !== 'undefined' && window.innerWidth < 960 ? 150 : Math.min(300, Math.round(window.innerHeight * 0.3))
  return (
    <Screen>
      <div className="launch">
        <div>
          <Item><span className="status-chip"><i className="pulse" aria-hidden="true" />{profile.availability}</span></Item>
          <h1 className="display" data-heading tabIndex={-1}><SplitText text={profile.name} /></h1>
          <Item><Role /></Item>
          <Item><p className="body tagline">{profile.tagline}</p></Item>
          <Item className="cta">
            <button className="btn btn-primary" onClick={() => travel(2)}>View work →</button>
            <button className="btn btn-secondary" onClick={() => setOverlay('brief')}>60-second brief</button>
            <a className="link-btn" href={profile.resume} download>Resume ↓</a>
          </Item>
          <Item><p className="label hint">Arrow keys or click to travel · press 1–5 to jump · ⌘K for commands</p></Item>
        </div>
        <Item className="planet-wrap"><HeroSystem size={size} /></Item>
      </div>
      <Item>
        <dl className="stats">
          {launchStats.map((s) => (
            <div key={s.label}><dt className="label">{s.label}</dt><dd><Count to={s.value} suffix={s.suffix} /></dd></div>
          ))}
        </dl>
      </Item>
    </Screen>
  )
}
