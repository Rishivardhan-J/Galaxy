import { useEffect, useState } from 'react'
import { profile } from '../../content/profile'
import { STOPS } from '../../state/route'
import { useStore } from '../../state/store'

export function Hud() {
  const index = useStore((s) => s.index)
  const warps = useStore((s) => s.warps)
  const quality = useStore((s) => s.quality)
  const [now, setNow] = useState(() => new Date())
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 30000); return () => clearInterval(t) }, [])
  const time = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: profile.timezone })
  return (
    <div className="hud" aria-hidden="true">
      <span>IST {time}</span>
      <span>Sector {STOPS[index].key.toUpperCase()}</span>
      <span>Warps {String(warps).padStart(2, '0')}</span>
      <span>Render {['HQ', 'MQ', 'LQ'][quality]}</span>
    </div>
  )
}

export function BootSequence({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1100)
    const skip = () => onDone()
    window.addEventListener('keydown', skip); window.addEventListener('pointerdown', skip)
    return () => { clearTimeout(t); window.removeEventListener('keydown', skip); window.removeEventListener('pointerdown', skip) }
  }, [onDone])
  const lines = ['Galaxy · systems check', 'Starfield · online', 'Course · launchpad']
  return (
    <div className="boot" aria-hidden="true">
      <div style={{ display: 'grid', gap: 8 }}>
        {lines.map((l, i) => <div key={l} style={{ ['--i' as string]: i }}>› {l}</div>)}
      </div>
    </div>
  )
}
