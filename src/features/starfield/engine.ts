// Canvas 2D starfield: 3 parallax layers, radial warp streaks, shooting stars, adaptive quality.
import { TRANSITION_MS, useStore } from '../../state/store'

interface Star { x: number; y: number; r: number; a: number; tw: number }
interface Layer { stars: Star[]; depth: number; speed: number }

const LAYERS = [
  { depth: 0.35, speed: 2.5, base: 120, size: 0.8 },
  { depth: 0.65, speed: 5, base: 80, size: 1.1 },
  { depth: 1, speed: 9, base: 40, size: 1.6 },
]
const WARP_ON = false
const QUALITY = [1, 0.6, 0.35]

const rand = (a: number, b: number) => a + Math.random() * (b - a)
const bell = (t: number) => Math.sin(Math.PI * Math.min(1, Math.max(0, t))) // 0 → 1 → 0

export function createStarfield(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')!
  let w = 0, h = 0, dpr = 1
  let layers: Layer[] = []
  let raf = 0, last = 0, running = false
  let mx = 0, my = 0, px = 0, py = 0
  let shoot: { x: number; y: number; vx: number; vy: number; t: number } | null = null
  let nextShoot = performance.now() + rand(8000, 15000)
  const frames: number[] = []
  let lowStreak = 0

  const mobile = () => w < 768
  const build = () => {
    const q = QUALITY[useStore.getState().quality] * (mobile() ? 1 / 3 : 1)
    layers = LAYERS.map((l) => ({
      depth: l.depth,
      speed: l.speed,
      stars: Array.from({ length: Math.round(l.base * q) }, () => ({
        x: Math.random(), y: Math.random(), r: l.size * rand(0.7, 1.3), a: rand(0.35, 1) * (l.depth < 0.5 ? 0.6 : 1), tw: rand(0, 6.28),
      })),
    }))
  }
  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    w = window.innerWidth; h = window.innerHeight
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr)
    build()
    if (!running) draw(0, 0)
  }

  // warp strength 0..1 and travel sign, from store timing
  const warp = (now: number) => {
    const s = useStore.getState()
    const dur = s.reducedMotion ? 0 : TRANSITION_MS
    let k = 0
    // Screen-change warp is off for now: transitions are a quick fade. Hyperspace (Konami) still streaks.
    if (WARP_ON && s.status === 'transitioning' && dur) k = bell((now - s.transitionStart) / dur)
    const hy = (now - s.hyperAt) / 2000
    if (hy >= 0 && hy <= 1) k = Math.max(k, bell(hy) * 1.6)
    return { k, dir: hy >= 0 && hy <= 1 ? 1 : s.direction }
  }

  function draw(t: number, now: number) {
    const rm = useStore.getState().reducedMotion
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, w, h)
    const { k, dir } = rm ? { k: 0, dir: 1 } : warp(now)
    const cx = w / 2, cy = h / 2
    const diag = Math.hypot(cx, cy)
    px += (mx - px) * 0.05; py += (my - py) * 0.05
    ctx.lineCap = 'round'
    for (const L of layers) {
      const ox = rm ? 0 : -px * 12 * L.depth, oy = rm ? 0 : -py * 12 * L.depth
      const drift = rm ? 0 : t * L.speed
      for (const s of L.stars) {
        let x = ((s.x * w + drift + ox) % w + w) % w
        let y = s.y * h + oy
        const tw = rm ? 1 : 0.75 + 0.25 * Math.sin(t * 1.3 + s.tw)
        ctx.globalAlpha = Math.min(1, s.a * tw + k * 0.25)
        ctx.strokeStyle = ctx.fillStyle = L.depth > 0.9 ? '#fff' : '#cfcfcf'
        if (k > 0.02) {
          // stretch along the radial direction; forward streaks outward, back streaks inward
          const dx = x - cx, dy = y - cy
          const d = Math.hypot(dx, dy) || 1
          const len = k * L.depth * (30 + d * 0.55)
          const sx = x + (dx / d) * len * 0.35 * dir, sy = y + (dy / d) * len * 0.35 * dir
          ctx.lineWidth = s.r * (1 + k)
          ctx.beginPath()
          ctx.moveTo(sx - (dx / d) * len * dir, sy - (dy / d) * len * dir)
          ctx.lineTo(sx, sy)
          ctx.stroke()
          x = sx; y = sy
        } else {
          ctx.beginPath(); ctx.arc(x, y, s.r, 0, 6.283); ctx.fill()
        }
      }
    }
    // shooting star
    if (!rm) {
      if (!shoot && now > nextShoot) {
        const left = Math.random() < 0.5
        shoot = { x: rand(0.1, 0.9) * w, y: rand(0, 0.35) * h, vx: (left ? 1 : -1) * rand(0.9, 1.2) * diag * 0.9, vy: diag * 0.4, t: now }
      }
      if (shoot) {
        const p = (now - shoot.t) / 900
        if (p > 1) { shoot = null; nextShoot = now + rand(8000, 15000) }
        else {
          const x = shoot.x + shoot.vx * p, y = shoot.y + shoot.vy * p
          const g = ctx.createLinearGradient(x, y, x - shoot.vx * 0.12, y - shoot.vy * 0.12)
          g.addColorStop(0, `rgba(255,255,255,${1 - p})`); g.addColorStop(1, 'rgba(255,255,255,0)')
          ctx.globalAlpha = 1; ctx.strokeStyle = g; ctx.lineWidth = 1.5
          ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - shoot.vx * 0.12, y - shoot.vy * 0.12); ctx.stroke()
        }
      }
    }
    ctx.globalAlpha = 1
  }

  // frame-time governor: step quality down when frames run slow
  function govern(dt: number) {
    frames.push(dt)
    if (frames.length < 90) return
    const avg = frames.reduce((a, b) => a + b, 0) / frames.length
    frames.length = 0
    lowStreak = avg > 34 ? lowStreak + 1 : 0
    const s = useStore.getState()
    if (lowStreak >= 3 && s.quality < 2) {
      lowStreak = 0
      useStore.setState({ quality: (s.quality + 1) as 1 | 2 })
      build()
    }
  }

  function loop(ts: number) {
    if (!running) return
    const dt = last ? ts - last : 16
    last = ts
    if (dt < 100) govern(dt) // ignore tab-switch and navigation hiccups
    draw(ts / 1000, ts)
    raf = requestAnimationFrame(loop)
  }
  const start = () => { if (running || useStore.getState().reducedMotion) return; running = true; last = 0; raf = requestAnimationFrame(loop) }
  const stop = () => { running = false; cancelAnimationFrame(raf) }
  const onVis = () => (document.hidden ? stop() : start())
  const onMove = (e: PointerEvent) => { mx = e.clientX / w - 0.5; my = e.clientY / h - 0.5 }

  resize()
  window.addEventListener('resize', resize)
  window.addEventListener('pointermove', onMove, { passive: true })
  document.addEventListener('visibilitychange', onVis)
  const unsub = useStore.subscribe((s, p) => {
    if (s.reducedMotion !== p.reducedMotion) { stop(); if (s.reducedMotion) draw(0, 0); else start() }
  })
  start()
  if (useStore.getState().reducedMotion) draw(0, 0)

  return () => {
    stop(); unsub()
    window.removeEventListener('resize', resize)
    window.removeEventListener('pointermove', onMove)
    document.removeEventListener('visibilitychange', onVis)
  }
}
