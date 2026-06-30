# PerformIQ — Authentication & RBAC

## Purpose

How users authenticate and how roles constrain routes and APIs.

## Current state

**Implemented** — NextAuth v5 JWT sessions with middleware guards in `src/proxy.ts`.

---

## Authentication

### Providers

| Provider | Status | Config |
|----------|--------|--------|
| Credentials (email/password) | **Implemented** | `src/auth.config.ts` |
| GitHub OAuth | **Implemented** | Env: `AUTH_GITHUB_*` |
| Google OAuth | **Implemented** | Env: `AUTH_GOOGLE_*` |

### Session strategy

- **JWT** (`src/auth.ts`) — not database sessions.
- `jwt` callback loads `role`, `isOAuth`, 2FA flags from DB on each token refresh.
- `session` callback exposes fields to client (`useSession`).

### Sign-in rules (credentials)

| Check | When | Status |
|-------|------|--------|
| User exists + password match | Always | **Implemented** |
| `emailVerified` | `EMAIL_SERVICE=1` | **Partial** |
| 2FA confirmation record | `EMAIL_SERVICE=1` + `isTwoFactorEnabled` | **Partial** |

OAuth sign-in skips email verification check.

### Post-login redirect

| Step | Behavior |
|------|----------|
| Auth routes while logged in | Redirect → `/dashboard` |
| `/dashboard` | Client `roleHomePath()` redirect |

| Role | Home path |
|------|-----------|
| Employee, USER (legacy) | `/goals` |
| Manager | `/team` |
| Admin, SUPER_ADMIN | `/admin/atomquest` |

**Files:** `src/lib/atomquest/roles.ts`, `src/app/(protected)/dashboard/page.tsx`

---

## Middleware (`src/proxy.ts`)

**Status:** **Implemented**

Separate `NextAuth()` instance includes `session` callback mapping `token.role` → `session.user.role` (required for correct RBAC in middleware).

### Public routes (`src/route.ts`)

- `/`, `/verify-email`, `/terms`, `/privacy`

### Auth routes

- `/login`, `/signup`, `/error`, `/reset-password`, `/new-password`
- Logged-in users redirected to `/dashboard`

### Protected routes

All others require session; unauthenticated → `/login?callbackUrl=...`

### Legacy RBAC guard

Paths starting with `/employee`, `/manager`, or `/admin` (includes `/admin/atomquest`):

| Path prefix | Allowed roles |
|-------------|---------------|
| `/admin/*` | Admin, SUPER_ADMIN |
| `/manager/*` | Manager, Admin |
| `/employee/*` | (guard exists; no dedicated pages in App Router) |

Non-matching roles → redirect `/dashboard`.

### PerformIQ guard (`atomquestRouteGuard`)

| Path | Employee | Manager | Admin |
|------|----------|---------|-------|
| `/goals` | ✓ | ✓ | ✓ |
| `/team`, `/team/*` | ✗ | ✓ | ✓ |
| `/admin/atomquest` | ✗ | ✗ | ✓ |

Unauthorized → redirect to `roleHomePath(role)`.

**File:** `src/lib/atomquest/guard.ts`, `src/lib/atomquest/routes.ts`

---

## API authorization

Pattern: `requireAtomquestUser()` + `resolveUserRole()` + explicit checks.

| API area | Rule |
|----------|------|
| Goal sheet PUT/POST | `isEmployeeRole` only |
| Goal sheet GET | Any authenticated (own sheet) |
| Check-in GET/POST | `isEmployeeRole` only |
| Team routes | Manager or Admin |
| Team member access | `canAccessTeamMember()` — admin: all; manager: `employee.managerId === viewer.id` |
| Admin routes | `isAdminRole` |

**File:** `src/lib/atomquest/team-access.ts`

---

## Role helpers

| Function | True for |
|----------|----------|
| `isEmployeeRole` | EMPLOYEE, USER |
| `isManagerRole` | MANAGER |
| `isAdminRole` | ADMIN, SUPER_ADMIN |

---

## Settings UI

- Portal role shown read-only (`roleDisplayLabel`).
- Role field stripped from settings POST payload.

**Status:** **Implemented**

---

## Limitations

- No per-resource permissions beyond role + manager hierarchy.
- Managers can open `/goals` in UI but cannot use employee write APIs (see [KNOWN_LIMITATIONS.md](./KNOWN_LIMITATIONS.md)).
- Legal copy mentions LinkedIn OAuth; code only registers GitHub + Google.
- Demo emails remain `@atomquest.demo`.

---

## Future enhancements

- Azure AD / OIDC
- Attribute-based access (department scopes)
- Audit of failed auth attempts

See [ROADMAP.md](./ROADMAP.md).
