# Visual After Audit — `redesign/scene-transitions` HEAD

> Post-implementation companion to
> [`redesign/audit/visual-baseline.md`](visual-baseline.md). Captured
> Mon May 18, 2026 against the same `npm run preview` URL,
> immediately after the seven implementation commits landed (head
> `9d7445d`).

---

## 1. Side-by-side: the panel rainbow is dead

| Metric | Baseline | After | Delta |
|---|---:|---:|---:|
| Distinct panel backgrounds on `/projects/` | **8** | **2** | -75% |
| Distinct panel left-rule / accent colors | 4 (blue, pink, yellow, slate) | 2 (slate-300, amber-700) | -50% |
| Badge fill colors (pink/blue/amber/green pastel) | **4** | **0** (all outlined-only) | -100% |
| Border-radius distinct values site-wide | 5 (`999, 8, 6.4, 4, 6, 50%`) | 4 (`999, 8, 4, 50%`) | dropped 6.4 + 6 |
| Heading sizes referenced by ad-hoc px | 7 distinct | All on `--fs-*` token scale | unified |
| `/projects/` scrollHeight | 9524px | 9213px | -3% (despite +360-480px hero) |
| `/` page hex codes hard-coded outside `:root` | dozens | 0 | full tokenization |

## 2. Per-page after-state

### Home `/`
- Pink `.capstone-banner` deleted. Course-context content now lives
  in the `<HeroScene>` eyebrow at the top of the page.
- Hero is 480px tall (`tall` flag), imageless, with a textured warm/cool
  gradient veil and the "CISC480 · SENIOR CAPSTONE · SECTION 02 ·
  SPRING 2026" label in amber small-caps.
- Body: about + skills + goals + explore + stats. All token-bound.
- Combo cards on About Me now use the same `border-left: 3px solid`
  pattern as `<InfoPanel>` for consistency.
- `scrollHeight` 2188px → 2452px (+12% from the hero band).

### Projects `/projects/`
- Hero backdrop is the GreenStep template-form screenshot at 0.55
  opacity behind the dark veil — the page literally opens with the
  capstone admin console as cinematic backdrop.
- Every entry now reads as one panel family. Confirmed via
  `getComputedStyle`: the capstone entry's seven children below the
  card share two backgrounds (`#fff` card body and `#f8fafc` panels).
- The capstone card carries:
  - outlined amber badge `[ CISC480 CAPSTONE ]` (transparent fill,
    amber-700 text + border)
  - 3px amber `box-shadow: inset 3px 0 0 var(--color-accent)` on its
    leading edge — marking importance without shouting
- SOAR is the only accent-rule panel inside any entry (3px amber + amber
  small-caps label). Failure-story is muted (3px slate-300 +
  slate-600 label). Contribution is neutral.

### Resume `/resume/`
- Deliberate spec deviation: no HeroScene. The "paper on stage"
  aesthetic flagged in `visual-baseline.md` §7 as the design DNA
  reference is preserved untouched.
- Sticky nav uses `staticHeader={true}` so it's opaque from page load.
- Resume stage now consumes `--color-stage` token and uses the same
  `calc(50% - 50vw)` bleed-out trick as `<HeroScene>` for full-bleed
  background.

### Fun `/fun/`
- Hero backdrop is the Vegas KitKat lineup photograph at 0.55 opacity.
- Hobby cards get the same `border-left: 3px` rule treatment as
  combo cards on home — visual rhyme across pages.
- Brand-correct icon colors (GitHub black, LinkedIn `#0077b5`) preserved
  per the audit's note that brand identity beats palette uniformity in
  this one place. The "showcase" icon was migrated from raw `#2563eb`
  to `var(--color-accent)` so it picks up the new amber.

## 3. View transitions verified

Programmatically confirmed at the end of the implementation:

```
hero-scene             present on every page that uses HeroScene
hero-scene-bg          present on every page with a bgImage
project-{slug}         present on every ProjectCard with transitionId
```

Cross-page navigation home → projects under headless puppeteer
successfully transitions both the hero band and its bg image (the
amber dark band on home morphs into the GreenStep-screenshot dark
band on projects).

## 4. Animations + motion

GSAP scene script at `src/scripts/scene.ts` runs on every
`astro:page-load`. Two effects:

1. Body content lift: `main > :not(.hero-scene)` enters with
   `y: 18, autoAlpha: 0, stagger: 0.06s, duration: 0.5s, ease: power2.out`.
2. Hero parallax: `.hero-scene__bg` scales `1 → 1.06` and translates
   `y * 0.18` as the user scrolls past the hero, RAF-throttled.

Reduced-motion handling:
- `:root` `prefers-reduced-motion: reduce` global rule kills all CSS
  transitions/animations site-wide.
- `scene.ts` short-circuits both effects.
- Astro `<ClientRouter />` falls back to instant nav (browser-level).

## 5. Bundle delta

| File | Size (min) |
|---|---:|
| `dist/_astro/BaseLayout...js` (GSAP + scene.ts + sticky-header) | 70.9 KB |
| `dist/_astro/ClientRouter...js` | 15.8 KB |
| **Total redesign cost** | **~87 KB** |

Estimated ~28-30 KB gzipped. Within the budget specified in
`animation-options.md`.

## 6. What is NOT done in this round

- Project-detail pages. Currently every project lives inline on
  `/projects/`, so the per-card `transition:name="project-{slug}"`
  doesn't yet pair with a destination. Adding `/projects/[slug]/`
  pages with the same name on the destination hero would unlock the
  "click thumbnail → zooms into hero" flow. Deferred (post-grading).
- `prefers-color-scheme: dark` full theme. Tokens are authored to
  support it.
- Mobile-specific hero treatment beyond the existing min-height +
  font-size breakpoint at 640px.
- Theatre.js camera-dolly version (approach C from animation-options).
