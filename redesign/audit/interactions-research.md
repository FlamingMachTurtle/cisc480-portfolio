# Interaction Patterns — React Bits + Magic UI Research

> Companion to `redesign/audit/ai-tells.md`. Written after a headless
> review of reactbits.dev and magicui.design to decide which
> animation patterns map to our editorial direction and which would
> re-introduce AI-tutorial chrome.

---

## Question

The user wants hover effects, scroll-triggered changes, and carousels
(per the "Amine" portfolio reference). They asked whether we should
switch the project to React.

## Recommendation

**Don't migrate.** Add React **islands** via `@astrojs/react`. Astro's
killer feature is hybrid rendering — pages stay statically generated
in Astro for free, while specific interactive components run as
client-side React, hydrated only when needed. We get the React +
framer-motion + embla ecosystem for the things that genuinely need
it, and ship zero JS for everything else.

This preserves:

- The editorial structure built in v1 + v2.
- Astro's view transitions (already wired).
- The GSAP scene layer (already wired).
- Geist + Geist Mono and the full `:root` token system.

---

## Library landscape

### React Bits (`reactbits.dev`)

- **Distribution model:** copy-paste components, Tailwind + framer-motion-based.
- **Marquee equivalent:** `Logo Loop` — exactly the pattern from the
  user's inspiration site. Configurable direction/speed/gap/fade-out/
  scale-on-hover. Useful as inspiration; we'll hand-roll a smaller
  CSS-only equivalent that fits our token system.
- **Useful conceptually:** Logo Loop, Animated Content (scroll
  reveal), Fade Content, Magnet (cursor-attraction), Animated List
  (staggered list), Carousel.
- **Avoid:** every cursor effect (Blob/Ghost/Target/Splash Cursor),
  every WebGL background (Aurora, Beams, Ballpit, Balatro, Ribbons,
  Magic Rings, Pixel Trail, Magnet Lines), Tilted Card, Spotlight
  Card, Reflective Card, Fluid Glass, Magic Bento, Chroma Grid,
  Star Border, Border Glow, Electric Border, Glitch Text, Shiny
  Text, Gradient Text, Fuzzy Text, ASCII Text. The library's own
  landing page is built on the literal aurora-purple aesthetic our
  audit calls out as AI slop — we're using it for component ideas,
  not visual direction.

### Magic UI (`magicui.design`)

- **Distribution model:** shadcn registry (`shadcn add @magicui/x`).
  We are not on shadcn, so direct install isn't appropriate; same
  inspiration-only treatment as React Bits.
- **Useful conceptually:** Marquee, Bento Grid (with restraint), Icon
  Cloud, Animated Beam, Number Ticker, Animated List.
- **Avoid:** the same neon/glow/gradient family.

---

## Decision matrix — which patterns to adopt

Five interaction layers map cleanly to our editorial direction. The
others either duplicate what we have or fight the aesthetic.

| Pattern | Adopt? | Implementation |
|---|---|---|
| **Tech-stack marquee** (logo loop) | ✓ | CSS-only Astro component. Pause-on-hover. Prefers-reduced-motion off-switch. No React needed. |
| **Scroll-reveal** (fade-up on viewport entry) | ✓ | React island via `framer-motion`'s `useInView`. 12-16px Y translate + opacity 0 → 1. Triggers once per element, then unobserves. |
| **Card hover-lift** (Y translate + shadow promote) | ✓ | CSS-only. Already added to `ProjectCard`, will extend to home Continue links and fun Links. |
| **Project gallery carousel** | ✓ | React island via `embla-carousel-react`. Snap-scroll, prev/next, dot pagination, keyboard navigable. Replaces the current static grid for entries with multiple images. |
| **Magnetic CTAs** | — | Skip for now. The portfolio's CTAs are typographic links inside an editorial article, not standalone marketing buttons. Adding cursor-attraction would feel out of register. |
| **3D tilt cards / glow borders / animated gradient text** | ✗ | These are the v2 audit's "AI tells" wearing animation costumes. Hard skip. |
| **Cursor blob / particle trails** | ✗ | Decorative noise that fights the editorial frame. Hard skip. |
| **WebGL backgrounds** (Aurora, Beams, etc.) | ✗ | Heavy + the literal "AI slop" aesthetic. Hard skip. |

---

## Dependency plan

```
@astrojs/react           # Astro integration (handles config, deps)
react + react-dom        # Pulled in by the integration
framer-motion            # ~30 KB gzipped — for ScrollReveal, future motion
embla-carousel-react     # ~10 KB gzipped — for ProjectGalleryCarousel
```

Total client-JS budget for the new interactions: < 50 KB gzipped,
loaded only on pages where the islands are present
(`client:visible` directive on each).

---

## Token-system constraints (binding for v3)

- Marquee row uses `--color-border` for the fade-out edge mask, no
  hard color.
- Card-hover transform = `translateY(-3px)`, transition 250ms ease.
  Shadow promotes from 0 to `--shadow-3`.
- Carousel uses `--color-border` for the prev/next button outlines
  and `--color-text-muted` for inactive dots, `--color-accent` for
  the active dot.
- All interactions disable themselves under
  `prefers-reduced-motion: reduce` — the existing global rule in
  `global.css` already handles `transition-duration` and
  `animation-duration`; framer-motion respects the media query when
  configured to.

---

## Status

Research complete. Proceed to implementation in the order:

1. `@astrojs/react` + framer-motion + embla install
2. `<TechMarquee />` (Astro, CSS-only)
3. `<ScrollReveal />` (React island)
4. Card hover-lift extensions (CSS)
5. `<ProjectGalleryCarousel />` (React island)
6. Wire into `index.astro`, `projects/index.astro`, `fun/index.astro`
7. Verify, screenshot, commit per component, push.
