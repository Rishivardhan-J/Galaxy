import { skillSchema, type Skill } from './schema'
import { projects } from './projects'

export const skills: Skill[] = (
  [
    { id: 'react', label: 'React', group: 'core', x: 300, y: 250 },
    { id: 'typescript', label: 'TypeScript', group: 'core', x: 500, y: 170 },
    { id: 'nodejs', label: 'Node.js', group: 'core', x: 470, y: 380 },
    { id: 'fastapi', label: 'FastAPI', group: 'related', x: 720, y: 120 },
    { id: 'python', label: 'Python', group: 'related', x: 900, y: 210 },
    { id: 'postgresql', label: 'PostgreSQL', group: 'related', x: 780, y: 300 },
    { id: 'neo4j', label: 'Neo4j', group: 'related', x: 900, y: 400 },
    { id: 'docker', label: 'Docker', group: 'related', x: 740, y: 470 },
    { id: 'mongodb', label: 'MongoDB', group: 'related', x: 260, y: 470 },
    { id: 'flutter', label: 'Flutter', group: 'related', x: 110, y: 130 },
  ] satisfies Skill[]
).map((s) => skillSchema.parse(s))

export const links: [string, string][] = [
  ['react', 'typescript'],
  ['typescript', 'nodejs'],
  ['react', 'nodejs'],
  ['nodejs', 'mongodb'],
  ['typescript', 'fastapi'],
  ['fastapi', 'python'],
  ['fastapi', 'postgresql'],
  ['fastapi', 'neo4j'],
  ['postgresql', 'docker'],
  ['neo4j', 'docker'],
  ['react', 'flutter'],
]

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '')
export const projectsUsing = (skill: Skill) => projects.filter((p) => p.stack.some((t) => norm(t) === norm(skill.label)))
export const neighbours = (id: string) =>
  links.filter(([a, b]) => a === id || b === id).map(([a, b]) => (a === id ? b : a))
