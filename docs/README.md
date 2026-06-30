# PerformIQ — Documentation

**Status:** Demo-ready · Proof of Concept

> PerformIQ's internal code and APIs use the `atomquest` module prefix (`/api/atomquest/*`, `/admin/atomquest`). All documentation refers to the product as PerformIQ.

All content is derived from the repository. No speculative features are documented.

---

## Product

| Document | Description |
|----------|-------------|
| [SHOWCASE.md](./SHOWCASE.md) | Visual screenshot showcase of all major pages |
| [APPLICATION_WALKTHROUGH.md](./APPLICATION_WALKTHROUGH.md) | End-user workflow guide for employees, managers, and admins |
| [FEATURES.md](./FEATURES.md) | Feature catalog with implementation status labels |
| [FEATURE_MATRIX.md](./FEATURE_MATRIX.md) | BRD traceability matrix |
| [DEMO_FLOW.md](./DEMO_FLOW.md) | Condensed demo flow for judges |
| [KNOWN_LIMITATIONS.md](./KNOWN_LIMITATIONS.md) | Known constraints and demo risks |

---

## Engineering

| Document | Description |
|----------|-------------|
| [IMPLEMENTATION.md](./IMPLEMENTATION.md) | Master implementation reference (modules, lifecycles, inventories) |
| [API.md](./API.md) | HTTP API reference — handlers, roles, request/response shapes |
| [DATABASE.md](./DATABASE.md) | Drizzle schema, tables, columns, relationships |
| [SETUP.md](./SETUP.md) | Local development setup — prerequisites, env vars, seed |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Production build and verification |
| [TESTING.md](./TESTING.md) | Test strategy and current coverage gaps |
| [CHANGELOG.md](./CHANGELOG.md) | Release notes and doc history |

---

## Architecture

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System flows: auth, RBAC, goal lifecycle, check-in, audit |
| [TECHNICAL_GUIDE.md](./TECHNICAL_GUIDE.md) | Architecture evolution — scaling, multi-tenancy, observability, deployment |
| [ROADMAP.md](./ROADMAP.md) | Deferred and planned features (not implemented) |

---

## Security & Access

| Document | Description |
|----------|-------------|
| [AUTH_RBAC.md](./AUTH_RBAC.md) | NextAuth v5, JWT sessions, middleware guards, role matrix |

---

## UI/UX

| Document | Description |
|----------|-------------|
| [UI_UX.md](./UI_UX.md) | Pages, components, design tokens, theme system |
| [SHOWCASE.md](./SHOWCASE.md) | Visual page-by-page showcase with screenshots |

---

## Contribution

| Document | Location |
|----------|----------|
| Contributing guide | [../CONTRIBUTING.md](../CONTRIBUTING.md) |

---

## Status Labels

| Label | Meaning |
|-------|---------|
| **Implemented** | Works end-to-end |
| **Demo-ready** | Implemented; tuned for demo/seed data |
| **Partial** | Incomplete or environment-dependent |
| **Deferred** | Schema or stub only; no runtime feature |
| **Planned** | Roadmap only; not in codebase |

---

## Quick Reference

```bash
pnpm install
cp .example.env .env.local   # set DATABASE_URL, AUTH_SECRET
pnpm drizzle:push
pnpm seed:atomquest
pnpm dev                     # → http://localhost:3000
```

Demo password: `AtomQuest@123` (see [APPLICATION_WALKTHROUGH.md](./APPLICATION_WALKTHROUGH.md) §11 for all accounts).
