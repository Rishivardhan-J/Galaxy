import { useState } from 'react'
import { Item, Screen } from '../components/Motion'
import { SplitText } from '../components/SplitText'
import { links, neighbours, projectsUsing, skills } from '../content/skills'
import { useStore } from '../state/store'

export function Constellations() {
  const [hover, setHover] = useState<string | null>(null)
  const [pinned, setPinned] = useState<string | null>('react')
  const select = useStore((s) => s.select)
  const travel = useStore((s) => s.travel)
  const active = hover ?? pinned
  const lit = new Set(active ? [active, ...neighbours(active)] : [])
  const skill = skills.find((s) => s.id === pinned)
  const used = skill ? projectsUsing(skill) : []
  const byId = Object.fromEntries(skills.map((s) => [s.id, s]))

  return (
    <Screen>
      <div className="const">
        <div>
          <p className="label">04 · Constellations</p>
          <h2 className="display" data-heading tabIndex={-1} style={{ margin: '14px 0 8px' }}><SplitText text="Skills, mapped." /></h2>
          <Item>
          <svg className="map" viewBox="0 0 1000 560" role="group" aria-label="Skill constellation map. The same information is available in the list below the map for screen readers.">
            {links.map(([a, b]) => (
              <line key={a + b} className={`lnk ${active && (a === active || b === active) ? 'on' : ''}`} x1={byId[a].x} y1={byId[a].y} x2={byId[b].x} y2={byId[b].y} />
            ))}
            {skills.map((s) => {
              const n = projectsUsing(s).length
              const r = s.group === 'core' ? 9 + n * 1.5 : 5 + n * 1.5
              const on = lit.has(s.id)
              return (
                <g
                  key={s.id}
                  className={`star ${s.group} ${on ? 'on' : ''}`}
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
                  <circle className="core" cx={s.x} cy={s.y} r={r} fill={s.group === 'core' ? '#fff' : '#8a8a8a'} />
                  <text x={s.x} y={s.y + r + 24} textAnchor="middle">{s.label}</text>
                </g>
              )
            })}
          </svg>
          </Item>
        </div>
        <Item className="skill-panel">
          {skill && (
            <>
              <p className="label">{skill.group === 'core' ? 'Core' : 'Related'} · {used.length} project{used.length === 1 ? '' : 's'}</p>
              <h3>{skill.label}</h3>
              {used.length ? (
                <ul>
                  {used.map((p) => (
                    <li key={p.slug}>
                      <button onClick={() => { select(p.slug); travel(2) }}><span>{p.short}</span><span aria-hidden="true">→</span></button>
                    </li>
                  ))}
                </ul>
              ) : <p className="body">Used across coursework and internships.</p>}
            </>
          )}
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
