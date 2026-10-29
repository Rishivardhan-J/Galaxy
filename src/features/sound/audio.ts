// Synthesised ambient hum and warp whoosh. No audio files; off until the visitor opts in.
let ctx: AudioContext | null = null
let hum: { stop: () => void } | null = null

const get = () => (ctx ??= new AudioContext())

export function startHum() {
  if (hum) return
  const c = get(); void c.resume()
  const g = c.createGain(); g.gain.value = 0; g.gain.linearRampToValueAtTime(0.035, c.currentTime + 2)
  const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 400
  const oscs = [55, 82.7, 110.4].map((f) => { const o = c.createOscillator(); o.frequency.value = f; o.connect(lp); o.start(); return o })
  lp.connect(g); g.connect(c.destination)
  hum = { stop: () => { g.gain.linearRampToValueAtTime(0, c.currentTime + 0.5); setTimeout(() => oscs.forEach((o) => o.stop()), 600); hum = null } }
}
export const stopHum = () => hum?.stop()

export function whoosh(dir: 1 | -1) {
  const c = get(); void c.resume()
  const len = c.sampleRate * 0.7
  const buf = c.createBuffer(1, len, c.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1
  const src = c.createBufferSource(); src.buffer = buf
  const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 1.2
  const t = c.currentTime
  bp.frequency.setValueAtTime(dir > 0 ? 200 : 2200, t)
  bp.frequency.exponentialRampToValueAtTime(dir > 0 ? 2200 : 200, t + 0.6)
  const g = c.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.12, t + 0.25); g.gain.linearRampToValueAtTime(0, t + 0.65)
  src.connect(bp); bp.connect(g); g.connect(c.destination); src.start()
}
