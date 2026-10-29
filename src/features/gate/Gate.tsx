import { useEffect, useState } from 'react'
import { useStore } from '../../state/store'

const LINES = ['Hello, I am ', 'Rishi']
const FULL = LINES.join('')

export default function Gate() {
  const enter = useStore((s) => s.enter)
  const phase = useStore((s) => s.phase)
  const reduced = useStore((s) => s.reducedMotion)
  const [n, setN] = useState(reduced ? FULL.length : 0)

  useEffect(() => {
    if (reduced) { setN(FULL.length); return }
    let i = 0
    const start = setTimeout(() => {
      const t = setInterval(() => { i += 1; setN(i); if (i >= FULL.length) clearInterval(t) }, 70)
    }, 500)
    return () => clearTimeout(start)
  }, [reduced])

  const typed = FULL.slice(0, n)
  const hello = typed.slice(0, LINES[0].length)
  const name = typed.slice(LINES[0].length)

  return (
    <main id="main" className={`gate ${phase === 'warp' ? 'leaving' : ''}`} aria-label="Welcome">
      <div className="g-grid" aria-hidden="true" />
      <div className="g-hline" aria-hidden="true" />
      <div className="g-vline" aria-hidden="true" />
      <div className="g-ring" aria-hidden="true"><i /></div>
      <div className="g-ring g-ring2" aria-hidden="true" />
      <span className="g-plus g-top" aria-hidden="true">+</span>
      <span className="g-plus g-bottom" aria-hidden="true">+</span>
      <span className="g-plus g-left" aria-hidden="true">+</span>
      <span className="g-plus g-right g-boxed" aria-hidden="true">+</span>

      <div className="g-corner g-tl" aria-hidden="true"><b />PORTFOLIO V1.0<br />// 2026</div>
      <div className="g-corner g-tr" aria-hidden="true"><b />BUILD<br />LEARN<br />ITERATE<br />REPEAT</div>
      <div className="g-corner g-ml" aria-hidden="true">N 11.0168°<br />E 76.9558°</div>
      <div className="g-corner g-bl"><b aria-hidden="true" /><i className="pulse" aria-hidden="true" /> OPEN TO OPPORTUNITIES</div>
      <div className="g-corner g-br" aria-hidden="true"><b />CSE<br />SRI ESHWAR COLLEGE<br />OF ENGINEERING<br />2024 – 2028<br />INDIA</div>

      <div className="g-center">
        <h1 className="g-title">
          <span className="sr-only">Hello, I am Rishi. Rishivardhan J, full-stack and mobile developer.</span>
          <span className="g-type" aria-hidden="true">
            <span className="g-ghost">{FULL}</span>
            <span className="g-live">
              <span className="g-hello">{hello}</span>
              <span className="g-name">{name}</span>
              <span className="g-caret" />
            </span>
          </span>
        </h1>
        <p className="g-sub" aria-hidden="true">Developer / Builder / Problem solver</p>
        <button className="g-btn" autoFocus onClick={enter} disabled={phase !== 'gate'}>
          <span className="c c1" /><span className="c c2" /><span className="c c3" /><span className="c c4" />
          Enter orbit <span aria-hidden="true">→</span>
        </button>
      </div>
    </main>
  )
}
