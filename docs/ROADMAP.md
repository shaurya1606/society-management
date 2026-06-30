# PerformIQ — Roadmap

## Purpose

Planned and deferred work. **Nothing in this document is implemented unless marked otherwise.**

## Current state

Hackathon MVP is **Demo-ready** for core lifecycle; items below are **Planned** or **Deferred**.

---

## Deferred (schema or stub exists)

| Item | Notes |
|------|-------|
| Escalation engine | `escalation_rule`, `escalation_event` tables; no jobs/UI |
| Check-in email notification | Submit/approve/return only |

---

## Planned — authentication & enterprise

| Item | Priority |
|------|----------|
| Azure AD / OIDC SSO | High for enterprise pitch |
| SCIM / HRIS user sync | Medium |
| Enforce email verification in production | Medium |

---

## Planned — product

| Item | Priority |
|------|----------|
| Cycle administration UI (open/close windows) | Medium |
| Sheet unlock / admin override workflow | Medium |
| Dynamic export (active quarter, full FY) | Medium |
| In-app notification center | Low |
| Manager “view as employee” read-only | Low |
| Rename `atomquest` routes to `performiq` | Low (breaking) |

---

## Planned — engineering

| Item | Priority |
|------|----------|
| Playwright E2E smoke tests | High |
| API integration tests (goal validation, RBAC) | High |
| OpenAPI specification | Medium |
| CI: lint + typecheck + test on PR | Medium |
| Startup env validation (Zod) | Low |

---

## Planned — analytics

| Item | Priority |
|------|----------|
| Deeper BI / trend dashboards | Low |
| Escalation analytics | Low (depends on escalation engine) |

---

## Out of scope (explicit)

- Multi-region active-active
- Custom workflow designer
- Compensation / bonus calculation

---

## Status legend

| Label | Meaning |
|-------|---------|
| **Implemented** | Shipped in repo |
| **Demo-ready** | Shipped for demo |
| **Partial** | Incomplete |
| **Deferred** | Not started; may have schema |
| **Planned** | Future intent only |

For what **is** built, see [FEATURES.md](./FEATURES.md).
