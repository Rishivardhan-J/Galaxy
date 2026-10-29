import { motion } from 'motion/react'
import { Screen } from '../components/Motion'
import { CASE_PAGES, projects } from '../content/projects'
import { groupStack } from '../content/stack'
import { Orbit } from '../features/orbit/Orbit'
import { useStore } from '../state/store'

const firstSentence = (t: string) => t.split(/(?<=\.)\s/)[0]

export function StarSystems() {
  const selected = useStore((s) => s.selected)
  const select = useStore((s) => s.select)
  const openCase = useStore((s) => s.openCase)
  const reduced = useStore((s) => s.reducedMotion)
  const idx = Math.max(0, projects.findIndex((p) => p.slug === selected))
  const sel = projects[idx]
  const step = (d: number) => select(projects[(idx + d + projects.length) % projects.length].slug)

  return (
    <Screen>
      <div className="systems">
        <Orbit />
        <motion.div
          key={sel.slug}
          className="dossier scroll-panel"
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="dos-id">
            <div className="dos-top">
              <p className="label">03 · Mission {String(idx + 1).padStart(2, '0')} · {sel.tier} · {sel.year}</p>
              <div className="stepper" role="group" aria-label="Browse projects">
                <button onClick={() => step(-1)} aria-label="Previous project">‹</button>
                <span className="label" aria-live="polite">{String(idx + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</span>
                <button onClick={() => step(1)} aria-label="Next project">›</button>
              </div>
            </div>
            <h2 className="display" data-heading tabIndex={-1}>{sel.name}</h2>
            <p className="body">{sel.summary}</p>
          </div>

          <div className="dos-brief">
            {sel.problem ? (
              <>
                <p className="label">The brief</p>
                <blockquote>{firstSentence(sel.problem)}</blockquote>
                <ol className="steps" aria-label="Case study pages">
                  {CASE_PAGES.map((c, i) => (
                    <li key={c}>
                      <button onClick={() => openCase(sel.slug, i)}>
                        <span className="label">{String(i + 1).padStart(2, '0')}</span>
                        <span className="step-name">{c}</span>
                        <span aria-hidden="true">→</span>
                      </button>
                    </li>
                  ))}
                </ol>
              </>
            ) : (
              <>
                <p className="label">Side mission</p>
                <blockquote>{sel.summary}</blockquote>
              </>
            )}
          </div>

          <div className="dos-stack">
            <div className="groups" aria-label="Tech stack">
              {groupStack(sel.stack).map((g) => (
                <div className="group" key={g.group}>
                  <span className="label">{g.group}</span>
                  <div className="chip-row">{g.items.map((t) => <span className="chip" key={t}>{t}</span>)}</div>
                </div>
              ))}
            </div>
            <div className="actions">
              {sel.problem && <button className="btn btn-primary" onClick={() => openCase(sel.slug)}>Open mission →</button>}
              {sel.repoUrl ? <a className="btn btn-secondary" href={sel.repoUrl} target="_blank" rel="noreferrer">Repo ↗</a> : <span className="btn btn-secondary" aria-disabled="true">Repo private</span>}
              {sel.liveUrl ? <a className="btn btn-secondary" href={sel.liveUrl} target="_blank" rel="noreferrer">Live demo ↗</a> : <span className="btn btn-secondary" aria-disabled="true">Live demo soon</span>}
            </div>
          </div>
        </motion.div>
      </div>
    </Screen>
  )
}
