# Holistic Signature Work Reflection — Eli Goldberger

*University of St. Thomas · CISC480 Senior Capstone · Section 02 · Spring 2026*

> **Submission links.** Live portfolio site: <https://flamingmachturtle.github.io/cisc480-portfolio/>
> · This repository (graded artifact): <https://github.com/FlamingMachTurtle/cisc480-portfolio>
> · The CISC480 capstone project itself (GreenStep Admin Console): documented inline on the [Projects page](https://flamingmachturtle.github.io/cisc480-portfolio/projects/) and in the source repo `CISC-480-GreenStep/sp26_team2_greenstepchallenge_admin`.
>
> **What this document is.** The 1000–1200 word integrative, interdisciplinary reflection that the Senior Capstone rubric requires as the main content of the portfolio's `README.md`. Developer notes for the site itself live in [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md).

---

## Introduction

If I had to name the thread that runs through everything I have built at the University of St. Thomas, it would be this: **practical, ethical automation for small businesses and underserved users.** Not moonshot software — the kind that takes a problem someone is already solving badly, usually in Excel, usually after hours, usually for a person no one was going to build software for, and replaces it with a tool that respects their time, their data, and their judgment. The theme sits squarely inside the St. Thomas commitment to the common good and the dignity of the person, because it insists that "the person being served" includes the people the market usually leaves out.

## The Problem and Why It Matters

The pattern repeats. A state agency runs a sustainability program in scoring spreadsheets passed by email. A small wholesaler runs B2B trade-show fulfillment out of QuickBooks and a hand-edited Google Sheet. A storefront on eBay rebuilds product imagery by hand because the "easy" tools don't fit their inventory. A middle-school student is told to "look it up" without being taught how to look. None of these people are doing anything wrong — they are doing the rational thing with the tools they were given. What is wrong is that the technology industry mostly does not see them as customers worth designing for, which means the costs of bad software — wasted hours, lost data, public mistakes — fall hardest on the people who already have the least margin to absorb them. The St. Thomas mission asks us to take the common good seriously, and the common good is exactly the wrong number to compute if your model of "user" silently excludes the people most likely to be ignored. The problem matters to me because the gap is bridgeable, and bridging it is the work I want my career to be about.

## Interdisciplinary Lens

This work needs at least three explicit disciplines to be done responsibly, plus a quiet fourth that trains all of them.

**Computer Science** gives me the build: the rate-limit-aware queue, the role-based access model, the test that catches the regression, the schema that survives migration. CS without the other lenses is sharper than it is useful.

**Business** is where I learned what "reasonable" means in the field. Two years of supporting Honey Smitten through trade-show seasons, lot-numbered inventory, and the QuickBooks workflow taught me that automation which doesn't survive a seasonal cycle was never really finished. Running Big Chuck Data LLC taught me to scope, to quote honestly, and to refuse work that would help me but not help the client.

**Ethics** is the lens that asks who gets hurt if the build is wrong. On the GreenStep capstone we made this concrete: deactivate-by-default rather than hard delete, every destructive action behind an explicit confirmation, and the single permanent-delete operation gated behind a server-side API route with row-level-security policies underneath — so a non-engineer can administer the system without accidentally erasing audit trails or violating role boundaries. The ethics were design constraints, not aspirations.

**Education**, the quiet fourth lens, comes from AVID tutoring. Inquiry-based teaching trained me to ask *"what is the user actually trying to do?"* before I write the code that answers them — which is the same posture good UI requires.

## Portfolio Examples Showing Growth

Four entries in my portfolio are the clearest evidence that these lenses sharpen each other.

**The CISC480 GreenStep capstone** is the integrating example. As one of four engineers building an admin console for Minnesota Pollution Control Agency staff, I scaffolded the React + Supabase app, owned the 22-widget customizable dashboard, and led the v0.7 cleanup that decomposed six 300+-line page components into a documented architecture. The ethics work — audit-log entries written *before* deletes, RLS policies underneath the SuperAdmin route, deactivate-by-default everywhere — is the part I am proudest of, because it shows the discipline of asking "who is this safe for?" before "is this fast?"

**The eBay store image standardization pipeline** is where I learned to treat external APIs as first-class infrastructure. The first version failed embarrassingly: I pushed a big batch through the eBay Trading API against a client's live store with no dry-run, the rate limiter tripped midway, and I had to reconstruct what had actually been applied versus rejected. The lesson is in every project I have built since — dry-run mode, idempotent logs, rate-limit-aware queues — and is exactly why the redesigned pipeline now ships at a 100% production success rate. That story is the kind of *failure → learning → change* I would tell any interviewer.

**AVID tutoring** sounds like an unrelated entry until you read the writing it produces. Asking middle schoolers structured questions instead of giving them answers — the inquiry-based questioning AVID drills into its tutors — is the same skill that produces error messages users can act on, onboarding flows that don't assume prior knowledge, and the live mobile preview I built into the GreenStep template form so non-technical staff can see what their decisions will look like *before* they ship.

**The capstone's own internal failure** — granting myself an exemption from my own file-size policy on `useDashboardStats.js`, writing the justification into the file header, and then catching myself a week later actively avoiding the file when adding the next widget — is the smaller, quieter learning moment I would also bring into an interview. A self-granted exemption from your own standard is almost always wrong on the second touch. I codified the rule into the team's `CODING_GUIDELINES.md` so the next person (including future-me) has to defend the exemption to the team, not to themselves.

## How St. Thomas Prepared Me, and What I'll Do With It

St. Thomas prepared me for this in a way I did not see at the time. The CS curriculum interleaves with a liberal-arts core that takes ethics, theology, philosophy, and language seriously, which is the only reason those four lenses feel like one job instead of four. The capstone class itself enforced the integrative part — a real client, a real team of four, a real semester, real coordination friction with a separate team on the shared schema — and the AVID service-learning placement gave me the outside-CS hours that keep the work honest.

What's next is concrete. I plan to grow **Big Chuck Data LLC** into a sustainable consultancy that serves small-business clients end-to-end without overcharging or over-automating. I plan to keep pushing toward medical and mental-health technology contributions, where the same posture — automate the boring parts, leave the human parts to humans, make the destructive actions hard to do by accident — matters even more than it does on a store inventory or a city sustainability dashboard. And I plan to keep doing service-learning work alongside the technical work, because the two sharpen each other.

## Closing

I leave St. Thomas as a developer who can talk to non-technical people without losing them, ship reliable automation that respects real-world constraints, and treat the people I build for — store owners, middle-school students, municipal staff, future patients — with the kind of care this tradition expects.

---

## Academic Honesty

I affirm that this portfolio and reflection are my own original work, completed in accordance with the University of St. Thomas academic integrity standards. AI tools were used as a scaffolding and review aid during the build of this portfolio site; all narrative claims, project history, personal contributions, and the reflection's argument are mine.

— **Eli Goldberger** · CISC480 Senior Capstone · Section 02 · Spring 2026
