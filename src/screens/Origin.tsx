import { Item, Screen } from '../components/Motion'
import { SplitText } from '../components/SplitText'
import { credentials, timeline } from '../content/profile'

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
              <h3 id="creds-h" className="label creds-h">Credentials <span>{String(credentials.length).padStart(2, '0')}</span></h3>
            </Item>
            <ul className="cred-grid">
              {credentials.map((c) => (
                <Item as="li" key={c.name} className="cred">
                  <span className="cred-mark" aria-hidden="true">{c.mark}</span>
                  <span className="cred-text"><strong>{c.name}</strong><span>{c.by}</span></span>
                  <span className="cred-year">{c.year}</span>
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
