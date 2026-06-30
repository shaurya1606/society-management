# PerformIQ — Local Setup

## Purpose

Run the application locally for development and demo rehearsal.

## Current state

**Implemented** — standard Next.js + Drizzle + Neon workflow.

---

## Prerequisites

| Requirement | Version |
|-------------|---------|
| Node.js | 20+ |
| pnpm | Latest recommended |
| PostgreSQL | Neon or compatible (connection string) |

---

## Installation

```bash
git clone <repository-url>
cd ignitia2k26
pnpm install
```

---

## Environment variables

Copy template:

```bash
cp .example.env .env.local
```

| Variable | Required | Status | Description |
|----------|----------|--------|-------------|
| `DATABASE_URL` | Yes | **Implemented** | PostgreSQL connection string |
| `AUTH_SECRET` | Yes | **Implemented** | NextAuth secret (`openssl rand -base64 32`) |
| `NEXT_PUBLIC_APP_URL` | Recommended | **Implemented** | Base URL for email links |
| `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` | No | **Partial** | GitHub OAuth |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | No | **Partial** | Google OAuth |
| `RESEND_API_KEY` | No | **Partial** | Transactional email |
| `ATOMQUEST_EMAIL_FROM` | No | **Partial** | From address (internal env name) |
| `EMAIL_SERVICE` | No | **Partial** | Set to `1` to enforce verification + 2FA paths |

---

## Database

```bash
pnpm drizzle:push
pnpm seed:atomquest
```

**Status:** **Demo-ready** — seed creates users, cycles, sheets, check-ins, shared KPI.

---

## Run

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Verify

| Check | Expected |
|-------|----------|
| Landing loads | PerformIQ branding |
| Login with `admin@atomquest.demo` | Redirect to `/admin/atomquest` |
| Admin charts | Populated after seed |
| `pnpm typecheck` | Passes |
| `pnpm build` | Production build succeeds |

---

## Scripts

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Development server |
| `pnpm build` | Production build |
| `pnpm start` | Run production build |
| `pnpm typecheck` | TypeScript |
| `pnpm lint` | ESLint |
| `pnpm drizzle:push` | Push schema to DB |
| `pnpm drizzle:generate` | Generate migrations |
| `pnpm seed:atomquest` | Demo data |

---

## Limitations

- `pnpm test` is a placeholder (no automated tests).
- `package.json` name is `letskraack.v1.0` (template artifact).

---

## Future enhancements

- Docker Compose for local Postgres
- `.env` validation at startup (zod)

See [DEPLOYMENT.md](./DEPLOYMENT.md), [TESTING.md](./TESTING.md).
