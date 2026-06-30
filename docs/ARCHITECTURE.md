# PerformIQ — Architecture

## Purpose

Technical flows and module boundaries for reviewers. Complements [IMPLEMENTATION.md](./IMPLEMENTATION.md).

## Current state

**Demo-ready** monolith: Next.js App Router + Route Handlers + Drizzle + PostgreSQL.

---

## System context

```
Browser
  → proxy.ts (NextAuth + RBAC)
  → App Router pages (RSC + client workspaces)
  → /api/atomquest/* handlers
  → Drizzle → PostgreSQL (Neon)
  → Resend (optional email)
```

**Status:** **Implemented**

---

## Module layout

| Area | Path |
|------|------|
| Pages | `src/app/` |
| UI workspaces | `src/components/atomquest/` |
| API handlers | `src/app/api/atomquest/` |
| Domain queries | `src/lib/queries/atomquest/` |
| Services | `src/services/atomquest/` |
| Auth | `src/auth.ts`, `src/auth.config.ts`, `src/proxy.ts` |
| Schema | `src/lib/dbconfig/` |

Internal prefix `atomquest` is historical; UI brand is PerformIQ.

---

## Auth flow

**Status:** **Implemented**

1. User authenticates (credentials or OAuth).
2. `auth.ts` issues JWT with `role` from `user` table.
3. Each request: `proxy.ts` reads session; enforces public/auth/protected rules.
4. PerformIQ paths: `atomquestRouteGuard` checks role vs `/goals`, `/team`, `/admin/atomquest`.
5. API routes re-validate user from DB via `requireAtomquestUser()`.

**Critical decision:** Middleware uses its own NextAuth config with `session.user.role` from JWT (see [AUTH_RBAC.md](./AUTH_RBAC.md)).

---

## Goal lifecycle

**Status:** **Implemented**

```
DRAFT ──submit──► SUBMITTED ──approve──► LOCKED
                    │
                    └──return──► RETURNED ──(edit)──► SUBMITTED
```

| Step | Component |
|------|-----------|
| Employee edit | `PUT /api/atomquest/goal-sheet` |
| Submit | `POST` action `submit` |
| Manager review | `POST /api/atomquest/team/[userId]` |
| Audit | `writeAuditLog()` + `computeDiff()` |

---

## Quarterly check-in lifecycle

**Status:** **Implemented**

1. Sheet must be `LOCKED`.
2. `resolveActiveCheckInPhase()` picks editable quarter.
3. `GET/POST /api/atomquest/check-in` load/save `quarterly_update`.
4. `computeProgressScore()` + `check-in-parse.ts` validate numerics.
5. Primary shared-goal owner triggers `syncSharedGoalCheckIn()`.

---

## Shared KPI flow

**Status:** **Demo-ready**

1. Admin `POST /api/atomquest/admin/shared-goals`.
2. `assignSharedGoal()` inserts `shared_goal` + per-employee `goal` rows.
3. Recipients: locked definition fields; editable weightage.
4. Check-in sync from primary owner only.

---

## Admin governance flow

**Status:** **Demo-ready**

| Capability | API | UI tab |
|------------|-----|--------|
| Metrics + charts | `GET /admin/stats` | Overview |
| Audit | `GET /admin/audit` | Audit |
| CSV | `GET /admin/export` | Export button |
| Assign KPI | `POST /admin/shared-goals` | Shared goals |

---

## Fiscal year & cycles

**Status:** **Implemented**

- Performance year: April–March (`getPerformanceYear()`).
- Cycles seeded per year: `GOAL_SETTING`, `Q1`–`Q4`.
- Window check: `isCycleWindowOpen(cycle)` — `isActive` and date range.
- Demo seed may open multiple quarters; active quarter resolved in code.

---

## Deliberate non-goals

| Item | Status |
|------|--------|
| Microservices | **N/A** — monolith |
| Azure AD | **Planned** |
| Escalation cron | **Deferred** |
| Cycle admin UI | **Planned** |
| Real-time / WebSockets | **Planned** |

---

## Limitations

See [KNOWN_LIMITATIONS.md](./KNOWN_LIMITATIONS.md).

---

## Future enhancements

See [ROADMAP.md](./ROADMAP.md).
