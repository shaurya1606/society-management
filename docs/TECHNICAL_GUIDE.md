# PerformIQ — Technical Guide

This document covers the current architecture, design decisions, and the evolution path toward a production-grade enterprise deployment. It is distinct from `IMPLEMENTATION.md` (which documents what is built) — this document covers *why* and *where it could go*.

---

## Current Architecture

### Request Flow

```
Browser (React / Next.js App Router)
  ↓
src/proxy.ts  (NextAuth middleware edge runtime)
  → Public route check      → pass through
  → Auth route check        → redirect if logged in
  → Protected route check   → redirect to /login if unauthenticated
  → RBAC guard              → redirect to roleHomePath if wrong role
  → atomquestRouteGuard     → role-specific path enforcement
  ↓
Next.js App Router (React Server Components + Route Handlers)
  ↓
src/lib/dbconfig/db.ts  (Drizzle ORM + Neon serverless driver)
  ↓
PostgreSQL (Neon)
```

### Session Model

NextAuth v5 with JWT strategy. No database sessions. The JWT stores `userId`, `role`, `isOAuth`, and 2FA status. The middleware has its own NextAuth instance (`proxy.ts`) to avoid edge-runtime incompatibilities with the Drizzle adapter used in `auth.ts`.

**Trade-off:** JWT sessions cannot be invalidated server-side without a token blocklist. Acceptable for a single-org demo deployment; would require session table or Redis blocklist in production.

### Database

Drizzle ORM with Neon serverless PostgreSQL. Neon's HTTP driver works in both Edge and Node runtimes. The schema is the source of truth; migrations are generated with `drizzle-kit`.

Key tables: `users`, `goal_sheet`, `goal`, `performance_cycle`, `thrust_area`, `quarterly_update`, `audit_log`, `shared_goal`.

---

## Scaling Considerations

### Current limitations at scale

| Area | Current approach | Scale concern |
|------|-----------------|---------------|
| Sessions | JWT (stateless) | No server-side invalidation |
| Database | Single Neon instance | Connection pooling via Neon's built-in pooler |
| Email | Resend HTTP API (sync) | Could block request on high volume |
| Audit log | Synchronous DB insert per action | Write contention under high throughput |
| Admin queries | Full table scans for stats | No indexes on status columns yet |

### Path to production-scale

1. **Connection pooling** — Neon's connection pooler handles concurrent serverless invocations. For a self-hosted Postgres, use PgBouncer.
2. **Async email** — Move Resend calls to a background job queue (BullMQ + Redis or Trigger.dev) rather than awaiting in the API handler.
3. **Audit log throughput** — Write audit events to a queue; a worker drains to the DB. For compliance, consider an append-only audit database (TimescaleDB or a CDC stream to S3).
4. **Analytics queries** — Materialised views or a separate read replica for admin dashboard queries to avoid impacting write performance.
5. **Caching** — Cache `thrust_areas`, `performance_cycle`, and role lookups in Redis (or Next.js `unstable_cache`) since they change infrequently.

---

## Multi-Tenancy

The current deployment is **single-tenant** (one organisation per database). Extending to multi-tenancy has two main models:

### Schema-based multi-tenancy (recommended for enterprise)

Add an `organisation_id` foreign key to every resource table. All queries filter by `organisation_id` derived from the authenticated user's JWT. Requires:
- `organisations` table
- `organisation_id` on all resource tables
- Row-level security policies in PostgreSQL (recommended for isolation guarantee)
- Tenant-aware seeding

### Database-per-tenant

Separate Neon projects per organisation. Simpler isolation; harder to operate. Suitable for very large customers with strict data residency requirements.

**Current state:** No multi-tenancy. All users share the same schema without organisation isolation.

---

## SSO Expansion

Current auth supports Credentials, GitHub OAuth, and Google OAuth (via NextAuth).

### Azure AD / Entra ID (most common enterprise requirement)

1. Register an app in Azure Portal.
2. Add the OIDC provider to `auth.config.ts`:
   ```typescript
   MicrosoftEntraID({
     clientId: process.env.AUTH_AZURE_CLIENT_ID,
     clientSecret: process.env.AUTH_AZURE_CLIENT_SECRET,
     tenantId: process.env.AUTH_AZURE_TENANT_ID,
   })
   ```
3. Map the `groups` claim from the OIDC token to PerformIQ roles in the `jwt` callback.
4. Provision users on first sign-in (already supported via the Drizzle adapter's `createUser` hook).

### SAML 2.0

NextAuth does not support SAML natively. Options:
- Use an identity proxy (Auth0, Okta, or a self-hosted Keycloak) that translates SAML to OIDC, then connect via NextAuth's OIDC provider.
- Use `node-saml` with a custom NextAuth provider wrapper.

---

## Observability

### Current state

- Application errors surface via Next.js error boundaries (`global-error.tsx`).
- Server-side errors appear in console / Next.js dev overlay.
- No structured logging, metrics, or tracing.

### Recommended additions

| Layer | Tool |
|-------|------|
| Structured logging | Pino (edge-compatible) → stdout → log aggregator |
| Error tracking | Sentry (`@sentry/nextjs`) — wraps API routes and RSC |
| Metrics | Prometheus + Grafana, or Datadog, via Next.js instrumentation hook |
| Tracing | OpenTelemetry with `@vercel/otel` or OTLP exporter |

The Next.js `instrumentation.ts` file (supported in App Router) is the recommended entry point for initialising Sentry and OTel exporters.

---

## Background Jobs

PerformIQ currently performs all work synchronously within API route handlers (email send, audit log write). For production resilience:

| Job | Trigger | Suggested approach |
|-----|---------|-------------------|
| Email notification | Goal submitted / approved / returned | Queue via BullMQ or Trigger.dev |
| Audit log flush | Every lifecycle action | Queue with at-least-once delivery |
| Quarter auto-lock | Fiscal calendar | Cron job via Vercel Cron or external scheduler |
| CSV export (large orgs) | Admin request | Async generation → S3 pre-signed URL |

The database schema already includes `escalation_rule` and `escalation_event` tables (deferred). A cron-based escalation worker would query overdue sheets and dispatch notifications or manager alerts.

---

## Deployment Considerations

### Vercel (recommended for Next.js)

```bash
pnpm build    # Verify build passes before deploy
vercel --prod
```

Set environment variables in the Vercel dashboard:
- `DATABASE_URL` — Neon connection string (pooled endpoint for Edge, direct for Node)
- `AUTH_SECRET` — random 32-byte string (`openssl rand -hex 32`)
- `RESEND_API_KEY` — optional; email falls back to console without it
- `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET` — optional OAuth
- `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` — optional OAuth

**Note:** Neon provides two connection strings — the pooled endpoint for serverless (Edge runtime, API routes) and the direct endpoint for schema migrations. Use the direct string for `pnpm drizzle:migrate`.

### Self-hosted (Node.js)

```bash
pnpm build
node .next/standalone/server.js
```

Requires `output: 'standalone'` in `next.config.ts` (not currently set — add before self-hosting). Pair with an Nginx reverse proxy and a process manager (PM2 or systemd).

### Docker

A `Dockerfile` does not currently exist in the repository. A minimal multi-stage build would:
1. `node:20-alpine` builder stage — install deps, run `pnpm build`.
2. `node:20-alpine` runner stage — copy `.next/standalone`, set `NODE_ENV=production`.

---

## Security Hardening

The following items are relevant for a production deployment beyond the hackathon scope:

| Area | Current state | Hardening path |
|------|--------------|----------------|
| Password hashing | bcrypt (auth.config.ts) | Increase cost factor to 12+ for production |
| JWT secret | `AUTH_SECRET` env var | Rotate quarterly; store in secrets manager |
| Session invalidation | Not supported (JWT) | Add Redis blocklist or switch to database sessions |
| Rate limiting | Not implemented | Add `@upstash/ratelimit` on auth routes and sensitive APIs |
| CSRF | NextAuth handles for form actions | Verify on custom API routes if moving off NextAuth |
| Content Security Policy | Not configured | Add `next.config.ts` headers with strict CSP |
| SQL injection | Drizzle ORM parameterises all queries | No raw SQL in codebase |
| Dependency scanning | Not automated | Add `pnpm audit` to CI pipeline |
| Secrets in code | `.env.local` gitignored | Verify `.gitignore` before any public repo |

---

## Future Enterprise Evolution Summary

| Capability | Effort | Notes |
|------------|--------|-------|
| Azure AD / Entra ID SSO | Medium | NextAuth OIDC provider |
| SAML 2.0 | High | Identity proxy recommended |
| Multi-tenancy | High | Schema + RLS migration |
| Escalation engine | Medium | Cron + existing schema |
| Background job queue | Medium | BullMQ or Trigger.dev |
| Real-time notifications | Medium | WebSocket or SSE |
| Async CSV export | Low–Medium | Queue + S3 |
| Structured logging | Low | Pino + instrumentation.ts |
| Error tracking | Low | Sentry |
| Advanced analytics | High | BI tool integration or dedicated analytics DB |
| HRIS sync (Workday, SAP) | High | Webhook receiver + ETL |

---

*For implemented features, see [`IMPLEMENTATION.md`](./IMPLEMENTATION.md).*  
*For deferred items, see [`ROADMAP.md`](./ROADMAP.md).*
