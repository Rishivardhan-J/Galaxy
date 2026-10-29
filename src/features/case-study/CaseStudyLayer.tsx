import { useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { CASE_PAGES, getProject } from '../../content/projects'
import { useStore } from '../../state/store'
import { Planet } from '../planet/Planet'
import { Diagram } from './Diagram'
import { useFocusTrap } from '../../app/useFocusTrap'

const TITLES = ['Problem', 'Approach', 'Architecture', 'Outcome']

export default function CaseStudyLayer() {
  const cs = useStore((s) => s.caseStudy)!
  const openCase = useStore((s) => s.openCase)
  const closeCase = useStore((s) => s.closeCase)
  const reduced = useStore((s) => s.reducedMotion)
  const p = getProject(cs.slug)!
  const ref = useRef<HTMLDivElement>(null)
  useFocusTrap(ref)
  const page = Math.min(cs.page, CASE_PAGES.length - 1)
  const key = CASE_PAGES[page]
  const text = p[key]!
  const last = page === CASE_PAGES.length - 1

  useEffect(() => { ref.current?.querySelector<HTMLElement>('[data-case-heading]')?.focus() }, [page, cs.slug])

  return (
    <motion.div
      ref={ref}
      className="case"
      role="dialog"
      aria-modal="true"
      aria-label={`${p.name} case study`}
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="case-head">
        <p className="label">Mission · {p.name} · page {String(page + 1).padStart(2, '0')}/04</p>
        <button className="link-btn" onClick={closeCase}>Close <span className="kbd">Esc</span></button>
      </div>
      <motion.div key={`${cs.slug}-${page}`} className="case-body" initial={reduced ? false : { opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35, ease: [0.65, 0, 0.35, 1] }}>
        <div>
          <p className="label">{TITLES[page]}</p>
          <h2 className="display" data-case-heading tabIndex={-1}>{TITLES[page]}</h2>
          <p className="body" style={{ maxWidth: '52ch' }}>{text}</p>
          {last && (
            <div className="chip-row" style={{ marginTop: 24 }}>{p.stack.map((t) => <span className="chip" key={t}>{t}</span>)}</div>
          )}
        </div>
        <div className="stat-planet">
          {key === 'architecture' && p.diagram ? (
            <Diagram diagram={p.diagram} label={`Architecture diagram. ${p.architecture}`} />
          ) : (
            <Planet params={p.planet} size={Math.min(260, Math.round(window.innerHeight * 0.3))} />
          )}
        </div>
      </motion.div>
      <div className="case-foot">
        <div className="dots" role="group" aria-label="Case study pages">
          {TITLES.map((t, i) => (
            <button key={t} aria-label={`${t}, page ${i + 1}`} aria-current={i === page ? 'step' : undefined} onClick={() => openCase(cs.slug, i)} />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {page > 0 && <button className="btn btn-secondary btn-sm" onClick={() => openCase(cs.slug, page - 1)}>← Back</button>}
          {!last && <button className="btn btn-primary btn-sm" onClick={() => openCase(cs.slug, page + 1)}>Next →</button>}
          {last && p.liveUrl ? <a className="btn btn-primary btn-sm" href={p.liveUrl} target="_blank" rel="noreferrer">Live demo ↗</a> : last && <span className="btn btn-secondary btn-sm" aria-disabled="true">Live demo soon</span>}
          {last && p.repoUrl ? <a className="btn btn-secondary btn-sm" href={p.repoUrl} target="_blank" rel="noreferrer">Repo ↗</a> : last && <span className="btn btn-secondary btn-sm" aria-disabled="true">Repo private</span>}
        </div>
      </div>
    </motion.div>
  )
}
