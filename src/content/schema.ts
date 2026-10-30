import { z } from 'zod'

const node = z.object({ id: z.string(), label: z.string(), x: z.number(), y: z.number(), w: z.number().default(130) })

export const projectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  short: z.string(),
  tier: z.enum(['flagship', 'compact']),
  summary: z.string().min(20),
  stack: z.array(z.string()).min(1),
  problem: z.string().optional(),
  approach: z.string().optional(),
  architecture: z.string().optional(),
  outcome: z.string().optional(),
  diagram: z.object({ nodes: z.array(node), edges: z.array(z.tuple([z.string(), z.string()])) }).optional(),
  liveUrl: z.string().url().optional(),
  repoUrl: z.string().url().optional(),
  year: z.number(),
  planet: z.object({ seed: z.number(), bands: z.number(), ring: z.boolean(), tilt: z.number().default(0.3) }),
})
export type Project = z.infer<typeof projectSchema>

export const skillSchema = z.object({
  id: z.string(),
  label: z.string(),
  group: z.enum(['core', 'related']),
  x: z.number().min(0).max(1000),
  y: z.number().min(0).max(560),
})
export type Skill = z.infer<typeof skillSchema>

export const credentialSchema = z.object({
  issuer: z.string(),
  mark: z.string().max(4),
  track: z.boolean().optional(),
  courses: z.array(z.object({ name: z.string(), year: z.number() })).min(1),
})
export type Credential = z.infer<typeof credentialSchema>
