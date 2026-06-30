# PerformIQ — Demo Flow

## Purpose

Step-by-step script for hackathon judges and live demos (~5–8 minutes).

## Current state

**Demo-ready** with seeded data (`pnpm seed:atomquest`).

---

## Prerequisites

| Step | Command / value |
|------|-----------------|
| Database | `DATABASE_URL` in `.env.local` |
| Schema | `pnpm drizzle:push` |
| Seed | `pnpm seed:atomquest` |
| Server | `pnpm dev` or production URL |
| Password | `AtomQuest@123` (all demo users) |

---

## Demo accounts

### Quick-fill (login page)

| Card | Email |
|------|-------|
| Employee | `employee@atomquest.demo` |
| Manager | `manager@atomquest.demo` |
| Admin | `admin@atomquest.demo` |

### Extended seed users

| Email | Sheet status | Demo use |
|-------|--------------|----------|
| `employee@atomquest.demo` | DRAFT | Live save + submit |
| `priya.sharma@atomquest.demo` | SUBMITTED | Manager approve |
| `arjun.mehta@atomquest.demo` | LOCKED | Check-in + shared KPI owner |
| `sam.okonkwo@atomquest.demo` | LOCKED | Completed check-in data |
| `jordan.lee@atomquest.demo` | RETURNED | Return feedback banner |

Emails use `@atomquest.demo` (seed); UI brand is **PerformIQ**.

---

## Recommended flow (~5 min)

### 1. Admin — governance (90s)

1. Login → **Admin** demo card.
2. Lands on `/admin/atomquest` (via `/dashboard`).
3. **Overview:** stat cards, charts, employee table.
4. **Export CSV** — file downloads.
5. **Audit** tab — sample SUBMITTED / LOCKED / CHECK_IN entries.
6. **Shared goals** tab — explain assign form (seed already has shared KPI).

**Talking point:** Org-wide visibility without editing employee drafts directly.

### 2. Manager — approval (60s)

1. Sign out → **Manager** demo card.
2. `/team` — mixed statuses.
3. **Review** Priya Sharma (SUBMITTED).
4. **Approve & lock** (or save edits first).
5. Optional: manager check-in comment on Arjun.

**Talking point:** Separation of employee submission vs manager lock.

### 3. Employee — goals (60s)

1. Sign out → **Employee** demo card.
2. `/goals` — edit draft, **Save draft**, **Submit**.
3. Or login as Arjun → **Quarterly check-in** tab → save active quarter.

**Talking point:** Server-side validation (100% weightage, max 8 goals).

---

## Role transitions

| From | Action |
|------|--------|
| Any | Navbar sign out |
| Login | Demo card → Log In |
| After login | Auto `/dashboard` → role home |

| Role | Home |
|------|------|
| Employee | `/goals` |
| Manager | `/team` |
| Admin | `/admin/atomquest` |

---

## Expected outputs

| Action | Expected |
|--------|----------|
| Submit goals | Status Submitted; toast success |
| Approve | Status Locked; employee notify (console or email) |
| Check-in save | Progress score; active quarter only |
| Admin stats | Non-zero charts after seed |
| Export | CSV with goal rows |

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Empty charts | Run `pnpm seed:atomquest` |
| Check-in disabled | Sheet must be LOCKED |
| 403 on save | Use employee account for goal/check-in APIs |
| Wrong quarter active | Seed uses calendar quarter when multiple cycles open |

---

## Limitations

- Not a load or security test environment.
- Re-seeding may duplicate audit rows.

---

## Future enhancements

- Recorded video walkthrough
- Staging URL pinned in docs

See [SETUP.md](./SETUP.md), [DEPLOYMENT.md](./DEPLOYMENT.md).
