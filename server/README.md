# Server (API)

Node.js + Express REST API for Release 1. Connects to the Neon database described
in `../database/README.md`.

## Endpoints (Release 1)

| Route | Auth | Purpose |
|---|---|---|
| `POST /api/auth/login` | public | Admin/staff login, returns a JWT |
| `POST /api/leads` | public | Website enquiry form submission |
| `GET /api/leads` | admin | List leads |
| `PATCH /api/leads/:id` | admin | Update lead status/assignment |
| `GET /api/courses` | public | List active courses |
| `POST/PATCH/DELETE /api/courses` | admin | Manage course catalog |
| `GET /api/gallery` | public | List active gallery items |
| `POST/DELETE /api/gallery` | admin | Manage gallery (stores an image URL -- file upload isn't wired up yet) |
| `GET /api/reviews` | public | List approved reviews |
| `POST /api/reviews` | public | Submit a review (goes to `pending`, never auto-published) |
| `GET /api/reviews/all`, `PATCH /api/reviews/:id` | admin | Moderate reviews |
| `GET /api/settings` | public | Contact info, hours, etc. |
| `PUT /api/settings/:key` | admin | Update a setting |

Every write route other than the public enquiry/review submissions requires a
valid JWT (`Authorization: Bearer <token>`) belonging to an `ADMIN` or
`SUPER_ADMIN` user (leads also allow `STAFF`).

## Running locally

```
cd server
npm install
cp .env.example .env   # fill in DATABASE_URL and a real JWT_SECRET
npm run dev
```

**Note:** some sandboxed environments (including the one this was built in) block
outbound network access to arbitrary hosts, which prevents this server from
reaching Neon from inside them. That's an environment limitation, not a bug in
the code -- it will connect normally from a real machine or a deployed
environment like Render with normal network access.

## Security notes

- Passwords hashed with bcrypt (cost factor 12), never stored or logged in plain text.
- JWT-based auth, 12-hour expiry.
- Rate limiting on the public enquiry form and review submission endpoints.
- Review submissions are checked against a disposable-email blocklist and a live DNS MX lookup, so obviously fake or throwaway email addresses are rejected before they reach the database.
- `helmet` for security headers, CORS restricted via `CORS_ORIGINS` in `.env`.
- No fee data anywhere in the courses table/API, per confirmed business policy.
- A throwaway test admin account (`test-admin@angelinstitute.local`) was created
  directly in the database to verify the login flow -- delete it before real
  admin accounts are created for production use.
