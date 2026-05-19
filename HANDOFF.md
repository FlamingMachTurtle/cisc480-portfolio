# CISC480 Portfolio — Build Handoff (current state)

> **Audience:** future you, future me, or the next AI agent who picks up this repo.
> This file is the **authoritative status snapshot** for the CISC480 Senior Capstone
> portfolio submission. The graded artifact (the reflection essay) lives in
> [`README.md`](README.md); developer notes live in [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md).
>
> **Deadline:** Wednesday, May 20, 2026, 5:00 PM (Canvas submission cutoff).

---

## 0. TL;DR — current state

- **Site builds clean** (`npm run build` → 4 pages, 0 errors).
- **All 11 rubric adjustments** from the original handoff are **done** except for one
  small owner-input item flagged below (A8).
- **Project entries:** 8 total, exceeding the rubric floor (≥ 5), with the right
  composition: 4 CS, 2 interdisciplinary, 1 outside-CS, 1 capstone. SOAR ×3
  (capstone + eBay + NutriBot), failure-story ×2 (eBay rate-limit + capstone v0.7.2),
  myContribution callout on Hydreon (placeholder text pending) and on the capstone.
- **Reflection essay:** 1194 words (in the 1000–1200 range), theme = practical /
  ethical automation for small businesses and underserved users, disciplines named
  = CS + Business + Ethics + Education, ≥ 3 portfolio examples, ≥ 1 failure story,
  explicit St. Thomas / common-good tie-in.
- **Deploy config:** Astro `site: https://flamingmachturtle.github.io`, `base:
  '/cisc480-portfolio/'`. All absolute asset paths run through `withBase()` so the
  site works correctly under the project-page subpath.

---

## 1. Adjustments status (was: §4 of the inherited handoff)

| ID | Item | Status | Notes |
|----|------|--------|-------|
| A1 | Rewrite About Me with ACM "unique combination" pattern | ✅ Done | `src/pages/index.astro` — explicit "Why should you hire me?" lead, paired CS-vs-liberal-arts cards |
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
| | | |
