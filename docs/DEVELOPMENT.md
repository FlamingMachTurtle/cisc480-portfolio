# Developer Notes — CISC480 Portfolio Site

This file holds the technical README that used to live at the repo root. It is intentionally kept short and oriented toward future development; the graded artifact lives in [`README.md`](../README.md) (the reflection essay).

---

## Stack

- **Astro v6** (static output)
- Content collections: `src/content/projects/*.md`, schema in `src/content.config.ts`
- Shared layout: `src/layouts/BaseLayout.astro` — sticky nav (transparent over hero, opaque past it), skip link, OG/canonical meta, `<ClientRouter />` for view transitions
- Components:
  - `src/components/ProjectCard.astro` — outlined-only category badge, leading accent rule for capstone, `transition:name` on the card image for view-transition morphs
  - `src/components/InfoPanel.astro` — *single primitive* replacing the four ad-hoc panels that used to be `.soar`, `.failure-story`, `.my-contribution`, and `.capstone-banner`. Three tones (`neutral`, `accent`, `muted`) differentiated only by a 3px left rule + label color, never by background fill
  - `src/components/HeroScene.astro` — full-bleed dark cinematic band atop home / projects / fun pages, with optional photographic backdrop and `transition:name="hero-scene"` for cross-page morphs
- Animation: `src/scripts/scene.ts` (vanilla GSAP) — body-content lift on page enter, hero-bg parallax on scroll, full `prefers-reduced-motion` support, re-bound on every `astro:page-load`
- Path helper: `src/lib/url.ts` — `withBase()` prepends `import.meta.env.BASE_URL` so the site survives the `/cisc480-portfolio/` project-page subpath
- Deploy: `.github/workflows/deploy.yml` — GitHub Actions → GitHub Pages

## Configuration

`astro.config.mjs` is configured for a GitHub project page under FlamingMachTurtle:

```js
site: 'https://flamingmachturtle.github.io',
base: '/cisc480-portfolio/',
```

Live URL: <https://flamingmachturtle.github.io/cisc480-portfolio/>

## Local development

```bash
npm install
npm run dev      # http://localhost:4321/cisc480-portfolio/
npm run build    # → dist/
npm run preview
```

> The dev server URL includes the base path. Navigating to `http://localhost:4321/` will show 404 — use `/cisc480-portfolio/`.

## Asset paths

Every absolute asset path inside `.astro` files goes through `withBase()`:

```astro
import { withBase } from '../lib/url';
<img src={withBase('/images/headshot.jpg')} />
```

Markdown project entries store unprefixed paths (e.g., `image: /images/cruz-after.jpg`); the card and gallery templates pass them through `withBase()` at render time. Do **not** hard-code `/cisc480-portfolio/` in any source file — it should only ever appear in `astro.config.mjs`.

## Content schema

`src/content.config.ts` adds these fields beyond the basics:

- `keywords?: string[]` — rendered as visible dashed tags under the tech list
- `category?: 'cs' | 'interdisciplinary' | 'outside-cs' | 'capstone'` — drives the badge in the top-left of the card. As of the redesign, the badge is outlined-only (no pastel fill); only `capstone` uses the warm amber accent color
- `myContribution?: string` — renders as `<InfoPanel tone="neutral" label="My personal contribution">`
- `soar?: { situation, obstacle, action, result }` — renders as `<InfoPanel tone="accent">` (the only accent-toned panel in a typical entry, marking it as the most important section)
- `failureStory?: { context, whatHappened, learning }` — renders as `<InfoPanel tone="muted">` (deliberately quieter than SOAR; important content shouldn't be the most aggressive content)

## Adding a project entry

1. Drop a new file in `src/content/projects/<slug>.md`.
2. Set `category`, `sortOrder` (lower = earlier on page), `image`, `imageAlt`, and `tech`.
3. Add `keywords`; also weave them into the `description` prose (the rubric requires keywords in both places).
4. Add `soar` and/or `failureStory` blocks if you want the structured renderings.
5. If the entry is a group project, fill in `myContribution`.
6. If it needs an inline gallery, add a new key to the `galleries` map in `src/pages/projects/index.astro` matching the file's slug.

## Design system (post-redesign)

All visual decisions live as CSS custom properties in `src/styles/global.css` `:root`. Component styles consume tokens via `var(--token-name)`; **no hex codes are allowed in component-scoped styles** outside of `:root` itself. The full spec is at [`redesign/design-spec.md`](../redesign/design-spec.md) (only checked in on the `redesign/scene-transitions` branch).

Token quick reference:

```
Color spine     --color-text             #0f172a (slate-900)
                --color-text-muted       #475569 (slate-600)
                --color-text-subtle      #94a3b8 (slate-400)
Surfaces        --color-bg               #ffffff
                --color-surface          #f8fafc (slate-50)
                --color-stage            #f1f3f5 (resume page)
Hero band       --color-hero-bg          #0b1220 (near-black)
                --color-hero-text        #f8fafc
                --color-accent-on-dark   #fbbf24 (amber-400)
Lines           --color-border           #e2e8f0
                --color-border-strong    #cbd5e1
Accent (one)    --color-accent           #b45309 (amber-700)
                --color-accent-hover     #92400e
Type scale      --fs-2xs through --fs-3xl on a 1.250 modular ratio
Spacing         --space-2xs through --space-3xl
Radius          --radius-sm 4 / --radius-md 8 / --radius-pill 999
```

The audit that drove the redesign and the binding spec are checked into the `redesign/scene-transitions` branch under `redesign/`. They are not on `main` (so the graded artifact stays clean).

## View transitions and animation

Astro 6's `<ClientRouter />` handles cross-page shared-element morphs natively. To opt an element into the morph, give two pages the same `transition:name`:

```astro
---
import { ClientRouter } from 'astro:transitions';
import { fade } from 'astro:transitions';
---
<HeroScene title="..." bgImage="/images/..." />
<!-- HeroScene internally emits transition:name="hero-scene"
     on the section and transition:name="hero-scene-bg" on the
     bg image. -->
```

The vanilla GSAP layer in `src/scripts/scene.ts` complements this with body-content lift on enter and a hero-bg parallax tied to scroll position. It re-binds on every `astro:page-load` event and tears down listeners on `astro:before-swap`. All animations short-circuit when `prefers-reduced-motion: reduce` is set.

## Documentation history

- [`docs/legacy/REPO_OVERHAUL_AUDIT.md`](legacy/REPO_OVERHAUL_AUDIT.md) — inherited technical audit
- [`docs/legacy/SITE_ANALYSIS_AND_IMPROVEMENT_PLAN.md`](legacy/SITE_ANALYSIS_AND_IMPROVEMENT_PLAN.md) — inherited improvement-plan rubric
- [`docs/legacy/AI_RESEARCH_PROMPT.md`](legacy/AI_RESEARCH_PROMPT.md) — inherited prompt artifact (not relevant to CISC480 submission)
- [`HANDOFF.md`](../HANDOFF.md) — the agent handoff used to drive this submission build
- `redesign/audit/visual-baseline.md`, `redesign/design-spec.md`, `redesign/animation-options.md` — present on `redesign/scene-transitions` branch only

## CI / Deploy

`.github/workflows/deploy.yml` runs on every push to `main` and on manual dispatch:

1. Checkout, Node 22 + npm cache
2. `npm ci`
3. `npm run build`
4. Upload `dist/` and deploy via `actions/deploy-pages@v4`

Repository → Settings → Pages → Source must be set to **GitHub Actions**.
