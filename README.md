# Society Maintenance Tracker

**Resident complaint tracking platform.**  
Residents can raise complaints, follow status history, and receive updates while admins manage priority, notices, and overdue cases.

![Landing Page](./docs/assets/screenshots/landing/landing-hero.png)

---

## Overview

Society Maintenance Tracker replaces fragmented complaint handling with a structured, auditable workflow:

```
Employee sets goals → Manager reviews & approves → Quarterly actuals entered → Admin governs & reports
```

Built as a placement assignment foundation for an apartment society service platform.

---

## Key Features

| Feature | Description |
|---------|-------------|
| **Role-based access** | Employee, Manager, Admin — each with scoped routes and capabilities |
| **Goal lifecycle** | DRAFT → SUBMITTED → RETURNED → LOCKED with full validation |
| **Weightage enforcement** | 100% total, 10% minimum per goal, max 8 goals per sheet |
| **Manager review** | Inline edit, approve & lock, or return with feedback |
| **Quarterly check-ins** | UOM-aware inputs (numeric, percent, timeline, zero-defect) with progress scoring |
```
Resident raises complaint → Admin reviews and updates status → History and notices are tracked
```
| **Shared KPIs** | Admin assigns org-wide goals to multiple employees simultaneously |
| **Admin dashboard** | Recharts analytics: submission pipeline, achievement mix, manager completion |
| **Audit trail** | Immutable log of all lifecycle events with before/after diffs |
| **CSV export** | Performance data export for compliance reporting |
| **Authentication** | Credentials + OAuth (Google, GitHub), JWT sessions |
| **Role-based access** | Resident, Admin — each with scoped routes and capabilities |
| **Complaint lifecycle** | OPEN → IN_PROGRESS → RESOLVED with full history |
| **Priority control** | Low, Medium, High complaint priority handling |
| **Admin review** | View all complaints and update status with notes |
| **Notices** | Post important notices and pin critical updates |
| **Admin dashboard** | Recharts analytics for complaints by status, category, and overdue count |
| **Audit trail** | Immutable log of all lifecycle events with before/after diffs |
| **Notifications** | Email updates for complaint changes and important notices |
| Styling | Tailwind CSS 4, shadcn/ui |
| Auth | NextAuth v5 (JWT, Credentials + OAuth) |
| ORM | Drizzle ORM |
| Database | PostgreSQL (Neon) |
| Charts | Recharts 3 |
| Email | Resend  |

---

## Quick Start

**Prerequisites:** Node.js 20+, pnpm, PostgreSQL (Neon recommended)

```bash
pnpm install
cp .example.env .env.local
# Set DATABASE_URL and AUTH_SECRET in .env.local
pnpm drizzle:push
pnpm seed:atomquest
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
# Production build
pnpm build && pnpm start
```

---

| Resident | `/dashboard` | Legacy scaffold entry point |
| Manager | `/team` | Legacy scaffold entry point |
| Admin | `/admin/atomquest` | Legacy scaffold entry point |
One-click fill buttons are available on the login page.

| Role | Email | Pre-seeded state |
|------|-------|------------------|
| **Admin** | `admin@atomquest.demo` | Full org data, charts, audit entries |
| **Manager** | `manager@atomquest.demo` | Team of 5 employees in mixed states |
| **Employee** | `employee@atomquest.demo` | DRAFT — create and submit live |
| `pnpm seed:atomquest` | Legacy demo data seed; do not use for the new domain |
| **Employee** | `arjun.mehta@atomquest.demo` | LOCKED + check-in + shared KPI |
| **Employee** | `sam.okonkwo@atomquest.demo` | LOCKED + completed Q1 check-in |
| **Employee** | `jordan.lee@atomquest.demo` | RETURNED — feedback received |

---

## RBAC

| Role | Home | Capabilities |
|------|------|-------------|
| Employee | `/goals` | Own goal sheet, submit, quarterly check-in |
| Manager | `/team` | Direct reports, review, approve/return, check-in comments |
| Admin | `/admin/atomquest` | Org-wide analytics, audit trail, shared KPIs, CSV export |

---

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Development server |
| `pnpm build` | Production build |
| `pnpm seed:atomquest` | Seed demo data |
| `pnpm drizzle:push` | Push schema to DB (dev) |
| `pnpm drizzle:studio` | Open Drizzle Studio |
| `pnpm typecheck` | TypeScript type check |

---

## Documentation

| Document | Description |
|----------|-------------|
| [docs/SHOWCASE.md](./docs/SHOWCASE.md) | Visual screenshot showcase |
| [docs/APPLICATION_WALKTHROUGH.md](./docs/APPLICATION_WALKTHROUGH.md) | User workflow guide (employee/manager/admin) |
| [docs/IMPLEMENTATION.md](./docs/IMPLEMENTATION.md) | Master technical implementation reference |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | System flows and data models |
| [docs/API.md](./docs/API.md) | HTTP API reference |
| [docs/AUTH_RBAC.md](./docs/AUTH_RBAC.md) | Authentication and role model |
| [docs/DATABASE.md](./docs/DATABASE.md) | Schema and relationships |
| [docs/TECHNICAL_GUIDE.md](./docs/TECHNICAL_GUIDE.md) | Architecture evolution and scaling |
| [docs/SETUP.md](./docs/SETUP.md) | Detailed local setup guide |
| [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) | Production deployment |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Contribution guide |
| [docs/KNOWN_LIMITATIONS.md](./docs/KNOWN_LIMITATIONS.md) | Known constraints |
|