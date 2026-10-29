import { useState } from 'react'
import { Item, Screen } from '../components/Motion'
import { SplitText } from '../components/SplitText'
import { profile } from '../content/profile'
import { useStore } from '../state/store'

export function Transmission() {
  const travel = useStore((s) => s.travel)
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try { await navigator.clipboard.writeText(profile.email); setCopied(true); setTimeout(() => setCopied(false), 1800) } catch { /* clipboard blocked */ }
  }
  return (
    <Screen>
      <div className="signal">
        <div>
          <p className="label">05 · Transmission</p>
          <h2 className="display" data-heading tabIndex={-1} style={{ marginTop: 16 }}><SplitText text="Send a signal." /></h2>
        </div>
        <Item className="links">
          <div className="row">
            <a href={`mailto:${profile.email}`}><span>{profile.email}</span></a>
            <button className="copy label" onClick={copy}>{copied ? 'Copied' : 'Copy'}</button>
            <span className="sr-only" role="status">{copied ? 'Email copied' : ''}</span>
          </div>
          <a href={profile.linkedin} target="_blank" rel="noreferrer"><span>LinkedIn</span><span aria-hidden="true">↗</span></a>
          <a href={profile.github} target="_blank" rel="noreferrer"><span>GitHub</span><span aria-hidden="true">↗</span></a>
          <a href={profile.resume} download><span>Resume · PDF</span><span aria-hidden="true">↓</span></a>
          <button className="row" style={{ textAlign: 'left', fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 'clamp(17px,1.8vw,24px)', borderBottom: '1px solid var(--line)', gridColumn: 'auto', display: 'flex', justifyContent: 'space-between', padding: '18px 0' }} onClick={() => travel(0)}>
            <span>Back to Launchpad</span><span aria-hidden="true">↺</span>
          </button>
        </Item>
      </div>
    </Screen>
  )
}
