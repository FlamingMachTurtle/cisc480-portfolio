# Developer Notes — CISC480 Portfolio Site

This file holds the technical README that used to live at the repo root. It is intentionally kept short and oriented toward future development; the graded artifact lives in [`README.md`](../README.md) (the reflection essay).

---

## Stack

- **Astro v6** (static output)
- Content collections: `src/content/projects/*.md`, schema in `src/content.config.ts`
- Shared layout: `src/layouts/BaseLayout.astro` — sticky nav, skip link, OG/canonical meta
- Components: `src/components/ProjectCard.astro`
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
- `category?: 'cs' | 'interdisciplinary' | 'outside-cs' | 'capstone'` — drives the colored badge in the top-left of the card
- `myContribution?: string` — renders as a highlighted yellow callout under the card (use for group-project entries)
- `soar?: { situation, obstacle, action, result }` — renders as a structured blue block
- `failureStory?: { context, whatHappened, learning }` — renders as a structured pink block

## Adding a project entry

1. Drop a new file in `src/content/projects/<slug>.md`.
2. Set `category`, `sortOrder` (lower = earlier on page), `image`, `imageAlt`, and `tech`.
3. Add `keywords`; also weave them into the `description` prose (the rubric requires keywords in both places).
4. Add `soar` and/or `failureStory` blocks if you want the structured renderings.
5. If the entry is a group project, fill in `myContribution`.
6. If it needs an inline gallery, add a new key to the `galleries` map in `src/pages/projects/index.astro` matching the file's slug.

## Documentation history

- [`docs/legacy/REPO_OVERHAUL_AUDIT.md`](legacy/REPO_OVERHAUL_AUDIT.md) — inherited technical audit
- [`docs/legacy/SITE_ANALYSIS_AND_IMPROVEMENT_PLAN.md`](legacy/SITE_ANALYSIS_AND_IMPROVEMENT_PLAN.md) — inherited improvement-plan rubric
- [`docs/legacy/AI_RESEARCH_PROMPT.md`](legacy/AI_RESEARCH_PROMPT.md) — inherited prompt artifact (not relevant to CISC480 submission)
- [`HANDOFF.md`](../HANDOFF.md) — the agent handoff used to drive this submission build

## CI / Deploy

`.github/workflows/deploy.yml` runs on every push to `main` and on manual dispatch:

1. Checkout, Node 22 + npm cache
2. `npm ci`
3. `npm run build`
4. Upload `dist/` and deploy via `actions/deploy-pages@v4`

Repository → Settings → Pages → Source must be set to **GitHub Actions**.
