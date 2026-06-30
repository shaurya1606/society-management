# PerformIQ — Known Limitations

## Purpose

Honest constraints for reviewers, judges, and engineers. Not a roadmap.

## Current state

Applies to hackathon submission build.

---

## Product & scope

| Limitation | Impact | Status |
|------------|--------|--------|
| Hackathon / demo scope | Not production-hardened (tenancy, SLA, compliance certifications) | **Known** |
| Single-org model | No multi-tenant isolation | **Known** |
| No HRIS integration | Manual users via seed/signup | **Known** |

---

## Naming & branding

| Limitation | Impact |
|------------|--------|
| UI = PerformIQ; APIs/routes = `atomquest` | `/api/atomquest/*`, `/admin/atomquest`, seed emails `@atomquest.demo` |
| CSV filename `atomquest-achievement-report.csv` | Internal naming in export |
| Env `ATOMQUEST_EMAIL_FROM` | Internal env var name |
| Dashboard spinner text references “AtomQuest” | UI string in `dashboard/page.tsx` |
| Root `README.md` may still say AtomQuest | Prefer `/docs` as maintained set |

---

## RBAC & APIs

| Limitation | Impact |
|------------|--------|
| Managers/admins can open `/goals` | `PUT`/`POST` goal-sheet require `isEmployeeRole` — use employee accounts for goal demo |
| Goal sheet GET uses session user only | Managers see own sheet, not direct report’s |
| Admin export check-in column | Hardcoded `Q1` in `admin/export/route.ts` |
| Admin stats use active quarter | Export does not match |

---

## Features not implemented

| Item | Status |
|------|--------|
| Check-in completion email | **Deferred** |
| Escalation rule execution | **Deferred** (schema only) |
| Cycle admin CRUD UI | **Deferred** |
| Sheet unlock workflow | **Partial** (columns exist; limited API) |
| Azure AD / SAML | **Planned** |
| In-app notifications | **Planned** |

---

## Data & seed

| Limitation | Impact |
|------------|--------|
| Re-run seed | May duplicate audit log rows |
| Shared goals on re-seed | Idempotent check added for goal rows; audit may still duplicate |
| All demo cycles may be “open” | Active quarter logic uses calendar fallback |

---

## Auth

| Limitation | Impact |
|------------|--------|
| `EMAIL_SERVICE` unset by default | Skips verification + 2FA for demo |
| Legal pages mention LinkedIn OAuth | Code: GitHub + Google only |
| OAuth not required for demo | Credentials sufficient |

---

## Quality & ops

| Limitation | Impact |
|------------|--------|
| No automated tests | See [TESTING.md](./TESTING.md) |
| No rate limiting | |
| No structured logging / APM | Console logs for email fallback |
| `package.json` name `letskraack.v1.0` | Template artifact |

---

## UI

| Limitation | Impact |
|------------|--------|
| Admin tables on small screens | Horizontal scroll |
| Dark mode tokens | Not exposed in app shell |

---

## Demo risks

| Risk | Mitigation |
|------|------------|
| Empty admin charts | Run `pnpm seed:atomquest` |
| Check-in blocked | Approve sheet first (LOCKED) |
| Live submit needs manager step | Pre-seed SUBMITTED user or switch to manager mid-demo |

---

## Future enhancements

Items listed here are **not commitments**. See [ROADMAP.md](./ROADMAP.md).
