import { motion } from 'motion/react'
import { Screen } from '../components/Motion'
import { projects, type Project } from '../content/projects'
import { Planet } from '../features/planet/Planet'
import { useStore } from '../state/store'

const sizeOf = (p: Project, sel: boolean, small: boolean) => {
  const base = p.tier === 'flagship' ? 132 : 78
  const k = small ? 0.62 : 1
  return Math.round(base * k * (sel ? 1.3 : 1))
}

export function StarSystems() {
  const selected = useStore((s) => s.selected)
  const select = useStore((s) => s.select)
  const openCase = useStore((s) => s.openCase)
  const reduced = useStore((s) => s.reducedMotion)
  const small = typeof window !== 'undefined' && (window.innerWidth < 768 || window.innerHeight < 700)
  const idx = Math.max(0, projects.findIndex((p) => p.slug === selected))
  const ordered = [...projects.slice(idx), ...projects.slice(0, idx)] // selected anchors left
  const sel = projects[idx]

  return (
    <Screen>
      <div className="systems">
        <div className="orbit h-scroll" role="group" aria-label="Projects, planets along an orbit">
          <div className="orbit-row">
            {ordered.map((p) => {
              const isSel = p.slug === selected
              const size = sizeOf(p, isSel, small)
              return (
                <motion.button
                  layout={!reduced}
                  transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
                  key={p.slug}
                  className="planet-btn"
                  style={{ width: size, height: size, marginRight: isSel && p.planet.ring ? Math.round(size * 0.45) : 0, marginLeft: isSel && p.planet.ring ? Math.round(size * 0.45) : 0 }}
                  aria-pressed={isSel}
                  aria-label={`${p.name}, ${p.tier} project`}
                  onClick={() => select(p.slug)}
                >
                  <Planet params={p.planet} size={size} />
                  {isSel && (
                    <svg className="sel-ring" viewBox="0 0 100 100" aria-hidden="true" style={{ inset: -16 }}>
                      <circle cx="50" cy="50" r="49" pathLength={1} />
                    </svg>
                  )}
                  {!isSel && <span className="planet-name label">{p.short}</span>}
                </motion.button>
              )
            })}
          </div>
        </div>
        <motion.div
          key={sel.slug}
          className="detail scroll-panel"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <p className="label">03 · Star systems · {sel.tier} · {sel.year}</p>
            <h2 className="display" data-heading tabIndex={-1}>{sel.name}</h2>
            <p className="body">{sel.summary}</p>
          </div>
          <div className="detail-side">
            <div className="chip-row" aria-label="Tech stack">{sel.stack.map((t) => <span className="chip" key={t}>{t}</span>)}</div>
            <div className="actions" style={{ marginTop: 20 }}>
              {sel.problem && <button className="btn btn-primary" onClick={() => openCase(sel.slug)}>Open mission →</button>}
              {sel.repoUrl && <a className="btn btn-secondary" href={sel.repoUrl} target="_blank" rel="noreferrer">Repo ↗</a>}
              {sel.liveUrl && <a className="btn btn-secondary" href={sel.liveUrl} target="_blank" rel="noreferrer">Live demo ↗</a>}
            </div>
          </div>
        </motion.div>
      </div>
    </Screen>
  )
}
