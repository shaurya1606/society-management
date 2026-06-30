# PerformIQ — Features

## Purpose

Catalog of product capabilities with implementation status. Use with [API.md](./API.md) and [IMPLEMENTATION.md](./IMPLEMENTATION.md) for detail.

## Current state

Hackathon MVP: core performance lifecycle is **Implemented** or **Demo-ready**. Enterprise extras (SSO, escalation automation, BI) are **Deferred** or **Planned**.

---

## Authentication & access

| Feature | Status | Notes |
|---------|--------|-------|
| Credentials login | **Implemented** | bcrypt; `auth.config.ts` |
| OAuth (GitHub, Google) | **Implemented** | Drizzle adapter |
| JWT sessions | **Implemented** | `session: { strategy: 'jwt' }` |
| Email verification gate | **Partial** | Only when `EMAIL_SERVICE=1` |
| 2FA | **Partial** | Schema + signIn logic when `EMAIL_SERVICE=1` |
| Sign up / reset password | **Implemented** | Auth pages + `/api/auth/*` |
| Demo account quick-fill | **Demo-ready** | `LoginForm` + `demo-accounts.ts` |
| Azure AD / SAML | **Planned** | Not in codebase |

---

## RBAC & navigation

| Feature | Status | Notes |
|---------|--------|-------|
| Roles: Employee, Manager, Admin | **Implemented** | `SUPER_ADMIN` = Admin |
| Middleware route guards | **Implemented** | `src/proxy.ts` |
| Role home redirect | **Implemented** | `/dashboard` → `roleHomePath()` |
| Legacy `/employee`, `/manager`, `/admin` guards | **Implemented** | Redirect non-matching roles |
| Settings portal role display | **Implemented** | Read-only badge |

---

## Goal lifecycle

| Feature | Status | Notes |
|---------|--------|-------|
| Annual goal sheet (per FY cycle) | **Implemented** | `goal_sheet` + `GOAL_SETTING` cycle |
| Draft / save | **Implemented** | `PUT /api/atomquest/goal-sheet` |
| Submit for approval | **Implemented** | `POST` action `submit` |
| Weightage validation (100%, min 10%, max 8 goals) | **Implemented** | Zod + `validateGoals()` |
| UOM types (6 variants) | **Implemented** | See [IMPLEMENTATION.md](./IMPLEMENTATION.md) §7 |
| Status: DRAFT, SUBMITTED, RETURNED, LOCKED | **Implemented** | |
| Thrust areas | **Implemented** | Seeded; `GET /api/atomquest/thrust-areas` |
| Cycle open window check | **Implemented** | `assertCycleOpen()` on save/submit |

---

## Manager review

| Feature | Status | Notes |
|---------|--------|-------|
| Team list (direct reports) | **Implemented** | `GET /api/atomquest/team` |
| Admin org-wide team view | **Implemented** | All employees for Admin role |
| Review employee sheet | **Implemented** | `/team/[userId]` |
| Manager edit goals (pre-approve) | **Implemented** | `action: save` |
| Approve & lock | **Implemented** | `action: approve` → LOCKED |
| Return with feedback | **Implemented** | `action: return` |
| Manager quarterly comment | **Implemented** | `POST .../check-in` |

---

## Quarterly check-in

| Feature | Status | Notes |
|---------|--------|-------|
| Q1–Q4 updates per goal | **Implemented** | `quarterly_update` |
| Active quarter locking | **Implemented** | `resolveActiveCheckInPhase()` |
| Progress score by UOM | **Implemented** | `computeProgressScore()` |
| Achievement status field | **Implemented** | NOT_STARTED / ON_TRACK / COMPLETED |
| Requires LOCKED sheet | **Implemented** | API 403 otherwise |
| Shared KPI check-in sync | **Demo-ready** | Primary owner only |

---

## Shared KPI

| Feature | Status | Notes |
|---------|--------|-------|
| Admin assign shared goal | **Demo-ready** | Admin UI + `POST .../shared-goals` |
| Recipient locked title/target | **Implemented** | `replaceGoalsForSheet` |
| Recipient editable weightage | **Implemented** | Must fit 100% total |
| Primary owner check-in sync | **Implemented** | `syncSharedGoalCheckIn()` |

---

## Admin governance

| Feature | Status | Notes |
|---------|--------|-------|
| Dashboard stats | **Demo-ready** | `GET .../admin/stats` |
| Charts (Recharts) | **Demo-ready** | Submission, achievement, managers |
| Employee completion table | **Demo-ready** | |
| Audit trail viewer | **Demo-ready** | Last 150 entries |
| CSV export | **Partial** | Q1 check-in column hardcoded |
| Shared goals tab | **Demo-ready** | |

---

## Notifications & audit

| Feature | Status | Notes |
|---------|--------|-------|
| Email: goal submitted | **Partial** | Resend or console log |
| Email: approved / returned | **Partial** | |
| Email: check-in completed | **Deferred** | Not implemented |
| Audit log with diffs | **Demo-ready** | Key workflow actions |

---

## Escalation

| Feature | Status | Notes |
|---------|--------|-------|
| `escalation_rule` / `escalation_event` tables | **Deferred** | Schema only |
| Escalation jobs / UI | **Deferred** | |

---

## BRD mapping (summary)

Full matrix: [FEATURE_MATRIX.md](./FEATURE_MATRIX.md).

| BRD area | Coverage |
|----------|----------|
| Auth / access | **Implemented** (demo credentials; optional OAuth) |
| Goal creation & validation | **Implemented** |
| Manager approval workflow | **Implemented** |
| Quarterly measurement | **Implemented** |
| Shared goals | **Demo-ready** |
| Reporting | **Demo-ready** |
| Compliance / audit | **Demo-ready** |
| Enterprise SSO / HRIS | **Planned** |

---

## Future enhancements

See [ROADMAP.md](./ROADMAP.md).
