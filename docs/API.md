# PerformIQ — API Reference

## Purpose

HTTP API surface as implemented in `src/app/api`. All PerformIQ domain endpoints use the `/api/atomquest` prefix.

## Current state

**Implemented** — REST-style route handlers; JSON responses unless noted.

## Implementation notes

- Auth: session cookie via NextAuth; handlers call `requireAtomquestUser()` or `auth()`.
- Errors: `handleApiError()` → `{ error: string }` with 401/403/400/500.
- Success: `jsonOk(data)` → JSON body.

---

## Auth & settings

| Method | Path | Auth | Status | Description |
|--------|------|------|--------|-------------|
| * | `/api/auth/[...nextauth]` | — | **Implemented** | NextAuth handlers (`src/auth.ts`) |
| POST | `/api/auth/login` | — | **Implemented** | Custom login helper |
| POST | `/api/auth/signup` | — | **Implemented** | Registration |
| POST | `/api/auth/verify-email` | — | **Implemented** | Email verification |
| POST | `/api/auth/reset-password` | — | **Implemented** | Request reset |
| POST | `/api/auth/new-password` | — | **Implemented** | Set new password |
| POST | `/api/settings` | Session | **Implemented** | Profile, password, 2FA toggle |

---

## Goal sheet

**Base:** `/api/atomquest/goal-sheet`

| Method | Role | Status | Description |
|--------|------|--------|-------------|
| GET | Any authenticated | **Implemented** | Load/create sheet for session user. Query: `phase` (default `GOAL_SETTING`). Returns `{ cycle, sheet, goals, canEdit }`. |
| PUT | Employee (`isEmployeeRole`) | **Implemented** | Save draft. Body: `{ goals: GoalInput[] }`. Requires open goal-setting cycle; sheet DRAFT or RETURNED. |
| POST | Employee | **Implemented** | Body: `{ action: "submit" }`. Sets SUBMITTED; audit; optional manager email. |

**Goal input fields:** `id?`, `title`, `description?`, `thrustAreaId`, `uomType`, `targetValue?`, `targetDeadline?`, `weightage`, `isSharedRecipient?`

---

## Check-in

**Base:** `/api/atomquest/check-in`

| Method | Role | Status | Description |
|--------|------|--------|-------------|
| GET | Employee | **Implemented** | Query: `period` (Q1–Q4). Returns `{ updates }` for session user's locked sheet goals. |
| POST | Employee | **Implemented** | Body: `{ period, updates: [{ goalId, actualValue?, actualCompletionDate?, achievementStatus, notes? }] }`. Active quarter only; sheet must be LOCKED. Syncs shared goals for primary owner. |

---

## Cycles & catalog

| Method | Path | Role | Status | Description |
|--------|------|------|--------|-------------|
| GET | `/api/atomquest/cycles` | Authenticated | **Implemented** | `{ activeQuarter, quarters[] }` with lockState, lockLabel, editable |
| GET | `/api/atomquest/thrust-areas` | Authenticated | **Implemented** | `{ thrustAreas }` active catalog |

---

## Team (manager / admin)

| Method | Path | Role | Status | Description |
|--------|------|------|--------|-------------|
| GET | `/api/atomquest/team` | Manager, Admin | **Implemented** | `{ cycle, team: [{ user, sheet }] }` |
| GET | `/api/atomquest/team/[userId]` | Manager, Admin | **Implemented** | `{ employee, sheet, goals }`; `canAccessTeamMember()` |
| POST | `/api/atomquest/team/[userId]` | Manager, Admin | **Implemented** | Body: `{ action, returnReason?, goals? }`. Actions: `save`, `approve`, `return` |
| POST | `/api/atomquest/team/[userId]/check-in` | Manager, Admin | **Implemented** | Body: `{ period, comment }`. Upserts `manager_check_in` |

**Approve rules:** Only `SUBMITTED` → `LOCKED`.

---

## Admin

| Method | Path | Role | Status | Description |
|--------|------|------|--------|-------------|
| GET | `/api/atomquest/admin/stats` | Admin | **Implemented** | Dashboard metrics (see below) |
| GET | `/api/atomquest/admin/audit` | Admin | **Implemented** | `{ logs }` — limit 150 |
| GET | `/api/atomquest/admin/export` | Admin | **Partial** | CSV attachment; check-in uses **Q1** only |
| POST | `/api/atomquest/admin/shared-goals` | Admin | **Implemented** | Assign shared KPI (Zod body) |

### `GET /admin/stats` response (implemented fields)

`totalEmployees`, `submitted`, `approved`, `pendingApproval`, `completionRate`, `employees[]`, `activeQuarter`, `quarterCheckInCompleted`, `quarterCheckInPct`, `pendingReviews`, `achievementDistribution[]`, `managers[]`

---

## Shared goals POST body

```json
{
  "title": "string",
  "description": "string?",
  "thrustAreaId": "string",
  "uomType": "NUMERIC_MIN | PERCENT_MIN | ...",
  "targetValue": "string?",
  "targetDeadline": "ISO date string?",
  "weightage": 10-100,
  "primaryOwnerUserId": "string",
  "employeeIds": ["string"]
}
```

---

## Error codes

| Condition | HTTP | `error` |
|-----------|------|---------|
| No session | 401 | Unauthorized |
| Wrong role | 403 | Forbidden |
| Validation / business rule | 400 | Message string |
| Uncaught | 500 | Something went wrong |

---

## Limitations

- No API versioning prefix.
- No rate limiting or request IDs.
- Manager/Admin cannot `PUT` goal-sheet (employee role required) — use team `save` for reports.
- Export filename: `atomquest-achievement-report.csv` (internal naming).

---

## Future enhancements

- OpenAPI spec generation
- Active-quarter-aware export
- Webhooks for HRIS

See [ROADMAP.md](./ROADMAP.md).
