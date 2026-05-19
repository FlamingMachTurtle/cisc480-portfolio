# Redesign Spec — `redesign/scene-transitions`

> Inputs: [`redesign/audit/visual-baseline.md`](audit/visual-baseline.md) +
> the user's design directive ("more consistent, decide on a better
> theme, kill the AI-bolt-on red card, make it look like a cool screen
> where each page takes you deeper into the scene").
>
> This document is the binding spec for Phase 4 implementation. Every
> commit on `redesign/scene-transitions` must trace back to one of these
> decisions.

---

## 1. Direction — *editorial paper + cinematic dark hero*

The audit's most useful finding is that **`/resume/` is the only page
that already feels designed**. Its formula — white "paper" sheet on a
slate-100 stage, tiny SMALL-CAPS section labels, one thin underline rule
— is the spine we'll extend to the rest of the site.

To answer the user's "cool screen / deeper into the scene" ask without
scrapping that spine, we add **one new surface**: a dark photographic
hero band at the top of each page. The hero is the cinematic element;
the body below is the editorial paper. Every page navigation is a
camera-dolly through the hero into the next hero (mechanism specified in
[`redesign/animation-options.md`](animation-options.md)).

This split is deliberate:

| Region | Mood | Color mode | Where animations live |
|---|---|---|---|
| **Hero band** | cinematic, photographic | dark | view-transition + GSAP scene dolly |
| **Body content** | editorial, calm | light | quiet hover/reveal, `prefers-reduced-motion` aware |
| **Footer** | utilitarian | light gray | none |

A pure dark theme would force a redesign of the resume page (which is
working) and would risk the deadline. The hero-band-only dark surface
gets us cinematic gravity at low risk.

---

## 2. Token system — `:root` is the only place hex codes live

Implementation note: existing `src/styles/global.css` already has `:root`
custom properties. We'll extend, not replace, so component-scoped styles
that consume `var(--color-text)` still work.

### 2.1 Color tokens

```css
:root {
  /* Foreground spine (slate, neutral) */
  --color-text:        #0f172a; /* slate-900, body */
  --color-text-muted:  #475569; /* slate-600, secondary */
  --color-text-subtle: #94a3b8; /* slate-400, dates / labels */
  --color-text-inverse:#f8fafc; /* slate-50, on dark hero */

  /* Surfaces */
  --color-bg:          #ffffff; /* page */
  --color-surface:     #f8fafc; /* slate-50, panel tint */
  --color-surface-raised: #ffffff; /* card on tinted background */
  --color-stage:       #f1f3f5; /* slate-100, page stage (resume keeps this) */

  /* Hero (dark cinematic band) */
  --color-hero-bg:     #0b1220; /* near-black warm-cool blend */
  --color-hero-text:   #f8fafc;
  --color-hero-muted:  #cbd5e1;

  /* Lines */
  --color-border:      #e2e8f0; /* slate-200, default */
  --color-border-strong:#cbd5e1;/* slate-300, divider */
  --color-rule:        #1e293b; /* slate-800, resume-style rule */

  /* Accent — single warm amber for links, focus, badges, accent rule */
  --color-accent:      #b45309; /* amber-700 */
  --color-accent-hover:#92400e; /* amber-800 */
  --color-accent-soft: #fef3c7; /* amber-100, used very sparingly */
  --color-accent-on-dark: #fbbf24; /* amber-400, contrast on hero */

  /* Focus ring */
  --color-focus:       #b45309;
}
```

Why amber `#b45309` over the obvious indigo / blue:
- Differentiates from the default Bootstrap-blue look every CS portfolio
  uses.
- Pairs well with both the slate spine and the dark hero band.
- Reads as "editorial / intellectual" rather than "SaaS dashboard".
- Survives the `prefers-color-scheme: dark` follow-up cleanly because
  `--color-accent-on-dark: #fbbf24` is already defined.

### 2.2 Type scale (1.250 modular ratio rooted at 1rem)

```css
:root {
  --fs-2xs: 0.7rem;   /* 11.2px — small-caps labels */
  --fs-xs:  0.78rem;  /* 12.5px — pill text, captions */
  --fs-sm:  0.875rem; /* 14px   — body in dense panels */
  --fs-base:1rem;     /* 16px   — body */
  --fs-md:  1.125rem; /* 18px   — lead paragraphs */
  --fs-lg:  1.25rem;  /* 20px   — H3 */
  --fs-xl:  1.5625rem;/* 25px   — H2 */
  --fs-2xl: 1.953rem; /* 31.25px— H1 page title */
  --fs-3xl: 2.441rem; /* 39.06px— Hero H1 (home) */

  --lh-tight:1.25;
  --lh-snug: 1.45;
  --lh-base: 1.6;

  --tracking-caps: 0.09em;
}
```

Mapping to current elements (replaces the seven ad-hoc heading sizes
flagged in audit §1):

| Element | New token |
|---|---|
| Hero H1 (`/`) | `--fs-3xl` |
| Page H1 (other pages) | `--fs-2xl` |
| Section H2 | `--fs-xl` |
| Skill-group / panel-header | `--fs-2xs` SMALL-CAPS |
| Body paragraph | `--fs-base` |
| Resume body | `--fs-sm` (resume stays dense) |
| Pill labels | `--fs-xs` |

### 2.3 Spacing scale

```css
:root {
  --space-2xs: 0.25rem;
  --space-xs:  0.5rem;
  --space-sm:  0.75rem;
  --space-md:  1rem;
  --space-lg:  1.5rem;
  --space-xl:  2rem;
  --space-2xl: 3rem;
  --space-3xl: 4.5rem;
}
```

### 2.4 Radius scale

Audit §5 found 5 distinct values. Reducing to 3:

```css
:root {
  --radius-sm:   4px;  /* small inline tags, focus ring */
  --radius-md:   8px;  /* every card, every panel */
  --radius-pill: 999px;/* pills, avatar */
}
```

Drops `6.4px` and `6px`. Avatar still uses `50%` which is intentional.

### 2.5 Shadow scale

```css
:root {
  --shadow-1: 0 1px 2px rgba(15,23,42,0.04);
  --shadow-2: 0 1px 3px rgba(15,23,42,0.06), 0 4px 12px rgba(15,23,42,0.04);
  --shadow-3: 0 4px 16px rgba(15,23,42,0.08); /* card hover */
  --shadow-hero: 0 16px 48px rgba(0,0,0,0.35); /* on dark hero */
}
```

---

## 3. Component primitives

### 3.1 `<InfoPanel>` — replaces 4 panels and 1 banner

Single Astro component at `src/components/InfoPanel.astro`. Replaces:
- `.soar` (projects page)
- `.failure-story` (projects page)
- `.my-contribution` (projects page)
- `.capstone-banner` (home page)

```astro
---
interface Props {
  tone?: 'neutral' | 'accent' | 'muted';
  label?: string;          // small-caps header
  sublabel?: string;       // optional subhead, e.g. "Situation · Obstacle · ..."
}
const { tone = 'neutral', label, sublabel } = Astro.props;
---
<aside class:list={['info-panel', `info-panel--${tone}`]}>
  {label && (
    <header class="info-panel__head">
      <span class="info-panel__label">{label}</span>
      {sublabel && <span class="info-panel__sub">{sublabel}</span>}
    </header>
  )}
  <div class="info-panel__body">
    <slot />
  </div>
</aside>
```

Visual rules:
- Background: `--color-surface` (slate-50) for **all three** tones.
- Differentiator is a **3px left rule** in `--color-border-strong` (neutral),
  `--color-accent` (accent), or transparent (muted).
- Header label is `--fs-2xs` SMALL-CAPS in `--color-text` (neutral),
  `--color-accent` (accent), or `--color-text-muted` (muted).
- No tinted background. No colored border-all-around. No header pill.
- Padding: `var(--space-md) var(--space-lg)`.
- Radius: `var(--radius-md)`.

This is the single biggest visual change. Mockup:

```
┌──────────────────────────────────────────────────┐
│▌ SITUATION · OBSTACLE · ACTION · RESULT           │  <- left rule + caps label
│                                                   │
│  Situation   Obstacle                             │
│  ────────    ────────                             │
│  ...         ...                                  │
└──────────────────────────────────────────────────┘
```

Tone usage:
- `tone="neutral"` — gallery, contribution
- `tone="accent"` — SOAR (the SOAR is structurally the most important
  and deserves the only accent rule in a typical project entry)
- `tone="muted"` — failure-story (intentionally quieter; the failure is
  important content but should not be the loudest thing on screen)

### 3.2 `<ProjectCard>` — refactor

Today: header card grid (text+image), with per-category pink/blue/amber/
green pastel-fill badge ([`src/components/ProjectCard.astro` lines
100–130](../src/components/ProjectCard.astro)).

Refactor:
- Card body bg = `--color-surface-raised` (`#ffffff`)
- Border = `1px solid var(--color-border)`
- Radius = `var(--radius-md)`
- Hover: `box-shadow: var(--shadow-3)`, no transform
- **Badge becomes outlined-only:**
  - bg: transparent
  - color: `--color-text-muted`
  - border: `1px solid var(--color-border-strong)`
  - The category is a *label*, not a status indicator.
- Tech pills + keyword pills retain current treatment but read tokens.

### 3.3 `<HeroScene>` — new (the cinematic surface)

New Astro component at `src/components/HeroScene.astro`. Each page
imports it and provides children:
- `bgImage` — string URL of the photographic backdrop
- `title` — page title
- `eyebrow` — optional kicker (e.g. "CISC480 Senior Capstone · Spring 2026"
  on home — this is **where the pink banner content goes**, restyled)

Visual rules:
- Full-bleed dark band, ~480px tall on desktop, `min(56vh, 480px)`.
- BG image is `object-fit: cover; opacity: 0.55` on top of `--color-hero-bg`.
- Subtle gradient veil bottom-to-top from `--color-hero-bg` to transparent.
- Title is `--fs-3xl` in `--color-hero-text`.
- Eyebrow is `--fs-2xs` SMALL-CAPS in `--color-accent-on-dark`.
- This element receives `view-transition-name: hero-scene` so it can
  morph between pages in Phase 3.

The pink `.capstone-banner` is **deleted** — its course-context content
moves into the home page's `HeroScene` eyebrow.

### 3.4 Shared "page stage" wrapper

`<main>` keeps `max-width: 64rem` and centers as today; remove the
ad-hoc `max-width: 52rem` on resume in favor of a `<main class="main--narrow">`
modifier.

---

## 4. Page-by-page change list

### `src/pages/index.astro`
- DELETE: `.capstone-banner` block (lines 13–19) + its 35-line style.
- ADD: `<HeroScene title="Eli Goldberger" eyebrow="CISC480 · Senior Capstone · Spring 2026" bgImage="/images/headshot-bg.jpg or similar" />`
  - Eyebrow contains the same text the pink banner had.
- KEEP: about, skills, goals, explore, stat-row sections — but rebind to
  tokens. Reduce repeated heading sizes to `--fs-xl`.

### `src/pages/projects/index.astro`
- WRAP: `<HeroScene title="Projects & Experiences" eyebrow="Eight entries · Capstone first" bgImage="/images/greenstep/greenstep-template-form.png" />`
- REPLACE inline `.soar`/`.failure-story`/`.my-contribution` markup with
  `<InfoPanel tone="accent|muted|neutral" label="..." sublabel="..." />`.
- DELETE the corresponding `<style>` blocks.
- Galleries keep their existing structure but consume tokens.

### `src/pages/resume/index.astro`
- KEEP: paper-on-stage layout, UST shield, dividers, small-caps headings.
  This page is the design DNA.
- ADD: a tiny `<HeroScene title="Resume" eyebrow="Print, download, or read inline" bgImage="(subtle desk/paper image)" />` at the top to keep
  per-page rhythm consistent.
- TIGHTEN: rebind hardcoded `#f1f3f5` etc. to tokens.

### `src/pages/fun/index.astro`
- WRAP: `<HeroScene title="Fun Stuff" eyebrow="Hobbies · Trade shows · Experiments" bgImage="/images/b2b-shows/vegas/vegas-candy.jpg" />`
- KEEP: brand-colored link icons (correct decision).
- REBIND: hobby cards / gallery to tokens.

### `src/layouts/BaseLayout.astro`
- Header nav becomes `position: sticky` and **transparent over the hero**
  (text uses `--color-text-inverse`), then transitions to opaque white
  past hero scrollY (small JS / IntersectionObserver, ~10 lines, vanilla).
- This is what makes navigation feel like it's "above the scene."
- Footer is unchanged structurally; tokens only.

---

## 5. Accessibility & motion

- All accent-on-dark + accent-on-light combinations specified in §2.1
  pass WCAG AA at 4.5:1 minimum (verified against:
  amber-700 `#b45309` on white = 4.97:1; amber-400 `#fbbf24` on
  `#0b1220` = 8.21:1).
- Every animation in Phase 3 wraps in
  `@media (prefers-reduced-motion: no-preference)`. Reduced-motion users
  get instant page transitions, no hero parallax, no scene dolly.
- Every interactive element keeps a 2px focus ring in `--color-focus`
  with `outline-offset: 2px`.

---

## 6. What is *not* in scope this round

- Dark mode (full `prefers-color-scheme: dark` theme). Tokens are
  authored to support it later; no media-query branch ships in Phase 4.
- Mobile rework. Existing breakpoints + responsive grids carry forward
  unchanged; only the new `<HeroScene>` and `<InfoPanel>` need their
  own mobile rules.
- Content edits. No project entry copy, no reflection edits, no
  HANDOFF rewrites except the redesign notes.
- Resume content/layout. Only token rebinding.

---

## 7. File diff preview

New files (Phase 4):
- `src/components/InfoPanel.astro`
- `src/components/HeroScene.astro`
- `redesign/animation-options.md` (Phase 3)
- `redesign/audit/visual-after.md` (post-implementation pass)

Modified files (Phase 4, in commit order):
1. `src/styles/global.css` — token block rewrite
2. `src/layouts/BaseLayout.astro` — tokens + sticky transparent nav
3. `src/components/ProjectCard.astro` — tokens, outlined badge
4. `src/components/InfoPanel.astro` — new
5. `src/pages/projects/index.astro` — replace 4 ad-hoc panels with `<InfoPanel>`
6. `src/components/HeroScene.astro` — new
7. `src/pages/index.astro` — delete pink banner, wire `<HeroScene>`
8. `src/pages/resume/index.astro`, `src/pages/fun/index.astro` — `<HeroScene>` + tokens
9. View Transitions + GSAP wiring (Phase 3 output)
10. `HANDOFF.md` + `docs/DEVELOPMENT.md` — design system notes

Each step is a single commit with `npm run build` clean.
