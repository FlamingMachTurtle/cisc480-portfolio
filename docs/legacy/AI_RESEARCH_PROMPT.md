# External AI Research Prompt: Tech Stack & Framework Evaluation for Portfolio Overhaul

**Purpose:** Copy the prompt below into an external AI researcher (e.g., Claude, GPT, or similar) to get a structured evaluation of modern tech stacks and frameworks suitable for overhauling this static portfolio site.

**Context documents to attach (if the AI supports file uploads):**
- `REPO_OVERHAUL_AUDIT.md` — Full technical audit
- `README.md` — Project overview, goals, decision criteria

---

## Prompt (Copy From Here)

```
You are an expert in modern web development and static site architecture. I need a comprehensive, research-driven evaluation of tech stacks and frameworks to overhaul a developer portfolio site. Please provide a structured analysis with ranked options, migration paths, and clear recommendations.

---

### Project Context

**Current state:**
- Static multi-page site (4 pages: Home, Projects, Resume, Fun Stuff)
- Built with Zurb Foundation 6.8.0, jQuery, and minimal custom CSS
- Hosted on GitHub Pages (static hosting only; no server)
- Critical issues: missing core JS dependency (foundation.js), duplicated layout across all pages, no build pipeline, no dependency manifest

**Site content:**
- Home: headshot, bio, highlight cards, contact links
- Projects: 5 project cards with descriptions and image galleries
- Resume: embedded PDF with download/open/print actions
- Fun Stuff: hobbies, trade show photos, links

---

### Constraints

1. **Hosting:** Must deploy to GitHub Pages (static HTML or static output)
2. **Scope:** Small site (~4 pages); avoid over-engineering
3. **Maintainability:** Reduce duplication—shared layout/components essential
4. **Developer:** Solo developer; balance power vs. learning curve
5. **Budget:** Prefer low-cost or free tooling; no paid hosting required

---

### Prioritized Goals (in order)

1. **Maintainability** — Shared layout, components, or templating; single source of truth for nav/footer
2. **Performance** — Fast loads, minimal JS, lazy loading, good Lighthouse scores
3. **Content authoring** — Easy to add/edit projects and pages (markdown or simple data preferred)
4. **Deploy simplicity** — Push-to-deploy or minimal CI (e.g., GitHub Actions)
5. **SEO & accessibility** — Meta tags, semantic HTML, ARIA, skip links
6. **Future flexibility** — Room to add filtering, dark mode, or interactive elements later

---

### Tech Stack Categories to Evaluate

Please compare and score options across these categories (and suggest others if relevant):

1. **Static Site Generators (SSG)**
   - Astro (with or without islands)
   - Eleventy (11ty)
   - Hugo
   - Jekyll (GitHub Pages native)

2. **React-based**
   - Next.js (static export)
   - Gatsby
   - Remix (static deploy)

3. **Vue-based**
   - VitePress
   - VuePress / VitePress
   - Nuxt (static)

4. **Other / Minimal**
   - Plain HTML + templating (e.g., Nunjucks, Pug) + simple build
   - SvelteKit (static adapter)

5. **CSS / Styling**
   - Tailwind CSS
   - UnoCSS
   - Lightning CSS + custom properties
   - Keep minimal custom CSS only

---

### Required Output Format

Provide your analysis in the following structure:

#### 1. Executive Summary (2–3 paragraphs)
- Top 2–3 recommended stacks with brief rationale
- Key trade-offs and when to choose each

#### 2. Ranked Options Table
| Rank | Stack | Best For | Effort (1–5) | Migration Risk | Notes |
|------|-------|----------|--------------|----------------|------|
| 1 | ... | ... | ... | ... | ... |
| 2 | ... | ... | ... | ... | ... |
| ... | ... | ... | ... | ... | ... |

#### 3. Detailed Analysis (for top 3 options)
For each of the top 3 options, provide:
- **Pros & cons** specific to this portfolio use case
- **Migration path** — step-by-step approach (e.g., "start with single page, then expand")
- **Estimated effort** — hours/days for solo developer familiar with basics
- **Risks** — what could go wrong; how to mitigate
- **Pilot recommendation** — what to build first to validate the choice (e.g., "rebuild Projects page only")

#### 4. Styling Strategy
- Which CSS approach pairs best with your top recommendation?
- How to handle the embedded PDF resume (iframe vs. link-only)
- Image optimization and lazy loading recommendations

#### 5. Deployment & CI
- Recommended GitHub Actions workflow (or alternative)
- Branch strategy for staging vs. production if applicable

#### 6. Decision Matrix
If the user values X over Y (e.g., "least learning curve" vs. "maximum flexibility"), which option wins and why?

---

### Additional Questions to Address

1. **Astro vs. Eleventy** — For a content-light portfolio, which is a better fit and why?
2. **Framework overhead** — Is a full React/Vue/Svelte framework justified for 4 static pages, or is an SSG + minimal JS sufficient?
3. **Content sourcing** — Should projects be stored as Markdown + frontmatter, JSON, or kept in HTML/components? What's easiest to maintain?
4. **PDF resume** — Best practice: embed in iframe, link only, or convert to HTML section?

---

Please base your recommendations on current best practices (2024–2025). Cite specific versions or docs where relevant. If any framework has had significant recent changes (e.g., major version, new defaults), note them.
```

---

## End of Prompt

---

**After running:** Review the AI output, compare with your own preferences, and use the ranked options and migration paths to plan the overhaul. The pilot recommendation is especially useful—start small (e.g., one page) before committing to a full rebuild.
