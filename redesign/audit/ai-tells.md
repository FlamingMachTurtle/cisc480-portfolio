# Why Some Components Read as "AI-Generated" and Others Don't

> Companion analysis to drive the v2 editorial pass on
> `redesign/scene-transitions`. Triggered by the user's note: "I don't
> like the side color to the panels, find a different way... research
> why some of our components look extra ai generated when some dont."

---

## The pattern, in one sentence

**Components that follow real-world editorial / document conventions
read as designed. Components that follow tutorial / framework UI-kit
conventions read as AI-generated.**

The redesign branch's biggest remaining tell is that ~7 of its
container patterns are built on the **"bordered tinted card with a
small-caps kicker pill"** convention, which is the literal default
look of:

- shadcn/ui `<Alert>`
- MUI `<Alert>` and `<Card>` with header
- Radix `<Callout>`
- The Tailwind UI marketing template
- Most ChatGPT / Cursor / Copilot UI scaffolds

Once a viewer has seen that pattern in 50 portfolios in a row, it
reads as *generated* even when the content is good.

---

## Component-by-component triage (current `redesign/scene-transitions` head)

### Reads as editorial / hand-crafted

| Component | Why it works |
|---|---|
| Resume "paper on stage" | Follows a real document convention (printed CV in LaTeX). Section heads are tiny SMALL-CAPS with a single thin underline. Body is paragraphs. Dates right-align in tabular figures. No bordered cards anywhere. The convention being mimicked is **the printed page**, not the framework UI kit. |
| `<HeroScene>` cinematic band | Single typographic moment (eyebrow + title + subtitle) over a photographic backdrop. No chrome around the copy itself. The convention is **a film title card / magazine cover**, not a hero card. |
| Site footer | Plain-text contact line + copyright. No box. |
| Project card image hover | Image scales to 1.03 with a soft shadow lift. Real interaction, not a chrome change. |

### Reads as AI-generated (with the *specific tell*)

| Component | The tell | Convention being mimicked |
|---|---|---|
| `<InfoPanel>` (SOAR / failure / contribution) | 3px left-rule + tinted bg + small-caps header label. | shadcn/ui `<Alert>` exactly. Any reader who has used shadcn recognizes this within a glance. |
| `.combo-card` on home About Me | Bordered tinted card with small-caps kicker + bullet list, in a 2-up grid. | Tailwind UI "Feature comparison: split values" template. |
| `.skill-group` on home Skills | Bordered card with kicker + pill list, 4 cards in a 2x2 grid. | Tailwind UI "Categorized tag set" template. |
| `.explore` on home | 3 equal call-to-action tiles linking to other pages. | Tailwind UI "3-column CTA grid" template. **One of the most-used AI scaffolds in 2024-26.** |
| `.stat-row` on home | 3 stats with thin vertical dividers. | Tailwind UI marketing-stats template. |
| `.hobby-item` on fun | Bordered tinted card with kicker + body. | Same as combo-card. |
| `.link-card` on fun | Square colored icon + body text + (invisible) arrow. | Tailwind UI "Icon link card" / shadcn `<Card>` with badge. |
| Phrasings: "Net-net:", "Why should you hire me?", "My personal contribution", "Salient technical skills" | LLM ghostwriting tells. | These specific framings recur across LLM-generated portfolios. The content is fine; only the framing reads off. |

### The single-pixel test

If a screenshot of the component, with the text blurred out, would still
be recognizably "shadcn-styled" or "Tailwind-UI-styled," the component
has an AI tell. By that test:

- The current InfoPanel fails (alert-recognizable).
- Combo-card fails (feature-grid-recognizable).
- Skill-group fails (categorized-tags-recognizable).
- Explore tiles fail (CTA-grid-recognizable).
- Resume paper passes.
- Hero band passes.
- Footer passes.

---

## Why the "side rule + tinted bg" pattern is the worst offender

It compresses **four** AI tells into one component:

1. **Tinted background.** Tutorial UI kits use a soft tint to mark
   "callout" or "alert" surfaces. Editorial design almost never tints
   container backgrounds — typography does the marking.
2. **3px solid color rule on the left edge.** Material Design's `<Alert>`
   visual signature, ported into every Tailwind/shadcn kit. Once you've
   seen this in any tutorial, you recognize it everywhere.
3. **Small-caps pill header above the body.** The "kicker label
   inside a colored pill" is shadcn `<Badge>` + heading combination.
4. **Rounded corners on the container.** A printed page doesn't have
   rounded corners. Containers in real editorial design are usually
   delimited by typography, not by a curved-corner box.

Drop those four moves and the same content reads completely differently.

---

## Editorial replacements (the v2 plan in one table)

| Today | Replacement |
|---|---|
| `<InfoPanel>` (3px rule + tint + pill header) | **Hairline rule above + small-caps kicker label**, no tint, no rounded box. The kicker may be numbered (e.g., `02 / Approach`) for editorial structure. Body content has no chrome. |
| `.combo-card` (2 bordered cards) | **Two-column typographic comparison**, no card chrome. Small-caps `CS STRENGTHS` / `LIBERAL ARTS` headers above bullet lists, vertical hairline divider between them on desktop, stacked on mobile. |
| `.skill-group` (4 bordered cards) | **Definition list**: small-caps category label in a left column (~140-160px), pills flowing in the right column. No bordered containers. |
| `.explore` (3 CTA tiles) | **"Continue:" footer-style links**. Each is `→ Title — short description`, single-line, hairline-separated. No tile, no bg. |
| `.stat-row` (3 stats with dividers) | **Credits-style line block**. Three lines, label-left value-right, tabular numerals where numeric. No vertical dividers. |
| `.hobby-item` (3 bordered cards) | Definition list, same as Skills. |
| `.link-card` (icon + body card) | Cleaner: small mono brand-colored icon inline with the link title, single-line description, hairline rule between rows. Or: keep card but drop background, only border-bottom on hover. |
| Project entry's stacked panels | **Numbered editorial sections** with hairlines between. `01 / Contribution`, `02 / Approach — SOAR`, `03 / What I Learned`, then gallery. Section labels in small-caps tabular, content has no chrome. |

---

## Typography moves that distinguish editorial from tutorial

Independent of the chrome question, the *typeface* and its features
matter. Specific moves to add:

1. **Adopt Geist Sans** (Vercel's typeface, MIT licensed). Linear,
   Vercel, Raycast all use Inter or Geist. The default `system-ui`
   stack reads as "developer didn't pick a typeface."
2. **Adopt Geist Mono** for technical content (tech pills, dates,
   keywords, version numbers, file paths). Monospace makes "this is
   technical" legible without colored badges.
3. **Tabular numerals (`font-feature-settings: 'tnum'`)** for any
   number that aligns vertically — dates, stats, percentages.
4. **Stylistic alternates** (`'ss01', 'cv11'` in Geist) — single-storey
   `a`, straight `l`, refined `g`. Subtle but signals craft.
5. **Mixed weight typography** — light + extrabold contrast in headings.
   AI tutorials default to a single weight per heading level.
6. **Letter-spacing on small-caps** (`letter-spacing: 0.09em` is the
   editorial value; 0.05em or default reads as careless).

---

## What stays as-is

- HeroScene dark band (already editorial)
- Resume page (already editorial — was the design-DNA reference)
- Footer (already minimal)
- Project card image + tech pills + outlined badge (post-redesign-v1; the
  outlined-only badge is fine; the image-with-hover-scale is fine)
- The single warm amber accent + slate spine palette
- View transitions + GSAP scene layer
- The full token system in `:root`

The chrome that this pass removes is a layer that sits ABOVE the token
system. Tokens stay; what consumes them changes.

---

## Risk register for v2

- **Geist license:** OFL 1.1, free for commercial use, no attribution
  required. Bundling via `@fontsource-variable/geist` adds ~80 KB woff2
  (gzipped). Acceptable.
- **Removing chrome makes content denser.** This is the right move
  for an editorial portfolio (Linear, Vercel docs are dense), but
  needs careful spacing — typography has to do all the work that
  borders used to do.
- **Numbered sections (`01 / Contribution`)** are a strong move that
  could read as overdesigned if applied everywhere. Apply to project
  entries (which have natural section structure) but **not** to home
  page sections (where it would feel forced).
- **Hairline rules between elements** can read as "editorial newspaper"
  or "ugly underlined HTML" depending on stroke weight. Use 1px
  `--color-border` (very faint) and only between meaningfully-separate
  blocks.
