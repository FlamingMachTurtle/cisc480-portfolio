# V4 — Density & Interactive Disclosure Pass

> Companion to `ai-tells.md`, `visual-after-v2.md`, `interactions-research.md`,
> and `interactions-after.md`. Driven by user feedback on the
> `redesign/scene-transitions` branch:
>
> > "remove the references to future patients in the net net im not going to be
> > a doctor. overall try to keep things concise and information rich but not
> > overwhelming with the amount of text. be creative with how you present
> > things and use animations to save space and interactions like hover and
> > clicking to flip panels."

---

## Goals

1. **Specific fix.** Remove every "future patients" reference from the site
   and the README. Eli is not pursuing medicine.
2. **Density.** Reduce text volume across the site without losing
   rubric-required content (project keywords, personal contribution,
   technical depth). Tighten verbose prose; never tighten the technical
   substance the rubric grades.
3. **Interactive disclosure.** Replace always-visible content blocks with
   click-to-disclose patterns where the content is dense enough that hiding
   it on first view actively helps scannability. Save vertical space without
   removing information from the DOM.

## Decisions

### What got tightened

| Surface | Before | After | Notes |
|---|---|---|---|
| Hero lead | 2 sentences (~38 words) including a forward-looking line about medical/mental-health tech | 1 sentence (~22 words) | Forward-looking goals moved into the dedicated Goals section below; lead now only states the present-tense pitch |
| About — "Why hire me?" | Question + 2-sentence prose answer | Tighter question + 1-sentence answer | "A CS + liberal-arts combination that's pretty hard to find in one person." |
| About bullets | 4 + 4 bullets averaging 18 words each | 4 + 4 bullets averaging 11 words each | Same information, no padding. PR/issue numbers removed from bullets — they live in the project entries |
| Net-net paragraph | "...store owners, middle-school students, **or future patients**..." (3 stacked clauses, 1 trailing reference to St. Thomas tradition) | "I talk to non-technical clients without losing them and ship reliable automation that respects real-world constraints — for the small-team operators who don't usually get any of either." | Reduces 4 lines to 2; drops the doctor implication; sharpens the punchline (the wrong people getting good software) |
| Goals | 4 bullets averaging 19 words each | 4 bullets averaging 11 words each | "Move toward human-centered software in spaces where care matters" replaces the explicit medical/mental-health framing in this list |
| Project descriptions (× 8) | Each ended with a "Keywords: a, b, c, d…" trailing line that **duplicated** the `keywords:` array already rendered as visible chips on the card | Trailing keyword line removed; prose tightened to 3–4 sentences max | The keyword chips were always going to be the rubric evidence — the prose duplicate was AI-tutorial filler |

### What is now interactive

Two new components carry the bulk of the space-saving work.

#### `<SOARTabs />` (React island, replaces `<dl class="kv-grid">` on every project with a `soar:` block)

| | Before | After |
|---|---|---|
| Visible at first scan | All 4 quadrants of SOAR prose (~60–100 lines per project) | A single panel — Situation, by default — plus a 4-step tab strip (~12–18 lines per project) |
| Mechanism | `<dl class="kv-grid">` with `data-step="01..04"` rendered as a 2×2 grid | `role="tablist"` with arrow-key roving focus + Framer Motion `layoutId` shared underline that animates between the active tab |
| Hidden information | None | Three of four panels (~75% of SOAR prose) — but every word is still in the React state and one click / arrow-key away |
| Reduced motion | N/A (was static) | `useReducedMotion()` short-circuits the underline spring and the panel-swap fade |

#### `<InfoDisclosure />` (Astro component, replaces `<InfoPanel tone="muted">` for `failureStory:` blocks)

| | Before | After |
|---|---|---|
| Visible at first scan | The full failure-story block — context + what happened + learning (~25–40 lines per failure) | Just the kicker `03 / WHAT I LEARNED · Failure → learning → change ↓` — one row |
| Mechanism | `<dl class="kv-stack">` rendered always-visible | Native HTML `<details>` with a custom-styled `<summary>` and `interpolate-size: allow-keywords` for an animated reveal where supported |
| Hidden information | None | The whole failure story — but it's still in the DOM, screen-reader accessible, and one click / Enter keystroke away |
| JS required | None (static HTML) | None (still static — `<details>` is native HTML) |

### What was deliberately *not* changed

- `myContribution` (the "01 / Contribution" block on each project entry).
  This is dense by design — it is the rubric-required record of personal
  contribution including specific PR numbers and issue references. Tightening
  it would weaken the portfolio's evidentiary value. The space saved by
  SOARTabs and InfoDisclosure on the same entry more than compensates.
- The capstone's accent treatment. The amber color is the only accent on the
  site and it is reserved for the SOAR-tab active underline + the capstone
  badge. Adding more accent surfaces would dilute the signal.
- The home-page Goals section's "human-centered software" line. The user
  ruled out *being a doctor*, not *building software for medical /
  mental-health products*. Software contribution to those spaces is a valid
  CS career direction and was retained, with the explicit "medical and
  mental-health technology" wording softened to "spaces where care matters"
  — a more honest claim that doesn't promise a specific industry.

## Programmatic verification

All checks run against the production preview at
`http://127.0.0.1:4321/cisc480-portfolio/` after `npm run build`.

```
== Home ==
"future patients" occurrences in body text          = 0       (was: 1)
.about-summary innerText                            = "NET-NET I talk to non-technical clients..."
.about-question innerText                           = "Why hire me? A CS + liberal-arts combination..."
.lead innerText (hero)                              = "I ship working tools fast — especially..."

== Projects ==
.soar-tabs (SSR-rendered roots)                     = 3       (one per project with soar: data)
.soar-tab (rendered tab buttons)                    = 12      (3 instances × 4 tabs)
.soar-tab--active                                   = 3       (one active per instance — Situation by default)
[role=tabpanel]                                     = 3       (matches active-tab count after AnimatePresence)
dl.kv-grid                                          = 0       (old grid pattern fully removed)
details.info-disclosure                             = 2       (one per project with failureStory: data — eBay + capstone)
details.info-disclosure[open]                       = 0       (collapsed by default)

== Interaction smoke tests ==
Click SOAR tab "03 ACTION" on capstone entry:
  before active label                               = "01 SITUATION"
  after  active label                               = "03 ACTION"
  panel content swapped                             = true
Click failure-story <summary>:
  before                                            = open: false
  after  (200ms)                                    = open: true, body height: 280px,
                                                       chevron mid-rotation transform applied
```

## Files touched

- `src/pages/index.astro` — hero lead, About bullets, Net-net, Goals
- `src/content/projects/*.md` — 8 files, descriptions tightened, "Keywords: …" trailing line removed
- `src/pages/projects/index.astro` — SOAR section now uses `<SOARTabs />`; failure story now uses `<InfoDisclosure />`; page-header copy updated to describe the new interactions
- `src/components/react/SOARTabs.tsx` — new React island (Framer Motion + WAI-ARIA tabs pattern)
- `src/components/InfoDisclosure.astro` — new Astro component (native `<details>` + editorial styling)
- `README.md` — Closing paragraph reworded; "future patients" removed
- `docs/DEVELOPMENT.md` — component list + content-schema section updated to describe the new components and rendering paths
