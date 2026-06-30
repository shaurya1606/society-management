# Contributing to PerformIQ

PerformIQ is a hackathon-origin enterprise HRTech platform. This document covers repository conventions, development workflow, and contribution expectations.

---

## Repository Structure

```
src/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Login, signup, reset, new-password
│   ├── (legal)/                # Terms, privacy (public routes)
│   ├── (protected)/            # Auth-gated routes
│   │   ├── dashboard/          # Role redirect
│   │   ├── goals/              # Employee goal sheet + check-in
│   │   ├── team/               # Manager + admin team view
│   │   │   └── [userId]/       # Goal review page
│   │   ├── admin/atomquest/    # Admin dashboard
│   │   └── settings/           # User settings
│   ├── api/atomquest/          # API route handlers
│   ├── global-error.tsx        # Error boundary (standalone html)
│   ├── global-not-found.tsx    # 404 page
│   ├── loading.tsx             # Suspense loading UI
│   └── layout.tsx              # Root layout
├── components/
│   ├── atomquest/              # Domain components (goal editor, check-in, etc.)
│   ├── auth/                   # Auth form components
│   ├── dashboard/              # Navbar
│   ├── landing/                # Landing page sections
│   └── ui/                     # shadcn/ui primitive wrappers
├── lib/
│   ├── atomquest/              # Domain logic (roles, guards, validation)
│   ├── auth/                   # Auth helpers, email templates
│   ├── dbconfig/               # Drizzle schema + db instance
│   └── helpers/                # Shared utilities
├── services/                   # External service clients (email)
├── auth.ts                     # NextAuth main config (Drizzle adapter)
├── auth.config.ts              # NextAuth edge-compatible config
├── proxy.ts                    # Middleware (NextAuth + RBAC guards)
└── route.ts                    # Public / auth / protected route lists

docs/                           # All documentation
drizzle/                        # Migration snapshots
scripts/                        # Seed scripts
public/                         # Static assets
```

---

## Development Setup

```bash
# Prerequisites: Node 20+, pnpm
pnpm install
cp .example.env .env.local
# Required: DATABASE_URL, AUTH_SECRET
# Optional: RESEND_API_KEY, AUTH_GITHUB_*, AUTH_GOOGLE_*

pnpm drizzle:push        # Push schema to database
pnpm seed:atomquest      # Seed demo data
pnpm dev                 # Start development server (port 3000)
```

---

## Coding Conventions

### TypeScript

- Strict mode is enabled (`tsconfig.json`).
- No `any` without explicit justification in a comment.
- All API route handlers must return typed responses.
- Run `pnpm typecheck` before committing.

### Naming

| Thing | Convention |
|-------|-----------|
| React components | `PascalCase` |
| Functions and variables | `camelCase` |
| Constants | `UPPER_SNAKE_CASE` |
| Database tables | `snake_case` (Drizzle schema) |
| API routes | `kebab-case` path segments |
| Files | `kebab-case.tsx` for components, `camelCase.ts` for utilities |

### File Organisation

- One component per file. No barrel files unless the module is stable.
- Server-only logic (DB calls, auth checks) stays in `lib/` or `api/` — never in `components/`.
- Client components require `'use client'` at the top.

---

## Feature Development Workflow

1. **Check existing docs** — read `docs/FEATURES.md` and `docs/API.md` before adding a new feature to avoid duplication.
2. **Schema first** — if the feature needs a new table or column, update `src/lib/dbconfig/schema.ts` and run `pnpm drizzle:generate && pnpm drizzle:migrate`.
3. **API then UI** — implement the API route handler, verify it with a manual request, then build the UI.
4. **Update docs** — update `docs/FEATURES.md` status, `docs/API.md` endpoint listing, and `docs/CHANGELOG.md`.

---

## Database Migration Workflow

PerformIQ uses Drizzle ORM with PostgreSQL.

```bash
# After modifying schema.ts:
pnpm drizzle:generate   # Generates migration file in drizzle/
pnpm drizzle:migrate    # Applies migration to DB

# For development (no migration file needed):
pnpm drizzle:push       # Pushes schema directly (overwrites)

# View DB in browser:
pnpm drizzle:studio
```

**Rules:**
- Never edit generated migration files manually.
- Always commit migration files alongside schema changes.
- The seed script (`scripts/seed-atomquest.ts`) is for demo data only — not a substitute for migrations.

---

## API Conventions

All application API routes live under `/api/atomquest/`.

### Route structure

```
/api/atomquest/goal-sheet          GET, PUT, POST
/api/atomquest/check-in/[quarter]  GET, POST
/api/atomquest/team                GET
/api/atomquest/team/[userId]       GET, POST
/api/atomquest/admin/*             Admin-only routes
```

### Auth pattern

Every handler starts with:

```typescript
const user = await requireAtomquestUser()     // throws 401 if unauthenticated
const role = await resolveUserRole(user.id)   // loads role from DB
```

Role checks use the helpers from `src/lib/atomquest/roles.ts`:

```typescript
if (!isAdminRole(role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
```

### Response format

```typescript
// Success
return NextResponse.json({ data: result })

// Error
return NextResponse.json({ error: 'Human-readable message' }, { status: 400 })
```

Do not return raw Drizzle objects — shape the response explicitly.

---

## UI Design Rules

PerformIQ uses a light-mode enterprise theme. Follow these rules when building UI:

### Colour tokens (Tailwind)

| Role | Token |
|------|-------|
| Page background | `bg-slate-50` |
| Card / surface | `bg-white` |
| Card border | `border-slate-200` |
| Primary action | `bg-indigo-600`, hover `bg-indigo-700` |
| Primary text | `text-slate-900` |
| Secondary text | `text-slate-500` |
| Muted text | `text-slate-400` |
| Input border | `border-slate-200`, focus `ring-indigo-500` |
| Success | `emerald-*` |
| Warning | `amber-*` |
| Destructive | `red-*` |

### Typography

- Font: **Poppins** (configured in root layout)
- Headings: `font-semibold` or `font-bold`, `text-slate-900`
- Body: `text-sm`, `text-slate-700`
- Captions / labels: `text-xs`, `text-slate-500`

### Component rules

- Use `shadcn/ui` primitives from `src/components/ui/` — do not install new component libraries.
- Status badges use `rounded-full px-2.5 py-0.5 text-xs font-medium` with role-appropriate colour pairs.
- Empty states use a dashed `border-slate-300` card with a centred icon and description.
- All interactive elements must have descriptive `id` attributes for testing.

### No dark mode

The application uses a light-only theme. Do not add `dark:` variants unless explicitly directed.

---

## Branching Strategy

```
main          Production-ready; no direct commits
dev           Active development integration branch
feature/*     Feature branches (e.g. feature/shared-kpi-sync)
fix/*         Bug fix branches (e.g. fix/weightage-validation)
docs/*        Documentation-only branches
```

PRs merge into `dev`. `dev` → `main` on release.

Commit messages follow Conventional Commits:

```
feat: add shared KPI primary owner sync
fix: correct weightage validation on resubmit
docs: update API.md with check-in endpoints
chore: upgrade Next.js to 16.2.6
```

---

## Documentation Update Expectations

When any of the following change, update the corresponding doc:

| Change | Doc to update |
|--------|---------------|
| New feature or status change | `docs/FEATURES.md` |
| New API endpoint | `docs/API.md` |
| Schema change | `docs/DATABASE.md` |
| Auth / RBAC change | `docs/AUTH_RBAC.md` |
| New public / auth route | `src/route.ts` + `docs/AUTH_RBAC.md` |
| UI component system change | `docs/UI_UX.md` |
| Any completed work | `docs/CHANGELOG.md` |

Do not let docs drift. Repository truth always takes precedence — if a doc contradicts the code, fix the doc.

---

## Known Scope Boundaries

PerformIQ is a **hackathon MVP**. Certain areas are intentionally out of scope:

- No real-time WebSocket updates (polling is acceptable).
- No multi-tenant isolation (single org per deployment).
- No production SSO (Azure AD / SAML is deferred).
- Email is best-effort (Resend; console fallback in dev).
- CSV export is partial (Q1 column hardcoded — tracked in `docs/KNOWN_LIMITATIONS.md`).

Do not attempt to solve deferred items without first updating `docs/ROADMAP.md` and discussing scope impact.
