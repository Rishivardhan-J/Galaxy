import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { profile } from '../../content/profile'
import { projects } from '../../content/projects'
import { STOPS } from '../../state/route'
import { useStore } from '../../state/store'
import { useFocusTrap } from '../../app/useFocusTrap'
import { fuzzy } from './fuzzy'

interface Cmd { id: string; label: string; hint: string; run: () => void }

export default function CommandPalette() {
  const s = useStore.getState
  const [q, setQ] = useState('')
  const [i, setI] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  useFocusTrap(ref)
  const close = () => useStore.getState().setOverlay(null)

  const cmds = useMemo<Cmd[]>(() => {
    const done = (fn: () => void) => () => { close(); fn() }
    return [
      ...STOPS.map((t, n) => ({ id: t.key, label: `Go to ${t.label}`, hint: String(n + 1), run: done(() => s().travel(n)) })),
      ...projects.map((p) => ({
        id: p.slug, label: `Project: ${p.name}`, hint: p.tier,
        run: done(() => { s().select(p.slug); if (p.problem) s().openCase(p.slug)
          else s().travel(2) }),
      })),
      { id: 'brief', label: 'Open 60-second brief', hint: 'B', run: () => s().setOverlay('brief') },
      { id: 'copy', label: 'Copy email address', hint: '', run: done(() => navigator.clipboard?.writeText(profile.email)) },
      { id: 'resume', label: 'Download resume', hint: 'PDF', run: done(() => { const a = document.createElement('a'); a.href = profile.resume; a.download = ''; a.click() }) },
      { id: 'github', label: 'Open GitHub', hint: '↗', run: done(() => window.open(profile.github, '_blank', 'noopener')) },
      { id: 'linkedin', label: 'Open LinkedIn', hint: '↗', run: done(() => window.open(profile.linkedin, '_blank', 'noopener')) },
      { id: 'motion', label: 'Toggle reduced motion', hint: '', run: done(() => useStore.setState((x) => ({ reducedMotion: !x.reducedMotion }))) },
      { id: 'sound', label: 'Toggle ambient sound', hint: '', run: done(() => useStore.setState((x) => ({ sound: !x.sound }))) },
      { id: 'wheel', label: 'Toggle mouse-wheel travel', hint: '', run: done(() => useStore.setState((x) => ({ wheelTravel: !x.wheelTravel }))) },
      { id: 'hyper', label: 'Engage hyperspace', hint: '↑↑↓↓←→←→BA', run: done(() => s().hyperspace()) },
    ]
  }, [])

  const results = useMemo(
    () => cmds.map((c) => ({ c, sc: fuzzy(q, c.label) })).filter((r) => r.sc >= 0).sort((a, b) => b.sc - a.sc).map((r) => r.c),
    [q, cmds],
  )
  useEffect(() => setI(0), [q])

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setI((n) => Math.min(results.length - 1, n + 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setI((n) => Math.max(0, n - 1)) }
    else if (e.key === 'Enter') { e.preventDefault(); results[i]?.run() }
    else if (e.key === 'Escape') { e.stopPropagation(); close() }
  }

  return (
    <motion.div className="overlay" style={{ alignItems: 'start', paddingTop: '12vh' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close}>
      <div ref={ref} className="panel" role="dialog" aria-modal="true" aria-label="Command palette" onClick={(e) => e.stopPropagation()} onKeyDown={onKey}>
        <input
          autoFocus className="pal-input" placeholder="Type a command or a place…" value={q} onChange={(e) => setQ(e.target.value)}
          role="combobox" aria-expanded="true" aria-controls="pal-list" aria-activedescendant={results[i] ? `pal-${results[i].id}` : undefined} aria-label="Search commands"
        />
        <ul className="pal-list" id="pal-list" role="listbox" aria-label="Commands">
          {results.map((c, n) => (
            <li key={c.id} role="presentation">
              <button id={`pal-${c.id}`} role="option" aria-selected={n === i} tabIndex={-1} onMouseMove={() => setI(n)} onClick={c.run}>
                <span>{c.label}</span><span className="label">{c.hint}</span>
              </button>
            </li>
          ))}
          {!results.length && <li className="label" style={{ padding: 12 }}>No signal.</li>}
        </ul>
      </div>
    </motion.div>
  )
}
