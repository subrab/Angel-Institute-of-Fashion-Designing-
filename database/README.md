# Database

PostgreSQL on Neon. `schema.sql` in this folder is the applied Release 1 schema —
treat it as the source of truth, and add future schema changes here too (as new
dated migration files, once the backend project exists to run them from).

## Live instance

- Neon project: `angel-institute-platform` (id `noisy-dew-58591893`)
- Database: `angel`
- This was created and applied directly via the Neon MCP connector during Phase 1
  setup. The connection string (with password) was shared with the project owner
  directly in chat — **it is intentionally not stored anywhere in this repo.**

## Tables (Release 1)

| Table | Purpose |
|---|---|
| `users` | Admin / staff / faculty logins. `STUDENT` / `CUSTOMER` roles exist in the enum for Release 2/3 but aren't used yet. |
| `courses` | Course catalog — track, name, duration, whether it's a certification course. No fee column, per confirmed policy (fees are enquiry-only). |
| `leads` | Every enquiry from the website's contact form. |
| `gallery_items` | Photos shown on the site, tagged institute/tailoring. |
| `reviews` | Reviews, held in `pending` status until approved for public display. Collects reviewer phone/email for follow-up — never shown publicly, admin-only. |
| `site_settings` | Key/value store for contact info, hours, etc. — editable without a redeploy. |

Reserved for later releases (not yet created): `students`, `customers`, `batches`,
`attendance`, `assignments`, `measurements`, `orders`, `payments`, `certificates` —
see `docs/01-PHASE0-FOUNDATION.md` for the full proposed entity list.

## Environment variable

The backend (once it exists) should read the connection string from a single
environment variable, never hardcoded:

```
DATABASE_URL=postgresql://<role>:<password>@<host>/angel?sslmode=require
```

Get the real value from the Neon console (or ask Claude to fetch it again via the
Neon connector) and set it directly in your local `.env` (gitignored) and in
Render's environment variables when the API is deployed. Do not commit it.
