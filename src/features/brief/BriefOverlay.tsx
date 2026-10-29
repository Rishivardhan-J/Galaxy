import { useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { profile } from '../../content/profile'
import { flagships } from '../../content/projects'
import { useStore } from '../../state/store'
import { useFocusTrap } from '../../app/useFocusTrap'

export default function BriefOverlay() {
  const setOverlay = useStore((s) => s.setOverlay)
  const travel = useStore((s) => s.travel)
  const select = useStore((s) => s.select)
  const openCase = useStore((s) => s.openCase)
  const ref = useRef<HTMLDivElement>(null)
  useFocusTrap(ref)
  useEffect(() => { ref.current?.querySelector<HTMLElement>('h2')?.focus() }, [])
  const close = () => setOverlay(null)
  return (
    <motion.div className="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close}>
      <div ref={ref} className="panel" role="dialog" aria-modal="true" aria-labelledby="brief-h" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="label">60-second brief</span>
          <button className="link-btn" onClick={close}>Close <span className="kbd">Esc</span></button>
        </div>
        <h2 id="brief-h" className="display" tabIndex={-1}>{profile.name}</h2>
        <div className="brief-grid scroll-panel">
          <div><span className="label">Role</span><span>{profile.role}. B.E. Computer Science, {profile.college}, 2024–2028.</span></div>
          <div><span className="label">Status</span><span>{profile.availability}.</span></div>
          <div><span className="label">Core stack</span><span>React, TypeScript, Node.js · FastAPI, Python, PostgreSQL, Neo4j, MongoDB · Flutter, Docker</span></div>
          <div><span className="label">Best work</span>
            <span style={{ display: 'grid', gap: 8 }}>
              {flagships.map((p) => (
                <button key={p.slug} style={{ textAlign: 'left' }} onClick={() => { close(); select(p.slug); openCase(p.slug) }}>
                  <strong style={{ fontWeight: 500 }}>{p.short}</strong> <span style={{ color: 'var(--muted)' }}>· {p.summary.split(',')[0]}</span> →
                </button>
              ))}
            </span>
          </div>
          <div><span className="label">Proof</span><span>Finalist, GDG TechSprint 2026 and HCL × StartUp TN AI for Social Impact 2026 · LeetCode max {profile.leetcode.rating}, {profile.leetcode.solved} solved.</span></div>
          <div><span className="label">Contact</span><span><a href={`mailto:${profile.email}`}>{profile.email}</a></span></div>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a className="btn btn-primary btn-sm" href={profile.resume} download>Download resume ↓</a>
          <button className="btn btn-secondary btn-sm" onClick={() => { close(); travel(4) }}>Contact →</button>
        </div>
      </div>
    </motion.div>
  )
}
