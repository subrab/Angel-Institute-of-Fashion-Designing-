# Angel Institute of Fashion Designing & Angel Tailoring

Digital platform project for a real, currently-offline business in Tirunelveli, Tamil Nadu —
a fashion design institute and a tailoring studio run under one roof.

**Status: Phase 0 (foundation) complete. Phase 1 in progress — database is live on
Neon. Homepage design mockup in progress. No backend API or frontend app code has
been written yet.**

## Repo structure

```
docs/
  ANGEL-PHASE0-CLAUDE-PACKAGE.md   Business info pack + master build prompt
  01-PHASE0-FOUNDATION.md          Product vision, personas, feature matrix, architecture,
                                    database/API proposals, Release 1 backlog
database/
  schema.sql                       Release 1 schema (applied to the live Neon database)
  README.md                        Table-by-table explanation + how to connect
assets/
  logo/                            Isolated Angel logo mark (white-bg and transparent PNG)
mockups/
  angel-homepage-mockup.html       Self-contained HTML/CSS design preview of the homepage
                                    (mock data only, not connected to any backend)
```

## How to view the homepage mockup

`mockups/angel-homepage-mockup.html` is a single self-contained file — open it directly in
any browser, no build step or server required. All images are embedded, and the enquiry
form / brochure button are front-end mock interactions only.

## Confirmed business facts (do not invent beyond these)

See `docs/ANGEL-PHASE0-CLAUDE-PACKAGE.md` for the full, current list — location, contact
details, course durations, services, fee policy (not publicly listed), and registration
status. That document is the source of truth for any future work on this project,
including by Claude.

## Roadmap

- Release 1 — public website (in design now) + basic admin
- Release 2 — student platform (progress, attendance, assignments, certificates)
- Release 3 — customer tailoring platform (measurements, orders, tracking)
- Release 4 — CRM, analytics, and automation

Full detail in `docs/01-PHASE0-FOUNDATION.md`.
