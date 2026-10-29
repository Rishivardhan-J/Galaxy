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
