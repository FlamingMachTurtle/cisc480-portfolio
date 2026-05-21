# V5 — Timeline Rail, Tech Logos, and Contrast Pass

> Companion to `ai-tells.md`, `visual-after-v2.md`, `interactions-research.md`,
> `interactions-after.md`, and `density-pass-v4.md`. Driven by user feedback:
>
> > "love the carousel with the hover interaction. research other things and
> > techniques like carousels that can help us use animations with our stack
> > to convey information... research how to pull logos for all these
> > frameworks and stuff and use them too. you have to use more outlines and
> > shading and contrast of color of what's in focus versus the background
> > just being static white and blending too much... please make it so as you
> > scroll down the projects [they] are displayed with connecting lines
> > towards a timeline like in the photo and as you scroll different items
> > come into focus using cool animations as needed or color changes."

---

## Research — animation patterns considered, decisions made

| Pattern | Lib / Stack fit | Verdict | Notes |
|---|---|---|---|
| **Vertical timeline rail with scroll-driven amber fill** | CSS + ~40 LOC vanilla JS (RAF + scroll listener) | **Adopt** | Direct match for the "connecting lines / items come into focus" inspiration. Pure CSS for the rail; tiny scroll handler computes progress. No React island cost |
| **Per-project dim → focus** as item passes viewport center | CSS opacity + class toggle from same scroll handler | **Adopt** | Two states: `--past` (above center, full opacity) and `--active` (closest to center, full opacity + node scale-up). Default = dimmed 0.4 |
| **Real branded tech logos** in skill rows + project cards | `simple-icons` (3433 brand SVGs, MIT/CC0). Inline path data, no remote fetches | **Adopt** | Bundled at build time. Each badge is a single `<path>` — no images, no preflight, no CLS |
| **Brand-color reveal on hover** (icon stays monochrome until interaction) | CSS `var(--brand)` set via inline `style` on each `<svg>` | **Adopt** | Editorial in default state; reveals identity on interaction. Avoids the "marketing-deck stack lockup" feel of always-colored brand walls |
| **Stronger card baseline contrast** | shadow-2 + `--color-border-strong` (slate-300) + active-state border lift | **Adopt** | Was: 1px slate-200 border + no shadow on white-on-white page bg. Now: cards visibly lift, focus state distinct |
| **Hover affordance on tabs / disclosure summaries** | Subtle bg tint + chevron color shift on hover | **Adopt** | Addresses "interactions need more distinction." Tabs grow a hairline preview on hover; disclosures gain a surface-tint hover state and accent chevron |
| Animated stat counters (e.g., "100% success rate") | `useMotionValue` + `useTransform` | Defer | No stat row exists right now; would need new content surface. Park for next iteration |
| Card flip on click, hover-tilt 3D, magnetic cursor, glowing rings, neon gradients | CSS `transform: rotateY` / pointer events | **Hard skip** | These were the V2 audit's "AI tells" wearing animation costumes. Same conclusion applies in V5 |
| Typewriter rotating role | CSS `steps()` or Framer | **Skip** | Hero already reads cleanly; rotating text is the same cliché the user is trying to escape |
| WebGL backgrounds (Aurora, Beams) | three.js / shaders | **Hard skip** | Heavy + the literal "AI slop" aesthetic |

## Why `simple-icons` (not Devicon, not lucide)

- **3433 brands** including everything in our content (React, Python, Vite, Supabase, Vercel, GSAP, Framer, eBay, QuickBooks, Google Sheets, GitHub Actions, Three.js, WebGL, Apple/iOS, Postgres, Material UI, ESLint, Prettier, Git, Astro, Java/OpenJDK, TypeScript, JavaScript, Swift, HTML5, CSS).
- **Single-color silhouettes** match an editorial spine — no full-color logo lockups that read as "marketing slide."
- **MIT / CC0 licensing** — no attribution liability.
- **Tree-shakeable**: each icon is a named export, so only the ~30 we actually reference end up in the bundle.
- **Tradeoff accepted**: no Minecraft, no react-grid-layout, no Recharts, no DAX/Power BI, no PhotoKit. These render via the registry's null-fallback as text-only badges — same pill shape, no icon slot, so the row stays visually coherent.

The registry (`src/lib/tech-icons.ts`) explicitly maps friendly names from our markdown content (e.g., "Material UI v7", "Supabase (Postgres + Auth)") to canonical icons, plus normalization helpers (`resolveTechIcon()` strips parenthetical suffixes and "Foo / Bar" → "Foo" so "Vercel (static + serverless API routes)" still resolves).

## What ships in V5

### 1. `<TechIcon />` + `<TechBadge />` (Astro components)

`<TechIcon />` renders the simple-icons `<path>` as a 1em × 1em inline SVG with `fill="currentColor"`. The brand hex is exposed as `--brand: #61DAFB` on the `<svg>`'s inline `style` attribute so the parent can swap colors on hover without re-rendering the React tree (and without React being involved at all, since these are server-rendered Astro components).

`<TechBadge />` wraps a `<TechIcon />` + label in a pill:

- **Default**: monochrome icon (slate-400) + muted label, slate-200 border, slate-50 bg
- **Hover**: icon swaps to its brand color, label darkens to slate-900, border darkens to slate-300
- **No-icon fallback**: hides the icon slot entirely, renders text-only — covers `react-grid-layout`, `Recharts`, `Aurora processor interface`, `Inquiry-based coaching`, etc.
- **Block variant**: stacked icon-over-label, larger touch target — currently unused but ready for a future skills grid

Wired into:
- Project card tech list (every entry on `/projects/`)
- Home Skills section (Languages + Frameworks rows; the other two rows stay as mono dot-separated text since they're abstract competencies)
- `<TechMarquee />` (the home tech-stack lockup)

### 2. Projects timeline

Layout: a left-edge vertical hairline rule with numbered project nodes. Three-state visual model per node:

| State | Trigger | Node visual | Group opacity |
|---|---|---|---|
| **upcoming** | viewport center is above the project | hollow ring, slate-300 border, white fill | `0.4` |
| **active** | project is the closest one to viewport center AND is in viewport | hollow ring, **amber** border, white fill, `scale(1.4)`, **amber** numeric label | `1.0` |
| **past** | viewport center has crossed the project's top edge | filled solid amber circle | `1.0` |

The amber rail fill on top of the gray rail tracks scroll progress through the entire list (set as `--rail-fill` % from 0 → 100 by the RAF-throttled scroll handler).

Implementation choices:
- **Pure CSS for the rail and node visuals.** No JS reads or writes to layout-affecting styles other than the single `--rail-fill` custom property + two class toggles per group. Cheap on long pages.
- **Vanilla JS, not a React island.** The handler is ~40 lines. Hydrating React just to drive two classes and a CSS variable would be wasteful.
- **Survives `<ClientRouter />` view transitions.** Tears down on `astro:before-swap`, re-binds on `astro:page-load`.
- **Respects `prefers-reduced-motion`.** When set, the rail fill snaps to 100% (no crawl) and the dim transitions are disabled, but the node fills still update so the visual map of "where am I" stays accurate.
- **Mobile**: rail tucks closer to the edge (`left: 0.75rem`), the numeric label hides, the nodes shrink and stay on the rail.

The previous per-project `<ScrollReveal>` wrapper was removed from the projects page — the timeline rail provides a stronger and more meaningful entry signal than a generic fade-up, and the two were starting to fight on opacity.

### 3. Contrast pass

Targeted edits to address the user's "static white and blending too much" + "interactions aren't always obvious" feedback:

| Surface | Before | After |
|---|---|---|
| Project card | 1px slate-200 border, no baseline shadow, white card on white page | 1px **slate-300** border, **shadow-2** baseline, hover lifts to slate-400 + shadow-3, timeline-active state pops border to slate-400 + shadow-3 |
| SOAR tabs | hover = darker text only | hover = darker text + slate-50 bg + a hairline preview underline (signals "you can click these"); active tab keeps the spring-animated amber underline |
| Failure-story disclosure summary | hover = darker label + chevron color shift only | hover = darker label + slate-50 bg pad + accent-amber chevron + accent-amber "Click to expand" hint (so the click target is unambiguous) |
| Tech badge | flat slate-50 pill, monochrome icon | flat slate-50 pill, monochrome icon by default, on hover: brand-color icon + white bg + slate-300 border + slate-900 label |

## Programmatic verification

Build runs clean. Headless smoke test against the production preview at port 4321:

```
== Home page ==
svg.tech-icon (in skills + marquee)              = 63
.tech-badge (skills + marquee)                   = 63
.marquee .tech-badge                             = 42  (21 unique items × 2 marquee rows)

== Projects page ==
#projects-timeline                               = 1
.project-group                                   = 8
.project-group__node                             = 8
.card-tech .tech-badge                           = 44  (across all 8 cards)
.card-tech .tech-badge svg                       = 15  (the rest are no-icon text-only badges)
SOARTabs                                         = 3   (one per project with soar: data)
details.info-disclosure                          = 2   (eBay + capstone failure stories)

== Timeline scroll smoke test ==
At scrollY=0:    rail-fill = 0%,    active = idx 0 (Capstone)
At scrollY=1500: rail-fill = 18.04%, active = idx 0 (Capstone)
At scrollY=3500: rail-fill ≈ 50%,   active = idx 2-3 (NutriBot/SwiftUI)
                 inactive groups confirmed dimmed via class toggle

== Build ==
4 page(s) built in 2.65s. No errors. Bundle delta vs V4: +~6 KB
(only ~30 simple-icons paths actually imported, tree-shaken)
```

## Files touched in V5

**Added**
- `src/lib/tech-icons.ts` — name-to-icon registry (~30 entries) + `resolveTechIcon()` resolver
- `src/components/TechIcon.astro` — inline brand SVG component
- `src/components/TechBadge.astro` — icon+label pill with no-icon fallback

**Modified**
- `src/components/ProjectCard.astro` — wire `<TechBadge />` into card tech list; stronger baseline border + shadow; timeline-active border lift
- `src/components/TechMarquee.astro` — render items via `<TechBadge />` instead of mono text
- `src/components/InfoDisclosure.astro` — hover bg tint + accent chevron + accent hint on summary
- `src/components/react/SOARTabs.tsx` — hover bg tint + hairline preview on inactive tabs
- `src/pages/index.astro` — add `mode: 'badges' | 'mono'` to skills data; render Languages + Frameworks rows as `<TechBadge />` grids
- `src/pages/projects/index.astro` — replace per-project `<ScrollReveal>` with the timeline rail structure; CSS for rail + nodes + dim/focus states; vanilla JS handler for scroll progress + active/past classification
- `docs/DEVELOPMENT.md` — describe the new components, the registry, and the timeline

**Dependencies added**
- `simple-icons@^15` — brand SVG paths (used at build time only via path-data extraction; no client-side dep)
