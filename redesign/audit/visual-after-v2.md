# Visual Audit — v2 Editorial Pass (post-implementation)

> Status: **Done**, all four pages verified headlessly on the
> `redesign/scene-transitions` branch. Paired with the v1
> `visual-after.md` from the previous round.
>
> Trigger: user requested move away from "obvious AI-generated look,"
> specifically the side color on panels, and asked for "better ways to
> communicate information than just basic panels … cohesive and
> creative but good and professional."

---

## What v2 changed (delta from v1 audit)

The v1 redesign already removed the rainbow palette, the three
inconsistent panel families, and the pink hero banner. v2 attacks the
remaining layer of "AI-tutorial" chrome — the borders, tints, rounded
boxes, and tile grids that read as Tailwind UI / shadcn / MUI Alert
even when the palette was clean.

Six commits on `redesign/scene-transitions`, in order:

1. `redesign(audit)` — `redesign/audit/ai-tells.md` cataloging which
   conventions read as AI vs editorial and why.
2. `redesign(typography)` — Geist + Geist Mono variable fonts, tabular
   nums + `ss01` stylistic alternates globally, mono utility class.
3. `redesign(editorial)` — `<InfoPanel>` rewrite (no chrome at all,
   just hairline rule + small-caps kicker with optional mono index)
   and projects entries restructured as numbered editorial articles.
4. `redesign(home)` — every body section refactored: combo-cards,
   skills cards, explore tiles, stat row.
5. `redesign(fun)` — same sweep: link cards, hobby cards, gallery
   figures.
6. `redesign(audit)` — this document.

---

## Component-by-component delta

| Component | v1 (post-redesign) | v2 (this pass) |
|---|---|---|
| **InfoPanel** | tinted bg + 3px left rule + small-caps pill header (shadcn `<Alert>` tell) | hairline-rule above + small-caps kicker label, optional mono index "01 /". No bg, no rule, no border, no radius. |
| **Project entries** | 3 stacked panels, each with the alert chrome | numbered editorial article: `01 / Contribution`, `02 / Approach`, `03 / What I learned`, `04 / Gallery`. Each section delimited by a single hairline rule and a kicker label. |
| **SOAR grid** | 2x2 dl inside a tinted alert | 2x2 dl with a mono "01"/"02"/"03"/"04" prefix beside each step's small-caps label, no panel chrome. The four-step arc is now visible at a glance via numerals. |
| **Failure-story stack** | 3-row dl inside a tinted alert | 3-row dl with same mono numbered prefix pattern. |
| **Inline gallery** | tinted surface + bordered figures | hairline rule + numbered kicker, figures are images with hairline borders only, captions in plain text below. |
| **Home About** | 2 bordered tinted cards (Tailwind UI feature-grid tell) | typographic two-column comparison with a single vertical hairline divider between columns. List markers became thin slate dashes instead of bullets. |
| **Home Skills** | 4-up bordered card grid with rounded pill tags (Tailwind UI tag-set tell) | definition-list. 12rem small-caps left column, items in Geist Mono separated by `  ·  ` in the right. Hairline between rows. No card chrome. |
| **Home Explore** | 3-column CTA tile grid with bg-seam dividers (one of the most-used AI scaffolds in 2024-26) | 3 hairline-separated rows under a "CONTINUE" kicker. Each row: `→` mono arrow + title + dimmer description. |
| **Home Stat row** | 3-column flex with vertical dividers (Tailwind UI marketing-stats tell) | film-credits-style 3-line block. Mono `LATEST` / `FOCUS` / `AVAILABLE` labels in fixed left column, prose body in sans on the right. No vertical dividers. |
| **Home "Net-net:" framing** | bold body word | small-caps mono kicker "NET-NET —" inline with prose. Editorial cue, not emphasized body type. |
| **Fun Links & Media** | 3 bordered tinted cards with colored icon-square (shadcn icon-link tell) | 3 hairline-separated rows. Small inline brand-color glyph (no colored backing square) + name + description. Whole row is the link. |
| **Fun Hobbies** | 3 bordered tinted cards with `border-left: 3px solid` — *the literal target of the user's "side color" complaint* | definition-list, same pattern as Skills. |
| **Fun Gallery** | bordered tinted figures with internal padding | minimal figures: hairline-bordered images with captions in plain text below. |
| **Resume** | unchanged — was the editorial-DNA reference | unchanged structurally; gets Geist as body font (subtle improvement). |
| **Hero band** | unchanged | unchanged structurally; gets Geist; reads more refined at display sizes thanks to `-0.015em` heading track. |
| **Site header / footer** | unchanged | unchanged. |
| **View transitions + GSAP** | wired | unchanged. |

---

## Quantified verifications (programmatic, headless)

Each ran in a fresh `npm run preview` headless session at the live
build of the relevant page.

### Projects page
```
sections.every(p => p.bg === 'rgba(0, 0, 0, 0)')   // true (no tint)
sections.every(p => p.boxShadow === 'none')        // true (no left rule)
sections.every(p => p.borderTop === '1px rgb(226,232,240)')  // true (hairline)
font-family includes 'Geist Variable'              // true
font-feature-settings === '"tnum", "ss01"'         // true
```

### Home page
```
querySelector('.combo-card')   // null  (was: 2)
querySelector('.skill-group')  // null  (was: 4)
querySelector('.explore-item') // null  (was: 3)
querySelector('.stat-divider') // null  (was: 2)
.combo, .skills-row, .explore li, .credits-row counts: 2, 4, 3, 3
```

### Fun page
```
querySelector('.hobby-item')   // null  (was: 3)
querySelector('.link-card')    // null  (was: 3)
.hobbies-row, .links-list li counts: 3, 3
```

### Resume page
```
font-family includes 'Geist Variable'  // true
structure: unchanged; section heads still small-caps with underline.
```

---

## What we did NOT change (and why)

- **Token system** in `:root` (palette, type scale, spacing, radius,
  shadow). v2 lives entirely in component-level CSS — tokens are the
  spec, behavior consuming them is the deliverable.
- **HeroScene** dark band — already editorial, just gets Geist.
- **Resume "paper on stage"** — was the design-DNA reference for the
  editorial pass.
- **Astro View Transitions + GSAP scene layer** — the animation
  story carries forward unchanged.
- **The single warm amber accent + slate spine palette.**
- **Brand-correct icon colors on Links & Media** (GitHub charcoal,
  LinkedIn `#0077b5`, 90-Day Showcase amber). Brand identity > palette
  uniformity here — but the *colored square backing* is gone, only
  the glyph carries color.

---

## Risk register, post-implementation

- **Geist load weight**: ~80 KB woff2 per face, two faces, served
  from `node_modules/@fontsource-variable` and built into the static
  output. Acceptable; first paint still hits within a single
  font-display: swap cycle.
- **Density vs whitespace**: removing chrome makes some sections feel
  denser. Compensated for by promoting top-level section margins from
  `--space-2xl` → `--space-3xl`, and by tighter line-heights so the
  hairlines sit visually neutral.
- **Numbered editorial sections** (`01 / Contribution`) applied only
  to project entries, deliberately. Home and fun page section heads
  do **not** carry numerical prefixes — that would feel template-y,
  not editorial. The numbering signals "this is a multi-section
  article" only where the structure is genuinely article-shaped.
- **Pull-quote / sidenote moves not yet introduced**. v2 stopped at
  hairline-rule + kicker structure, which is the minimum-disruption
  editorial move. Bigger moves (real pull-quote, marginalia,
  drop-caps) could come in v3 if the user wants more density of
  voice; deferred for now.

---

## Status for submission day

- All v2 commits land on `redesign/scene-transitions` (six total).
- `npm run build` passes clean (4 pages, ~8s).
- `redesign/scene-transitions` does not affect `main`. The
  `submission-2026-05-20` tag still points at the stable main HEAD.
- Decision still open per `redesign/decision-gate.md`: keep redesign
  off main for the May 20 graded artifact, fast-forward post-grading
  if desired.
