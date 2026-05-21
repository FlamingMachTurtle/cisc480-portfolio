# Visual Baseline Audit — `submission-2026-05-20`

> Headless puppeteer review of all four pages of the CISC480 portfolio,
> captured locally from `npm run preview` against
> `http://127.0.0.1:4321/cisc480-portfolio/` on Mon May 18, 2026.
> Tag of record: `submission-2026-05-20` (commit `b748233`).
> This audit is the input spec for `redesign/design-spec.md`.

---

## 1. Per-page measurements

| Page | Path | scrollHeight | Distinct H2 sizes | Distinct accent BGs |
|---|---|---:|---:|---:|
| Home | `/` | 2188px | 1 (21.6px) | 4 (slate, pink banner, pink pill, footer gray) |
| Projects | `/projects/` | **9524px** | 1 (21.6px) | **8** (see §3) |
| Resume | `/resume/` | 1600px | 1 (11.52px small-caps) | 2 (paper white, stage `#f1f3f5`) |
| Fun | `/fun/` | 1600px | 1 (19.2px) | 1 (`#f8fafc` hobby cards) plus 3 brand-colored link icons |

Heading sizes are **not on a coherent scale** across pages:

| Element | Page | Computed font-size |
|---|---|---:|
| H1 hero | Home | 32px |
| H1 page title | Projects / Fun | implied via h1 default |
| H2 section | Home / Projects | 21.6px |
| H2 section | Fun | 19.2px |
| H2 small-caps | Resume | 11.52px |
| H3 skill group | Home | 13.6px |
| Resume name | Resume | 24.8px |

There is no shared modular scale. Heading hierarchy reads differently on every page.

---

## 2. Top finding — "the red card on top" is not one card; it is six

The user's complaint about "AI additions looking out of place" maps cleanly to
the project page's stacked-panel architecture. Inside a single project entry
(GreenStep capstone is the worst case), the reader sees this sequence of
fully-different visual treatments:

1. White `.card` body with a **pink filled `.card-badge--capstone` pill**
   (`#fce7f3` bg / `#be185d` text)
2. Yellow `.my-contribution` callout (`#fef9c3` bg / `#92400e` label)
3. Blue `.soar` panel (`#eff6ff` bg / `#1d4ed8` badge / `#1e3a8a` dt)
4. Pink/red `.failure-story` panel (`#fff1f2` bg / `#be123c` badge /
   `#9f1239` dt)
5. Slate `.inline-gallery` strip (`#f8fafc` bg / `#e2e8f0` border)
6. (For the home page) the loud pink `.capstone-banner` at the very top of `/`
   (`#fdf2f8` bg / `#fbcfe8` border / `#fce7f3` pill / `#be185d` text)

**Six adjacent surfaces, six different palettes, six different header
treatments.** That is what reads as "AI bolt-on" — the entry was assembled
out of independently-styled blocks and never harmonized.

Per the user's confirmed answer ("all of the above"), every one of these
treatments is in scope for the redesign.

---

## 3. Panel inventory (hard data from `getComputedStyle`)

| Panel | Selector | Background | Border | Radius | Padding |
|---|---|---|---|---|---|
| Card | `.card` | `#ffffff` | `#e2e8f0 1px` | `8px` | `0` (body 28px/24px) |
| SOAR | `.soar` | `#eff6ff` | `#bfdbfe 1px` | `6.4px` | `16 18.4` |
| Failure | `.failure-story` | `#fff1f2` | `#fecdd3 1px` | `6.4px` | `16 18.4` |
| Contribution | `.my-contribution` | `#fef9c3` | `#fde68a 1px` | `6.4px` | `13.6 17.6` |
| Gallery | `.inline-gallery` | `#f8fafc` | top: `0px` solid `#1a1a1a` | `0 0 8px 8px` | `16 20` |
| Capstone banner | `.capstone-banner` | `#fdf2f8` | `#fbcfe8 1px` | `8px` | `9.6 13.6` |
| Stat row | `.stat-row` | (none) | top: `1px solid #e2e8f0` | `0` | `28 0 0 0` |
| Skill group | `.skill-group` | `#ffffff` | `#e2e8f0 1px` | `8px` | `14.4 16` |
| Combo card | `.combo-card` | `#f8fafc` | `#e2e8f0 1px` | `8px` | `16 17.6` |
| Hobby item | `.hobby-item` | `#f8fafc` | `#e2e8f0 1px` | `8px` | `14.4 16` |
| Link card | `.link-card` | `#ffffff` | `#e2e8f0 1px` | `8px` | `16 17.6` |

Observations:
- Five panels (`card`, `skill-group`, `combo-card`, `hobby-item`, `link-card`)
  already share `8px` radius + `#e2e8f0` border + slate-100ish backgrounds.
  These are de-facto the "neutral" tone and need no color change — only
  consolidation behind a single component.
- Four panels (`soar`, `failure-story`, `my-contribution`, `capstone-banner`)
  introduce four different *content-tinted* backgrounds with header pills.
  These are the AI-bolt-on panels and the redesign target.
- All four content-tinted panels even agree on a `6.4px` (≈ `0.4rem`) radius,
  which is *different from* the `8px` (`0.5rem`) radius used everywhere else.
  No reason for this drift; consolidate to one radius token.

---

## 4. Badge inventory

| Badge variant | BG | Text | Border |
|---|---|---|---|
| `card-badge--capstone` | `#fce7f3` (pink) | `#be185d` | `#fbcfe8` |
| `card-badge--cs` | `#eff6ff` (blue) | `#1d4ed8` | `#bfdbfe` |
| `card-badge--interdisciplinary` | `#fef3c7` (amber) | `#b45309` | `#fde68a` |
| `card-badge--outside-cs` | `#dcfce7` (green) | `#15803d` | `#bbf7d0` |

Four full-fill pastel pills. Each one collides with the panels below the
card it sits in (e.g., pink capstone badge above pink failure panel; blue
CS badge above blue SOAR). Ditto: `card-badge--cs` and `.soar` use the
**exact same blue palette**, so the badge visually merges into the panel
header below. Same for `card-badge--capstone` + `.capstone-banner`.

Recommended consolidation: **one outlined badge** (transparent bg, single
accent border + color, no fill) with the label being the only differentiator.

---

## 5. Border-radius inventory (whole site, from home page sample)

| Radius | Count |
|---:|---:|
| `999px` (pills) | 29 |
| `8px` | 7 |
| `6.4px` (≈ 0.4rem) | from §3 — 4 panels |
| `4px` | 1 |
| `50%` (avatar) | 1 |
| `6px` | 1 |

Recommended scale: `--radius-pill: 999px`, `--radius-md: 8px`,
`--radius-sm: 4px`. Drop the `6.4px` and `6px` outliers.

---

## 6. Color audit summary

Distinct accent backgrounds currently in production (excluding pure
black/white/transparent and base text):

| Hex | Used by | Notes |
|---|---|---|
| `#f1f5f9` | pill list, card-tech | Fine — neutral-100 |
| `#f8fafc` | combo-card, gallery, hobby-item, explore tile | Fine — neutral-50 |
| `#e2e8f0` | every border + stat-row separator | Fine — neutral-200 |
| `#fdf2f8` | **capstone-banner** | DROP |
| `#fce7f3` | **capstone-banner pill, capstone badge** | DROP |
| `#fbcfe8` | **capstone-banner border, capstone badge border** | DROP |
| `#eff6ff` | SOAR, CS badge | Consolidate to `--accent-soft` |
| `#bfdbfe` | SOAR border, CS badge border | Consolidate |
| `#fff1f2` | **failure-story** | Replace with neutral-tone variant of InfoPanel |
| `#fecdd3` | failure-story border | Replace |
| `#fef9c3` | **my-contribution** | Replace |
| `#fde68a` | my-contribution border | Replace |
| `#fef3c7` | interdisciplinary badge | Drop fill — use outline only |
| `#dcfce7` | outside-cs badge | Drop fill — use outline only |

Net: **8 distinct accent surface colors get reduced to 2** (one accent +
one neutral panel tint), with category badges becoming outlined-only.

---

## 7. The resume page is the design DNA reference

Of the four pages, `/resume/` is the only one without a panel-rainbow
problem. It uses:

- A single white "paper" sheet on a slate-100 stage (`#f1f3f5`)
- Section headings as **tiny SMALL-CAPS in slate-900** with a single thin
  underline rule
- Dates in muted gray, body in slate-800
- One serif-free system stack
- One accent decoration (the UST shield, top-right)

The redesigned home + projects + fun pages should adopt this palette and
heading rhythm. The "loud" treatments on the other three pages are
inherited from the AI-scaffolded panel components, not from any deliberate
design system.

---

## 8. Concrete deliverables this audit asks `design-spec.md` to define

1. **One token palette in `:root`** — `--accent`, `--accent-soft`,
   `--surface`, `--surface-raised`, `--surface-muted`, `--border`,
   `--text`, `--text-muted`, `--text-subtle`. No more direct hex values
   in component styles.
2. **One panel primitive** (`<InfoPanel tone="neutral" | "accent" |
   "muted">`) replacing `.soar`, `.failure-story`, `.my-contribution`,
   `.capstone-banner`. Tone changes the header label color and a thin
   left rule, not the entire background.
3. **Outlined-only category badge** — same border/text color, no fill.
4. **Modular type scale** — pick a 1.250 ratio rooted at 1rem; map every
   heading to `--fs-{xs,sm,base,md,lg,xl,2xl}`.
5. **Quiet course-context strip on `/`** — replace the pink banner with
   a small-caps slate label + thin rule, same visual weight as a resume
   section header.
6. **Reduce radius scale to {`--radius-sm: 4px`, `--radius-md: 8px`,
   `--radius-pill: 999px`}.**

---

## 9. Method note

This baseline was produced via headless puppeteer (1920×1080 viewport)
against a local `npm run preview` server. Screenshot artifacts are
ephemeral (rendered inline during the review session) — programmatic
facts captured via `getComputedStyle` are the durable record above.
A subsequent audit pass on `redesign/scene-transitions` head will be
written as `redesign/audit/visual-after.md` once the implementation
lands, for a clean before/after comparison.
