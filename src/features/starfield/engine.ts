// Canvas 2D starfield: 3 parallax layers, radial warp streaks, shooting stars, adaptive quality.
import { TRANSITION_MS, WARP_MS, useStore } from '../../state/store'

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
  let dtSec = 0.016
  // Entry warp: a separate 3D tunnel of stars flying at the camera (angle, radius, depth).
  interface WStar { a: number; r: number; z: number }
  const spawn = (z: number): WStar => ({ a: Math.random() * 6.2832, r: 0.04 + Math.pow(Math.random(), 1.6) * 1.5, z })
  let wstars: WStar[] = []
  const smooth = (t: number) => t * t * (3 - 2 * t)
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
    const st = useStore.getState()
    const rm = st.reducedMotion
    const wu = (now - st.enterAt) / WARP_MS
    const warping = !rm && wu >= 0 && wu < 1
    const amb = warping ? (wu < 0.08 ? 1 - wu / 0.08 : wu > 0.85 ? (wu - 0.85) / 0.15 : 0) : 1
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
        ctx.globalAlpha = Math.min(1, s.a * tw + k * 0.25) * amb
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
    if (!rm && !warping) {
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
    if (warping) drawWarp(wu)
  }

  // Entry warp: slow ramp, hyperspeed, white flash while the Launchpad mounts, then a soft landing.
  function drawWarp(u: number) {
    const count = mobile() ? 320 : 850
    if (wstars.length !== count) wstars = Array.from({ length: count }, () => spawn(Math.random()))
    const cx = w / 2, cy = h / 2, diag = Math.hypot(cx, cy), F = diag * 0.22
    const ramp = u < 0.7 ? Math.pow(u / 0.7, 2.4) : 1 - ((u - 0.7) / 0.3) * 0.85
    const speed = 0.12 + 7 * ramp // depth units per second
    const trail = speed * 0.045
    const fade = u > 0.9 ? 1 - (u - 0.9) / 0.1 : 1
    const shake = ramp * 1.4
    ctx.save()
    ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake)
    ctx.lineCap = 'round'; ctx.strokeStyle = '#fff'
    for (const s of wstars) {
      s.z -= speed * dtSec
      const k0 = s.r / s.z * F
      if (s.z <= 0.02 || k0 > diag * 1.1) { Object.assign(s, spawn(0.8 + Math.random() * 0.2)); continue }
      const z0 = Math.min(1.6, s.z + trail)
      const k1 = s.r / z0 * F
      const ca = Math.cos(s.a), sa = Math.sin(s.a)
      ctx.globalAlpha = Math.min(1, Math.max(0.12, (1.05 - s.z) * 1.4)) * fade
      ctx.lineWidth = 0.5 + (1 - s.z) * 2.4
      ctx.beginPath(); ctx.moveTo(cx + ca * k1, cy + sa * k1); ctx.lineTo(cx + ca * k0, cy + sa * k0); ctx.stroke()
    }
    ctx.restore()
    // shockwave ring at launch
    if (u < 0.3) {
      const t = u / 0.3
      ctx.globalAlpha = (1 - t) * 0.5; ctx.lineWidth = 1.2
      ctx.beginPath(); ctx.arc(cx, cy, smooth(t) * diag, 0, 6.2832); ctx.stroke()
    }
    // bright core that builds with speed, then the flash
    const flash = u < 0.55 ? 0 : u < 0.73 ? Math.pow((u - 0.55) / 0.18, 2) : Math.pow(1 - (u - 0.73) / 0.27, 1.6)
    const glow = Math.max(ramp * 0.16, flash * 0.95)
    if (glow > 0.01) {
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, diag * (0.25 + flash * 1.1))
      g.addColorStop(0, `rgba(255,255,255,${glow})`); g.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.globalAlpha = 1; ctx.fillStyle = g; ctx.fillRect(0, 0, w, h)
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
    dtSec = Math.min(0.05, dt / 1000)
    if (dt < 100 && useStore.getState().phase !== 'warp') govern(dt) // ignore tab-switch and navigation hiccups
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
