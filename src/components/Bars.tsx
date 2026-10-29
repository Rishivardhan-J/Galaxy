import { useState } from 'react'
import { STOPS } from '../state/route'
import { useStore } from '../state/store'
import { profile } from '../content/profile'

export function Minimap() {
  const index = useStore((s) => s.index)
  const travel = useStore((s) => s.travel)
  const pts = [4, 24, 44, 64, 84]
  const ys = [10, 3, 12, 4, 9]
  return (
    <div className="minimap">
      <svg width="92" height="22" viewBox="0 0 92 22" role="group" aria-label="Journey map">
        {pts.slice(1).map((x, i) => (
          <line key={i} x1={pts[i]} y1={ys[i]} x2={x} y2={ys[i + 1]} stroke={i < index ? '#fff' : '#4d4d4d'} strokeWidth="1" />
        ))}
        {pts.map((x, i) => (
          <g key={i} className="mm-star" onClick={() => travel(i)}>
            <circle cx={x} cy={ys[i]} r="9" fill="transparent" />
            <circle cx={x} cy={ys[i]} r={i === index ? 3.5 : 2} fill={i === index ? '#fff' : '#8a8a8a'} />
          </g>
        ))}
      </svg>
      <span className="count" aria-label={`Stop ${index + 1} of 5`}>
        {String(index + 1).padStart(2, '0')} / 05
      </span>
    </div>
  )
}

export function TopBar() {
  const index = useStore((s) => s.index)
  const travel = useStore((s) => s.travel)
  const setOverlay = useStore((s) => s.setOverlay)
  const [open, setOpen] = useState(false)
  return (
    <header className="topbar">
      <a className="logo" href="#launchpad" onClick={(e) => { e.preventDefault(); travel(0) }} aria-label={`RJ, ${profile.name} home`}>
        <i aria-hidden="true" /> RJ
      </a>
      <nav aria-label="Sections" id="site-nav" className={`nav ${open ? 'open' : ''}`}>
        {STOPS.map((s, i) => (
          <button key={s.key} aria-current={i === index ? 'page' : undefined} onClick={() => { setOpen(false); travel(i) }}>
            {s.label}
          </button>
        ))}
      </nav>
      <div className="top-right">
        <button className="link-btn hide-m" onClick={() => setOverlay('brief')} aria-haspopup="dialog">
          Brief <span className="kbd">B</span>
        </button>
        <Minimap />
        <button className="menu-btn" aria-expanded={open} aria-controls="site-nav" onClick={() => setOpen((o) => !o)}>
          {open ? 'Close' : 'Menu'}
        </button>
      </div>
    </header>
  )
}

export function BottomBar() {
  const index = useStore((s) => s.index)
  const travel = useStore((s) => s.travel)
  const setOverlay = useStore((s) => s.setOverlay)
  const last = index === 4
  return (
    <footer className="bottombar">
      <div className="left">
        {index > 0 && (
          <button className="link-btn" onClick={() => travel(index - 1)}>
            ← Back: {STOPS[index - 1].label}
          </button>
        )}
        <button className="link-btn hide-m" onClick={() => setOverlay('palette')} aria-haspopup="dialog">
          Commands <span className="kbd">⌘K</span>
        </button>
      </div>
      <div className="right">
        {index > 0 && (
          <button className="btn btn-primary btn-sm" onClick={() => travel(last ? 0 : index + 1)}>
            {last ? 'Back to Launchpad ↺' : `Next: ${STOPS[index + 1].label} →`}
          </button>
        )}
      </div>
    </footer>
  )
}

export function ProgressLine() {
  const index = useStore((s) => s.index)
  return (
    <>
      <div className="progress-track" aria-hidden="true" />
      <div className="progress" style={{ width: `${(index + 1) * 20}%` }} aria-hidden="true" />
    </>
  )
}
