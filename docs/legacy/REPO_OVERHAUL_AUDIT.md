# Portfolio Repo Overhaul Audit

**Audit Date:** March 18, 2025  
**Branch:** `overhaul/audit-and-research`  
**Site Type:** Developer/Consultant Portfolio (GitHub Pages)  
**Scope:** Full repository analysis for overhaul planning and tech stack research

---

## Executive Summary

The portfolio is a static multi-page site (4 pages) built with Zurb Foundation 6.8.0, jQuery, and minimal custom styling. Several critical issues—including a missing core dependency (`foundation.js`) and duplicated layout across pages—undermine reliability and maintainability. The site scores ~2.3–2.4/5 on documented rubric criteria. A full overhaul with a modern stack is recommended to address dependency risks, improve UX/navigation, and establish build/tooling maturity.

---

## 1. Current Architecture

### Stack

| Layer | Technology | Version / Notes |
|-------|------------|-----------------|
| HTML | Static multi-page | 4 pages: index, projects, resume, fun |
| CSS | Foundation for Sites + custom | `foundation.css` ~8k lines; `site.css` ~84 lines |
| JS | jQuery, what-input, Foundation | jQuery 3.7.0; what-input 5.2.12; Foundation **missing** |
| Deploy | GitHub Pages | No CI config; push-to-deploy assumed |
| Build | None | No npm, bundler, or build pipeline |

### File Structure

```
/
├── index.html              # Home
├── pages/
│   ├── projects.html
│   ├── resume.html
│   └── fun.html
├── css/
│   ├── foundation.css      # Full framework (~8k lines)
│   └── site.css            # Custom overrides
├── js/vendor/
│   ├── jquery.js
│   ├── what-input.js
│   └── foundation.js       # REFERENCED BUT MISSING
├── resume/
│   └── resue.pdf           # Typo in filename
├── images/                 # Referenced; structure inferred from HTML
│   ├── headshot.jpg
│   ├── cruz-before.jpg, cruz-after.jpg
│   ├── nutri/, filter/, mc-port/, 30-day/, b2b-shows/, prisoners/, prestige/, robots/
└── SITE_ANALYSIS_AND_IMPROVEMENT_PLAN.md
```

---

## 2. Critical Issues

### 2.1 Missing Dependency (CRITICAL)

| Issue | Location | Impact |
|-------|----------|--------|
| `js/vendor/foundation.js` is referenced in all 4 HTML files but **does not exist** in the repo | `index.html` line 82; `pages/*.html` ~lines 60–90 | Off-canvas menu cannot initialize; `$(document).foundation()` will fail; primary navigation may be broken |

**Recommendation:** Either add the missing Foundation JS file or migrate to a stack that does not depend on it before deploy.

### 2.2 Content Errors

| Issue | Location | Fix |
|-------|----------|-----|
| Typo: "proccesing" → "processing" | `index.html` line 61 | Edit copy |
| Typo filename: `resue.pdf` → `resume.pdf` | `resume/resue.pdf`; `pages/resume.html` lines 40–42, 51 | Rename file and update all references |

### 2.3 Documentation Drift

| Doc Claim | Reality |
|-----------|---------|
| "No PDF resume download" | Download, Open in New Tab, and Print buttons **already exist** on Resume page |
| "Add Download Resume—P0" | Implemented; doc is outdated |

---

## 3. UX & Navigation

### 3.1 Navigation

| Issue | Impact |
|-------|--------|
| **Hidden primary nav** | All nav is in off-canvas menu; users must find and click "Menu" to see links |
| **No persistent header** | No sticky navbar with Home \| Projects \| Resume \| Fun Stuff |
| **Inconsistent Menu placement** | On Home: inline with header content; on subpages: top-left under title |
| **No breadcrumbs** | Subpages give no indication of current location |
| **No footer** | No site-wide secondary nav, contact links, or copyright |

### 3.2 Resume Page UX

| Issue | Location | Notes |
|-------|----------|-------|
| "Print" control opens PDF in new tab | `pages/resume.html` line 42 | Label implies print action; user must use Cmd/Ctrl+P manually. Consider renaming to "Open for printing" or adding explicit print behavior |

---

## 4. Accessibility

| Status | Item |
|--------|------|
| Good | Close button has `aria-label`; nav links use `aria-current="page"`; decorative `×` has `aria-hidden` |
| Good | External links use `target="_blank" rel="noopener"` |
| Good | Images have meaningful `alt` text |
| Good | what-input.js for input-method-aware focus |
| Missing | Skip-to-content link for keyboard users |
| Misleading | "Print" link `aria-label="Open resume for printing"`—opens PDF in new tab rather than invoking print |

---

## 5. Performance

| Issue | Location | Recommendation |
|-------|----------|----------------|
| No lazy loading | All `<img>` | Add `loading="lazy"` for below-fold images |
| Render-blocking scripts | All pages | Scripts loaded synchronously; add `defer` where possible |
| Large CSS | `foundation.css` ~8k lines | Only off-canvas, grid, callout, buttons used; consider minimal CSS or framework replacement |
| Full stack on every page | All pages | Same jQuery + Foundation + what-input on every page; no per-page or code splitting |

---

## 6. SEO & Social

| Issue | Impact |
|-------|--------|
| No `meta name="description"` | Poor search snippets |
| Generic titles ("X \| Personal Website") | Weak differentiation |
| No Open Graph / Twitter Card | Poor social sharing previews |
| No `rel="canonical"` | Duplicate-content risk if multiple URLs |

---

## 7. Content Architecture

| Issue | Location |
|-------|----------|
| Commented-out movie posters | `pages/fun.html` lines 52–57 |
| Duplicate GitHub link | Fun Stuff header + callout both link to GitHub |
| Project card structure inconsistency | Hydreon card: image before heading; others: heading first |
| Image filenames with spaces | `p1 copy.png`, `p2 copy.png`—may require URL encoding |
| Only one project with live link | 90-Day Challenge; others lack demo/source CTAs |

---

## 8. Maintainability

| Issue | Impact |
|-------|--------|
| **Duplicated layout** | Off-canvas, nav, scripts repeated in 4 HTML files; one change requires edits in multiple places |
| **Path inconsistency** | `index.html` uses `images/`, `css/`, `js/`; `pages/*` use `../images/`, `../css/`, `../js/`—correct but error-prone |
| **No README** | No top-level project docs or version tracking |
| **No dependency manifest** | No `package.json`; jQuery, Foundation, what-input vendored without lockfile |
| **Existing analysis not linked** | `SITE_ANALYSIS_AND_IMPROVEMENT_PLAN.md` not referenced from main docs |

---

## 9. Dependency & Tooling Health

| Area | Status |
|------|--------|
| Build pipeline | None |
| Tests | None |
| Linting / formatting | None |
| Dependency tracking | None (`package.json` absent) |
| Foundation version | 6.8.0 (older release) |
| foundation.js | Missing from repo |

---

## 10. Prioritized Remediation Matrix

### P0 — Immediate (before any deploy)

1. Add or restore `foundation.js` so the menu works.
2. Fix typo: "proccesing" → "processing".
3. Rename `resue.pdf` → `resume.pdf` and update references (or fix links to match current filename if file rename is avoided).

### P1 — Overhaul Prerequisites

4. Add persistent nav bar (sticky header with collapse on mobile).
5. Add favicon.
6. Add meta descriptions and improve page titles.
7. Add `loading="lazy"` to below-fold images.
8. Add skip-to-content link.

### P2 — Structural Improvements (or migrate instead)

9. Extract shared layout (templating, includes, or migration to component-based stack).
10. Add footer with nav and contact.
11. Project CTAs: add "View Demo" / "Source" links for each project.
12. Uncomment or remove movie poster block.

### P3 — Overhaul / Rebuild

13. Migrate to modern stack with build pipeline, component reuse, and dependency management.
14. Add Open Graph / Twitter Card meta tags.
15. Consider dark mode, project filtering, performance optimization, and accessibility audit.

---

## 11. Overhaul Decision Criteria

When evaluating a new tech stack for a full rebuild, consider:

- **Static-first:** GitHub Pages hosting; no server required.
- **Low complexity:** Small site (4 pages); avoid over-engineering.
- **Maintainability:** Shared layout/components; minimal duplication.
- **Performance:** Fast loads; lazy loading; minimal JS.
- **Authoring UX:** Easy to add/edit content (markdown or simple data).
- **Deploy simplicity:** Push-to-deploy or simple CI.
- **Learning curve:** Solo developer; balance power vs. ramp-up time.

---

## 12. Related Documents

- [SITE_ANALYSIS_AND_IMPROVEMENT_PLAN.md](SITE_ANALYSIS_AND_IMPROVEMENT_PLAN.md) — Grading rubric, page scores, and improvement roadmap (to be reconciled with this audit)
- [AI_RESEARCH_PROMPT.md](AI_RESEARCH_PROMPT.md) — Ready-to-use prompt for external AI to evaluate tech stack options
