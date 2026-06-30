# PerformIQ — Feature Matrix

## Purpose

Single-table view of capabilities for hackathon judging, BRD traceability, and portfolio review. Repository truth only.

## Current state

**Demo-ready** hackathon MVP (Ignitia 2K26). UI brand: **PerformIQ**. Internal APIs/routes: `atomquest` prefix.

## Status legend

| Status | Meaning |
|--------|---------|
| **Implemented** | End-to-end in codebase |
| **Demo-ready** | Implemented and exercised in demo/seed |
| **Partial** | Incomplete, env-dependent, or constrained |
| **Deferred** | Schema/stub only; no user-facing runtime |
| **Planned** | Roadmap; not in repository |

## Demo column

| Value | Meaning |
|-------|---------|
| **Yes** | Shown in recommended judge flow |
| **Optional** | Works; not required for core demo |
| **Seed** | Visible after `pnpm seed:atomquest` |
| **No** | Not demoed / not built |

---

## Feature matrix

### Authentication & access

| Feature | Status | Demoed | BRD mapping |
|---------|--------|--------|-------------|
| Credentials login | **Implemented** | Yes | Auth / access |
| OAuth (GitHub, Google) | **Implemented** | Optional | Auth / access |
| JWT session + role in token | **Implemented** | Yes | Auth / access |
| Sign up | **Implemented** | Optional | Auth / access |
| Password reset / new password | **Implemented** | Optional | Auth / access |
| Email verification gate | **Partial** | No | Security (`EMAIL_SERVICE=1`) |
| Two-factor authentication | **Partial** | No | Security (`EMAIL_SERVICE=1`) |
| Demo account quick-fill (login) | **Demo-ready** | Yes | Demo / access |
| Azure AD / SAML | **Planned** | No | Enterprise SSO |

### RBAC & navigation

| Feature | Status | Demoed | BRD mapping |
|---------|--------|--------|-------------|
| Roles: Employee, Manager, Admin | **Implemented** | Yes | RBAC |
| Legacy `USER` role → Employee | **Implemented** | — | RBAC |
| `SUPER_ADMIN` → Admin privileges | **Implemented** | — | RBAC |
| Middleware route protection | **Implemented** | Yes | RBAC |
| PerformIQ path guards (`/goals`, `/team`, `/admin/atomquest`) | **Implemented** | Yes | RBAC |
| Post-login role home (`/dashboard`) | **Implemented** | Yes | RBAC |
| Manager hierarchy (`user.manager_id`) | **Implemented** | Seed | Org structure |
| Settings: read-only portal role | **Implemented** | Optional | User prefs |

### Goal lifecycle

| Feature | Status | Demoed | BRD mapping |
|---------|--------|--------|-------------|
| Annual goal sheet (FY cycle) | **Implemented** | Yes | Goal creation |
| Draft save | **Implemented** | Yes | Goal creation |
| Submit for approval | **Implemented** | Yes | Workflow |
| Status: DRAFT / SUBMITTED / RETURNED / LOCKED | **Implemented** | Seed | Workflow |
| Goal validation (max 8, 100% weight, min 10%/goal) | **Implemented** | Yes | Business rules |
| UOM types (6) | **Implemented** | Yes | Measurement |
| Thrust areas | **Implemented** | Seed | Goal taxonomy |
| Goal-setting cycle window check | **Implemented** | Yes | Cycle mgmt |
| Client + server validation (Zod) | **Implemented** | Yes | Business rules |

### Manager review

| Feature | Status | Demoed | BRD mapping |
|---------|--------|--------|-------------|
| Team list (direct reports) | **Implemented** | Yes | Manager view |
| Admin org-wide team list | **Implemented** | Optional | Admin view |
| Review employee sheet (`/team/[userId]`) | **Implemented** | Yes | Manager approval |
| Manager edit goals (pre-approve) | **Implemented** | Optional | Manager approval |
| Approve & lock sheet | **Implemented** | Yes | Workflow |
| Return with feedback | **Implemented** | Seed | Workflow |
| Manager quarterly check-in comment | **Implemented** | Seed | Check-in |

### Quarterly check-in

| Feature | Status | Demoed | BRD mapping |
|---------|--------|--------|-------------|
| Q1–Q4 updates per goal | **Implemented** | Yes | Check-in |
| UOM-based progress score | **Implemented** | Yes | Measurement |
| Achievement status (NOT_STARTED / ON_TRACK / COMPLETED) | **Implemented** | Seed | Check-in |
| Active quarter lock (edit one quarter) | **Implemented** | Yes | Cycle control |
| Requires LOCKED goal sheet | **Implemented** | Yes | Workflow |
| Quarter metadata API (`/cycles`) | **Implemented** | Yes | Cycle control |
| Shared KPI check-in sync (primary owner) | **Demo-ready** | Seed | Shared goals |

### Shared KPI

| Feature | Status | Demoed | BRD mapping |
|---------|--------|--------|-------------|
| Admin assign shared goal | **Demo-ready** | Seed | Shared goals |
| Recipient: locked title/target/UOM | **Implemented** | Seed | Shared goals |
| Recipient: editable weightage | **Implemented** | Seed | Shared goals |
| Primary owner designation | **Implemented** | Seed | Shared goals |

### Admin governance & reporting

| Feature | Status | Demoed | BRD mapping |
|---------|--------|--------|-------------|
| Admin dashboard stats | **Demo-ready** | Yes | Reporting |
| Charts (Recharts) | **Demo-ready** | Yes | Reporting |
| Manager completion / pending table | **Demo-ready** | Yes | Reporting |
| Employee completion table | **Demo-ready** | Yes | Reporting |
| Achievement distribution | **Demo-ready** | Seed | Reporting |
| CSV export | **Partial** | Yes | Reporting (Q1 actuals only) |
| Audit trail viewer | **Demo-ready** | Yes | Compliance |
| Audit diffs on key actions | **Demo-ready** | Yes | Compliance |
| Shared goals admin tab | **Demo-ready** | Optional | Shared goals |

### Notifications

| Feature | Status | Demoed | BRD mapping |
|---------|--------|--------|-------------|
| Email: goal submitted → manager | **Partial** | Optional | Notifications (Resend or console) |
| Email: goal approved → employee | **Partial** | Optional | Notifications |
| Email: goal returned → employee | **Partial** | Optional | Notifications |
| Email: check-in completed | **Deferred** | No | Notifications |

### Cycles & data

| Feature | Status | Demoed | BRD mapping |
|---------|--------|--------|-------------|
| Fiscal year labeling (Apr–Mar) | **Implemented** | Yes | Cycle mgmt |
| Performance cycles (GOAL_SETTING + Q1–Q4) | **Implemented** | Seed | Cycle mgmt |
| Demo seed script | **Demo-ready** | Yes | Demo |
| Dynamic cycle admin CRUD UI | **Planned** | No | Cycle mgmt |

### UI / UX

| Feature | Status | Demoed | BRD mapping |
|---------|--------|--------|-------------|
| PerformIQ landing & marketing pages | **Demo-ready** | Yes | UX |
| Light enterprise app shell | **Implemented** | Yes | UX |
| Status badges & toasts | **Implemented** | Yes | UX |
| Legal pages (privacy, terms) | **Implemented** | Optional | Compliance |

### Engineering & quality

| Feature | Status | Demoed | BRD mapping |
|---------|--------|--------|-------------|
| Production build (`pnpm build`) | **Implemented** | — | Engineering |
| Typecheck (`pnpm typecheck`) | **Implemented** | — | Engineering |
| Automated unit/E2E tests | **Deferred** | No | QA |
| Escalation rules (DB schema) | **Deferred** | No | Escalation |
| Escalation job execution | **Deferred** | No | Escalation |
| Advanced analytics / BI | **Planned** | No | Reporting |

---

## BRD coverage summary

| BRD area | Coverage |
|----------|----------|
| Auth / access | **Implemented** (demo credentials; optional OAuth) |
| RBAC | **Implemented** |
| Goal creation & validation | **Implemented** |
| Manager approval workflow | **Implemented** |
| Quarterly check-in | **Implemented** |
| Shared goals | **Demo-ready** |
| Reporting | **Demo-ready** (export **Partial**) |
| Compliance / audit | **Demo-ready** |
| Notifications | **Partial** |
| Enterprise SSO / HRIS | **Planned** |
| Escalation automation | **Deferred** |

---

## Related documentation

| Doc | Link |
|-----|------|
| Feature narratives | [FEATURES.md](./FEATURES.md) |
| Implementation detail | [IMPLEMENTATION.md](./IMPLEMENTATION.md) |
| Limitations | [KNOWN_LIMITATIONS.md](./KNOWN_LIMITATIONS.md) |
| Roadmap | [ROADMAP.md](./ROADMAP.md) |
| Demo script | [DEMO_FLOW.md](./DEMO_FLOW.md) |

---

## Legacy file

Root [FEATURE_MATRIX.md](../FEATURE_MATRIX.md) uses AtomQuest branding and older status labels (`Done` / `Not started`). **This file is the maintained matrix.**
