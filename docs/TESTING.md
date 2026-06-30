# PerformIQ — Testing

## Purpose

Document test coverage, manual QA, and gaps.

## Current state

**Deferred** — no automated test suite in repository.

---

## Automated tests

| Type | Status | Notes |
|------|--------|-------|
| Unit tests | **Deferred** | `pnpm test` → `echo No tests specified` |
| Integration tests | **Deferred** | |
| E2E (Playwright/Cypress) | **Deferred** | |
| API contract tests | **Deferred** | |

---

## Manual verification (implemented practice)

Used for hackathon hardening:

| Area | Method | Status |
|------|--------|--------|
| Type safety | `pnpm typecheck` | **Implemented** |
| Lint | `pnpm lint` | **Implemented** |
| Production build | `pnpm build` | **Implemented** |
| Role routing | Manual login per role | **Demo-ready** |
| Goal validation | Submit invalid weightage | **Demo-ready** |
| Check-in lock | Save non-active quarter | **Demo-ready** |

---

## Suggested manual test matrix

| ID | Scenario | Role | Expected |
|----|----------|------|----------|
| T1 | Login credentials | Employee | `/goals` |
| T2 | Submit without 100% weight | Employee | 400 error |
| T3 | Approve non-submitted sheet | Manager | 400 error |
| T4 | Check-in on DRAFT sheet | Employee | 403 |
| T5 | Access `/admin/atomquest` | Employee | Redirect |
| T6 | Admin export | Admin | CSV download |
| T7 | Shared recipient edit title | Employee | Server preserves title |

---

## Seed-dependent tests

Run `pnpm seed:atomquest` before T4–T7 for locked sheets and charts.

---

## Limitations

- No CI gate on tests.
- No coverage reporting.
- Regression risk on middleware/RBAC changes without E2E.

---

## Future enhancements

| Item | Priority |
|------|----------|
| Playwright smoke: login + 3 role homes | High |
| API tests for goal validation | Medium |
| Visual regression (optional) | Low |

See [ROADMAP.md](./ROADMAP.md).
