# Visual Audit — v3 Interactions Pass (post-implementation)

> Status: **Done**, all four pages verified headlessly on the
> `redesign/scene-transitions` branch. Pairs with v1
> (`visual-after.md`), v2 (`visual-after-v2.md`), and the v3 plan
> (`interactions-research.md`).
>
> Triggers: user wanted hover effects, scroll-triggered changes,
> carousels (per the "Amine" reference), asked whether to migrate to
> React. Also flagged "I think I still see color on the left side of
> the panels."

---

## What v3 changed

### Architecture
- Added `@astrojs/react` integration; React lives only in islands.
- Static pages still render to zero-JS Astro markup; islands hydrate
  per directive.
- `framer-motion` (~30 KB gz) + `embla-carousel-react` (~10 KB gz)
  added; total client-JS budget for all interactions ≈ 50 KB gz,
  loaded only on pages where islands are present.

### Six commits on `redesign/scene-transitions`

1. `redesign(cards): kill the last left-color rule, upgrade hover feedback`
2. `redesign(audit): research why specific components read as AI-generated` (v3 prep)
3. `build: add @astrojs/react + framer-motion + embla-carousel-react`
4. `redesign(home): add infinite tech-stack marquee under Skills`
5. `redesign(motion): scroll-reveal islands on home + projects`
6. `redesign(carousel): swipeable project gallery via embla-carousel-react`

---

## Component-by-component delta

| Component | v2 | v3 |
|---|---|---|
| **`.card--capstone`** | `box-shadow: inset 3px 0 0 var(--color-accent)` (the user's "color on the left" — last instance) | shadow `none`. Importance now marked solely by the outlined `CISC480 CAPSTONE` badge. |
| **Project card hover** | `box-shadow` promotion + `border-color` darken | adds `transform: translateY(-3px)` and `:focus-within` accent border for keyboard users. Image still scales `1.03` on hover. |
| **Tech-stack lockup** | (none) | `<TechMarquee />` after home Skills. Geist-Mono items separated by 4px bullet dots, infinite leftward scroll over 50s, pauses on hover/focus. CSS mask fades both edges — no painted overlay. Zero client JS. |
| **Section reveals on scroll** | (none) | `<ScrollReveal />` React island wraps About, Skills, TechMarquee, Goals, Continue, Credits on home; wraps each project entry on projects page. 16px upward translate + opacity 0→1, 600ms cubic-bezier(0.22, 1, 0.36, 1), `useInView` once. Reduced-motion: noop render. |
| **Project gallery (>2 images)** | static grid of figures | `<ProjectGalleryCarousel />` React island via embla. Snap-scroll, swipe/touch, prev/next outlined chevron buttons, dot pagination (active dot expands into amber pill), arrow-key navigable, ARIA carousel/slide roles. |
| **Project gallery (≤2 images)** | static grid | unchanged static grid (carousel would be overkill). |
| **Resume page** | unchanged | unchanged. Zero JS shipped. |

---

## Programmatic verifications (live preview)

### Projects page
```
.card--capstone { box-shadow: 'none' }                     // ✓ (was: inset 3px ...)
.card--capstone { transition: 'box-shadow 0.25s, border-color 0.25s, transform 0.25s' }
.pgc count                              = 1                 (Hydreon, 5 images)
.pgc__slide count (in .pgc)             = 5
.pgc__btn count (in .pgc)               = 2 (prev / next)
.pgc__dot count (after hydration)       = 4
project-group count                     = 8 (each wrapped in ScrollReveal)
```

### Home page
```
.marquee-section                        = 1
.marquee__row li count (with duplicate) = 36 (18 originals × 2)
animation-name on .marquee__track       = 'marquee-scroll'
ScrollReveal islands (motion.divs)      = 6
```

### Codebase
```
rg "border-left:|inset 3px|inset 4px|inset 5px|inset 0 0 0 3px"
  → No matches found
```

The "color on the left side of the panels" the user flagged is now
verifiably gone everywhere.

---

## Editorial constraints honoured (binding)

- No 3D tilt cards. No glow borders. No animated gradient text.
- No cursor blob / particle trails. No WebGL backgrounds.
- Carousel chrome stays inside the editorial budget: outlined-only
  prev/next buttons, hairline-bordered slide images, no card body
  around each slide.
- Marquee items are mono small-caps tags separated by middle-dot
  bullets — same convention as the home Skills definition list, so
  the marquee reads as a continuation of that voice rather than a
  separate visual style.
- Reveal animation is intentionally subtle (16px translate, not
  60px; opacity 0 → 1, no scale or rotation).
- Card-hover lift is `translateY(-3px)` only — not the 6-12px lift
  + heavy drop-shadow that screams shadcn `<Card hover>`.

---

## Accessibility / motion preferences

- Every component has a `prefers-reduced-motion: reduce` branch.
  Marquee freezes and converts to a horizontally-scrollable list.
  ScrollReveal renders children with no motion wrapper.
  Carousel transitions drop to 0ms.
- Carousel exposes `role="carousel"` / `role="tab"` /
  `aria-selected` / `aria-roledescription` correctly.
- Prev/next buttons disable themselves at the edges
  (`canScrollPrev` / `canScrollNext`).
- ScrollReveal renders the underlying tag (`section` / `div`) so
  semantic structure is preserved.
- Tab order: marquee items are not interactive, no focus traps. The
  carousel section is itself tabbable (tabIndex=0) so arrow-key
  nav works as expected.

---

## Bundle / performance impact

| Page | Before v3 | After v3 |
|---|---|---|
| `/` | 0 KB JS | ~95 KB gz (React + framer-motion, shared) |
| `/projects/` | 0 KB JS | ~105 KB gz (React + framer-motion + embla) |
| `/fun/` | 0 KB JS | 0 KB JS (no islands yet — v3 didn't touch this page beyond what v2 did) |
| `/resume/` | 0 KB JS | 0 KB JS |

The shared React + framer-motion bundle is cached after the first
page load; subsequent navigations benefit from view transitions
keeping the same hydrated React runtime alive between pages.

---

## What we did NOT do (deliberate)

- **Skip:** magnetic CTA buttons. Our CTAs are typographic links
  inside an editorial article, not standalone marketing buttons.
  Adding cursor-attraction would feel out of register.
- **Skip:** scroll-velocity text. It's a strong signature move but
  reads as the literal "Linear/Vercel template" tell at scale.
- **Skip:** any react-bits/magicui WebGL or cursor-effect
  components. Direct violations of the v2 audit's editorial
  constraints.
- **Skip:** scroll-driven view transitions between cards. Our pages
  already have Astro view transitions cross-page and a GSAP scene
  layer; layering scroll-driven transforms on top would double-count.

---

## Status for submission day

- All v3 commits land on `redesign/scene-transitions`.
- `npm run build` passes clean (4 pages, ~3s).
- `redesign/scene-transitions` does not affect `main`. The
  `submission-2026-05-20` tag still points at the stable main HEAD
  for the Wednesday-5pm graded artifact.
- After grading, the redesign branch can be fast-forwarded if
  desired. All work is reversible and isolated.
