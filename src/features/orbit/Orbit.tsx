import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react'
import { animate, motion, useMotionValue, useTransform, type MotionValue } from 'motion/react'
import { projects, type Project } from '../../content/projects'
import { useStore } from '../../state/store'
import { Planet } from '../planet/Planet'
import { shortestTarget } from './angle'

const STEP = (Math.PI * 2) / projects.length

interface Geo { w: number; h: number }

function OrbitPlanet({ p, i, rot, geo, selected, small, onSelect }: {
  p: Project; i: number; rot: MotionValue<number>; geo: Geo; selected: boolean; small: boolean; onSelect: () => void
}) {
  const size = Math.round((p.tier === 'flagship' ? 124 : 82) * (small ? 0.66 : 1))
  const rx = geo.w * (small ? 0.34 : 0.36), ry = geo.h * 0.27, cy = geo.h * 0.44
  const theta = useTransform(rot, (r) => i * STEP - r)
  const depth = useTransform(theta, (t) => (1 + Math.cos(t)) / 2)
  const x = useTransform(theta, (t) => geo.w / 2 + Math.sin(t) * rx)
  const y = useTransform(theta, (t) => cy + Math.cos(t) * ry)
  const scale = useTransform(depth, (d) => 0.42 + 0.58 * d)
  const opacity = useTransform(depth, (d) => 0.35 + 0.65 * d)
  const z = useTransform(depth, (d) => Math.round(d * 10))

  return (
    <motion.button
      id={`orb-${p.slug}`}
      role="radio"
      aria-checked={selected}
      tabIndex={selected ? 0 : -1}
      aria-label={`${p.name}, ${p.tier} project`}
      className="planet-btn orb"
      style={{ x, y, scale, opacity, zIndex: z, width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2 }}
      onClick={onSelect}
    >
      <Planet params={p.planet} size={size} />
      {selected && (
        <svg className="sel-ring" viewBox="0 0 100 100" aria-hidden="true" style={{ inset: -14 }}>
          <circle cx="50" cy="50" r="49" pathLength={1} />
        </svg>
      )}
      {!selected && <span className="planet-name label">{p.short}</span>}
    </motion.button>
  )
}

export function Orbit() {
  const selected = useStore((s) => s.selected)
  const select = useStore((s) => s.select)
  const openCase = useStore((s) => s.openCase)
  const reduced = useStore((s) => s.reducedMotion)
  const idx = Math.max(0, projects.findIndex((p) => p.slug === selected))
  const rot = useMotionValue(idx * STEP)
  const box = useRef<HTMLDivElement>(null)
  const [geo, setGeo] = useState<Geo>({ w: 900, h: 340 })
  const small = geo.w < 640

  useLayoutEffect(() => {
    const el = box.current!
    const measure = () => setGeo({ w: el.clientWidth, h: el.clientHeight })
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const target = shortestTarget(rot.get(), idx * STEP)
    if (reduced) rot.set(target)
    else {
      const c = animate(rot, target, { duration: 0.7, ease: [0.65, 0, 0.35, 1] })
      return () => c.stop()
    }
  }, [idx, reduced, rot])

  const go = (n: number, focus = true) => {
    const next = projects[(n + projects.length) % projects.length]
    select(next.slug)
    if (focus) document.getElementById(`orb-${next.slug}`)?.focus()
  }

  const onKey = (e: KeyboardEvent) => {
    const k = e.key
    if (k === 'ArrowRight' || k === 'ArrowDown') go(idx + 1)
    else if (k === 'ArrowLeft' || k === 'ArrowUp') go(idx - 1)
    else if (k === 'Home') go(0)
    else if (k === 'End') go(projects.length - 1)
    else if (k === 'Enter' && projects[idx].problem) openCase(projects[idx].slug)
    else return
    e.preventDefault()
  }

  const touchX = useRef(0)
  const { w, h } = geo
  return (
    <div
      ref={box}
      className="orbit3 h-scroll"
      data-orbit
      role="radiogroup"
      aria-label="Projects on an orbit. Use the arrow keys to rotate."
      onKeyDown={onKey}
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX }}
      onTouchEnd={(e) => { const dx = e.changedTouches[0].clientX - touchX.current; if (Math.abs(dx) > 50) go(idx + (dx < 0 ? 1 : -1), false) }}
    >
      <svg className="orbit-path" width={w} height={h} aria-hidden="true">
        <ellipse cx={w / 2} cy={h * 0.44} rx={w * (small ? 0.34 : 0.36)} ry={h * 0.27} />
        <ellipse cx={w / 2} cy={h * 0.44} rx={w * (small ? 0.42 : 0.45)} ry={h * 0.36} className="faint" />
      </svg>
      {projects.map((p, i) => (
        <OrbitPlanet key={p.slug} p={p} i={i} rot={rot} geo={geo} selected={i === idx} small={small} onSelect={() => select(p.slug)} />
      ))}
      <p className="orb-hint label" aria-hidden="true">← → orbit · Enter open mission</p>
    </div>
  )
}
