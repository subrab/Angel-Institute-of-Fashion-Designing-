# ANGEL DIGITAL PLATFORM — PHASE 0 FOUNDATION

Prepared per the Master Claude Prompt, Section 13 (First Task). This is analysis and
architecture only — no application code has been written yet.

---

## A. Product Vision

ANGEL is a single digital ecosystem for an existing, real business in Tirunelveli that
already runs two connected activities: **Angel Institute of Fashion Designing** (a small
training institute, 1 faculty, ~24 current students) and **Angel Tailoring** (a working
tailoring shop taking custom stitching orders). Both currently run entirely offline —
enquiries by phone/visit, students tracked on paper and WhatsApp.

The platform's job is to give this real, small, high-touch business a professional
online presence and a lightweight operational system, without turning it into
something the owner and one faculty member can no longer run day-to-day. It should:

- Generate enquiries for both the institute and the tailoring shop, and make it easy to
  follow up on them (a simple CRM).
- Give students a way to see their own course progress, attendance, and assignments
  instead of relying on a notebook.
- Give tailoring customers a way to place a request and track its status instead of
  calling to ask "is it ready."
- Do all of this in phases small enough that each one can go live and start being used
  before the next is built.

It is explicitly **not** a generic SaaS product for other tailoring shops — it is a
custom system for one business, sized to that business's actual scale (a few dozen
students, an unspecified but presumably modest order volume, one faculty member, one
admin/owner).

---

## B. User Personas

| Persona | Who they are | What they need from ANGEL |
|---|---|---|
| **Prospective student** | Someone in/near Tirunelveli interested in a fashion design or tailoring course | See what courses exist, see real student work/photos, contact the institute easily, without seeing a price they can't get (fees are enquiry-only) |
| **Prospective customer** | Someone wanting a blouse, chudi, lehenga, or pattu pavadai stitched | See the services offered, see the shop is real and trustworthy (gallery, reviews, Instagram), reach the shop by phone/WhatsApp or place a request |
| **Enrolled student** | One of the ~24 current or future students | Log in, see which modules/course they're doing, see attendance %, see assignments and feedback, eventually see fees/certificate status |
| **Ordering customer** | Someone who has placed a stitching order | Log in, see order status without calling, store their measurements once and reuse them, leave a review after pickup |
| **Faculty (1 person today)** | Runs classes, currently tracks everything on paper | Mark attendance quickly, set/grade assignments, without needing to become a "computer person" — this must be simpler than the current notebook, not harder |
| **Admin / Owner** | Runs the whole business | See all leads in one place, manage courses/gallery/reviews, see orders and their status, without needing technical skill beyond basic web use |
| **Super Admin (likely the owner or a trusted family member/you)** | Manages the platform itself | Manage staff/admin accounts, see everything, control settings |

Note: with 1 faculty and effectively one admin (the owner) today, STAFF and FACULTY
roles may end up being the same person for a long time. The system should still model
them as separate roles so it scales if that changes, but Release 1 does not need to
assume more than one real admin user.

---

## C. Feature Matrix

**MUST HAVE (Release 1 — cannot launch without these)**
- Public website: Home, About, Institute, Courses, Tailoring Services, Gallery,
  Reviews, Contact, Enquiry form
- "Contact us for fees" CTA on every course/enquiry touchpoint (no visible pricing)
- Admin login + basic dashboard
- Admin: view/manage leads (from website enquiry form)
- Admin: manage course listings and gallery content
- Admin: approve/manage reviews shown on site
- Mobile-responsive design (most visitors will be on phones)
- Basic SEO (titles, meta descriptions, sitemap) for Tirunelveli-area search

**SHOULD HAVE (Release 1 if time allows, else early Release 2/3)**
- Instagram feed embed on the website
- WhatsApp click-to-chat button throughout the site
- Lead source tracking (website / Instagram / WhatsApp / referral / other)
- Google Business Profile link/embed once the owner creates one

**COULD HAVE (Release 2/3 — real but not urgent)**
- Student login, course progress view, attendance view
- Assignment upload/grading
- Certificate generation with a public verification page
- Customer login, saved measurements, order placement and tracking
- Review request flow after order/course completion

**FUTURE (Release 4+ — do not design for this yet, just don't block it)**
- CRM-style conversion reporting and analytics dashboards
- WhatsApp Business API integration for automated notifications
- Payment collection inside the app (currently cash/GPay/NEFT handled directly)
- Online course content / paid digital workshops
- Repeat-customer / lifetime-value tracking

---

## D. MVP Definition — Release 1 Scope

**In scope:**
1. Public website (see sitemap below), fully responsive, built around lead generation
   for both the institute and the tailoring shop.
2. A single enquiry form (with a dropdown for "Institute" vs "Tailoring" interest) that
   creates a **lead** in the admin system.
3. Admin portal with: login, dashboard, leads list with status (New / Contacted /
   Converted / Lost), course content management (add/edit course name, duration,
   description — no fee field), gallery management (upload/remove photos), review
   management (approve/hide submitted or manually-entered reviews).
4. One admin account (the owner) to start; role structure supports more later.
5. Content: real business details (name, location, phone, WhatsApp, Instagram,
   hours), the provided logo assets, the one classroom photo, and clearly-labeled
   placeholders anywhere a real photo is still missing.

**Explicitly out of scope for Release 1:** student login, customer login, order
tracking, payments, certificates, mobile app. These come in Releases 2–3.

**Definition of done for Release 1:** the owner can point a real prospective student
or customer at the website, that person can find what they need and submit an
enquiry, and the owner can see and act on that enquiry from the admin portal —
without touching a database or writing anything down on paper for that lead.

---

## E. Website Sitemap (Release 1)

```
/
├── Home
├── About Angel
├── Institute
│   ├── Courses (Fashion Designing, Tailoring — duration only, "contact for fees")
│   ├── Why Angel Institute
│   └── Student Work / Gallery (Institute)
├── Tailoring
│   ├── Services (Blouse, Chudi, Lehenga, Pattu Pavadai)
│   └── Gallery (Tailoring)
├── Gallery (combined, or split by section as above)
├── Reviews
├── Contact
│   ├── Address (Tirunelveli), phone/WhatsApp, hours, map
│   └── Enquiry Form (Institute or Tailoring)
├── Privacy Policy
└── Terms
```

No pricing page. No customer/student login yet in Release 1 (can show a "Coming
soon" placeholder or simply omit the nav item until Release 2/3).

---

## F. Mobile App Information Architecture (for Release 2/3 — design now, build later)

**Student view** (Release 2)
```
Dashboard
├── My Course (name, duration, batch)
├── Progress (module checklist)
├── Attendance (%, monthly breakdown)
├── Assignments (list, due dates, submit, feedback)
├── Certificates (once issued)
├── Notifications
└── Profile
```

**Customer view** (Release 3)
```
Dashboard
├── New Order (service type, reference photo, notes)
├── My Orders (status tracker)
├── Measurements (saved profiles)
├── Notifications
└── Profile
```

Both share login/auth and a common shell; the dashboard content differs entirely by
role, per the "do not copy the website UX into the app" principle.

---

## G. Admin Portal Architecture

**Release 1**
```
Dashboard (lead count, recent enquiries)
├── Leads (list, status, source, notes)
├── Courses (add/edit — name, duration, description)
├── Gallery (upload/remove/reorder photos, tag Institute vs Tailoring)
├── Reviews (approve/hide)
└── Settings (contact info, hours, Instagram handle)
```

**Release 2/3 additions**
```
├── Students / Batches / Attendance / Assignments / Certificates
├── Customers / Measurements / Orders / Order status
└── Reports (basic counts — leads, conversions, orders)
```

---

## H. Database Entity Proposal (Release 1 subset shown first, full list for context)

**Release 1 tables:**
- `users` (id, name, email, password_hash, role, created_at, deleted_at)
- `leads` (id, name, phone, interested_in [institute|tailoring], source, message,
  status, assigned_to, created_at)
- `courses` (id, name, duration, description, is_active)
- `gallery_items` (id, image_url, category [institute|tailoring], caption, sort_order)
- `reviews` (id, author_name, rating, comment, status [pending|approved|rejected],
  source, created_at)
- `site_settings` (key, value) — for phone/hours/Instagram handle etc., editable
  without a redeploy

**Full candidate list (introduced progressively in Release 2/3), for architectural
planning only:** `roles`, `user_roles`, `students`, `customers`, `faculty`,
`course_modules`, `lessons`, `batches`, `batch_students`, `attendance`,
`assignments`, `assignment_submissions`, `student_progress`, `certificates`,
`tailoring_services`, `measurements`, `measurement_sets`, `orders`, `order_items`,
`order_status_history`, `payments`, `notifications`, `audit_logs`.

Relationships to note now (so Release 1 schema doesn't need breaking changes
later): `leads` should have an optional `converted_to_user_id` so a lead can later
become a real `students` or `customers` record without losing history; `reviews`
should have an optional `student_id`/`customer_id`/`order_id` for when real
post-service review requests exist in Release 2/3.

---

## I. API Module Proposal (Release 1 subset)

```
/api/auth          — login, logout, session
/api/leads         — create (public, from enquiry form), list/update (admin only)
/api/courses        — list (public), create/update/delete (admin only)
/api/gallery        — list (public), upload/delete/reorder (admin only)
/api/reviews        — list approved (public), create (public or admin-entered),
                      approve/reject (admin only)
/api/settings       — get (public, for contact info etc.), update (admin only)
```

Later modules (`/api/students`, `/api/attendance`, `/api/assignments`,
`/api/customers`, `/api/measurements`, `/api/orders`, `/api/payments`,
`/api/notifications`) are planned into the same API namespace but not built until
Release 2/3, so the URL structure never has to change.

---

## J. Security Architecture

- JWT-based session auth for the admin portal from day one (even with a single
  admin user), so the pattern is already correct when more roles are added.
- Passwords hashed (bcrypt or equivalent) — never stored in plain text.
- Public endpoints (`leads` create, `courses`/`gallery`/`reviews` read,
  `settings` read) have no auth requirement; every write endpoint requires an
  authenticated admin session.
- Basic rate limiting on the public enquiry form to prevent spam submissions.
- File upload validation (type + size limits) for gallery images from day one,
  since this is the first upload surface even in Release 1.
- No secrets (DB credentials, JWT signing key) committed to Git — environment
  variables only.
- CORS restricted to the actual website domain once deployed.

---

## K. Deployment Architecture

```
GitHub (source of truth)
   │
   ├── Website (React/Vite)  → Vercel
   ├── API (Node/Express)    → Render
   └── Database (PostgreSQL) → Neon
```

This matches the tooling already connected (Neon, Render, Vercel). Recommend a
single repository (monorepo) for Release 1 given the small scope — `apps/web`,
`server`, `docs` — rather than splitting into multiple repos prematurely; this can
be revisited once the mobile app (Release 2) is added.

---

## L. Development Backlog — Release 1

1. Repo setup (monorepo structure, README, environment config)
2. Database: create `users`, `leads`, `courses`, `gallery_items`, `reviews`,
   `site_settings` tables with migrations
3. API: auth endpoints + admin login flow
4. API: leads create (public) + list/update (admin)
5. API: courses CRUD
6. API: gallery upload/list/delete/reorder
7. API: reviews create/list/approve
8. API: settings get/update
9. Website: shell, navigation, responsive layout, brand theme using the provided
   logo and colour palette
10. Website: Home, About, Institute, Courses, Tailoring, Gallery, Reviews, Contact
    pages wired to the API
11. Website: enquiry form → leads API, with basic validation and spam protection
12. Admin portal: login, dashboard, leads screen, courses screen, gallery screen,
    reviews screen, settings screen
13. Content pass: load real business details, logo assets, the one classroom photo,
    and clearly-marked placeholders for anything still missing
14. Basic SEO pass: titles, meta descriptions, sitemap.xml, robots.txt
15. QA pass: forms, responsive behavior, empty/error states, basic security checks
16. Deploy to Vercel/Render/Neon, connect domain, final review with the owner
    before going live

---

## M. Risks and Assumptions

**Assumptions made (flagged so they can be corrected):**
- The owner (or one delegated person) will be the sole admin user at launch.
- "Contact us for fees" is acceptable as the permanent policy, not just a temporary
  placeholder — if this changes later, the courses UI will need a fee field added.
- The classroom photo received is representative and can be used publicly as-is.
- Existing Instagram account (`angel_institute_72_`) is public and embeddable;
  this hasn't been separately verified.
- No existing domain name has been purchased yet — this will be needed before
  Release 1 can go properly live (a placeholder Vercel URL can be used for review).

**Risks:**
- **Content bottleneck**: the website's credibility depends heavily on gallery
  photos and reviews, and only one interior render exists today. Launching with
  too few real photos risks looking unfinished — worth prioritizing getting more
  photos even ahead of some backlog items.
- **Single point of operation**: with one faculty and effectively one admin, any
  system that adds significant daily data-entry work (vs. the current paper/
  WhatsApp method) may simply not get used. Release 2 (student tracking) should
  be piloted carefully with the faculty member before assuming it replaces the
  notebook entirely.
- **Fee-hiding UX risk**: hiding all pricing may reduce enquiry conversion
  compared to competitors who list fees. Worth the owner monitoring enquiry
  volume after launch to see if this needs revisiting.
- **No current digital order/student process to mirror**: the order state
  machine and student lifecycle proposed in the master prompt are reasonable
  defaults but are inventions, not digitizations — they should be walked through
  with the owner/faculty in plain language before Release 2/3 are built, to
  catch mismatches with how they actually think about the work.

---

## N. Remaining Questions Before Release 1 Build Starts

1. Is there a domain name already purchased, or should one be chosen/registered
   as part of Release 1 setup?
2. Who will be the actual admin user logging in day-to-day — the owner, or
   someone else? (Needed for the first real account, not just a test login.)
3. For the enquiry form: should Institute and Tailoring enquiries go to the same
   phone/WhatsApp, or should they be routed differently?
4. Gallery pacing: is it acceptable to launch Release 1 with just the one
   classroom photo plus placeholders, or should launch wait for more photos
   (tailoring shop front, finished garments, a few more classroom/student shots)?
5. Reviews: are there any existing reviews (Google, Instagram comments, WhatsApp
   testimonials) that can be used at launch, or will Release 1 launch with an
   empty reviews section until real customers/students start submitting them?
6. Should the "Contact for fees" CTA go to a phone call, WhatsApp chat, or the
   enquiry form — or all three, with the person choosing?

---

*Do not proceed to implementation until this document is reviewed and the open
questions above are answered or explicitly deferred.*
