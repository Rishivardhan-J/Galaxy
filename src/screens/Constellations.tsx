import { useState } from 'react'
import { Item, Screen } from '../components/Motion'
import { SplitText } from '../components/SplitText'
import { links, neighbours, projectsUsing, skills } from '../content/skills'
import { useStore } from '../state/store'

const maxUse = Math.max(...skills.map((s) => projectsUsing(s).length))
const corePts = skills.filter((s) => s.group === 'core').map((s) => `${s.x},${s.y}`).join(' ')

export function Constellations() {
  const [hover, setHover] = useState<string | null>(null)
  const [pinned, setPinned] = useState<string>('react')
  const select = useStore((s) => s.select)
  const travel = useStore((s) => s.travel)
  const active = hover ?? pinned
  const lit = new Set([active, ...neighbours(active)])
  const byId = Object.fromEntries(skills.map((s) => [s.id, s]))
  const skill = byId[active]
  const used = projectsUsing(skill)
  const linked = neighbours(active).map((id) => byId[id])

  return (
    <Screen>
      <div className="const">
        <div className="const-map">
          <div className="const-head">
            <div>
              <p className="label">04 · Constellations</p>
              <h2 className="display" data-heading tabIndex={-1}><SplitText text="Skills, mapped." /></h2>
            </div>
            <ul className="legend label" aria-hidden="true">
              <li><i className="dot core" /> Core</li>
              <li><i className="dot" /> Related</li>
              <li><i className="dot ring" /> Size = projects</li>
            </ul>
          </div>
          <Item className="map-wrap">
            <svg className="map" viewBox="0 0 1000 560" role="group" aria-label="Skill constellation map. The same information is available in the list below the map for screen readers.">
              <polygon className="core-fill" points={corePts} />
              {links.map(([a, b]) => (
                <line key={a + b} className={`lnk ${a === active || b === active ? 'on' : ''}`} x1={byId[a].x} y1={byId[a].y} x2={byId[b].x} y2={byId[b].y} />
              ))}
              {skills.map((s, i) => {
                const n = projectsUsing(s).length
                const r = s.group === 'core' ? 9 + n * 1.5 : 5 + n * 1.5
                const on = lit.has(s.id)
                return (
                  <g
                    key={s.id}
                    className={`star ${s.group} ${on ? 'on' : ''} ${pinned === s.id ? 'pinned' : ''}`}
                    tabIndex={0}
                    role="button"
                    aria-label={`${s.label}, used in ${n} project${n === 1 ? '' : 's'}`}
                    aria-pressed={pinned === s.id}
                    onMouseEnter={() => setHover(s.id)}
                    onMouseLeave={() => setHover(null)}
                    onFocus={() => setHover(s.id)}
                    onBlur={() => setHover(null)}
                    onClick={() => setPinned(s.id)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setPinned(s.id) } }}
                  >
                    <circle className="halo" cx={s.x} cy={s.y} r={r + 12} />
                    <circle cx={s.x} cy={s.y} r={r + 16} fill="transparent" />
                    <circle className="core" style={{ animationDelay: `${i * 0.37}s` }} cx={s.x} cy={s.y} r={r} fill={s.group === 'core' ? '#fff' : '#8a8a8a'} />
                    <text x={s.x} y={s.y + r + 24} textAnchor="middle">{s.label}</text>
                  </g>
                )
              })}
            </svg>
          </Item>
        </div>

        <Item className="skill-panel">
          <p className="label">{skill.group === 'core' ? 'Core skill' : 'Related'} · {hover && hover !== pinned ? 'preview' : 'selected'}</p>
          <h3>{skill.label}</h3>
          <div className="meter" role="img" aria-label={`Used in ${used.length} of ${maxUse} possible projects`}>
            {Array.from({ length: maxUse }, (_, i) => <i key={i} className={i < used.length ? 'full' : ''} />)}
            <span className="label">{used.length} project{used.length === 1 ? '' : 's'}</span>
          </div>
          {used.length ? (
            <ul className="proj-list">
              {used.map((p) => (
                <li key={p.slug}>
                  <button onClick={() => { select(p.slug); travel(2) }}>
                    <span>{p.short}<small className="label"> {p.tier} · {p.year}</small></span>
                    <span aria-hidden="true">→</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : <p className="body">Used across coursework and internships.</p>}
          <p className="label" style={{ marginTop: 18 }}>Pairs with</p>
          <div className="chip-row" style={{ marginTop: 8 }}>
            {linked.map((l) => <button key={l.id} className="chip chip-btn" onClick={() => setPinned(l.id)}>{l.label}</button>)}
          </div>
        </Item>

        <ul className="sr-only">
          {skills.map((s) => (
            <li key={s.id}>{s.label}, {s.group}. Connected to {neighbours(s.id).map((n) => byId[n].label).join(', ') || 'none'}. Projects: {projectsUsing(s).map((p) => p.short).join(', ') || 'none'}.</li>
          ))}
        </ul>
      </div>
    </Screen>
  )
}
