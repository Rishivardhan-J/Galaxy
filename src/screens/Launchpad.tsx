import { Item, Screen } from '../components/Motion'
import { SplitText } from '../components/SplitText'
import { profile } from '../content/profile'
import { projects } from '../content/projects'
import { Planet } from '../features/planet/Planet'
import { useStore } from '../state/store'

export function Launchpad() {
  const travel = useStore((s) => s.travel)
  const setOverlay = useStore((s) => s.setOverlay)
  const size = typeof window !== 'undefined' && window.innerWidth < 960 ? 180 : Math.min(300, Math.round(window.innerHeight * 0.34))
  return (
    <Screen>
      <div className="launch">
        <div>
          <Item><span className="status-chip"><i className="pulse" aria-hidden="true" />{profile.availability}</span></Item>
          <h1 className="display" data-heading tabIndex={-1}><SplitText text={profile.name} /></h1>
          <Item><p className="role">{profile.role}</p></Item>
          <Item><p className="body" style={{ marginTop: 10 }}>{profile.tagline}</p></Item>
          <Item className="cta">
            <button className="btn btn-primary" onClick={() => travel(1)}>Next: Origin →</button>
            <button className="btn btn-secondary" onClick={() => setOverlay('brief')}>60-second brief</button>
          </Item>
          <Item><p className="label hint">Arrow keys or click to travel · press 1–5 to jump</p></Item>
        </div>
        <Item className="planet-wrap"><Planet params={projects[0].planet} size={size} /></Item>
      </div>
    </Screen>
  )
}
