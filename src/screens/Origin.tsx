import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Item, Screen } from '../components/Motion'
import { SplitText } from '../components/SplitText'
import { credentials, timeline } from '../content/profile'
import { useStore } from '../state/store'

export function Origin() {
  const [open, setOpen] = useState(false)
  const reduced = useStore((s) => s.reducedMotion)
  return (
    <Screen>
      <div className="origin">
        <div>
          <p className="label">02 · Origin</p>
          <h2 className="display" data-heading tabIndex={-1} style={{ marginTop: 16 }}>
            <SplitText text="The best way to learn is by building." />
          </h2>
        </div>
        <div className="scroll-panel origin-side">
          <ol className="journey">
            {timeline.map((t) => (
              <Item as="li" key={t.title} className={`stop ${t.now ? 'now' : ''}`}>
                <i className="node" aria-hidden="true" />
                <div className="stop-head">
                  <span className="label">{t.tag}{t.now && <b className="now-tag"> · In progress</b>}</span>
                  <span className="stop-year">{t.year}</span>
                </div>
                <div className="stop-title">
                  <h3>{t.title}</h3>
                  <div className="chip-row">{t.chips.map((c) => <span className="chip" key={c}>{c}</span>)}</div>
                </div>
                <p>{t.detail}</p>
              </Item>
            ))}
          </ol>
          <Item>
            <button className="link-btn drawer-btn" aria-expanded={open} aria-controls="creds" onClick={() => setOpen((o) => !o)}>
              {open ? '− Credentials' : '+ Credentials'}
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div id="creds" className="drawer" initial={reduced ? false : { height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <ul>
                    {credentials.map((c) => (
                      <li key={c.name}><span>{c.name} · {c.by}</span><span className="label">{c.year}</span></li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </Item>
        </div>
      </div>
    </Screen>
  )
}
