import { useEffect, useRef } from 'react'
import { animate, motion, useMotionValue, useTransform, type MotionValue } from 'motion/react'
import { flagships, projects, type Project } from '../../content/projects'
import { useStore } from '../../state/store'
import { Planet } from './Planet'

const STEP = (Math.PI * 2) / flagships.length

function Moon({ p, i, angle, rx, ry, size }: { p: Project; i: number; angle: MotionValue<number>; rx: number; ry: number; size: number }) {
  const openCase = useStore((s) => s.openCase)
  const theta = useTransform(angle, (a) => a + i * STEP)
  const x = useTransform(theta, (t) => Math.cos(t) * rx)
  const y = useTransform(theta, (t) => Math.sin(t) * ry)
  const depth = useTransform(theta, (t) => (1 + Math.sin(t)) / 2) // 1 = in front of the planet
  const scale = useTransform(depth, (d) => 0.7 + 0.3 * d)
  const z = useTransform(depth, (d) => (d > 0.5 ? 3 : 0))
  return (
    <motion.button
      className="moon"
      style={{ x, y, scale, zIndex: z, width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2 }}
      onClick={() => openCase(p.slug)}
      aria-label={`${p.name}, open case study`}
    >
      <Planet params={{ ...p.planet, ring: false }} size={size} />
      <span className="moon-tag" aria-hidden="true">{p.short} · {p.year} · {p.stack[0]}</span>
    </motion.button>
  )
}

// Hero planet with one orbiting moon per flagship project; the whole group leans slightly toward the pointer.
export function HeroSystem({ size }: { size: number }) {
  const reduced = useStore((s) => s.reducedMotion)
  const angle = useMotionValue(-Math.PI / 2)
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const rotY = useTransform(px, (v) => v * 3)
  const rotX = useTransform(py, (v) => v * -3)
  const wrap = useRef<HTMLDivElement>(null)
  const small = size < 220

  useEffect(() => {
    if (reduced) return
    const c = animate(angle, angle.get() + Math.PI * 2, { duration: 60, ease: 'linear', repeat: Infinity })
    return () => c.stop()
  }, [reduced, angle])

  useEffect(() => {
    if (reduced || !matchMedia('(pointer: fine)').matches) return
    const move = (e: PointerEvent) => {
      px.set((e.clientX / innerWidth - 0.5) * 2)
      py.set((e.clientY / innerHeight - 0.5) * 2)
    }
    addEventListener('pointermove', move)
    return () => removeEventListener('pointermove', move)
  }, [reduced, px, py])

  const rx = size * (small ? 0.95 : 1.15)
  const ry = size * 0.42
  const moon = small ? 38 : 56
  return (
    <motion.div ref={wrap} className="hero-sys" style={{ width: rx * 2, height: size * 1.9, rotateY: rotY, rotateX: rotX }}>
      <svg className="hero-orbit" viewBox={`${-rx} ${-size * 0.95} ${rx * 2} ${size * 1.9}`} aria-hidden="true">
        <ellipse cx="0" cy="0" rx={rx} ry={ry} />
      </svg>
      <div className="hero-core"><Planet params={projects[0].planet} size={size} /></div>
      <div className="hero-moons">
        {flagships.map((p, i) => <Moon key={p.slug} p={p} i={i} angle={angle} rx={rx} ry={ry} size={moon} />)}
      </div>
    </motion.div>
  )
}
