import { CASE_PAGES, getProject, type CasePage } from '../content/projects'

export const STOPS = [
  { key: 'launchpad', label: 'Launchpad', title: 'Launchpad' },
  { key: 'origin', label: 'Origin', title: 'Origin' },
  { key: 'star-systems', label: 'Star Systems', title: 'Star Systems' },
  { key: 'constellations', label: 'Constellations', title: 'Constellations' },
  { key: 'transmission', label: 'Transmission', title: 'Transmission' },
] as const

export interface Route {
  index: number
  slug?: string
  page?: number
}

export function parseHash(hash: string): Route {
  const [stop, slug, page] = hash.replace(/^#\/?/, '').split('/')
  const index = Math.max(0, STOPS.findIndex((s) => s.key === stop))
  if (index === 2 && getProject(slug)?.problem) {
    const p = CASE_PAGES.indexOf(page as CasePage)
    return { index, slug, page: p < 0 ? 0 : p }
  }
  return { index }
}

export function buildHash(r: Route): string {
  const base = `#${STOPS[r.index].key}`
  if (r.index === 2 && r.slug) return `${base}/${r.slug}${r.page ? `/${CASE_PAGES[r.page]}` : ''}`
  return base
}
