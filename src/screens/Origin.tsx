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
        <div className="scroll-panel" style={{ maxHeight: '100%' }}>
          <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {timeline.map((t) => (
              <Item as="li" key={t.title} className="tl-row">
                <span className="label" style={{ paddingTop: 4 }}>{t.year}</span>
                <div><h3>{t.title}</h3><p>{t.detail}</p></div>
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
