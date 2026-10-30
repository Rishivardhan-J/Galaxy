import type { PointerEvent } from 'react'
import { Item, Screen } from '../components/Motion'
import { SplitText } from '../components/SplitText'
import { credentials, timeline } from '../content/profile'

const years = credentials.flatMap((c) => c.courses.map((x) => x.year))
const total = credentials.reduce((n, c) => n + c.courses.length, 0)
const first = Math.min(...years)
const last = Math.max(...years)

// Shared leading words of a track's course names ("SQL Basics", "SQL Intermediate" -> "SQL").
function prefix(names: string[]) {
  const [head, ...rest] = names.map((n) => n.split(' '))
  const out: string[] = []
  for (let i = 0; i < head.length; i++) {
    if (rest.every((r) => r[i] === head[i])) out.push(head[i])
    else break
  }
  return out.join(' ')
}

function spot(e: PointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
}

export function Origin() {
  return (
    <Screen>
      <div className="origin">
        <div className="origin-left">
          <div>
            <p className="label">02 · Origin</p>
            <h2 className="display" data-heading tabIndex={-1} style={{ marginTop: 16 }}>
              <SplitText text="The best way to learn is by building." />
            </h2>
          </div>
          <section className="creds" aria-labelledby="creds-h">
            <Item>
              <h3 id="creds-h" className="label creds-h">
                Credentials <span>{String(total).padStart(2, '0')}</span>
                <span className="creds-meta">{credentials.length} issuers · {first}–{String(last).slice(2)}</span>
              </h3>
            </Item>
            <ul className="cred-grid">
              {credentials.map((c) => (
                <Item as="li" key={c.issuer} className="cred" onPointerMove={spot}>
                  <div className="cred-top">
                    <span className="cred-mark" aria-hidden="true">{c.mark}</span>
                    <span className="cred-count" aria-hidden="true">{String(c.courses.length).padStart(2, '0')}</span>
                  </div>
                  <span className="cred-issuer">{c.issuer}</span>
                  {'track' in c && c.track ? (
                    <div className="cred-track">
                      <span className="sr-only">{c.courses.map((x) => `${x.name} (${x.year})`).join(', ')}</span>
                      <div aria-hidden="true">
                        <span className="cred-track-name">{prefix(c.courses.map((x) => x.name))}</span>
                        <div className="cred-rail">{c.courses.map((x) => <i key={x.name} />)}</div>
                        <div className="cred-levels">{c.courses.map((x) => <span key={x.name}>{x.name.slice(prefix(c.courses.map((y) => y.name)).length + 1)}</span>)}</div>
                      </div>
                    </div>
                  ) : (
                    <ol className="cred-courses">
                      {c.courses.map((x) => (
                        <li key={x.name}><strong>{x.name}</strong><time>{x.year}</time></li>
                      ))}
                    </ol>
                  )}
                </Item>
              ))}
            </ul>
          </section>
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
        </div>
      </div>
    </Screen>
  )
}
