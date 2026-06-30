# PerformIQ — Visual Showcase

Enterprise performance lifecycle management platform. Built for Ignitia 2K26.

> **Demo credentials** — Password for all accounts: `AtomQuest@123`  
> Use the one-click demo account buttons on the login page.

---

## Landing Page

![Landing Page](./assets/screenshots/landing/landing-hero.png)

A public-facing enterprise landing page that communicates the product's value proposition — structured goal-setting, manager approval workflows, quarterly KPI tracking, and governance audit trails. Features a sticky nav, feature grid, and how-it-works section.

**Capabilities shown:**
- PerformIQ branding with gradient logo
- Role capability overview (Employee / Manager / Admin)
- Feature cards with enterprise messaging
- Sign in / Get started CTAs

---

## Login Page

![Login Page](./assets/screenshots/auth/login.png)

Split-panel authentication screen. Left panel carries the PerformIQ brand and feature summary. Right panel provides credential login plus OAuth (Google, GitHub). One-click demo account fill buttons for each role eliminate friction during demos.

**Capabilities shown:**
- Credentials login (email + password)
- Google / GitHub OAuth buttons
- Demo account quick-fill: Employee, Manager, Admin
- Forgot password link → reset flow

---

## Employee — Goal Sheet

![Employee Goals Dashboard](./assets/screenshots/employee/goals-dashboard.png)

The primary employee workspace. Displays the annual goal sheet with all goals, UOM types, targets, and weightages. A weightage progress bar validates that total equals 100%. Supports inline editing in DRAFT state.

**Capabilities shown:**
- Goal list with KPI title, thrust area, UOM, target, weightage
- Live weightage validation bar (green at 100%)
- DRAFT / SUBMITTED / RETURNED / LOCKED status badge
- Submit for approval CTA (when weightage valid)
- Add / edit / delete goals in DRAFT mode

---

## Employee — Quarterly Check-In

![Quarterly Check-In](./assets/screenshots/employee/quarterly-checkin.png)

Quarter-tabbed check-in interface. Only the active quarter is editable; past quarters are read-only. Input controls adapt to UOM type (numeric, percent, date, checkbox). Progress bars update as actuals are entered.

**Capabilities shown:**
- Q1–Q4 tab navigation with Active badge
- UOM-appropriate input rendering
- Achievement status selector (Not Started / On Track / Completed)
- Per-goal progress bar computed from actual vs. target
- Locked state when sheet is not yet approved

---

## Manager — Team Dashboard

![Manager Team Dashboard](./assets/screenshots/manager/team-dashboard.png)

The manager's command centre. Lists all direct reports with their current goal sheet status, goal count, and total weightage. Quick access to review any employee's sheet.

**Capabilities shown:**
- Direct reports table with status badges
- Real-time goal sheet status (Draft / Submitted / Returned / Locked)
- Weightage total per employee
- Review button per row
- Admin view: all employees org-wide

---

## Manager — Goal Review

![Goal Review Page](./assets/screenshots/manager/goal-review.png)

Inline review workspace. Managers can read all employee goals, edit targets or weightages before approving, approve and lock, or return with written feedback. Full weightage validation shown in real time.

**Capabilities shown:**
- All employee goals visible (read or edit mode)
- Weightage validation badge (100% / 100% ✓ Valid)
- Approve & Lock action → status becomes LOCKED
- Return to Employee action with feedback textarea
- Save review edits without committing approval

---

## Admin — Overview Dashboard

![Admin Overview](./assets/screenshots/admin/admin-overview.png)

Organisation-wide governance dashboard. Four KPI stat cards. Three Recharts visualisations: submission pipeline, achievement distribution, manager completion rates. Employee completion table below.

**Capabilities shown:**
- Total employees, submitted, approved, Q[n] check-in completion %
- Submission Progress bar chart (by status)
- Achievement Mix chart (NOT_STARTED / ON_TRACK / COMPLETED)
- Manager Completion Rate bar chart
- Employee completion table with sortable rows
- CSV Export button

---

## Admin — Audit Trail

![Audit Trail](./assets/screenshots/admin/audit-trail.png)

Immutable governance log. Records all significant lifecycle events with timestamp, actor, action code, target, and before/after diffs. Last 150 entries displayed. Read-only for all users including admins.

**Capabilities shown:**
- Chronological event list (newest first)
- Actor name + role on each entry
- Action codes: GOAL_SUBMITTED, GOAL_APPROVED, GOAL_RETURNED, GOAL_UPDATED, CHECK_IN_SAVED
- Before/after value diffs for edits
- Timestamp with exact date and time

---

## Admin — Shared KPIs

![Shared KPIs](./assets/screenshots/admin/shared-kpis.png)

Admin-controlled company-wide KPI assignment panel. Admins define a goal once and assign it to multiple employees. Recipients see the goal with a locked title and target; only the weightage is editable on their end.

**Capabilities shown:**
- Shared goal assignment form (title, UOM, target, recipients)
- Existing shared goal list with recipient count
- Recipient restrictions: title/target read-only
- Primary owner designation for check-in sync
- Goal injected directly into recipient's goal sheet

---

## Settings Page

![Settings](./assets/screenshots/settings/settings.png)

User profile and preferences page. Displays name, email, and role. The role field is read-only — role changes must be made by an administrator.

**Capabilities shown:**
- Name and email display / edit
- Role badge (Employee / Manager / Admin) — read-only
- Account settings layout

---

## Tech Stack Summary

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Auth | NextAuth v5 (JWT, Credentials + OAuth) |
| ORM | Drizzle ORM |
| Database | PostgreSQL (Neon) |
| Charts | Recharts 3 |
| Email | Resend (optional; console fallback) |

---

## Quick Start

```bash
pnpm install
cp .example.env .env.local   # set DATABASE_URL and AUTH_SECRET
pnpm drizzle:push
pnpm seed:atomquest
pnpm dev
```

Open `http://localhost:3000`.

---

*See [APPLICATION_WALKTHROUGH.md](./APPLICATION_WALKTHROUGH.md) for the full user workflow guide.*  
*See [IMPLEMENTATION.md](./IMPLEMENTATION.md) for technical implementation details.*
