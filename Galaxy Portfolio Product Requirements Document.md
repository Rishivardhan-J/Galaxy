# Galaxy Portfolio: Product Requirements Document

Rishivardhan J · Version 1.0 · 29 October 2026 · Status: Ready for build

## 1. Overview

Galaxy is the personal portfolio website of Rishivardhan J, a Computer Science student and full-stack / mobile developer. It replaces the current portfolio with a monochrome, space-themed experience that has **no page scrolling**: visitors travel between five full-screen stops using smooth animated transitions. The repository is named `galaxy`, and the site should feel like moving through space.

**Vision:** a portfolio that is memorable in ten seconds and credible in two minutes. Striking motion up front, real engineering evidence (case studies, live demos, repositories) one click deeper.

## 2. Goals, non-goals and success metrics

**Goals**

- Let a recruiter understand role, skills and best work in under two minutes.
- Showcase front-end craft through animation without hurting performance or accessibility.
- Make three flagship projects (Crime Analytics System, Transit, HarvestPro) the focus, each with a case study, live demo and repo link.
- Work well on mobile, not just desktop.

**Non-goals (v1)**

- No blog or CMS, no user accounts, no backend beyond one contact endpoint.
- No color theming beyond monochrome.

**Success metrics**

| Metric | Target |
| --- | --- |
| Lighthouse Performance (mobile) | 90 or higher |
| Lighthouse Accessibility | 95 or higher |
| LCP / CLS / INP | under 2.5 s / under 0.05 / under 200 ms |
| Initial JS (gzip) | under 200 KB |
| Animation frame rate | 60 fps on a mid-range laptop, 30 fps floor on low-end phones |
| Engagement | Share of visitors who open a case study or repo; contact submissions; resume downloads |

## 3. Audience

| Persona | Needs |
| --- | --- |
| Recruiter | Role, skills, resume and contact within 60 seconds |
| Engineer / hiring manager | Depth: architecture, stack, repos, live demos |
| Peers and hackathon judges | Impact, polish and originality |

## 4. Design direction

**Theme:** deep space in pure black and white. Stars are white dots, planets are white-to-black gradient spheres, orbits are hairline rings, and structure comes from thin grey lines rather than boxes.

**Palette tokens (monochrome only)**

| Token | Hex | Use |
| --- | --- | --- |
| `--bg` | #000000 | Background (about 60%) |
| `--fg` | #FFFFFF | Headlines, active states, primary buttons |
| `--muted` | #A3A3A3 | Body copy, labels (contrast about 9:1 on black) |
| `--line` | #333333 | Hairlines, dividers |
| `--line-soft` | #262626 | Subtle borders |
| `--map-line` | #4D4D4D | Constellation links (inactive) |
| `--chip-border` | #666666 | Chip outlines |
| `--star-dim` | #8A8A8A | Dim stars and sphere mid-tones |

**Typography:** Space Grotesk 500/700 for display, Inter 400/500 for body, JetBrains Mono 12 px uppercase with 0.1em tracking for labels and counters.

**Components:** pill buttons (primary: white fill, black text; secondary: 1 px white outline), outlined chips, hairline cards, a top bar (logo, nav, counter `01 / 05`), a bottom bar (back link, next pill) and a 2 px progress line along the bottom edge.

**Reference canvas:** 1440 x 900. The approved mockups are the source of truth for layout.

## 5. Screen specifications

### 5.1 Launchpad (01 / 05)

- Status chip: open to internships and full-time roles.
- H1 `Rishivardhan J` (about 104 px), one-line role statement, ringed planet on the right over a starfield.
- Letter-by-letter headline reveal on first load; planet slowly rotates its highlight.
- CTA: Next: Origin. Keyboard hint: arrow keys or click to travel.

### 5.2 Origin (02 / 05)

- Statement: the best way to learn is by building.
- Timeline rows: B.E. Computer Science at Sri Eshwar College of Engineering (2024-2028); Aptitude Guru internship, Feastly full-stack food delivery system (2025); Algotutor Flutter internship, CampusHub student app (2026); LeetCode max rating 1649 and 600+ problems solved.
- Optional (P2): credentials drawer with IIT Bombay C and C++ courses, Udemy DSA, HackerRank SQL.

### 5.3 Star Systems (03 / 05)

- Six planets along an orbit line: Crime Analytics (selected, largest), Transit, HarvestPro, TrackIt, Bench, Forge. Size signals flagship status.
- Selecting a planet slides the row so it anchors left, draws a selection ring and swaps the detail panel (title, summary, stack chips, Open mission button).
- **Open mission** launches a case-study layer made of paged sub-screens (Problem, Approach, Architecture, Outcome), navigated with arrows. Each ends with Live demo and Repo buttons. No scrolling inside the layer.

### 5.4 Constellations (04 / 05)

- SVG star map of skills. Core group (React, TypeScript, Node.js) is white; related technologies (FastAPI, Python, PostgreSQL, Neo4j, MongoDB, Docker, Flutter) are grey and linked.
- Hover or focus on a star lights its connected stars and lines. A visually hidden list provides the same information to screen readers.

### 5.5 Transmission (05 / 05)

- Large heading `Send a signal.`, email link, LinkedIn, GitHub and resume download.
- P1: short contact form (name, email, message) in a slide-in panel with sending, success and error states.
- Back to Launchpad loops the journey. Phone number is not published on the site.

## 6. Navigation and transitions

| Input | Behaviour |
| --- | --- |
| Right / Down arrow, Next button | Travel forward |
| Left / Up arrow, Back link | Travel backward |
| Keys 1 to 5, nav labels | Jump to a stop |
| Mouse wheel | Travel one stop per gesture (debounced, desktop only, can be disabled) |
| Swipe | Travel on touch devices |
| Esc | Close case-study layer or contact panel |

**Rules**

- Screen state is a small state machine: index 0 to 4, direction (forward or back), status (idle or transitioning). Input is locked during a transition; at most one queued input is kept.
- Hash routes keep deep links and the browser back button working: `#launchpad`, `#origin`, `#star-systems`, `#constellations`, `#transmission`, plus `#star-systems/crime-analytics` for case studies.
- After each transition: update `document.title`, move focus to the new screen heading and announce the change in an `aria-live` region.

## 7. Animation specification

| Effect | Trigger | Behaviour | Timing |
| --- | --- | --- | --- |
| Starfield | Always | Canvas 2D, 3 parallax layers (about 120 / 80 / 40 stars on desktop, one third on mobile), slow drift, mouse parallax up to 12 px | Continuous, one rAF loop |
| Warp transition | Screen change | Stars stretch into streaks along the travel direction; old content fades and moves 24 px, new content staggers in | 600 ms, cubic-bezier(.65,0,.35,1); exit 250 ms, enter 350 ms with 60 ms stagger |
| Headline reveal | Screen enter | Masked letter-by-letter rise | 600 ms, 20 ms stagger |
| Planet hover | Hover / focus | Scale 1.06 and soft white glow | 200 ms ease-out |
| Planet select | Click / Enter | Row slides, ring draws with stroke-dashoffset, panel cross-fades | 500 ms |
| Constellation light-up | Hover / focus star | Linked lines go from 30% to 100% opacity, labels turn white | 250 ms |
| Progress line | Screen change | Width tween to 20%, 40%, 60%, 80%, 100% | 600 ms |
| Shooting star | Random, every 8 to 15 s | Single streak across the canvas | 900 ms |
| Custom cursor | Desktop pointer | Small ring follower, grows over links | Spring |
| Hyperspace easter egg (P2) | Konami code | Full-screen warp | 2 s |

**Reduced motion:** warp becomes a 200 ms cross-fade, starfield is static, parallax, cursor and shooting stars are off. Pause the animation loop when the tab is hidden.

## 8. Content model and inventory

```ts
interface Project {
  slug: string;
  name: string;
  tier: 'flagship' | 'compact';
  summary: string;
  stack: string[];
  problem?: string;
  approach?: string;
  architecture?: string;
  outcome?: string;
  liveUrl?: string;
  repoUrl?: string;
  year: number;
}
```

Content lives in typed files validated with Zod at build time.

| Project | Tier | Stack | Summary |
| --- | --- | --- | --- |
| Crime Analytics System Using AI | Flagship | FastAPI, PostgreSQL, Neo4j, React, TypeScript, Docker, Render, Supabase, Neo4j Aura | Case, entity and relationship management with geospatial mapping, relationship graph, classification-gated access and audit controls |
| Transit | Flagship | Python | Real-time logistics optimisation with ML-predicted delivery times and Hybrid Genetic Search routing, with route explainability |
| HarvestPro | Flagship | Dart, Flutter | Turns AI crop predictions into advice small-scale Indian farmers can act on, in their language |
| TrackIt | Compact | React, TypeScript | Internship and hackathon tracker with an admin pipeline |
| Bench | Compact | React, TypeScript, Node.js, MongoDB | Freelancer discovery by skills and project needs |
| Forge | Compact | Dart, Flutter | Habit-formation app based on Atomic Habits |

**Achievements:** Google Developer Groups TechSprint Hackathon 2026 and HCL Foundations + StartUp TN AI for Social Impact Challenge 2026. The result wording (Finalist or Runner-up) must be confirmed; resume and README currently disagree.

**Links:** email rishivardhan.j2024cse@sece.ac.in, LinkedIn, GitHub (Rishivardhan-J), resume PDF. The existing site at rishi-j-portfolio.vercel.app is replaced.

## 9. Functional requirements

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-01 | Five full-screen stops with no page scroll at any supported viewport | P0 |
| FR-02 | Navigation by keyboard, nav labels, Next/Back buttons and swipe | P0 |
| FR-03 | Animated warp transition between stops, direction-aware | P0 |
| FR-04 | Hash routing with deep links and working browser back/forward | P0 |
| FR-05 | Canvas starfield with parallax, paused when tab hidden | P0 |
| FR-06 | Star Systems planet selection with detail panel | P0 |
| FR-07 | Case-study layer for the three flagship projects | P0 |
| FR-08 | Constellation map with hover and focus highlighting | P1 |
| FR-09 | Contact form with validation, spam protection and states | P1 |
| FR-10 | Resume PDF download | P0 |
| FR-11 | Reduced-motion mode | P0 |
| FR-12 | Mouse-wheel travel (toggleable) | P1 |
| FR-13 | Custom cursor on desktop | P2 |
| FR-14 | Konami hyperspace easter egg | P2 |
| FR-15 | 3D planets with React Three Fiber, lazy loaded | P2 |
| FR-16 | Credentials drawer in Origin | P2 |

## 10. Non-functional requirements

- **Accessibility (WCAG 2.2 AA):** full keyboard operation, visible focus rings, skip link, semantic landmarks, a text alternative for every canvas and SVG visual, focus management on screen change, respect for `prefers-reduced-motion`.
- **Responsive:** 1440 x 900 is the reference; scale type and spacing with `clamp()` and use `100dvh`. Below 768 px the nav collapses into a menu and screens stack content vertically. Where content cannot fit, only a contained panel may scroll internally; the page itself never scrolls.
- **SEO and sharing:** prerendered shell with title, description, Open Graph image, JSON-LD `Person` schema, sitemap and robots; real text content in the DOM, not only in canvas.
- **Browsers:** latest two versions of Chrome, Edge, Firefox and Safari; iOS Safari 16 or newer.
- **Performance:** device pixel ratio capped at 2, one animation loop, lazy-loaded case-study and 3D code, self-hosted subsetted fonts, adaptive star count.
- **Privacy and security:** no third-party tracking cookies; contact endpoint with validation, honeypot and rate limiting; no secrets in client code.

## 11. Recommended tech stack

| Layer | Choice | Why | Alternative |
| --- | --- | --- | --- |
| Language / UI | TypeScript (strict) + React 19 | Your preferred stack | none |
| Build | Vite | Fast dev loop, small output | Next.js static export if you want per-project URLs and stronger SEO |
| Styling | Tailwind CSS v4 with CSS variable tokens | Fast, consistent, tokens map to the palette | CSS Modules |
| UI animation | Motion (Framer Motion) with AnimatePresence | Declarative enter/exit transitions | GSAP for timelines |
| Starfield and warp | Custom Canvas 2D | Tiny, full control, no dependency | OGL or three.js |
| 3D planets (P2) | React Three Fiber + drei, lazy loaded | Real lighting and rotation | CSS spheres (current mockup) |
| State | Zustand | Small store for index, direction, overlays, motion preference | React context |
| Routing | Hash-based hook or React Router HashRouter | Deep links without server config | TanStack Router |
| Gestures | @use-gesture/react | Reliable swipe and drag | Pointer events by hand |
| Constellation map | Hand-placed SVG, optional d3-force | Deterministic layout, accessible | Canvas |
| Forms | React Hook Form + Zod | Typed validation shared with content schema | native forms |
| Contact backend | Vercel serverless function + Resend | No server to maintain | Formspree |
| Fonts | Fontsource (Space Grotesk, Inter, JetBrains Mono) | Self-hosted, subsettable | Google Fonts |
| Icons | Inline SVG or lucide-react | Minimal weight | none |
| Testing | Vitest, Testing Library, Playwright, axe-core | Unit, end-to-end and accessibility checks | Cypress |
| Quality | ESLint, Prettier, Husky, lint-staged | Consistent code | Biome |
| CI / hosting | GitHub Actions, Lighthouse CI, Vercel | Preview deploys and performance budgets | Netlify |
| Analytics | Vercel Web Analytics or Plausible | Privacy-friendly, no cookies | none |

## 12. Architecture

```
galaxy/
  src/
    app/            App shell, router, providers
    screens/        Launchpad, Origin, StarSystems, Constellations, Transmission
    features/
      warp/         Starfield canvas, warp transition controller
      case-study/   Paged case-study layer
      contact/      Form, schema, API client
    components/     Button, Chip, TopBar, BottomBar, ProgressLine, Planet
    content/        projects.ts, profile.ts, skills.ts (Zod-validated)
    state/          Zustand store (screen, direction, overlay, reducedMotion)
    styles/         Tokens and global CSS
  api/              contact.ts (serverless)
  e2e/              Playwright specs
```

**Data flow:** input events (keys, swipe, clicks, hash changes) dispatch to the store; the store drives the active screen, the warp controller and the URL; the canvas reads direction and status from the store to stretch stars during transitions.

## 13. Delivery plan

| Phase | Scope | Duration |
| --- | --- | --- |
| 0. Setup | Repo, Vite, TypeScript, Tailwind tokens, fonts, CI, Vercel preview | 2 days |
| 1. Shell | Store, hash routing, top and bottom bars, progress line, input handling, basic transitions | 1 week |
| 2. Screens | Starfield and warp, Launchpad, Origin, Star Systems, Constellations, Transmission | 1 week |
| 3. Depth | Case-study layer for three flagship projects, contact form and endpoint, resume download | 1 week |
| 4. Polish | Accessibility pass, reduced motion, mobile layout, performance tuning, SEO, analytics | 1 week |
| 5. Launch | Final content, live demo links, domain, Lighthouse and Playwright gates | 2 days |

Total: about four to five weeks part-time.

**Definition of done:** all P0 requirements pass; Lighthouse targets met on mobile; no axe violations; keyboard-only run-through completes; works with reduced motion on; real content and links in place.

## 14. Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Animation lags on low-end phones | Adaptive star count, 30 fps fallback, DPR cap, pause when hidden |
| No-scroll layout clips content on small screens | Fluid type, stacked mobile layout, contained internal scroll as the only exception |
| Search engines see little content in a no-scroll SPA | Prerender, real DOM text, metadata and JSON-LD |
| Motion causes discomfort | Reduced-motion mode, short durations, no flashing |
| Scope creep into 3D and extras | Keep 3D, cursor and easter egg at P2 |
| Missing live demos weaken credibility | Deploy flagship demos before launch |

## 15. Open questions

1. Hackathon wording: Finalist or Runner-up for both events?
2. Live demo and repo URLs for Crime Analytics, Transit and HarvestPro.
3. Domain name, and whether to keep the old Vercel URL as a redirect.
4. Screenshots or diagrams for each case study, rendered in monochrome.
5. Vite SPA or Next.js static export (decide by how much you value per-project URLs and SEO).
6. Which analytics tool, if any.

## Appendix: route map

| Route | Screen |
| --- | --- |
| `#launchpad` | Launchpad (default) |
| `#origin` | Origin |
| `#star-systems` | Star Systems |
| `#star-systems/<slug>` | Case study layer |
| `#constellations` | Constellations |
| `#transmission` | Transmission |
