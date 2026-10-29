import { describe, expect, it } from 'vitest'
import { flagships, projects } from './projects'
import { links, skills } from './skills'
import { stackGroup } from './stack'

describe('content', () => {
  it('has the six PRD projects with three flagships', () => {
    expect(projects).toHaveLength(6)
    expect(flagships.map((p) => p.slug)).toEqual(['crime-analytics', 'transit', 'harvestpro'])
  })
  it('flagships have full case studies', () => {
    for (const p of flagships) expect(p.problem && p.approach && p.architecture && p.outcome && p.diagram).toBeTruthy()
  })
  it('skill links reference real skills', () => {
    const ids = new Set(skills.map((s) => s.id))
    for (const [a, b] of links) expect(ids.has(a) && ids.has(b)).toBe(true)
  })
  it('every stack item has a display group', () => {
    for (const p of projects) for (const t of p.stack) expect(stackGroup[t], t).toBeDefined()
  })
})
