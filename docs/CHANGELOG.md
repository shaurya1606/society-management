# PerformIQ — Changelog

## Purpose

Track documentation and notable repository milestones.

Format: documentation-focused unless release tags are added later.

---

## [Unreleased]

### Documentation

- Synchronized `/docs` set from repository scan (routes, APIs, schema, auth, UI).
- Established PerformIQ as UI product name; documented `atomquest` internal prefix.
- Added: `FEATURES.md`, `FEATURE_MATRIX.md`, `API.md`, `DATABASE.md`, `AUTH_RBAC.md`, `UI_UX.md`, `DEMO_FLOW.md`, `SETUP.md`, `DEPLOYMENT.md`, `TESTING.md`, `KNOWN_LIMITATIONS.md`, `ROADMAP.md`.
- Updated `IMPLEMENTATION.md` with cross-links and inventories.

### Application

_No application code changes in this documentation sync._

---

## [Hackathon submission] — 2026

### Implemented (summary)

- PerformIQ UI branding on landing, auth, legal, navbar.
- Goal lifecycle: draft → submit → approve/return → lock.
- Quarterly check-ins with UOM scoring and active-quarter lock.
- Manager team review and check-in comments.
- Admin stats, Recharts, audit trail, CSV export, shared KPI assignment.
- NextAuth JWT + middleware RBAC fix (`proxy.ts` role in session).
- Demo seed script (`pnpm seed:atomquest`).

### Known gaps

Documented in [KNOWN_LIMITATIONS.md](./KNOWN_LIMITATIONS.md).

---

## Future entries

Record version tags here when production releases begin.
