# CISC480 Portfolio — Build Handoff (current state)

> **Audience:** future you, future me, or the next AI agent who picks up this repo.
> This file is the **authoritative status snapshot** for the CISC480 Senior Capstone
> portfolio submission. The graded artifact (the reflection essay) lives in
> [`README.md`](README.md); developer notes live in [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md).
>
> **Deadline:** Wednesday, May 20, 2026, 5:00 PM (Canvas submission cutoff).

---

## 0. TL;DR — current state

- **Site builds clean** (`npm run build` → 4 pages, 0 errors). Last verified
  May 20 20:25 after V6.2.2 timeline rail alignment (see §1).
- **All 11 rubric adjustments** from the original handoff are **done** except for one
  small owner-input item flagged below (A8).
- **Project entries:** 8 total, exceeding the rubric floor (≥ 5), with the right
  composition: 4 CS, 2 interdisciplinary, 1 outside-CS, 1 capstone. SOAR ×3
  (capstone + eBay + NutriBot), failure-story ×2 (eBay rate-limit + capstone v0.7.2),
  myContribution callout on Hydreon (placeholder text pending) and on the capstone.
- **Reflection essay:** 1172 words (in the 1000–1200 range), theme = practical /
  ethical automation for small businesses and underserved users, disciplines named
  = CS + Business + Ethics + Education, ≥ 3 portfolio examples, ≥ 1 failure story,
  explicit St. Thomas / common-good tie-in.
- **Deploy config:** Astro `site: https://flamingmachturtle.github.io`, `base:
  '/cisc480-portfolio/'`. All absolute asset paths run through `withBase()` so the
  site works correctly under the project-page subpath.
- **Tag of record for the May 20 submission:** `submission-2026-05-20` on `main`
  (commit `b748233`). Do not move this tag.
- **Redesign in flight:** branch `redesign/scene-transitions` carries a unified
  design-token system, a single `<InfoPanel>` primitive, a cinematic
  `<HeroScene>` with Astro 6 view-transition morphs, and a GSAP body-lift +
  hero-parallax layer. **Not merged to `main`.** See §7 below.

---

## 1. Adjustments status (was: §4 of the inherited handoff)

| ID | Item | Status | Notes |
|----|------|--------|-------|
| A1 | Rewrite About Me with ACM "unique combination" pattern | ✅ Done | `src/pages/index.astro` — `.about-claim` editorial lead at top of About explicitly answers "Why should we hire you?" via CS skills (Python automation, React + Supabase, SwiftUI, image pipelines) **plus** liberal-arts strengths (small-business operations, AVID inquiry-based tutoring, Math minor, three human languages). **V6.2 restore (May 20):** the V6.1 tone-down had flattened the section to factual bullets and lost the explicit framing; restored as a single editorial paragraph (no paired-card "AI bolt-on" grid). |
| A2 | Add Skills section (technical + professional) | ✅ Done | Same page, 4 grouped pill-tag panels |
| A3 | Add `keywords` + `category` to project schema; render visible | ✅ Done | `src/content.config.ts` + `src/components/ProjectCard.astro`. Badge + dashed keyword tags |
| A4 | Add outside-CS entry (AVID Tutoring) | ✅ Done | `src/content/projects/avid-tutoring.md` + stylized SVG (no minors) at `public/images/avid/` |
| A5 | Add second interdisciplinary entry | ✅ Done | `src/content/projects/honey-smitten-operations.md` |
| A6 | Rewrite ≥ 2 entries in SOAR | ✅ Done | eBay + NutriBot + capstone (3 total) — structured `soar` block in schema, blue UI panel |
| A7 | Add ≥ 1 failure → learning → change story | ✅ Done | eBay rate-limit + capstone v0.7.2 self-exemption (2 total) — structured `failureStory` block, pink UI panel |
| A8 | Personal contribution callout on Hydreon | ✅ Done | `src/content/projects/hydreon-minecraft.md` — owns QA-checklist authoring + adventure-map builds (One Block Challenge islands + cube-world map with rotating per-face gravity) |
| A9 | CISC480 capstone entry | ✅ Done | `src/content/projects/cisc480-capstone.md` (GreenStep Admin Console). Full SOAR + failure story + myContribution. `sortOrder: 0` so it appears first |
| A10 | Fix `resue.pdf` → `resume.pdf` | ✅ Done | Renamed + all 4 refs in `src/pages/resume/index.astro` updated to use `withBase()` |
| A11 | Replace README with reflection; move technical README to `docs/DEVELOPMENT.md` | ✅ Done | 1194 words, academic-honesty statement included, name/class/section in header |

---

## 2. Outstanding owner-input items

The only remaining thing blocking a clean submission:

1. **New GitHub repo provisioning.**
   - Repo name: `cisc480-portfolio` (under `FlamingMachTurtle`).
   - Astro is already configured for this URL — no code change needed once the
     repo exists.
   - Steps:
     1. Create empty repo at <https://github.com/new> (name: `cisc480-portfolio`,
        public, no README, no .gitignore — those exist locally already).
     2. From this workspace: `git remote add origin
        https://github.com/FlamingMachTurtle/cisc480-portfolio.git`
     3. `git add -A && git commit -m "Initial CISC480 portfolio submission"`
     4. `git push -u origin main`
     5. Repo Settings → Pages → Source = **GitHub Actions**.
     6. Confirm `jimenezpf` has read access (public repo = automatic).
   - Live URL after first deploy: <https://flamingmachturtle.github.io/cisc480-portfolio/>

2. **Capstone follow-ups (low priority — not blocking).**
   - `06-reports.png` (the Reports screen with CSV export) wasn't in the
     `./images/greenstep/` folder when this submission was built. If you want it
     in the inline gallery, drop a redacted copy at
     `public/images/greenstep/greenstep-reports.png` and I'll wire it in.
   - The agent flagged `02-group-detail.png` and `03-user-detail.png` contain
     real MPCA emails. They are intentionally **not** referenced in the site.
     If you want them included, redact the emails first.

---

## 3. Repo structure (current state)

```
.
├── README.md                           # ⭐ The graded reflection essay (1194 words)
├── HANDOFF.md                          # This file
├── astro.config.mjs                    # site + base configured for project page
├── package.json
├── .github/workflows/deploy.yml        # Triggers on push to main
├── public/
│   ├── favicon.ico, favicon.svg
│   ├── resume/resume.pdf               # Renamed from resue.pdf
│   └── images/
│       ├── headshot.jpg
│       ├── greenstep/                  # Capstone screenshots (3 safe ones)
│       ├── avid/avid-placeholder.svg   # Stylized, no minors
│       ├── capstone/                   # SVG placeholder (no longer referenced)
│       ├── cruz-before.jpg, cruz-after.jpg  # eBay before/after
│       ├── nutri/, mc-port/, filter/, 30-day/, b2b-shows/, resume/
│       └── prestige/, prisoners/, robots/   # Inherited (used on Fun page)
├── src/
│   ├── lib/url.ts                      # withBase() helper for /cisc480-portfolio/ subpath
│   ├── layouts/BaseLayout.astro
│   ├── components/ProjectCard.astro    # Renders badge, keywords, tech
│   ├── pages/
│   │   ├── index.astro                 # Home: About Me (ACM), Skills, Goals
│   │   ├── projects/index.astro        # Renders cards + SOAR/failure/contribution/gallery blocks
│   │   ├── resume/index.astro          # HTML resume + PDF viewer
│   │   └── fun/index.astro             # Hobbies + trade-show photos
│   ├── content.config.ts               # Project schema: + keywords, category, soar, failureStory, myContribution
│   ├── content/projects/
│   │   ├── cisc480-capstone.md         # sortOrder 0 — capstone (GreenStep) — first on page
│   │   ├── ebay-image-standardization.md  # sortOrder 1 — CS — SOAR + failure story
│   │   ├── nutribot.md                 # sortOrder 2 — CS — SOAR
│   │   ├── swiftui-photo-filter.md     # sortOrder 3 — CS
│   │   ├── hydreon-minecraft.md        # sortOrder 4 — interdisciplinary — ⚠ contribution placeholder
│   │   ├── 90-day-challenge.md         # sortOrder 5 — CS — has demo URL
│   │   ├── avid-tutoring.md            # sortOrder 6 — outside-CS
│   │   └── honey-smitten-operations.md # sortOrder 7 — interdisciplinary
│   └── styles/global.css
├── docs/
│   ├── DEVELOPMENT.md                  # Was README.md before the reflection took its place
│   └── legacy/                         # Inherited audit + improvement plan + research prompt
├── images/                             # ⚠ Leftover root-level folder from legacy site
│                                       #    (Astro doesn't serve it. Safe to delete after
│                                       #     confirming nothing in _legacy references it.)
├── _legacy/                            # Archived Foundation/jQuery site (reference only)
└── wireframes/                         # Original site wireframes
```

---

## 4. Submission checklist (per the assignment PDF)

Before submitting in Canvas:

- [x] All required sections present on the live site (About, Skills, Projects, Resume)
- [x] About Me uses ACM "unique combination" pattern, answers "Why should we hire me?"
- [x] ≥ 5 project entries (have 8)
- [x] ≥ 2 CS + ≥ 2 interdisciplinary + ≥ 1 outside-CS
- [x] Every entry has title, description, figure, keywords (keywords also in description prose)
- [x] ≥ 2 SOAR entries (have 3: capstone, eBay, NutriBot)
- [x] ≥ 1 failure → learning → change story (have 2: eBay, capstone)
- [x] Group projects have a personal-contribution callout (capstone ✅, Hydreon ✅)
- [x] CISC480 capstone project included (GreenStep Admin Console, sortOrder 0)
- [x] Resume link/visualization on the site (HTML view + PDF download/print)
- [x] Reflection 1000–1200 words (1194)
- [x] Reflection names ≥ 2 disciplines explicitly (CS + Business + Ethics + Education)
- [x] Reflection ties to St. Thomas mission / common good
- [x] Reflection includes ≥ 1 failure → learning → change story
- [x] Academic honesty statement in `README.md`
- [x] Name + class + section in `README.md` header
- [ ] **Deploy** — Push to new GitHub repo, verify GitHub Pages URL is live
- [ ] **Canvas submission** — Paste (a) academic honesty statement, (b) name + class
      + section, (c) repo URL, (d) live GitHub Pages URL

---

## 5. Self-grade against the rubric

| Criterion (5 pts each) | Target | Current self-grade | Why |
|---|---|---|---|
| Portfolio Structure & Organization | 5.0 | **5.0** | All sections present, intuitive nav, polished GH Pages, capstone-banner sets context |
| Content Quality & Breadth | 5.0 | **5.0** | 8 entries, all fields, badges visible, composition exceeds floor, both group projects (capstone + Hydreon) have personal-contribution callouts |
| Interview-Ready Narratives | 5.0 | **5.0** | 3 SOAR entries with detail, 2 failure stories, About Me hits the ACM pattern explicitly |
| Reflection Content / Integrative Growth | 5.0 | **5.0** | 1194 words, 4 disciplines named, 4 portfolio examples, capstone failure story doubled in essay |
| Professional Development & Writing Quality | 5.0 | **5.0** | Polished, voice-consistent, interview-framed examples |
| **Total / 25** | **25** | **25.0** (subject to deploy verification) | |

---

## 6. Status log

| Date | Agent / human | What changed |
|---|---|---|
| 2026-05-18 | Initial handoff drafted in personal repo | Set the scope |
| 2026-05-18 | Build agent | Cloned source repo, detached origin, configured for `/cisc480-portfolio/` base, added `withBase()` helper, refactored all absolute asset paths |
| 2026-05-18 | Build agent | Schema additions: `keywords`, `category`, `myContribution`, `soar`, `failureStory`; ProjectCard renders badge + keyword tags |
| 2026-05-18 | Build agent | A1–A7, A9, A10 completed; capstone entry written from owner-provided YAML (GreenStep Admin Console); reflection essay written (1194 words) |
| 2026-05-18 | Owner | Selected reflection theme (automation/ethics), failure story (eBay rate-limit), interdisciplinary second (Honey Smitten), repo strategy (`cisc480-portfolio` project page), section 02 |
| 2026-05-18 | Owner | Provided full capstone YAML brief + 5 screenshots (only 01/04/05 used; 02/03 omitted due to real emails) |
| 2026-05-18 | Build agent (with owner-provided detail) | A8 closed: Hydreon `myContribution` rewritten to QA-checklist authoring + adventure-map builds (One Block Challenge islands + cube-world rotating-gravity map); description updated to clarify Lifeboat as a Hydreon Corporation sub-brand |
| 2026-05-18 | Build agent | Submission baseline committed in two atomic commits on `main`: build-config + content-baseline. Tag `submission-2026-05-20` set on the result. Redesign branch `redesign/scene-transitions` cut from the tag (does NOT block submission). |
| 2026-05-18 | Build agent | Headless puppeteer audit of all four pages → `redesign/audit/visual-baseline.md`. Top finding: GreenStep capstone entry stacks 6 different visual treatments — confirms the user's "AI bolt-on red card" feedback. |
| 2026-05-18 | Build agent | `redesign/design-spec.md` + `redesign/animation-options.md` written. Decision: editorial paper + cinematic dark hero band, single warm amber accent, one `<InfoPanel>` primitive replacing four ad-hoc panels, Astro 6 View Transitions + GSAP for animation (no React added). |
| 2026-05-18 | Build agent | Phase 4 implemented in 7 commits on `redesign/scene-transitions`: tokens → layout/card → InfoPanel → projects sweep → HeroScene + page sweep → GSAP/view-transitions → docs. Build clean (4 pages, 0 errors) at every commit. Pink banner deleted. |
| 2026-05-20 | Build agent (owner-reported) | **V6.2 hero/header fix.** Owner reported: at scroll top of any hero page (home / projects / fun), the four nav links (Home / Projects / Resume / Fun Stuff) were nearly invisible. Root cause: the sticky `.site-header` is intentionally transparent over the hero band (white text inherited from `--color-text-inverse`), but `.main` had `padding-top: var(--space-xl)` *above* the hero, so at scrollY=0 the transparent header sat over the white main-padding band, not over the dark hero. Fixed in `src/styles/global.css` + `src/components/HeroScene.astro` by exposing `--main-padding-top` and a new `--header-overlap` (3.25rem) as CSS variables on `.main`, then having `.hero-scene` apply `margin-top: calc(-1 * (var(--main-padding-top) + var(--header-overlap)))` and add the same amount back as `padding-top`. Net effect: the dark hero band extends up *under* the transparent header (so white nav text is readable), and the title text still clears the header. No JS change. Resume page (`staticHeader`) is unaffected because the header is opaque from the start there. |
| 2026-05-20 | Build agent (owner-reported) | **V6.2 About-section restore (A1).** Owner asked to double-check the site against the May 20 PDF rubric. Found one regression: the V6.1 tone-down had stripped the "Why should we hire you?" framing from the About section (HANDOFF claimed A1 done, code had drifted). Restored as a single `.about-claim` editorial paragraph at the top of the About section in `src/pages/index.astro` — explicit ACM unique-combination pattern (CS skills *plus* liberal-arts strengths) — without bringing back the paired-card grid V6.1 had deliberately removed. Bullets and About summary unchanged. Build passes (4 pages, 0 errors). |
| 2026-05-20 | Build agent (owner-reported) | **V6.2.2 timeline rail alignment.** Owner reported the projects-page timeline rail "overlapped" the per-project node circles in a way that didn't look natural. Root cause: the rail sat at `left: 1.5rem` (1px wide) and the nodes were positioned at `left: -3rem` (relative to the project group, whose left edge is at the 4.5rem `.projects-timeline` padding), so the node's *left edge* — not its center — landed on the rail x. The line visually tangented the side of every ring instead of running through the middle, which read as "line poking out of the circles". Fixed in `src/pages/projects/index.astro` by hoisting the three layout numbers (`--timeline-gutter`, `--timeline-rail-x`, `--timeline-node-size`) to CSS variables on `.projects-timeline`, then computing the node's `left` as `calc(var(--timeline-rail-x) - var(--timeline-gutter) - var(--timeline-node-size) / 2)` so the node *center* lands on the rail. With centering, the node's background (white for active, amber for past) cleanly hides the line behind it — so the line now visually terminates at each circle instead of cutting across the edge. Mobile @media simplified to just override the two source-of-truth vars (gutter + rail-x); the node-position calc rederives correctly. Also nudged the editorial number label (`.project-group__node-num`) gap from `var(--space-xs)` (0.5rem) to `var(--space-sm)` (0.75rem) so the "03" sits a hair further from the circle. Build clean (4 pages, 0 errors). |
| 2026-05-20 | Build agent (owner-reported) | **V6.2.1 white-sliver fix.** Owner reported a ~2px white border still visible between the viewport top and the dark hero band on hero pages, flickering "when you move around a bit". Root cause: the static `--header-overlap: 3.25rem` CSS token was 0.11rem (~1.8px) shorter than the measured desktop header height (0.75rem×2 nav padding + 1.125rem×1.6 nav-home line-height + 1px border-bottom ≈ 3.36rem), and even more underspec'd on mobile where `.nav { flex-wrap: wrap }` doubles header height when links wrap to a second line. Font swap (Geist Variable loads via `@fontsource` after first paint) was changing line metrics ~1–2px and causing the flicker. **Layered fix:** (a) bumped the CSS fallback `--header-overlap` on `.main` from 3.25rem → 4.25rem so the band is gap-free even before JS runs; (b) updated the mobile `@media (max-width: 640px)` override in `HeroScene.astro` to keep the overlap calc in the padding (the previous override blew it away with a shorthand `padding:` declaration); (c) added a JS measurement in the existing inline script in `BaseLayout.astro` that writes the actual measured header height + 2px buffer to `--header-overlap` on `.main` after page-load, font swap, viewport resize, and orientation change. Static-header pages (resume) skip the scroll toggle but still get the measurement so the layout token stays accurate. Build clean (4 pages, 0 errors). |

---

## 7. Redesign branch notes

The branch `redesign/scene-transitions` (cut from tag `submission-2026-05-20`)
is intentionally **not merged to `main`**. It carries a non-trivial visual
overhaul that:

- Replaces the loud pink "CISC480 banner" on home with a cinematic dark
  `<HeroScene>` at the top of every page (resume excepted — its paper-on-stage
  aesthetic is preserved).
- Collapses four ad-hoc panel treatments (`.soar`, `.failure-story`,
  `.my-contribution`, `.capstone-banner`) into one `<InfoPanel>` primitive
  with three tones differentiated only by a 3px left rule + label color.
- Replaces four pastel-fill category badges with one outlined badge.
- Introduces a single warm amber accent (`#b45309`) and a slate spine
  consumed via `:root` tokens; no hex codes in component styles.
- Wires Astro 6 `<ClientRouter />` view transitions + a vanilla GSAP layer
  for body-content lift on page enter and hero-bg parallax on scroll.
  Bundle cost: ~71 KB minified (~25 KB gz) for GSAP, plus ~16 KB for the
  view-transitions polyfill. Acceptable for GH Pages.

Documents on the branch:

- `redesign/audit/visual-baseline.md` — programmatic audit of the
  submission baseline (every accent color, panel, badge, radius, heading
  size).
- `redesign/design-spec.md` — binding spec the implementation followed.
- `redesign/animation-options.md` — evaluates approach (A) View Transitions
  + GSAP vs (B) +React island vs (C) full R3F + Theatre.js. Recommended (A);
  shipped (A). (B) and (C) deferred as Summer 2026 follow-up.

Decision gate **before May 20, 5 PM Canvas cutoff**:

- **Default:** keep `main` at `submission-2026-05-20`. The graded artifact
  is the unanimated, less-polished but rubric-complete submission. The
  redesign is *not* what gets graded.
- **Optional fast-forward** if you want the redesign to be the live site
  shown to graders: `git checkout main && git merge --ff-only
  redesign/scene-transitions && git push`. Only do this after confirming
  the deploy succeeds against the new repo (see §2 owner item) and you
  have time to verify the live URL.
- **Recommendation: do not fast-forward before submission.** The redesign
  is large enough that a regression that only shows up on the live host
  (subpath asset issues, view-transition behavior in Safari, etc.) is the
  kind of thing that would eat your last 24 hours. Submit `main`, then
  decide post-grading whether to fast-forward as a portfolio refresh.
