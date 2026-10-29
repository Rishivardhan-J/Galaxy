import { useCallback, useEffect, useState } from 'react'
import { Item, Screen } from '../components/Motion'
import { SplitText } from '../components/SplitText'
import { profile } from '../content/profile'
import { useStore } from '../state/store'

interface Channel { key: string; label: string; detail: string; href: string; hint: string; external?: boolean; download?: boolean }

const channels: Channel[] = [
  { key: 'e', label: 'Email', detail: profile.email, href: `mailto:${profile.email}`, hint: '' },
  { key: 'l', label: 'LinkedIn', detail: '/in/rishivardhan-j', href: profile.linkedin, hint: 'Connect', external: true },
  { key: 'g', label: 'GitHub', detail: '@Rishivardhan-J', href: profile.github, hint: 'Read the code', external: true },
  { key: 'r', label: 'Resume', detail: 'PDF · one page', href: profile.resume, hint: 'Download', download: true },
]

export function Transmission() {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch { /* clipboard blocked */ }
  }, [])

  // single-key shortcuts while this stop is open: E, L, G, R
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const s = useStore.getState()
      if (e.metaKey || e.ctrlKey || e.altKey || s.overlay || s.phase !== 'site') return
      if (e.target instanceof HTMLElement && /^(INPUT|TEXTAREA)$/.test(e.target.tagName)) return
      const ch = channels.find((c) => c.key === e.key.toLowerCase())
      if (!ch) return
      document.getElementById(`chan-${ch.key}`)?.click()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <Screen>
      <div className="ripples" aria-hidden="true"><i /><i /><i /><i /></div>
      <div className="signal scroll-panel">
        <div className="signal-lead">
          <p className="label">05 · Transmission</p>
          <h2 className="display" data-heading tabIndex={-1}><SplitText text="Send a signal." /></h2>
          <Item>
            <p className="body">
              Internships, full-time roles, or a project worth building together. Pick a channel and the message finds me.
            </p>
          </Item>
          <Item className="signal-meta">
            <span className="status-chip"><i className="pulse" aria-hidden="true" />Channel open</span>
            <a className="btn btn-primary" href={`mailto:${profile.email}`}>Start a conversation →</a>
          </Item>
        </div>

        <ul className="chan-list scroll-panel" aria-label="Contact channels">
          {channels.map((c, i) => (
            <Item as="li" key={c.key} className="chan">
              <a
                id={`chan-${c.key}`}
                className="chan-link"
                href={c.href}
                {...(c.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                {...(c.download ? { download: true } : {})}
              >
                <span className="chan-idx">{String(i + 1).padStart(2, '0')}</span>
                <span className="chan-main">
                  <span className="chan-label">{c.label}</span>
                  <span className="chan-detail">{c.detail}</span>
                </span>
                <span className="chan-hint"><kbd className="kbd">{c.key.toUpperCase()}</kbd>{c.hint && <span>{c.hint}</span>}</span>
                <span className="chan-arrow" aria-hidden="true">{c.download ? '↓' : c.external ? '↗' : '→'}</span>
              </a>
              {c.key === 'e' && (
                <button className="copy label" onClick={copy} aria-label="Copy email address">{copied ? 'Copied ✓' : 'Copy'}</button>
              )}
            </Item>
          ))}
        </ul>
        <span className="sr-only" role="status">{copied ? 'Email copied to clipboard' : ''}</span>
      </div>
    </Screen>
  )
}
