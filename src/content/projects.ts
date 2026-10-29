import { projectSchema, type Project } from './schema'
export type { Project }

// Case-study copy is drafted from the resume and PRD summaries. Refine with real detail.
// TODO: add liveUrl for all three flagships, and repoUrl for Transit, HarvestPro, TrackIt.
const raw: Project[] = [
  {
    slug: 'crime-analytics',
    name: 'Crime Analytics System Using AI',
    short: 'Crime Analytics',
    tier: 'flagship',
    year: 2026,
    summary:
      'A crime intelligence platform for managing cases, entities and their relationships, with geospatial mapping, a relationship graph, classification-gated access and audit controls.',
    stack: ['FastAPI', 'PostgreSQL', 'Neo4j', 'React', 'TypeScript', 'Docker', 'Render', 'Supabase', 'Neo4j Aura'],
    problem:
      'Investigators work across cases, people, places and organisations, but the links between them live in separate records. Sensitive data also needs strict access rules and a trail of who saw what.',
    approach:
      'Model records relationally and connections as a graph. Gate every read by classification level, log every action, and give analysts a map and a relationship graph to explore instead of tables alone.',
    architecture:
      'A React and TypeScript client talks to a FastAPI service. PostgreSQL stores cases and entities, Neo4j stores relationships, and an access layer checks classification and writes an audit log. Docker images deploy to Render, with Supabase and Neo4j Aura as managed data stores.',
    outcome:
      'A working, deployed platform covering case and entity management, geospatial mapping, relationship graphs, classification-gated access and audit controls.',
    diagram: {
      nodes: [
        { id: 'ui', label: 'React + TS', x: 20, y: 120, w: 120 },
        { id: 'api', label: 'FastAPI', x: 190, y: 120, w: 120 },
        { id: 'acl', label: 'Access + Audit', x: 360, y: 120, w: 140 },
        { id: 'pg', label: 'PostgreSQL', x: 360, y: 20, w: 140 },
        { id: 'neo', label: 'Neo4j graph', x: 360, y: 220, w: 140 },
        { id: 'log', label: 'Audit log', x: 540, y: 120, w: 100 },
      ],
      edges: [['ui', 'api'], ['api', 'acl'], ['acl', 'pg'], ['acl', 'neo'], ['acl', 'log']],
    },
    repoUrl: 'https://github.com/crime-intelligence-team/Crime-intelligence-platform',
    planet: { seed: 3.1, bands: 5, ring: true, tilt: 0.32 },
  },
  {
    slug: 'transit',
    name: 'Transit',
    short: 'Transit',
    tier: 'flagship',
    year: 2026,
    summary:
      'Real-time logistics optimisation with ML-predicted delivery times and Hybrid Genetic Search routing, with route explainability.',
    stack: ['Python'],
    problem: 'Delivery plans built on fixed travel times break down as traffic and demand change, and dispatchers cannot see why a route was chosen.',
    approach: 'Predict delivery times with a learned model, feed them into Hybrid Genetic Search to build routes, and attach an explanation to each route.',
    architecture: 'Orders and live conditions go to a delivery-time model. Its predictions feed a Hybrid Genetic Search solver that produces routes, and an explainability step describes each choice.',
    outcome: 'A Python system that turns predicted delivery times into optimised routes, each with a readable explanation.',
    diagram: {
      nodes: [
        { id: 'in', label: 'Orders + live data', x: 10, y: 120, w: 150 },
        { id: 'ml', label: 'ML delivery time', x: 200, y: 120, w: 150 },
        { id: 'hgs', label: 'Hybrid Genetic Search', x: 390, y: 120, w: 170 },
        { id: 'out', label: 'Routes', x: 400, y: 20, w: 100 },
        { id: 'why', label: 'Explainability', x: 400, y: 220, w: 140 },
      ],
      edges: [['in', 'ml'], ['ml', 'hgs'], ['hgs', 'out'], ['hgs', 'why']],
    },
    planet: { seed: 7.7, bands: 2, ring: false, tilt: 0.3 },
  },
  {
    slug: 'harvestpro',
    name: 'HarvestPro',
    short: 'HarvestPro',
    tier: 'flagship',
    year: 2026,
    summary: 'Turns AI crop predictions into advice small-scale Indian farmers can act on, in their language.',
    stack: ['Dart', 'Flutter'],
    problem: 'A prediction score is not useful to a farmer who needs to know what to do this week, in a language they read comfortably.',
    approach: 'Translate model output into short, plain actions, and present them in the farmer\'s own language inside a simple mobile app.',
    architecture: 'A Flutter app receives crop predictions, maps them to a library of actionable advice, and renders it in the selected language.',
    outcome: 'A Flutter app that converts crop predictions into localised, actionable guidance.',
    diagram: {
      nodes: [
        { id: 'pred', label: 'AI crop prediction', x: 10, y: 120, w: 150 },
        { id: 'adv', label: 'Advice engine', x: 200, y: 120, w: 140 },
        { id: 'loc', label: 'Localisation', x: 380, y: 120, w: 130 },
        { id: 'app', label: 'Flutter app', x: 380, y: 220, w: 130 },
      ],
      edges: [['pred', 'adv'], ['adv', 'loc'], ['loc', 'app']],
    },
    planet: { seed: 11.3, bands: 8, ring: false, tilt: 0.3 },
  },
  {
    slug: 'trackit',
    name: 'TrackIt',
    short: 'TrackIt',
    tier: 'compact',
    year: 2026,
    summary: 'Internship and hackathon tracker with an admin pipeline.',
    stack: ['React', 'TypeScript'],
    planet: { seed: 1.9, bands: 3, ring: false, tilt: 0.3 },
  },
  {
    slug: 'bench',
    name: 'Bench',
    short: 'Bench',
    tier: 'compact',
    year: 2026,
    summary: 'Freelancer discovery by skills and project needs.',
    stack: ['React', 'TypeScript', 'Node.js', 'MongoDB'],
    repoUrl: 'https://github.com/Rishivardhan-J/Bench',
    planet: { seed: 5.5, bands: 4, ring: true, tilt: 0.45 },
  },
  {
    slug: 'forge',
    name: 'Forge',
    short: 'Forge',
    tier: 'compact',
    year: 2026,
    summary: 'Habit-formation app based on the framework in Atomic Habits.',
    stack: ['Dart', 'Flutter'],
    repoUrl: 'https://github.com/Rishivardhan-J/Forge',
    planet: { seed: 9.2, bands: 6, ring: false, tilt: 0.3 },
  },
]

export const projects: Project[] = raw.map((p) => projectSchema.parse(p))
export const flagships = projects.filter((p) => p.tier === 'flagship')
export const getProject = (slug?: string) => projects.find((p) => p.slug === slug)
export const CASE_PAGES = ['problem', 'approach', 'architecture', 'outcome'] as const
export type CasePage = (typeof CASE_PAGES)[number]
