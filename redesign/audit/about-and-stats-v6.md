# V6 — About redesign + one stat strip

Two focused changes on the home page. Goal: cut the static feel of
the About section without overdoing the chrome, and add one numeric
moment that pulls weight without inventing claims.

This pass deliberately did *not* touch the projects page, the goals
section, fun page, or resume — all of which were on the table in
the wider plan and were cut for scope. The plan's "What I need from
you before I start" list went unanswered before implementation, so
this audit documents the calls I made and flags every guess.

> **Revision note (V6.1).** The original V6 About section described
> below is no longer in the codebase. After it shipped, the user
> read the result as bragging — specifically the pull quote and the
> CS↔Liberal-arts pairing structure, which together implied "look
> how unusual I am." The section was rewritten as a flat
> hairline-separated list of independent factual bullets. The
> original V6 description is preserved here as the historical
> "before"; the actual current state is in the **V6.1** section at
> the bottom of this doc.

---

## Move 1 — About section restructure

**File:** [`src/pages/index.astro`](../../src/pages/index.astro), lines 73–129 (markup) and 275–433 (CSS)

### Before

- An h2 "About" followed by a "Why hire me?" question with a
  one-sentence answer
- Two parallel `<ul>` columns of four bullets each (CS strengths /
  Liberal-arts strengths) divided by a vertical hairline
- A closing "Net-net" paragraph with the small-caps kicker rendered
  inline before the prose

### After

1. **Pull quote** in place of the question. Italic, `--fs-xl`,
   max-width ~32rem, hairline rules above and below, smart curly
   quotes via `::before` / `::after`.
2. **2 paired-strengths rows** with an explicit `↔` glyph in the
   center column and a hairline rule between rows.
3. **4 parallel-strengths rows** (a `<dl>`) below the paired block.
   No ↔ glyph here — these don't pair cleanly.
4. **Net-net paragraph** with a CSS `::first-letter` drop cap and
   the small-caps `Net-net` label moved into a 6rem left gutter
   instead of sitting inline.

### What I had to decide without your input, and what I picked

- **Pull quote text** — went with option A from the plan:
  `"I can debug an API, then explain it to a 7th-grader."` That
  line was already in the AVID-tutoring bullet, so it isn't new
  copy I'm putting in your mouth. Easy to swap for B or C later
  by editing the `<blockquote>` in `index.astro`.
- **Which CS↔LA bullets actually pair** — only the two pairings I
  marked as real in the plan made it into the paired block:
  - "Ships production tools end-to-end under tight client deadlines"
    ↔ "Operations & client comms from running my LLC and
    supporting Honey Smitten" — same job (Big Chuck Data LLC),
    real connection.
  - "Python automation against real APIs — rate limits, auth,
    idempotency" ↔ "Math-minor rigor: edge cases, failure modes,
    checking my own work" — both bullets describe rigor about edge
    cases and failure modes. Defensible.
  - The other 4 bullets (SwiftUI/iOS, image pipelines, AVID
    tutoring, Japanese/Hebrew) sit in the parallel `<dl>` below,
    labeled "CS" or "Liberal arts" but with no connector. The
    plan flagged these as either guessed or invented; this layout
    keeps them visible without forcing a connection.
- **AVID bullet wording** — the original AVID bullet was
  *"AVID 1:1 tutoring — I can debug an API, then explain it to a
  7th-grader."* That second clause is now the pull quote at the
  top of the section, so I rewrote the parallel-strengths bullet
  to *"AVID 1:1 tutoring — tutoring middle-schoolers across
  multiple sites."* to avoid duplicating the line and to give it
  factual content instead of a punchline. If you'd rather change
  the wording, the bullet is in the `<dl class="parallel-strengths">`
  block.

### Why these choices, briefly

- **Pull quote, not question.** The "Why hire me?" framing was the
  loudest "AI-generated portfolio" tell on the page — it's a
  hiring-funnel question, not a personal voice. A pull quote moves
  the section from "answering the question I think a recruiter
  has" to "stating something I actually said." Italics + serif-
  quote glyphs do typographic work without adding chrome.
- **Paired pairs, not 2 parallel columns.** The plan offered two
  structures: a 4-row paired grid and a "two paired + the rest in
  parallel" fallback. The audit honest answer was the fallback —
  only 2 of 4 pairings hold up. Forcing the other 2 would have
  made the section dishonest in service of structural symmetry.
- **Drop cap + marginal label, not a kicker pill.** The previous
  "NET-NET — " kicker rendered inline; in V5 it was already
  small-caps + mono. Moving the label into a left gutter and
  giving the prose a drop cap makes the paragraph look like the
  closing of a long-form piece rather than a UI panel summary.

---

## Move 2 — Stat strip

**File:** [`src/components/StatStrip.astro`](../../src/components/StatStrip.astro) (new) — placed on the home page between About and Skills.

### Component

`<StatStrip>` takes a `stats: { value, suffix?, label, sublabel? }[]`
prop plus an optional `eyebrow`. Each item renders as a large Geist
Mono numeric (`--fs-3xl`, weight 600, `tnum`) above an uppercase
Geist Mono label and a smaller muted sublabel. Items sit on a
`grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr))` row
with a 1px hairline border above and below the strip and 1px
column dividers between items.

### Animation

- Trigger: `IntersectionObserver` with `threshold: 0.4`, fires once
  when the strip enters the viewport.
- Loop: `requestAnimationFrame` ticks for 1500ms, linear
  interpolation: `el.textContent = String(Math.floor(p * target))`.
- On the final frame the script writes the cached SSR `finalText`
  back rather than `String(target)` — preserves whatever the SSR
  rendered, including any thousands separators we add later.
- `prefers-reduced-motion: reduce` → the script returns before
  observing or mutating anything. The SSR'd HTML already holds the
  final values, so the strip just renders statically.

### Why count-up linear, not eased

Eased easing curves draw the eye to the *animation*; linear
draws the eye to the *number*. The plan called this out and I
agreed — for four small static numbers the count is a cue that the
user has scrolled past the section, not a piece of motion design.
~1.5s linear is the shortest duration where a viewer can still
register that the value moved through intermediate states.

### The numbers (verified before shipping)

| Stat | Value | Source |
| --- | --- | --- |
| Widgets | `22` | `src/content/projects/cisc480-capstone.md` (3 occurrences), `README.md` line 37, `src/pages/projects/index.astro` |
| Success rate | `100%` | `src/content/projects/ebay-image-standardization.md` lines 27 + 47, `README.md` line 39, `src/pages/index.astro` line 202 |
| Projects shipped | `8` | Count of files in `src/content/projects/` |
| Months running | `21` | BCD LLC start date "August 2024" per `src/pages/resume/index.astro` line 106 → today 2026-05-20 = 21 calendar months |

If the BCD duration date is wrong on the resume, the stat strip
inherits the error. The number ticks to whatever the prop receives;
just edit the `value` in `index.astro`.

---

## Bug found mid-implementation

The first version of `StatStrip.astro` ran `bindStatStrips()` both
inline and on `astro:page-load`. Both calls registered a fresh
`IntersectionObserver`. Because the strip is already intersecting
when the second observer is constructed during the same load,
`IntersectionObserver` fires immediately — and the second pass
captured the already-reset "0" as each cell's `finalText`. Result:
values stuck at 0 forever.

Fix: a `data-stat-bound="1"` flag on the strip element, set on the
first call to `animate()`. Subsequent calls bail out. Verified by
sampling `textContent` on a fresh page navigation:

```
t=0ms     [22, 100, 8, 21]   ← SSR
t=250ms   [22, 100, 8, 21]
…animation completed before puppeteer_evaluate started…
t=1500ms  [22, 100, 8, 21]   ← final
```

A manual rerun with a 30s duration confirmed mid-flight values
progress correctly: `[2, 11, 0, 2] → [8, 36, 2, 7] → [22, 100, 8, 21]`.

---

## Programmatic verification

### Build

`npm run build` — clean. 4 pages built, no warnings, no errors.

### Structural assertion (headless puppeteer)

Single `puppeteer_evaluate` against `/cisc480-portfolio/`:

```
{
  pullQuote:    "I can debug an API, then explain it to a 7th-grader." ✓
  pairedRows:   2                                                       ✓
  glyphChars:   ["↔", "↔"]                                              ✓
  parallelRows: 4                                                       ✓
  hasNetNetProse: true                                                  ✓
  netNetFirstChars: "I talk to non-technical clients without losing the…"
  hasStatStrip: true                                                    ✓
  statValues:   ["22", "100", "8", "21"]                                ✓
  statSuffixes: ["%"]                                                   ✓
  statLabels:   ["Widgets","Success rate","Projects shipped","Months running"] ✓
  statSublabels: ["GreenStep dashboard","eBay pipeline, post-redesign","On this site","Big Chuck Data LLC"] ✓
}
```

### Animation logic (manual run, 1500ms duration)

Frame samples:

```
frame 1   p=0.01   [0, 1, 0, 0]
frame 30  p=0.33   [7, 33, 2, 6]
frame 91  p=1.00   [22, 100, 8, 21]
```

### Reduced-motion (runtime simulation)

`window.matchMedia` overridden to return `{ matches: true }` for
the reduced-motion query, then `astro:page-load` redispatched.
Result: values stayed at `[22, 100, 8, 21]` — script bailed out
before mutating, SSR values preserved.

### CLS

`PerformanceObserver({ type: 'layout-shift', buffered: true })`
sampled for 3 seconds after navigation:

```
cls: 0.0013
3 shifts, all in the 0.0004 range
```

Threshold for "good" is 0.1. The new strip and pull quote reserve
their height at SSR (no `display: none`, no async height changes),
so neither contributes a measurable shift.

### Visual evidence captured

- `v6-home-final` — full-page baseline, 1920×3437.
- `v6-home-about-and-strip` — `#about` element scoped, shows pull
  quote / paired rows / parallel rows / drop cap on Net-net.
- `v6-stat-strip-midcount` — `.stat-strip` mid-animation:
  `[11, 52%, 4, 10]` at p≈0.5.
- `v6-stat-strip-reducedmotion` — `.stat-strip` under simulated
  reduced-motion: `[22, 100%, 8, 21]` rendered statically.

---

## Deliberately not in this pass

These were on the V6 table and got cut for scope. Not decided
against, just deferred:

- Per-project micro-stat rows on `/projects/`
- Heading split-text reveal on every `<h2>`
- Project category filter strip on `/projects/`
- Reading-progress indicator on `/projects/`
- Annotated capstone screenshot with hover callouts
- Goals as a `Now / Next / Later` track
- Fun page rework
- Resume page (intentionally a print-document mockup)

---

## Files touched

```
src/pages/index.astro          (markup + CSS for About; StatStrip placement)
src/components/StatStrip.astro (new)
docs/DEVELOPMENT.md            (Components list)
redesign/audit/about-and-stats-v6.md (this file)
```

---

# V6.1 — About tone-down revision

After V6 shipped, the user reviewed the result and called out the
section as overconfident:

> "dont sound so overconfdent aout debg and api and explain ing it
> to a 7th grader sounds cock make sure to display skills
> independantly from each other or something that feels less
> bragging or showing off."

That is a real read of what V6 was doing. Three pieces specifically
were performing rather than describing:

- The **pull quote** ("I can debug an API, then explain it to a
  7th-grader") — funny line, but extracted out of context and
  centered as a typographic moment, it reads as a self-celebratory
  punchline. Putting it in italics with hairline rules amplified
  the performance.
- The **CS↔Liberal-arts pairing structure** itself — even if every
  pairing were honest, the structural argument is "I uniquely
  combine these two columns of strengths." That's a value-prop, not
  a description.
- The **Net-net paragraph** — "I talk to non-technical clients
  without losing them and ship reliable automation that respects
  real-world constraints — for the small-team operators who don't
  usually get any of either." Four self-claims in one sentence
  ("without losing them" / "reliable" / "respects real-world
  constraints" / "who don't usually get any of either"), wrapped in
  editorial drop-cap chrome that drew the eye toward the brag.

## What V6.1 changed

**File:** [`src/pages/index.astro`](../../src/pages/index.astro), lines 73–106 (markup) and 275–309 (CSS)

### Removed

- `<figure class="pull-quote">` and its hairline-rule typography
- `<div class="paired">` 2-row CS↔LA grid (and its `↔` glyphs)
- `<dl class="parallel-strengths">` 4-row parallel block (and its
  CS / Liberal arts column labels)
- `.net-net` marginal label
- `.net-net-prose::first-letter` drop cap
- All associated CSS (~135 lines)

### Replaced with

A single `<ul class="about-list">` of seven hairline-separated
bullets. No categorization, no comparison, no inline glyphs. Each
bullet is a self-contained factual descriptor:

```
Builds and ships tools to paying clients.
Python automation against real APIs — rate limits, auth, idempotency.
SwiftUI / iOS native; React, Node, Astro on the web.
Image pipelines, scheduled services, data workflows.
Operations and client work for my LLC and Honey Smitten.
AVID 1:1 tutoring; middle-schoolers across multiple sites.
Math minor; intermediate Japanese, basic Hebrew.
```

### Self-claim language stripped from each bullet

Before vs after for the lines that changed:

| V6 wording | V6.1 wording |
| --- | --- |
| `Ships production tools end-to-end under tight client deadlines` | `Builds and ships tools to paying clients` |
| `Python automation against real APIs — rate limits, auth, idempotency` | (unchanged — this one is technical content, not a claim) |
| `SwiftUI / iOS native; React, Node, Astro on the web` | (unchanged — stack list) |
| `Image pipelines, scheduled services, small-business data workflows` | `Image pipelines, scheduled services, data workflows` |
| `Operations & client comms from running my LLC and supporting Honey Smitten` | `Operations and client work for my LLC and Honey Smitten` |
| `AVID 1:1 tutoring — tutoring middle-schoolers across multiple sites` | `AVID 1:1 tutoring; middle-schoolers across multiple sites` |
| `Math-minor rigor: edge cases, failure modes, checking my own work` | merged into next line |
| `Intermediate Japanese, basic Hebrew — comfort with ambiguity` | `Math minor; intermediate Japanese, basic Hebrew` |

Removed self-claim adjectives: *"end-to-end"*, *"tight"*, *"rigor"*,
*"comfort with ambiguity"*, *"production"* (where it implied
"things I personally ship to production"). The math-minor + languages
lines collapsed into one factual line — neither needs adjacent
content to hold up; both are just facts.

### Closing line: descriptive, not a value prop

Before:

> *"I talk to non-technical clients without losing them and ship
> reliable automation that respects real-world constraints — for
> the small-team operators who don't usually get any of either."*

After:

> *"Most of my work so far has been for small-business owners,
> AVID classrooms, and a sustainability dashboard pilot."*

This is the same paragraph slot but the content is descriptive
(who the work has been for) rather than performative (what makes
me special at it). No drop cap, no marginal label, no kicker — the
prior typography was working to make a value-prop sentence land,
and the value-prop is gone.

## What was deliberately kept

- The **stat strip** is still there. The numbers (22, 100%, 8, 21)
  are factually verified against repo content; "by the numbers"
  isn't a brag if the numbers are real. The user's note was
  specifically about the About section copy, not the strip.
- The hero-card lead ("I ship working tools fast — especially for
  small businesses and people who don't usually get custom
  software built for them.") is the same. That line predates V6
  and the user has not flagged it.

## Why a flat list, not a different structure

A few alternatives I considered and rejected:

- **A two-column "what I do / who I do it for" layout.** Still a
  comparative argument, just dressed differently.
- **A short prose paragraph instead of bullets.** Harder to scan,
  and the pressure to make prose flow tends to produce filler that
  reads as marketing language.
- **Keep the section but cut it down to 3 bullets.** Strips out
  honest, useful content (languages, AVID, LLC ops) for no
  structural benefit.

A flat hairline-separated list of independent facts is the simplest
shape that meets the user's instruction ("display skills
independently from each other"). Every line carries its own
content and stops; the next line does not have to relate to the
previous one. The section becomes scannable info, not an argument.

## Programmatic verification — V6.1

### Build

`npm run build` clean.

### Headless structural assertion

```
hasPullQuote:       false  ← removed
hasPaired:          false  ← removed
hasParallel:        false  ← removed
hasNetNet:          false  ← removed
hasDropCapWrapper:  false  ← removed
aboutItemCount:     7      ← flat list
aboutItems:         [
  "Builds and ships tools to paying clients.",
  "Python automation against real APIs — rate limits, auth, idempotency.",
  "SwiftUI / iOS native; React, Node, Astro on the web.",
  "Image pipelines, scheduled services, data workflows.",
  "Operations and client work for my LLC and Honey Smitten.",
  "AVID 1:1 tutoring; middle-schoolers across multiple sites.",
  "Math minor; intermediate Japanese, basic Hebrew."
]
summaryText:        "Most of my work so far has been for small-business
                     owners, AVID classrooms, and a sustainability
                     dashboard pilot."
statValues:         ["22", "100", "8", "21"]   ← unchanged
```

### CLS

`PerformanceObserver` sampled 2.5s after navigation: `0.0009`
(slightly better than V6's 0.0013, since the section's vertical
space reservation is simpler).

### Page height

V6 home page: 3437px. V6.1 home page: 3159px. ~278px of vertical
chrome reclaimed by removing the pull quote + paired structure +
parallel-strengths block + drop-cap kicker. The page is denser
without the section feeling cramped, because the bullets are
hairline-separated rather than padded.

### Visual evidence

- `v6-1-about-tonedown` — `#about` element scoped, shows the new
  flat 7-bullet list and the descriptive closing line.
- `v6-1-home-full` — full-page baseline at the new 3159px height.

## Files touched (V6.1)

```
src/pages/index.astro                  (markup + CSS)
redesign/audit/about-and-stats-v6.md   (this revision section)
```

`StatStrip.astro` and `docs/DEVELOPMENT.md` unchanged.
