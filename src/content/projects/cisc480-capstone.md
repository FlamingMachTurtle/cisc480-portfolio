---
sortOrder: 0
category: capstone
title: "Admin Console for Minnesota's GreenStep Sustainability Challenge Program"
description: >-
  A React + Supabase admin console built with a four-person CISC480 capstone
  team for the Minnesota Pollution Control Agency, replacing the scattered
  Excel scoring templates that GreenStep Cities staff had been using to run
  sustainability challenges (Commissioner's Challenge, Earth Month, Commute
  Week). Admins launch and edit challenges from reusable templates, assign
  users to groups, watch live engagement on a customizable drag-and-drop
  dashboard with 22 widgets, and export filtered participation reports as
  CSV for leadership. Role-based access (SuperAdmin / Admin / GeneralUser),
  Supabase magic-link/OTP auth, a global MUI v7 dark theme, and a live
  mobile preview next to the authoring forms shipped in the v0.10 release.
  Keywords: admin dashboard, drag-and-drop widgets, role-based access
  control, Supabase Postgres, CSV reporting, sustainability tracking,
  responsive design, React architecture and refactoring.
tech:
  - React 19
  - Vite
  - Material UI v7
  - react-grid-layout
  - Recharts
  - Supabase (Postgres + Auth)
  - Vercel (static + serverless API routes)
  - ESLint + Prettier
keywords:
  - Admin dashboard
  - Drag-and-drop widgets
  - Role-based access control
  - Supabase Postgres
  - CSV reporting
  - Sustainability tracking
  - Responsive design
  - React architecture & refactoring
highlights:
  - Shipped v0.10 frontend MVP, demoed live to the client (MPCA)
  - 22-widget customizable dashboard with 5-breakpoint responsive layouts
  - Every source file ≤ 300 lines by end of semester (tiered policy + ARCHITECTURE map)
myContribution: >-
  I scaffolded the initial admin React app (dual point system, role-based
  routing, mock data layer, reports + CSV export), then owned the customizable
  drag-and-drop dashboard end-to-end — 22 widgets across stats / charts /
  tables, 4 quick layout presets, per-user localStorage persistence, and
  explicit responsive layouts across 5 breakpoints (PR #2, plus the Reports
  widget slice in PR #68). I led the v0.7 code-cleanup-and-refactor as a
  ten-stacked-PR umbrella (PR #43, closes #42): split the 426-line data/api.js
  monolith into per-entity modules, decomposed six page components over 300
  lines, added Prettier + ESLint with a tiered file-size policy, restored
  CODING_GUIDELINES.md, and wrote the contributor-facing
  docs/ARCHITECTURE.md. I also shipped the global MUI v7 dark theme + the
  live mobile preview next to the challenge and template forms (PR #46,
  Issue #20 tasks A & C), the SuperAdmin permanent-user-delete via a Vercel
  serverless API route (PR #79 / Issue #67), and the presentation
  deliverables (C4 L1/L2/L3 mermaid diagrams, slide outline, demo script,
  lessons-learned synthesis, README/version-history). Teammates owned the
  Supabase integration and auth (magic-link → 6-digit OTP swap, RLS
  policies, deactivation flow, env-var migration, Vercel deploy), comparison
  mode, custom categories, and the schema work for groups/challenges.
  Git shows ~100 of ~199 commits authored by me.
soar:
  situation: >-
    Minnesota GreenStep Cities staff at the MPCA were running their annual
    sustainability programs by passing Excel scoring templates back and forth
    with cities. Data was fragmented, roll-ups were manual, and there was no
    central place for admins to manage challenges, users, or impact reporting.
    Our capstone team of four was asked to build the admin-side web console
    while a separate team built the user-facing mobile app against a shared
    Supabase database.
  obstacle: >-
    We had one semester, a live client, and a coordination boundary with a
    team we didn't sit with. The taxonomy had to match real MPCA scoring
    templates from 2019–2024, not invented categories. Mid-project we
    dropped the originally-planned FastAPI + standalone Postgres backend in
    favor of Supabase to fit the calendar, which meant rewriting the data
    layer. By v0.6 several page components had crossed 500 lines and the
    team had flagged in code review that the codebase was getting hard to
    extend with four contributors on it.
  action: >-
    I scaffolded the initial React + MUI app with role-based access, the
    dual point system, leaderboards, and CSV reports. I then built the
    customizable dashboard (22 widgets, 4 layout presets, drag-and-resize,
    5 responsive breakpoints, localStorage per user). To keep the team
    productive I ran the v0.7 code-cleanup as ten stacked PRs (split
    data/api.js into per-entity modules; decomposed DashboardPage,
    ChallengeForm, ChallengeDetail, GroupDetail, UsersPage, UserDetail; added
    Prettier + ESLint with a tiered file-size policy; wrote ARCHITECTURE.md).
    I shipped the global MUI v7 dark theme and the live mobile preview, the
    SuperAdmin permanent-delete via a Vercel serverless API route with
    cascade handling and an audit-log entry written before the delete, and
    the presentation-prep docs (C4 diagrams, slide outline, demo script).
    Teammates owned Supabase auth (including the magic-link → OTP swap and
    RLS policies), the Vercel deploy migration, comparison-mode charts,
    custom-category schema, and most of the back-end schema work.
  result: >-
    Shipped a v0.10 frontend MVP deployed to Vercel and demoed live to the
    client and the capstone class. Templates → challenges → reports flow,
    role-gated user/group management, customizable dashboard, CSV export,
    and the live mobile preview all working end-to-end against Supabase.
    Every source file in src/admin-app/src/ ended the semester ≤ 300 lines,
    with a documented coding standard, an ARCHITECTURE map, and lint +
    format + build all green. Integration with the mobile team on the
    shared schema, photo uploads, and content moderation are tracked as
    named follow-ups, not unknowns.
failureStory:
  context: >-
    I had pushed through the customizable dashboard fast to get features on
    screen. A few files (DashboardPage 509 lines, ChallengeForm 491,
    useDashboardStats 393) were well over the soft 300-line threshold the
    team had informally agreed to.
  whatHappened: >-
    In the v0.7 cleanup I split most of them but left useDashboardStats.js
    at 393 with a "splitting would hide the helpers" justification in the
    file header. Within a week of shipping I caught myself avoiding the
    file when adding the next widget — the justification I had written for
    myself was the excuse, not the reason.
  learning: >-
    A self-granted exemption from your own size policy is almost always
    wrong on the second touch. I did a v0.7.2 audit pass that pulled the
    13 pure aggregators out into a dashboard/hooks/aggregations.js module
    under 200 lines, dropped the in-file exemption, and codified the
    tiered rule (≤ 300 fine / 301–500 needs justification / > 500 hard
    ceiling) in CODING_GUIDELINES so the next person — including
    future-me — has to defend the exemption to the team, not to
    themselves.
image: /images/greenstep/greenstep-dashboard.png
imageAlt: "Dark-themed GreenStep admin dashboard with four KPI stat cards across the top, a Challenge Summary table, and an Actions-by-Category pie chart."
imageFirst: false
---
