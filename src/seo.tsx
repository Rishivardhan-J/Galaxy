// Rendered to static HTML at build time so crawlers and no-JS visitors get real text.
import { profile, timeline } from './content/profile'
import { projects } from './content/projects'
import { skills } from './content/skills'

export function SeoShell() {
  return (
    <div id="seo" className="noscript-note">
      <h1>{profile.name}</h1>
      <p>{profile.role}. {profile.tagline} {profile.availability}.</p>
      <h2>Origin</h2>
      <ul>{timeline.map((t) => <li key={t.title}>{t.year}: {t.title}. {t.detail}</li>)}</ul>
      <h2>Projects</h2>
      <ul>{projects.map((p) => <li key={p.slug}><strong>{p.name}</strong>: {p.summary} ({p.stack.join(', ')}){p.repoUrl && <> <a href={p.repoUrl}>Repo</a></>}</li>)}</ul>
      <h2>Skills</h2>
      <p>{skills.map((s) => s.label).join(', ')}</p>
      <h2>Contact</h2>
      <p><a href={`mailto:${profile.email}`}>{profile.email}</a> · <a href={profile.linkedin}>LinkedIn</a> · <a href={profile.github}>GitHub</a> · <a href={profile.resume}>Resume (PDF)</a></p>
    </div>
  )
}
