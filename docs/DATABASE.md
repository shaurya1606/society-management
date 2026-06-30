# PerformIQ — Database Schema

## Purpose

PostgreSQL schema as defined by Drizzle ORM. Source files: `src/lib/dbconfig/schema.ts` (auth/users), `src/lib/dbconfig/atomquest.ts` (domain).

## Current state

**Implemented** — applied via `pnpm drizzle:push`. Demo data via `pnpm seed:atomquest`.

## Implementation notes

- IDs: `text` UUIDs (`crypto.randomUUID()` defaults).
- Enums stored as `text` with TypeScript `$type<>` in Drizzle.
- Neon serverless driver (`@neondatabase/serverless`).

---

## Auth & users

### `user`

| Column | Type | Notes |
|--------|------|-------|
| id | text PK | |
| email | text unique | |
| name | text | |
| password | text | bcrypt hash (credentials) |
| role | enum | EMPLOYEE, MANAGER, ADMIN, SUPER_ADMIN, USER (legacy) |
| department | text | |
| manager_id | text FK → user.id | Hierarchy |
| emailVerified | timestamp | |
| isTwoFactorEnabled | boolean | |
| image | text | OAuth |

**Status:** **Implemented**

### NextAuth tables

| Table | Status |
|-------|--------|
| `account` | **Implemented** |
| `verificationToken` | **Implemented** |
| `resetPasswordToken` | **Implemented** |
| `twoFactorTokens` | **Implemented** |
| `twoFactorConfirmation` | **Implemented** |

---

## Performance domain

### `thrust_area`

| Column | Notes |
|--------|-------|
| name | unique |
| is_active | boolean |

**Status:** **Implemented** · seeded

### `performance_cycle`

| Column | Notes |
|--------|-------|
| year | int — FY label (April–March: `getPerformanceYear()`) |
| phase | GOAL_SETTING, Q1, Q2, Q3, Q4 |
| opens_at, closes_at | timestamp |
| is_active | boolean |

**Unique:** `(year, phase)`

**Status:** **Implemented**

### `goal_sheet`

| Column | Notes |
|--------|-------|
| user_id | FK user |
| cycle_id | FK performance_cycle |
| status | DRAFT, SUBMITTED, RETURNED, LOCKED |
| submitted_at, approved_at, returned_at | |
| approved_by_id, return_reason | |
| unlocked_at, unlocked_by_id | Schema present; unlock flow **Partial** in API |

**Unique:** `(user_id, cycle_id)`

**Status:** **Implemented**

### `goal`

| Column | Notes |
|--------|-------|
| goal_sheet_id | FK |
| thrust_area_id | FK |
| title, description | |
| uom_type | UomType enum |
| target_value | numeric |
| target_deadline | timestamp |
| weightage | int |
| sort_order | int |
| shared_goal_id | FK nullable |
| is_shared_recipient, is_primary_owner | boolean |

**Status:** **Implemented**

### `shared_goal`

Admin-defined template; spawns `goal` rows per employee.

**Status:** **Demo-ready**

### `quarterly_update`

| Column | Notes |
|--------|-------|
| goal_id, period | unique (goal_id, period) |
| actual_value | numeric |
| actual_completion_date | timestamp |
| achievement_status | NOT_STARTED, ON_TRACK, COMPLETED |
| progress_score | numeric |
| notes | text |
| updated_by_id | FK user |

**Status:** **Implemented**

### `manager_check_in`

| Column | Notes |
|--------|-------|
| employee_id, manager_id, cycle_id, period | unique triple |
| comment | text required |

**Status:** **Implemented**

### `audit_log`

| Column | Notes |
|--------|-------|
| entity_type | GOAL_SHEET, GOAL, QUARTERLY_UPDATE, SHARED_GOAL |
| entity_id | text |
| action | string (e.g. SUBMITTED, LOCKED, CHECK_IN_Q2) |
| changes | jsonb |
| changed_by_id | FK user |

**Status:** **Demo-ready**

### Escalation (deferred)

| Table | Status |
|-------|--------|
| `escalation_rule` | **Deferred** — no application writes |
| `escalation_event` | **Deferred** |

---

## Relationships

```
user (manager_id) ──► user
user ──► goal_sheet ──► goal ──► quarterly_update
shared_goal ──► goal (shared_goal_id)
performance_cycle ◄── goal_sheet, manager_check_in, shared_goal
thrust_area ◄── goal, shared_goal
```

---

## Seed script

**File:** `scripts/seed-atomquest.mjs`  
**Command:** `pnpm seed:atomquest`

| Data | Status |
|------|--------|
| 7 demo users | **Demo-ready** |
| Mixed sheet statuses | DRAFT, SUBMITTED, LOCKED, RETURNED |
| Quarterly updates (active quarter) | **Demo-ready** |
| Shared KPI | **Demo-ready** |
| Audit samples | **Demo-ready** (may duplicate on re-run) |

Emails use `@atomquest.demo` domain (seed artifact; UI shows PerformIQ).

---

## Limitations

- No row-level security in Postgres; app-layer RBAC only.
- No soft-delete columns.
- `USER` legacy role still in enum.

---

## Future enhancements

- Migrations-only workflow in CI
- HRIS sync tables
- Partitioning audit_log by year

See [ROADMAP.md](./ROADMAP.md).
