# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Galaxy is Rishivardhan J's no-scroll, monochrome, space-themed portfolio (React 19 + Vite + Tailwind 4, Zustand, `motion`, Zod). `Galaxy Portfolio Product Requirements Document.md` is the spec: design tokens, performance/accessibility targets, content requirements. Check it before changing behavior or visuals.

## Commands

- `npm run dev`: Vite dev server
- `npm run build`: `tsc -b`, then `vite build`, then `scripts/prerender.mjs`, then `scripts/check-size.mjs`
- `npm run lint`: ESLint on `src`
- `npm test`: Vitest (jsdom, `src/**/*.test.{ts,tsx}`). Single file: `npx vitest run src/state/store.test.ts`. Single test: add `-t "name"`.
- `npm run e2e`: Playwright (`e2e/`, includes axe accessibility checks). It runs `npm run build && npm run preview --port 4173` itself (or reuses a server already on 4173). Single test: `npx playwright test -g "name"`.

## Architecture

- **No scrolling, no router.** The site is five fixed "stops" (`STOPS` in `src/state/route.ts`: launchpad, origin, star-systems, constellations, transmission). `App.tsx` renders one screen from `src/screens/` at a time inside `AnimatePresence`. Navigation is `travel(index)` in the Zustand store (`src/state/store.ts`), which drives a transition state machine (`status`, `queued`, `direction`) that other features read.
- **URL hash is the route.** `parseHash`/`buildHash` in `route.ts` map the hash to `{index, slug?, page?}`. Case studies are deep links of the form `#star-systems/<slug>/<page>` and only exist for projects that have a `problem` field. The store syncs both ways via `syncFromHash`.
- **Entry phases.** The store's `phase` is `gate` → `warp` → `site`. A bare URL on a fresh session starts at the gate. A hash in the URL, or `sessionStorage['galaxy-booted']=1`, skips it, so the e2e tests set that key in `beforeEach`.
- **Persistent background.** `features/starfield` (canvas engine) runs behind everything and reacts to store state (`hyperAt`, `warps`, `quality`). `features/planet` is a WebGL planet (`glPlanet.ts`). `quality` is the adaptive-performance level.
- **Overlays and lazy chunks.** Case study, brief and command palette (Cmd/Ctrl-K, with fuzzy search) are `lazy()` and mount over `main`, which is made `inert` while they're open. Keep heavy code out of the entry bundle.
- **Input** lives in `app/useInput.ts` (keys, wheel, touch). Focus handling is in `app/useFocusTrap.ts`. After each transition, `App.tsx` focuses the new `[data-heading]` and updates `document.title` and the live-region `announce`.
- **Reduced motion** is `store.reducedMotion`, which toggles the `.rm` class on `<html>`. Animations must respect it, using `REDUCED_MS` rather than `TRANSITION_MS`.
- **Content is data, validated by Zod.** `src/content/{profile,projects,skills,stack}.ts` are checked against `schema.ts` and by `content.test.ts`. Add or edit portfolio content there, not in the screens. Skill coordinates are in a 1000×560 space.
- **SEO shell.** `src/seo.tsx` is rendered to static HTML by `scripts/prerender.mjs` and injected at the `<!--seo-->` marker in `dist/index.html`. `main.tsx` removes it once JS runs.

## Constraints

- The build fails if initial JS (entry plus modulepreloads) exceeds 200 KB gzip (`scripts/check-size.mjs`).
- The palette is strictly monochrome. Use the tokens in `src/styles/tokens.css`.
