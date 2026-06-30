# PerformIQ — Deployment

## Purpose

Deploy a production instance for hackathon judging or staging.

## Current state

**Demo-ready** — `pnpm build` verified; no platform-specific config in repo (e.g. no `vercel.json` required for basic Vercel deploy).

---

## Pre-deploy checklist

| Step | Status |
|------|--------|
| Set `DATABASE_URL` (production Neon DB) | Required |
| Set `AUTH_SECRET` (unique per environment) | Required |
| Set `NEXT_PUBLIC_APP_URL` to public URL | Required |
| Run `pnpm drizzle:push` against prod DB | Required |
| Run `pnpm seed:atomquest` (demo) or provision users | Recommended |
| Configure OAuth redirect URLs if using OAuth | Optional |
| Set `RESEND_API_KEY` for real email | Optional |

---

## Build & start

```bash
pnpm install
pnpm build
pnpm start
```

**Status:** **Implemented** — Next.js 16 production build includes API routes and `proxy.ts` middleware.

---

## Environment (production)

Same variables as [SETUP.md](./SETUP.md). Critical:

```env
DATABASE_URL=postgresql://...
AUTH_SECRET=<strong-secret>
NEXT_PUBLIC_APP_URL=https://your-domain.example
```

Do not commit `.env.local`.

---

## Post-deploy verification

| # | Test | Expected |
|---|------|----------|
| 1 | `GET /` | Landing page |
| 2 | Login admin demo user | `/admin/atomquest`, charts populated |
| 3 | Login manager | `/team`, reports listed |
| 4 | Login employee | `/goals`, sheet loads |
| 5 | Middleware | Employee cannot access `/admin/atomquest` (redirect) |
| 6 | Export CSV | Download from admin overview |
| 7 | OAuth (if configured) | Sign-in completes |

---

## Platform notes

| Platform | Notes |
|----------|-------|
| Vercel | Compatible; set env vars in dashboard; Neon serverless driver fits |
| Node VPS | `pnpm build && pnpm start`; reverse proxy for HTTPS |

**Status:** **Partial** — not tested on all platforms in CI.

---

## Middleware in production

`src/proxy.ts` runs on Edge-compatible Next.js middleware matcher:

```ts
matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)']
```

JWT role must propagate (see [AUTH_RBAC.md](./AUTH_RBAC.md)).

---

## Limitations

- No blue/green or migration automation documented in repo.
- No health check endpoint.
- Seed script not idempotent for all tables (audit duplicates possible).
- CSV export uses Q1 period only.

---

## Future enhancements

- CI deploy pipeline
- Staging + production DB separation
- Secrets manager integration

See [ROADMAP.md](./ROADMAP.md), [KNOWN_LIMITATIONS.md](./KNOWN_LIMITATIONS.md).
