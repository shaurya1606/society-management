# PerformIQ — Implementation Documentation

> **Source of truth:** This document reflects the **current repository** as of the Ignitia 2K26 hackathon submission.  
> **Product name (UI):** PerformIQ (`src/app/layout.tsx`, landing, legal pages).  
> **Internal module prefix:** `atomquest` (API paths, DB domain tables, seed script). Routes such as `/admin/atomquest` and `/api/atomquest/*` use this prefix.

---

## 1. Project Overview

### Problem Statement

Enterprise performance management typically spans annual goal definition, manager approval, quarterly progress tracking, and compliance reporting. Without a single system, teams rely on spreadsheets and email, which breaks down for RBAC, auditability, and consistent KPI measurement.

### Solution

**PerformIQ** is a hackathon-built HRTech web application that provides:

- Employee goal sheets with validation
- Manager review and lock workflows
- Quarterly check-ins with unit-of-measure (UOM) scoring
- Admin governance (stats, charts, CSV export, audit trail, shared KPI assignment)

### Core Objectives

| Objective | Status |
|-----------|--------|
| Goal alignment (annual sheet, weightage rules) | **Implemented** |
| KPI governance (shared goals, admin assign) | **Demo-ready** |
| Quarterly tracking (Q1–Q4 updates, active-quarter lock) | **Implemented** |
| Manager review workflows | **Implemented** |
| Auditability (audit log + diffs on key actions) | **Demo-ready** |
| Enterprise visibility (admin dashboard, export) | **Demo-ready** |

---

## 2. Product Scope

### Implemented Modules

| Module | Status | Primary locations |
|--------|--------|-------------------|
| Authentication & RBAC | **Implemented** | `src/auth.ts`, `src/proxy.ts`, `src/lib/atomquest/guard.ts` |
| Goal lifecycle | **Implemented** | `src/app/api/atomquest/goal-sheet/route.ts`, `goals-workspace.tsx` |
| Quarterly check-ins | **Implemented** | `src/app/api/atomquest/check-in/route.ts`, `check-in-fields.tsx` |
| Manager review | **Implemented** | `src/app/api/atomquest/team/*`, `team-member-workspace.tsx` |
| Shared KPI system | **Demo-ready** | `src/lib/queries/atomquest/shared-goals.ts`, `admin/shared-goals` API |
| Audit logs | **Demo-ready** | `src/lib/queries/atomquest/audit.ts`, admin audit tab |
| Reporting & analytics | **Demo-ready** | `src/app/api/atomquest/admin/stats/route.ts`, `admin-charts.tsx` |
| Admin governance | **Demo-ready** | `admin-workspace.tsx` |
| Email notifications | **Partial** | `src/services/atomquest/notifications.ts` (3 events; console fallback) |
| Escalation engine | **Deferred** | Schema only (`escalation_rule`, `escalation_event`) — no API/UI/cron |

### Hackathon Scope

Prioritized for a convincing demo:

- Credentials login + demo account panel
- Full goal → submit → approve/return → check-in path
- Admin charts populated via `pnpm seed:atomquest`
- Middleware RBAC and role-based home redirect
- Lightweight email (Resend optional)

Explicitly **not** built:

- Azure AD / SAML
- Escalation job execution
- Cycle admin CRUD UI
- Multi-level approval chains
- Automated test suite (`pnpm test` is a no-op placeholder)

---

## 3. System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Browser (React 19, App Router)                             │
│  Landing (public) │ Protected workspaces (session)          │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│  proxy.ts — NextAuth middleware + RBAC guards                 │
└───────────────────────────┬─────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
  Page components    /api/atomquest/*     /api/auth/*, /api/settings
        │                   │                   │
        └───────────────────┼───────────────────┘
                            ▼
              Drizzle ORM → PostgreSQL (Neon)
                            │
              Resend (optional) — email notifications
```

### Tech Stack (actual `package.json`)

| Layer | Technology | Version / notes |
|-------|------------|-----------------|
| Framework | Next.js (App Router) | 16.2.6 |
| Language | TypeScript | 5.x |
| UI | React | 19.2.0 |
| Styling | Tailwind CSS | 4.x |
| Components | Radix UI primitives + local `src/components/ui/*` | shadcn-style, not full CLI scaffold |
| ORM | Drizzle ORM | 0.45.x |
| Database | PostgreSQL via `@neondatabase/serverless` | Connection string in `DATABASE_URL` |
| Auth | NextAuth | 5.0.0-beta.30, JWT sessions |
| Charts | Recharts | 3.x (client components) |
| Email | Resend | Optional; logs to console if `RESEND_API_KEY` unset |
| Validation | Zod | 4.x |

### Architectural Principles (as implemented)

- **API-driven workspaces:** Client pages load state via `/api/atomquest/*` rather than server actions for core flows.
- **RBAC-first:** Middleware (`proxy.ts`) + API `requireAtomquestUser()` / role checks.
- **Single fiscal-year sheet per user:** `goal_sheet` unique on `(user_id, cycle_id)` for `GOAL_SETTING` phase.
- **Hackathon simplifications:** Cycles seeded with overlapping open windows; active quarter resolved in code when multiple windows are open.

### Key engineering decisions

1. **Separate NextAuth instance in `proxy.ts`** with explicit `jwt`/`session` callbacks so `session.user.role` is available in middleware (fixes redirect of managers/admins away from `/team` and `/admin/atomquest`).
2. **`/dashboard` as post-login router** — client redirect to `roleHomePath()` (`src/app/(protected)/dashboard/page.tsx`).
3. **Goal replace strategy** — `replaceGoalsForSheet` deletes and re-inserts goals on save (preserves shared-goal locked fields for recipients).
4. **Active quarter** — `resolveActiveCheckInPhase()` picks the single open check-in cycle, else calendar quarter (`src/services/atomquest/cycles.ts`).

---

## 4. Authentication & Authorization

### Authentication Flow

| Capability | Status | Details |
|------------|--------|---------|
| Credentials login | **Implemented** | `src/auth.config.ts` — bcrypt compare against `user.password` |
| OAuth (GitHub, Google) | **Implemented** | Providers in `auth.config.ts`; Drizzle adapter in `auth.ts` |
| JWT sessions | **Implemented** | `session: { strategy: 'jwt' }` in `auth.ts` |
| Email verification gate | **Partial** | Only when `EMAIL_SERVICE=1`; otherwise credentials login skips verification |
| 2FA | **Partial** | Schema + `auth.ts` signIn check when `EMAIL_SERVICE=1` and `isTwoFactorEnabled`; not required for default demo |
| Sign up / reset password | **Implemented** | Pages under `(auth)/`; separate `/api/auth/*` routes |

**Session fields exposed:** `id`, `email`, `name`, `image`, `role`, `isOAuth`, `isTwoFactorEnabled` (`src/auth.ts` session callback).

### RBAC Model

Roles stored in PostgreSQL enum `role` on `user` table (`src/lib/dbconfig/schema.ts`):

| Role | Used in app | Home route (`roleHomePath`) |
|------|-------------|----------------------------|
| `EMPLOYEE` | Yes | `/goals` |
| `USER` | Legacy — treated as employee (`isEmployeeRole`) | `/goals` |
| `MANAGER` | Yes | `/team` |
| `ADMIN` | Yes | `/admin/atomquest` |
| `SUPER_ADMIN` | Yes — same privileges as `ADMIN` (`isAdminRole`) | `/admin/atomquest` |

**Hierarchy:** `user.manager_id` self-FK; managers see `listDirectReports()`; admins see all employees on team list (`src/app/api/atomquest/team/route.ts`).

### Route Protection

**Middleware:** `src/proxy.ts` (Next.js 16 “proxy” convention).

| Guard | Paths | Behavior |
|-------|-------|----------|
| Public | `/`, `/verify-email` | No auth required |
| Auth routes | `/login`, `/signup`, `/error`, `/reset-password`, `/new-password` | Redirect to `/dashboard` if logged in |
| Protected | All other non-static routes | Redirect to `/login?callbackUrl=...` if anonymous |
| Legacy RBAC | `/employee/*`, `/manager/*`, `/admin/*` (except atomquest) | Redirect non-matching roles to `/dashboard` |
| PerformIQ guard | `/goals`, `/team`, `/admin/atomquest` | `atomquestRouteGuard()` — redirect to role home if unauthorized |

**PerformIQ path map** (`src/lib/atomquest/routes.ts`):

- Employee paths: `/goals` (managers and admins may also access)
- Manager paths: `/team`, `/team/[userId]`
- Admin paths: `/admin/atomquest`

**API authorization:** `requireAtomquestUser()` + `resolveUserRole()` + role checks per route (`src/lib/atomquest/session.ts`).

---

## 5. Database Design

### Schema modules

| Module | File |
|--------|------|
| Auth users & NextAuth tables | `src/lib/dbconfig/schema.ts` |
| PerformIQ domain tables | `src/lib/dbconfig/atomquest.ts` |

### Core tables

| Table | Purpose |
|-------|---------|
| `user` | Identity, `role`, `department`, `manager_id` |
| `account` | OAuth linkage (NextAuth adapter) |
| `thrust_area` | Goal categories (seeded) |
| `performance_cycle` | FY cycles: `GOAL_SETTING`, `Q1`–`Q4` |
| `goal_sheet` | Per-user annual sheet; status workflow |
| `goal` | Line items; optional `shared_goal_id` |
| `shared_goal` | Admin-defined KPI template |
| `quarterly_update` | Per-goal, per-period actuals and `progress_score` |
| `manager_check_in` | Manager comment per employee/cycle/period |
| `audit_log` | JSON `changes` + actor |
| `escalation_rule` / `escalation_event` | **Schema only — not used by application code** |

### Relationships

- One **goal sheet** per `(user_id, cycle_id)` for goal-setting cycle.
- Many **goals** per sheet; cascade delete with sheet.
- **Shared goal** → multiple `goal` rows (one per assigned employee sheet).
- **Manager** via `user.manager_id`; no separate `team` table.

### Seed data

**Script:** `scripts/seed-atomquest.mjs` (`pnpm seed:atomquest`)

- Demo password: `AtomQuest@123` (see `src/lib/atomquest/demo-accounts.ts`)
- Seeds thrust areas, FY cycles, 7 users, mixed sheet statuses, quarterly updates, shared KPI, manager comment, sample audit rows
- Fiscal year: April–March label via `getPerformanceYear()` in seed and `cycle-utils.ts`

---

## 6. Goal Lifecycle Workflow

### Employee Workflow

**Status:** **Implemented** · **Demo-ready**

1. Open `/goals` → `GoalsWorkspace` loads `GET /api/atomquest/goal-sheet`.
2. Edit goals in `GoalEditor` (add/remove rows client-side).
3. **Save draft** → `PUT /api/atomquest/goal-sheet` (requires `isEmployeeRole`).
4. **Submit** → `POST /api/atomquest/goal-sheet` with `{ action: 'submit' }` → status `SUBMITTED`, audit log, optional email to manager.

**UI:** `src/components/atomquest/goals-workspace.tsx`, `goal-editor.tsx`  
**API:** `src/app/api/atomquest/goal-sheet/route.ts`  
**Queries:** `src/lib/queries/atomquest/goal-sheets.ts`, `goals.ts`

### Manager Workflow

**Status:** **Implemented**

1. `/team` → `GET /api/atomquest/team` (direct reports or all employees for admin).
2. `/team/[userId]` → review UI (`team-member-workspace.tsx`).
3. **Save review edits** → `POST .../team/[userId]` `{ action: 'save', goals }`.
4. **Approve** → `{ action: 'approve' }` → status `LOCKED` (only from `SUBMITTED`).
5. **Return** → `{ action: 'return', returnReason }` → status `RETURNED`.
6. **Manager check-in comment** → `POST .../team/[userId]/check-in` with `period` + `comment`.

**Access control:** `canAccessTeamMember()` in `src/lib/atomquest/team-access.ts`.

### Status Machine

```
DRAFT ──submit──► SUBMITTED ──approve──► LOCKED
                    │
                    └──return──► RETURNED ──edit/resubmit──► SUBMITTED
```

| Status | Employee can edit goals? (`canEditGoalSheet`) |
|--------|-----------------------------------------------|
| `DRAFT` | Yes |
| `RETURNED` | Yes |
| `SUBMITTED` | No |
| `LOCKED` | No |

### Validation Rules

**Server:** `src/services/atomquest/validation.ts` + `src/lib/schema/goalSchema.ts`  
**Client:** duplicate checks in `goals-workspace.tsx` / `team-member-workspace.tsx`

| Rule | Value |
|------|-------|
| Max goals | 8 |
| Total weightage | 100% |
| Min weightage per goal | 10% |
| Title / thrust area | Required |
| Target value | Required except `TIMELINE` and `ZERO_BASED` |
| Timeline deadline | Required when `uomType === TIMELINE` |
| Shared recipient goals | Title/target/UOM preserved on save (`replaceGoalsForSheet`) |

**Cycle gate:** `assertCycleOpen(GOAL_SETTING)` on save/submit.

---

## 7. Quarterly Check-In System

### Active Quarter Logic

**Status:** **Implemented**

| Step | Implementation |
|------|----------------|
| Resolve active phase | `resolveActiveCheckInPhase()` — one open Q cycle, else `getCalendarCheckInPhase()` |
| UI quarter tabs | `GET /api/atomquest/cycles` → `getCheckInQuarterStatuses()` |
| Lock states | `getQuarterLockState()` → `active` \| `past` \| `future` \| `closed` |
| Save restriction | `POST /api/atomquest/check-in` rejects non-active period with 403 |

**Files:** `src/lib/atomquest/cycle-utils.ts`, `src/services/atomquest/cycles.ts`, `src/app/api/atomquest/cycles/route.ts`

### Prerequisites

- Goal sheet status must be **`LOCKED`**.
- Caller must be **`isEmployeeRole`** (managers/admins cannot POST employee check-in via this API).

### UOM Types

Defined in `UomType` enum (`src/lib/dbconfig/atomquest.ts`):

| Type | Meaning (implementation) |
|------|--------------------------|
| `NUMERIC_MIN` | Higher actual vs target is better |
| `PERCENT_MIN` | Same formula as numeric min (stored as numeric target) |
| `NUMERIC_MAX` | Lower actual vs target is better |
| `PERCENT_MAX` | Same as numeric max |
| `TIMELINE` | 100% if `actualCompletionDate <= targetDeadline`, else 0% |
| `ZERO_BASED` | 100% if actual parses to 0 (zero defects), else 0% |

**UI inputs:** `src/components/atomquest/check-in-fields.tsx` (number, date, checkbox for zero-based).

### Progress Calculation

**Core:** `computeProgressScore()` in `src/services/atomquest/progress.ts`

| UOM | Formula (capped at 100) |
|-----|-------------------------|
| MIN types | `(actual / target) * 100` |
| MAX types | `(target / actual) * 100` |
| TIMELINE | 100 or 0 by date comparison |
| ZERO_BASED | 100 if actual === 0 else 0 |

**Parsing:** `src/lib/atomquest/check-in-parse.ts` — guards NaN; returns validation errors to API.

**Persistence:** `quarterly_update.progress_score` as numeric string (2 decimal places).

### Shared KPI sync

When primary owner saves check-in, `syncSharedGoalCheckIn()` copies update to other goals with same `shared_goal_id` (`src/lib/queries/atomquest/shared-goals.ts`).

---

## 8. Shared KPI System

### Purpose

**Status:** **Demo-ready**

Admins assign the same KPI definition to multiple employees for governance alignment.

### Primary Owner Model

- One employee marked `isPrimaryOwner: true` on their `goal` row.
- Primary owner’s check-in triggers `syncSharedGoalCheckIn()` for linked recipient goals.

### Recipient Restrictions

On save (`replaceGoalsForSheet`):

- **Locked:** `title`, `description`, `uomType`, `targetValue`, `targetDeadline`, `thrustAreaId`
- **Editable:** `weightage` (must still satisfy sheet-level 100% rule when combined with other goals)

**Admin assign:** `POST /api/atomquest/admin/shared-goals` → `assignSharedGoal()` creates `shared_goal` + `goal` rows per selected employee.

**UI:** Admin workspace → Shared goals tab (`admin-workspace.tsx`).

---

## 9. Admin Governance Features

### Admin Dashboard

**Status:** **Demo-ready**  
**Route:** `/admin/atomquest` (server page loads cycles, employees, thrust areas; client fetches stats).

**Overview tab** (`GET /api/atomquest/admin/stats`):

- Counts: employees, submitted, approved, quarter check-in completion %
- `activeQuarter`, `quarterCheckInPct`
- `achievementDistribution` (from `quarterly_update.achievement_status`)
- `managers[]` with approved/pending counts
- Employee completion list

**Charts:** `AdminCharts` (Recharts) — submission bar, achievement pie, manager table.

### Audit Trail

**Status:** **Demo-ready**

- **API:** `GET /api/atomquest/admin/audit` (last 150 rows)
- **UI:** Audit tab with `formatAuditChanges()` (`src/lib/atomquest/audit-format.ts`)

**Logged actions (representative):**

| Action | Trigger |
|--------|---------|
| `SAVED_DRAFT` | Employee PUT goal sheet |
| `SUBMITTED` | Employee submit |
| `MANAGER_EDIT` | Manager save on team member |
| `RETURNED` / `LOCKED` | Manager return / approve |
| `CHECK_IN_Q*` | Employee check-in POST |

**Diff helper:** `src/lib/audit.ts` (`computeDiff`, snapshots).

### CSV Export

**Status:** **Demo-ready** · **Partial** (fixed Q1 period for actuals column)

- **API:** `GET /api/atomquest/admin/export`
- **Columns:** Employee, Email, Goal, Planned Target, Actual, Progress %, Status
- **Limitation:** Check-in actuals pulled for `CyclePhase.Q1` only in export route — not dynamic active quarter.

---

## 10. Notifications

### Email Events

**Status:** **Partial** (best-effort, non-blocking `void` calls)

| Event | Function | Trigger |
|-------|----------|---------|
| Goal submitted | `notifyGoalSubmitted` | After employee submit (if `managerId` set) |
| Goal approved | `notifyGoalApproved` | Manager approve |
| Goal returned | `notifyGoalReturned` | Manager return |
| Check-in completed | — | **Not implemented** |

### Resend Integration

**File:** `src/services/atomquest/notifications.ts`

- If `RESEND_API_KEY` unset → logs payload to console, returns `{ sent: false, logged: true }`
- `FROM`: `ATOMQUEST_EMAIL_FROM` or default Resend onboarding address
- Links use `NEXT_PUBLIC_APP_URL` (fallback `http://localhost:3000`)

---

## 11. UI/UX Design System

### Enterprise Design Philosophy

**Status:** **Demo-ready**

- **Public/marketing:** Dark landing (`LandingPage`, hero gradients).
- **Authenticated app:** Light enterprise shell (`bg-slate-50`, white navbar, indigo accents) in `(protected)/layout.tsx`.
- **Auth pages:** Split layout with PerformIQ branding (`(auth)/layout.tsx`).

### Theme System

**File:** `src/app/globals.css`

- CSS variables for light enterprise tokens (`--background`, `--primary`, chart colors).
- Font: Poppins via `next/font` in root layout.
- Dark mode variables exist but protected app does not toggle `.dark` by default.

### UX Priorities (implemented)

| Priority | Implementation |
|----------|----------------|
| Clarity | Status badges (`status-badge.tsx`), sheet status on team list |
| Governance | Read-only portal role on settings; admin audit tab |
| Information density | Tables for team, admin completion, audit |
| Workflow visibility | Quarter lock labels, toasts (`useAutoDismissToast`), demo hints on workspaces |
| Demo speed | Login demo account cards (`LoginForm.tsx` + `demo-accounts.ts`) |

### Component map

| Area | Components |
|------|------------|
| Shell | `page-shell.tsx`, `Navbar.tsx` |
| Employee | `goals-workspace.tsx`, `goal-editor.tsx`, `check-in-fields.tsx` |
| Manager | `team-workspace.tsx`, `team-member-workspace.tsx` |
| Admin | `admin-workspace.tsx`, `admin-charts.tsx` |
| Primitives | `src/components/ui/*` (Button, Input, Dialog, Badge, …) |

---

## 12. API Reference

**Status:** **Implemented** — full reference in [API.md](./API.md).

### PerformIQ domain (`/api/atomquest/*`)

| Method | Path | Role | Purpose |
|--------|------|------|---------|
| GET | `/api/atomquest/goal-sheet` | Authenticated | Load own sheet + goals (`?phase=`) |
| PUT | `/api/atomquest/goal-sheet` | Employee | Save draft |
| POST | `/api/atomquest/goal-sheet` | Employee | `{ action: 'submit' }` |
| GET | `/api/atomquest/check-in?period=` | Employee | Load quarter updates |
| POST | `/api/atomquest/check-in` | Employee | Save quarter updates |
| GET | `/api/atomquest/cycles` | Authenticated | Quarter metadata + lock states |
| GET | `/api/atomquest/team` | Manager, Admin | Team list + sheet status |
| GET | `/api/atomquest/team/[userId]` | Manager, Admin | Member sheet + goals |
| POST | `/api/atomquest/team/[userId]` | Manager, Admin | `save` \| `approve` \| `return` |
| POST | `/api/atomquest/team/[userId]/check-in` | Manager, Admin | Manager comment |
| GET | `/api/atomquest/thrust-areas` | Authenticated | Thrust area list |
| GET | `/api/atomquest/admin/stats` | Admin | Dashboard metrics |
| GET | `/api/atomquest/admin/audit` | Admin | Audit log (150 rows) |
| GET | `/api/atomquest/admin/export` | Admin | CSV download (**Partial:** Q1 actuals) |
| POST | `/api/atomquest/admin/shared-goals` | Admin | Assign shared KPI |

### Auth & settings

| Method | Path | Purpose |
|--------|------|---------|
| * | `/api/auth/[...nextauth]` | NextAuth handlers |
| POST | `/api/auth/login`, `signup`, `verify-email`, `reset-password`, `new-password` | Auth flows |
| POST | `/api/settings` | Profile / password / 2FA |

**Error handling:** `handleApiError` / `jsonError` in `src/lib/atomquest/api.ts`.

---

## 13. Demo Walkthrough

### Demo credentials

**Password (all seeded users):** `AtomQuest@123`  
**Quick fill:** Login page demo cards (`src/lib/atomquest/demo-accounts.ts`)

| Account | Role | Seeded state |
|---------|------|--------------|
| `employee@atomquest.demo` | Employee | DRAFT — live submit |
| `priya.sharma@atomquest.demo` | Employee | SUBMITTED |
| `arjun.mehta@atomquest.demo` | Employee | LOCKED + check-in + shared KPI owner |
| `sam.okonkwo@atomquest.demo` | Employee | LOCKED + completed check-in |
| `jordan.lee@atomquest.demo` | Employee | RETURNED |
| `manager@atomquest.demo` | Manager | Team of reports |
| `admin@atomquest.demo` | Admin | Full governance |

Run `pnpm seed:atomquest` before demo if charts/tables are empty.

### Recommended sequence (~5 min)

1. **Admin** — `/admin/atomquest` → Overview (charts) → Export CSV → Audit → Shared goals.
2. **Manager** — `/team` → Review Priya → Approve.
3. **Employee** — `/goals` → edit draft → Submit (or Arjun → Quarterly check-in tab).

Detailed script: [DEMO_FLOW.md](./DEMO_FLOW.md).

---

## 14. Challenges & Engineering Decisions

| Challenge | Decision |
|-----------|----------|
| Middleware saw all users as employees | Duplicate JWT/session role mapping in `proxy.ts` |
| Multiple open Q cycles in seed | `resolveActiveCheckInPhase()` falls back to calendar quarter |
| Check-in NaN in UI | `check-in-parse.ts` + finite checks in `computeProgressScore` |
| Shared goal field drift | Preserve locked fields from DB on `replaceGoalsForSheet` for recipients |
| Scope control | Keep `atomquest` module prefix; avoid route tree rewrite mid-hackathon |
| Manager access to `/goals` | Allowed in route guard for navigation; **write APIs require employee role** (see limitations) |

---

## 15. Current Limitations

**Status:** **Documented** — full list in [KNOWN_LIMITATIONS.md](./KNOWN_LIMITATIONS.md).

| Limitation | Impact |
|------------|--------|
| Hackathon / demo scope | Not production-hardened (rate limits, tenancy, HRIS sync) |
| `atomquest` internal naming | URLs and APIs not branded `performiq` |
| Managers/admins on `/goals` | Can open page; `PUT`/`POST` goal-sheet require `isEmployeeRole` — use employee accounts for goal demo |
| CSV export | Check-in column uses Q1 period only |
| No check-in email | Notifications stop at approve/return/submit |
| Escalation tables | No runtime feature |
| No automated tests | `pnpm test` prints placeholder |
| Audit log on re-seed | `seed-atomquest.mjs` may append duplicate audit rows |
| OAuth / 2FA | Optional; demo uses credentials |
| Legal pages mention LinkedIn OAuth | Providers in code are GitHub + Google only |
| `package.json` name | Still `letskraack.v1.0` (artifact of starter template) |

---

## 16. Future Enhancements

**Status:** **Planned** / **Deferred** — see [ROADMAP.md](./ROADMAP.md). Not implemented.

---

## 17. Conclusion

PerformIQ delivers a **working, demo-ready** enterprise performance workflow on a modern Next.js stack: authenticated RBAC, goal lifecycle with validation, manager approval, quarterly tracking with UOM scoring, admin analytics, audit trail, and shared KPI assignment. The implementation is intentionally scoped for hackathon judging—real database persistence and API boundaries, with honest gaps (escalation, full SSO, production ops) documented above.

For detailed breakdowns, see the [documentation index](./README.md): [ARCHITECTURE.md](./ARCHITECTURE.md), [API.md](./API.md), [DATABASE.md](./DATABASE.md), [AUTH_RBAC.md](./AUTH_RBAC.md), [DEMO_FLOW.md](./DEMO_FLOW.md), [KNOWN_LIMITATIONS.md](./KNOWN_LIMITATIONS.md).

---

## Appendix A — Page route inventory

**Status:** **Implemented** — see [UI_UX.md](./UI_UX.md).

| Route | Middleware | Component | Notes |
|-------|------------|-----------|-------|
| `/` | Public | `LandingPage` | |
| `/login` | Auth route | Login | Demo account cards |
| `/signup` | Auth route | Signup | |
| `/reset-password`, `/new-password`, `/error` | Auth route | Auth | |
| `/verify-email` | Public | Verify email | |
| `/terms`, `/privacy` | Public | Legal pages | PerformIQ branding |
| `/dashboard` | Protected | Role redirect | → `roleHomePath()` |
| `/goals` | Protected + atomquest | `GoalsWorkspace` | Nav: Employee+ |
| `/team` | Protected + atomquest | `TeamWorkspace` | Manager, Admin |
| `/team/[userId]` | Protected + atomquest | `TeamMemberWorkspace` | |
| `/admin/atomquest` | Protected + `/admin/*` + atomquest | `AdminWorkspace` | Admin only |
| `/settings` | Protected | Settings | Read-only portal role |
| `/server` | Protected | Session debug | Utility page |

**Legacy:** `/employee/*`, `/manager/*` guarded in `proxy.ts`; no App Router pages for those prefixes.

## Appendix B — Related scripts

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Development server |
| `pnpm build` | Production build (verified in submission hardening) |
| `pnpm drizzle:push` | Apply schema to database |
| `pnpm seed:atomquest` | Load demo data |
| `pnpm typecheck` | TypeScript check |
