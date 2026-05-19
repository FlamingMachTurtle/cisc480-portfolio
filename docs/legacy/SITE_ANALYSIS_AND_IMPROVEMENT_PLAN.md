# Portfolio Site Analysis & Improvement Plan

**Analyzed:** March 18, 2025  
**Last Updated:** March 18, 2025  
**Site Type:** Developer/Consultant Portfolio  
**Pages:** Home, Projects, Resume, Fun Stuff

> **Related:** See [REPO_OVERHAUL_AUDIT.md](REPO_OVERHAUL_AUDIT.md) for the full technical audit and overhaul planning context.

---

## Migration Status (Astro Overhaul — March 2025)

The site has been migrated to **Astro v6** with shared layout and content collections. Items addressed:

| Original Issue | Status |
|----------------|--------|
| No persistent nav | **Fixed** — Sticky header with Home \| Projects \| Resume \| Fun Stuff |
| foundation.js missing | **Resolved** — Astro layout; no Foundation dependency |
| Typo "proccesing" | **Fixed** → "processing" |
| Duplicated layout | **Fixed** — Single `BaseLayout.astro` |
| No meta descriptions / SEO | **Fixed** — Meta, canonical, Open Graph in layout |
| Skip-to-content link | **Added** |
| Download/Print resume | **Preserved** — Same UX on Resume page |
| Project content | **Migrated** — Content collections in `src/content/projects/` |
| Legacy Foundation/jQuery | **Archived** — Moved to `_legacy/` |

**Remaining (optional):** Fix PDF filename `resue.pdf` → `resume.pdf`; add favicon; consider Tailwind for further styling.

---

## Grading System for Developer Portfolios

| Category | Weight | 1 (Poor) | 2 (Fair) | 3 (Good) | 4 (Strong) | 5 (Excellent) |
|----------|--------|-----------|-----------|-----------|-------------|----------------|
| **Visual Design** | 20% | Generic, template-like | Some custom styling | Cohesive palette, clear hierarchy | Distinctive typography + layout | Memorable, portfolio-quality aesthetic |
| **First Impression** | 15% | Confusing or overwhelming | Functional but forgettable | Clear value proposition | Compelling hero, instant clarity | Strikes emotional + professional chord |
| **Content Presentation** | 20% | Walls of text, poor scan-ability | Basic structure | Scannable, organized | Well-paced sections, strong CTAs | Story-driven, converts interest to action |
| **Navigation & Flow** | 15% | Hard to find things | Menu exists but hidden | Predictable nav | Persistent, accessible nav | Intuitive, minimal friction |
| **Project Showcase** | 20% | No links, no visuals | Basic list | Links + images | Live demos, case studies | Interactive, outcome-focused |
| **Technical Polish** | 10% | Broken links, typos | Works but rough | Responsive, accessible | Performance, semantics | Best practices, accessibility score 90+ |

---

## Page-by-Page Analysis

### 🏠 Home Page

| Criteria | Score | Notes |
|----------|-------|------|
| Visual Design | 2/5 | Plain white, black text, default Foundation styling. No custom color palette or typography. |
| First Impression | 2/5 | Headshot + bio visible; value prop exists but feels generic. |
| Content Presentation | 3/5 | Clear sections (About, Goals, highlight cards). Good structure, but typography lacks hierarchy. |
| Navigation & Flow | 2/5 | Menu is a single "Menu" button—not discoverable. Off-canvas nav hidden. |
| Technical Polish | 3/5 | Typo: "proccesing" → "processing". Semantic HTML present. |

**Overall Home Score: 2.4/5**

**Strengths:**
- Headshot adds personal touch
- Contact links (LinkedIn, GitHub, email) are visible
- Highlight cards (Recent Win, What I'm Into, Reach Out) show personality

**Weaknesses:**
- No site-wide color scheme or custom typography
- Menu button placement is inconsistent (inline with header content)
- No persistent header/navbar—visitors must find "Menu" to navigate
- Headshot frame has no border/shadow—feels flat
- No call-to-action (e.g., "View Projects" or "Download Resume")

---

### 📁 Projects Page

| Criteria | Score | Notes |
|----------|-------|------|
| Visual Design | 2/5 | Same minimal styling. Project cards use default Foundation callouts. |
| First Impression | 2/5 | Long text blocks; first project (eBay) dominates. No visual hierarchy between projects. |
| Content Presentation | 3/5 | Projects listed with descriptions, tech stacks, and images. Good content depth. |
| Project Showcase | 2/5 | Only one project (90-Day Challenge) has a live link. No "View Demo" / "Source Code" CTAs. |
| Technical Polish | 3/5 | Images referenced; layout works. Multiple galleries feel repetitive. |

**Overall Projects Score: 2.4/5**

**Strengths:**
- Rich project descriptions (eBay, NutriBot, SwiftUI, Minecraft, 90-Day Challenge)
- Before/after image processing gallery
- NutriBot and Hydreon galleries add visual variety

**Weaknesses:**
- No links to live demos or repos for most projects
- Project cards lack hover states or visual differentiation
- Image order inconsistency (some have image first, some last)
- Long page—could benefit from filtering or tabs (e.g., "Automation" vs "Mobile" vs "Web")
- No metrics or outcomes highlighted (e.g., "100% success rate" buried in copy)

---

### 📄 Resume Page

| Criteria | Score | Notes |
|----------|-------|------|
| Visual Design | 2/5 | Same minimal styling. Work experience in callout boxes. |
| First Impression | 2/5 | Dense text. Skills section is a single paragraph—hard to scan. |
| Content Presentation | 2/5 | Education and experience are present but not visually prioritized. |
| Technical Polish | 3/5 | Download PDF, Open in New Tab, and Print actions exist. PDF filename typo: `resue.pdf` should be `resume.pdf`. |

**Overall Resume Score: 2.3/5**

**Strengths:**
- Education, work history, and skills all present
- Big Chuck Data, Honey Smitten, Hydreon roles well described
- External link to University of St. Thomas
- Download PDF, Open in New Tab, and Print controls implemented; PDF embedded in iframe

**Weaknesses:**
- Resume PDF filename typo (`resue.pdf`) — rename file or update links
- Skills as one block of text—consider tags, icons, or grouped layout
- "October 2022 – Present (still do random contract work)" reads informal
- Work experience cards don't distinguish current vs past roles
- No timeline or visual flow (e.g., vertical timeline)

---

### 🎮 Fun Stuff Page

| Criteria | Score | Notes |
|----------|-------|------|
| Visual Design | 2/5 | Minimal. Commented-out movie posters section. |
| First Impression | 2/5 | Hobbies paragraph is very long; Links section is sparse. |
| Content Presentation | 2/5 | Trade show photos add color, but layout is basic. |
| Technical Polish | 3/5 | GitHub link present. Photos load if images exist. |

**Overall Fun Stuff Score: 2.3/5**

**Strengths:**
- Personal voice (trade shows, KitKat story, movie favorites)
- Trade show images (Atlanta, Vegas) add authenticity
- GitHub link for experiments

**Weaknesses:**
- Movie poster section is commented out—either enable or remove
- "Check out my github" callout is repetitive (GitHub already in header)
- Hobbies paragraph is a single long block—consider bullet summary + expandable detail
- No link to 90-Day showcase or other interactive demos from this page

---

## User Flow Analysis

### Navigation Flow

```
Home → [Menu] → Off-canvas: Home | Projects | Resume | Fun Stuff
```

**Issues:**
1. **Hidden primary nav** — Users must find and click "Menu" to see navigation. No persistent nav bar.
2. **No breadcrumbs** — On subpages, no indication of where you are in the site structure.
3. **No footer** — No site-wide links, copyright, or secondary nav.
4. **Inconsistent Menu placement** — On Home it's with header content; on other pages it's at top-left. Same button, different context.

### Content Flow

| Path | Purpose | Friction Points |
|------|---------|------------------|
| Home → Projects | Show work | No CTA from Home to Projects; user must open Menu |
| Home → Resume | Get hired | Download/Print controls exist on Resume page; no CTA in header or on Home |
| Projects → External | See demos | Only 90-Day Challenge has a link; others lack live/demo links |
| Fun Stuff → GitHub | See experiments | Redundant with header; could link 90-Day showcase instead |

---

## Cross-Cutting Issues

| Issue | Impact | Pages Affected |
|-------|--------|----------------|
| No persistent nav | Hard to switch sections | All |
| Single color palette (white/black/blue) | Generic look | All |
| Default Foundation typography | No brand identity | All |
| No favicon | Unprofessional in tabs | All |
| Typo "proccesing" | Attention to detail | Home |
| PDF filename typo (`resue.pdf`) | Unprofessional, risk of broken links | Resume |
| Missing project links | Lost opportunities | Projects |
| Commented-out code | Incomplete feel | Fun Stuff |

---

## Improvement Recommendations (Prioritized)

### P0 — Quick Wins (1–2 hours)
1. **Fix typo:** "proccesing" → "processing"
2. **Add favicon** — Even a simple "E" or initial
3. **Add persistent nav bar** — Sticky header with Home | Projects | Resume | Fun Stuff (collapse to hamburger on mobile)
4. **Restore `foundation.js`** — Critical: file is referenced but missing from repo; off-canvas menu will not work without it
5. **Fix PDF filename:** Rename `resue.pdf` → `resume.pdf` and update links
6. **Add "Download Resume" to header/Home** — PDF link exists on Resume page; add prominent CTA in header and/or Home
7. **Remove or enable movie posters** — Uncomment and style, or delete the block

### P1 — Visual Upgrade (4–8 hours)
8. **Define a color palette** — Primary, secondary, accent (e.g., deep navy + warm accent)
9. **Custom typography** — Replace system fonts with Google Fonts (e.g., DM Sans + a display font)
10. **Hero section on Home** — Larger headshot, bold tagline, clear CTA ("View Projects" / "Download Resume")
11. **Card polish** — Borders, subtle shadows, hover states, rounded corners
12. **Headshot frame** — Border, shadow, or subtle background to make it pop

### P2 — Content & UX (4–6 hours)
13. **Project CTAs** — Add "View Demo" / "Source" / "Case Study" links for each project
14. **Skills as tags** — Convert skills paragraph to pill/badge layout (Resume page content is in PDF; consider adding skills summary in HTML)
15. **Footer** — Contact links, nav, copyright
16. **Breadcrumbs or page indicator** — Show current section in nav

### P3 — Advanced Polish (8+ hours)
17. **Smooth scroll / transitions** — Subtle page transitions or scroll effects
18. **Project filtering** — Filter by type (Automation, Mobile, Web, Game Dev)
19. **Dark mode toggle** — Optional for developer portfolios
20. **Performance** — Lazy-load images, optimize Foundation bundle if possible
21. **Accessibility audit** — Contrast, focus states, ARIA labels

---

## Summary Grades

| Page | Overall | Key Fix |
|------|---------|---------|
| **Home** | 2.4/5 | Add hero, persistent nav, fix typo |
| **Projects** | 2.4/5 | Add project links, improve card design |
| **Resume** | 2.3/5 | Fix PDF filename, add skills summary/tags in HTML if desired |
| **Fun Stuff** | 2.3/5 | Fix movie section, tighten copy |
| **Site-Wide** | **2.4/5** | Nav, palette, typography |

---

## Next Steps

1. **Critical:** Restore missing `js/vendor/foundation.js` — off-canvas menu depends on it
2. Choose a design direction (e.g., "Modern minimal" vs "Bold developer")
3. Implement P0 items first
4. Create a simple style guide (colors, fonts, spacing) in `site.css`
5. Add a README to track versions and future goals (per project conventions)
6. For full overhaul planning, use the [AI Research Prompt](AI_RESEARCH_PROMPT.md) with an external AI researcher to evaluate tech stacks and frameworks
