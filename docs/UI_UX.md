# PerformIQ — UI / UX

## Purpose

User-facing surfaces, design system, and component map.

## Current state

**Demo-ready** —  PerformIQ branding in metadata, navbar, auth, and legal pages.

---

## Route → UI map

| Route | Layout | Component | Access |
|-------|--------|-----------|--------|
| `/` | Root | `LandingPage` | Public |
| `/login`, `/signup` | `(auth)` | Auth forms | Public |
| `/reset-password`, `/new-password`, `/error` | `(auth)` | Auth | Public |
| `/verify-email` | Root | Verify page | Public |
| `/terms`, `/privacy` | `(legal)` | Legal copy | Public |
| `/dashboard` | `(protected)` | Redirect spinner | Authenticated |
| `/goals` | `(protected)` | `GoalsWorkspace` | Employee+ (route) |
| `/team` | `(protected)` | `TeamWorkspace` | Manager, Admin |
| `/team/[userId]` | `(protected)` | `TeamMemberWorkspace` | Manager, Admin |
| `/admin/atomquest` | `(protected)` | `AdminWorkspace` | Admin |
| `/settings` | `(protected)` | Settings form | Authenticated |
| `/server` | `(protected)` | Session debug | Authenticated |

---

## Design system

### Typography & color

| Aspect | Implementation | Status |
|--------|----------------|--------|
| Font | Poppins (`next/font`) | **Implemented** |
| App shell | `bg-slate-50`, white navbar, indigo accents | **Implemented** |
| Marketing | Dark hero, amber accents (`Landing*`) | **Implemented** |
| CSS tokens | `src/app/globals.css` — enterprise light variables | **Implemented** |
| Dark mode | Variables defined; app does not toggle `.dark` | **Partial** |

### UI primitives (`src/components/ui/`)

Radix-based shadcn-style components: `button`, `input`, `label`, `dialog`, `dropdown-menu`, `badge`, `avatar`, `separator`.

**Status:** **Implemented** (subset, not full shadcn CLI project)

---

## Workspaces

### Goals (`goals-workspace.tsx`)

**Status:** **Implemented**

- Tabs: Goal sheet | Quarterly check-in
- Weightage total indicator
- Status badge, toasts (`useAutoDismissToast`)
- Quarter tabs with lock labels from `/api/atomquest/cycles`
- Demo hint in description

### Team (`team-workspace.tsx`)

**Status:** **Implemented**

- Direct reports / org table
- Status badges, link to review
- Admin vs manager description text

### Team member (`team-member-workspace.tsx`)

**Status:** **Implemented**

- Goal list, manager edit, approve, return
- Return reason banner when RETURNED
- Manager check-in comment per quarter

### Admin (`admin-workspace.tsx`)

**Status:** **Demo-ready**

- Tabs: Overview | Audit | Shared goals
- Stat cards, `AdminCharts` (Recharts)
- CSV export, shared KPI form
- Demo navigation hint in description

### Shell

| Component | Role |
|-----------|------|
| `Navbar.tsx` | PerformIQ logo, role badge, nav links, sign out |
| `page-shell.tsx` | Title, description, cards |
| `status-badge.tsx` | Sheet status colors |
| `alert-banner.tsx` | Errors / return feedback |
| `empty-state.tsx` | Empty team list |

---

## Auth UX

| Feature | Status |
|---------|--------|
| Demo account cards on login | **Demo-ready** |
| OAuth buttons (GitHub, Google) | **Implemented** |
| Split auth layout with feature list | **Implemented** |

---

## Landing

**Status:** **Demo-ready**

Components: `LandingHero`, `LandingFeatures`, `LandingHowItWorks`, `LandingFooter`, `LandingHeader`.

Authenticated CTA → `/dashboard`.

---

## UX patterns

| Pattern | Status |
|---------|--------|
| Loading spinners on fetch | **Implemented** |
| Auto-dismiss toasts (~4s) | **Implemented** |
| Client-side validation before API | **Implemented** |
| Disabled actions when sheet locked | **Implemented** |

---

## Limitations

- Limited mobile optimization on wide admin tables (horizontal scroll).
- Manager `/goals` page loads but employee write APIs may fail (role mismatch).
- Dashboard loading text still says “AtomQuest workspace” in code.
- CSV download uses internal `atomquest` filename.

---

## Future enhancements

- Unified light/dark toggle
- In-app notification center
- Onboarding tour for judges

See [ROADMAP.md](./ROADMAP.md).
