# PerformIQ — Application Walkthrough

**Audience:** New employees, managers, and administrators joining the platform for the first time.  
**Purpose:** Understand what PerformIQ does, what your role can see and do, and how the workflows connect end to end.

> **Demo credentials** — Password for all accounts: `AtomQuest@123`  
> The login page includes quick-fill buttons for each demo account.

---

## Table of Contents

1. [What is PerformIQ?](#1-what-is-performiq)
2. [Roles at a Glance](#2-roles-at-a-glance)
3. [Getting Started — Logging In](#3-getting-started--logging-in)
4. [Employee Workflow](#4-employee-workflow)
5. [Manager Workflow](#5-manager-workflow)
6. [Admin Workflow](#6-admin-workflow)
7. [Shared KPIs](#7-shared-kpis)
8. [Quarterly Check-Ins](#8-quarterly-check-ins)
9. [Notifications](#9-notifications)
10. [Frequently Asked Questions](#10-frequently-asked-questions)
11. [Demo Accounts Reference](#11-demo-accounts-reference)

---

## 1. What is PerformIQ?

PerformIQ is an **enterprise performance lifecycle management platform**. It replaces spreadsheets and email chains with a structured, role-based workflow that covers the full annual performance cycle:

```
Employee sets goals → Manager reviews & approves → Quarterly actuals entered → Admin governs & reports
```

Every action is logged in an audit trail. The system enforces business rules (weightage totalling 100%, goals locked after approval) so the process is consistent across the organisation.

---

## 2. Roles at a Glance

| Role | What they can do | Where they land after login |
|------|------------------|-----------------------------|
| **Employee** | Create goal sheet, submit for approval, enter quarterly actuals | `/goals` |
| **Manager** | View direct reports, review/approve/return goal sheets, add quarterly comments | `/team` |
| **Admin** | Everything above + org-wide analytics, audit trail, shared KPI assignment, CSV export | `/admin/atomquest` |

> Roles are assigned by your system administrator. You cannot change your own role. The role is displayed as a pill badge in the navigation bar and on the Settings page.

---

## 3. Getting Started — Logging In

1. Navigate to the application URL (e.g. `http://localhost:3000`).
2. You will land on the **PerformIQ landing page**. Click **Sign in** or **Get started**.
3. On the login page, enter your **work email address** and **password**, then click **Sign in**.
   - If your organisation uses Google or GitHub SSO, click the respective button instead.
4. After login you are redirected to `/dashboard`, which immediately sends you to your **role home**:
   - Employees → `/goals`
   - Managers → `/team`
   - Admins → `/admin/atomquest`

**Forgot your password?** Click *Forgot password?* on the login page, enter your email, and a reset link will be sent to you.

---

## 4. Employee Workflow

### 4.1 Understanding Your Goal Sheet

Every employee has **one goal sheet per annual performance cycle**. The sheet moves through these statuses:

```
DRAFT → SUBMITTED → (RETURNED → DRAFT) → LOCKED
```

| Status | What it means |
|--------|---------------|
| **DRAFT** | You are still editing. Not yet visible to your manager for approval. |
| **SUBMITTED** | Sent to your manager for review. You can no longer edit goals. |
| **RETURNED** | Manager sent it back with feedback. You can edit and resubmit. |
| **LOCKED** | Manager approved. Goals are now locked. Quarterly check-ins become available. |

---

### 4.2 Creating and Editing Goals

1. Log in as an employee — you land on the **Goals** page.
2. The **Goal Sheet** tab shows your current goals.
3. To add a goal, click **+ Add goal** (available when the sheet is DRAFT and the annual cycle is open).
4. Fill in each goal:
   - **Title** — a clear, measurable objective (e.g. "Reduce customer churn by 8%").
   - **Thrust Area** — the strategic pillar this goal belongs to (selected from a dropdown seeded by your admin).
   - **Unit of Measure (UOM)** — how success is measured. Options:
     - *Numeric Maximize* — higher actual is better (e.g. sales revenue).
     - *Numeric Minimize* — lower actual is better (e.g. defect count).
     - *Percent Maximize / Minimize* — percentage-based targets.
     - *Timeline* — completion by a target date.
     - *Zero-Defect* — binary: achieved or not.
   - **Target Value** — the number or date you are aiming for.
   - **Weightage (%)** — how much this goal contributes to your overall score.

5. **Weightage rules enforced by the system:**
   - All goal weightages must total exactly **100%**.
   - Each individual goal must have a minimum weightage of **10%**.
   - Maximum **8 goals** per sheet.
   - A weightage bar at the top of the form shows your running total and turns green when you reach 100%.

6. Click **Save draft** at any time to save progress without submitting.

> **Tip:** If an admin has assigned you a **Shared KPI** (see §7), that goal appears pre-filled with a locked title and target. You can only adjust its weightage.

---

### 4.3 Submitting for Approval

Once your weightage bar shows 100% and you are satisfied with your goals:

1. Click **Submit for approval**.
2. Confirm the action when prompted.
3. The sheet status changes to **SUBMITTED**. Your manager will be notified.
4. Goals can no longer be edited in SUBMITTED status — wait for your manager to act.

---

### 4.4 Handling a Return

If your manager returns your sheet:

1. An **alert banner** appears at the top of your Goals page with the manager's feedback message.
2. The sheet reverts to **DRAFT** status — you can edit again.
3. Make the requested changes, then resubmit.

---

### 4.5 After Approval — Quarterly Check-Ins

Once your manager approves your sheet (status becomes **LOCKED**), the **Quarterly Check-in** tab becomes active. See §8 for the full check-in guide.

---

## 5. Manager Workflow

### 5.1 Your Team Page

After login, managers land on `/team`. The **Direct Reports** table lists every employee assigned to you, along with their current goal sheet status:

| Column | Description |
|--------|-------------|
| Name | Employee name and email |
| Status | DRAFT / SUBMITTED / RETURNED / LOCKED |
| Goals | Number of goals on their sheet |
| Weightage | Total weightage (must be 100% to submit) |
| Action | "Review" button opens the employee's sheet |

---

### 5.2 Reviewing an Employee Sheet

1. Click **Review** on any employee row.
2. The employee's full goal sheet opens — all goals with UOM, targets, and weightages are visible.
3. If the sheet is **SUBMITTED**, you have three options:

#### Option A — Approve & Lock

- Optionally edit any goal's target or weightage before approving.
- Click **Approve & lock**.
- The sheet status changes to **LOCKED**. The employee is notified and can now begin quarterly check-ins.

#### Option B — Return with Feedback

- Click **Return to employee**.
- Enter a feedback message in the text box that appears.
- Click **Confirm return**. The employee receives your feedback and can revise their sheet.

#### Option C — Save Edits Without Approving

- Edit goal fields (target values, weightages) directly in the review form.
- Click **Save review edits**. Changes are saved but the sheet remains SUBMITTED.
- Useful when you want to stage edits before approving in a later session.

> **Note:** Goals can only be edited before approval. Once a sheet is LOCKED, goals are immutable for all parties.

---

### 5.3 Adding Quarterly Comments

For employees whose sheet is **LOCKED**, you can record a manager comment per quarter:

1. Open the employee's review page.
2. Click the **Quarterly Check-in** tab.
3. Select the relevant quarter tab (Q1, Q2, Q3, Q4).
4. The active quarter (determined by the fiscal calendar) is editable. Past quarters are view-only.
5. Type your comment in the **Manager comment** field and click **Save comment**.

---

### 5.4 Admin-Level Team View

If you are an **Admin**, the Team page shows **all employees** in the organisation, not just your direct reports. Review and approval actions work identically.

---

## 6. Admin Workflow

Admins have access to everything managers and employees can do, plus a dedicated **Admin panel** at `/admin/atomquest`.

### 6.1 Overview Tab

The Overview tab is the organisation-wide governance dashboard.

**KPI stat cards:**

| Card | What it shows |
|------|---------------|
| Total Employees | Number of employees in the system |
| Goal Sheets Submitted | Count with SUBMITTED status |
| Sheets Approved | Count with LOCKED status |
| Q[n] Check-in Completion | Percentage of locked sheets with actuals entered this quarter |

**Charts:**

- **Submission Progress** — bar chart of goal sheet statuses across all employees.
- **Achievement Mix** — breakdown of check-in achievement statuses (NOT_STARTED / ON_TRACK / COMPLETED).
- **Manager Completion Rate** — bar chart showing each manager's team approval rate.

**Employee Completion Table:**  
A dense table listing every employee with their name, manager, sheet status, and check-in progress. Useful for identifying who has not yet submitted or entered actuals.

**CSV Export:**  
Click **Export CSV** to download a spreadsheet of employee performance data for offline reporting or compliance.

---

### 6.2 Audit Trail Tab

Every significant action in PerformIQ is recorded automatically. The **Audit Trail** tab shows the last 150 entries:

| Column | Description |
|--------|-------------|
| Timestamp | Exact date and time of the action |
| Actor | Who performed the action (name + role) |
| Action | What was done (e.g. GOAL_SUBMITTED, GOAL_APPROVED, GOAL_RETURNED) |
| Target | Which employee or sheet was affected |
| Changes | Before/after diff for edits |

> The audit trail is **read-only**. No user — including admins — can delete or modify entries.

---

### 6.3 Shared Goals Tab

Shared KPIs are company-wide or department-wide goals that an admin assigns to multiple employees at once. See §7 for details.

---

## 7. Shared KPIs

**What are they?**  
Shared KPIs are standardised goals (e.g. "Achieve 95% on-time delivery rate") that the admin defines once and assigns to a group of employees. This ensures identical measurement criteria across a team or department.

**How admins assign them:**

1. Go to **Admin** → **Shared Goals** tab.
2. Fill in the shared goal form: Title, Thrust Area, UOM, Target Value, and select the recipient employees.
3. Click **Assign**. The goal is injected into each recipient's goal sheet immediately.

**How they appear for employees:**

- The assigned goal appears in your Goals page with a **"Shared KPI"** badge.
- The **title**, **UOM**, and **target value** are read-only — set by the admin.
- You **can** adjust its **weightage** (provided your total remains 100%).

**Check-in sync:**

- The **primary owner** (one designated employee) enters check-in actuals for the shared KPI.
- The entered values sync automatically to all other recipients' check-in records.

---

## 8. Quarterly Check-Ins

Quarterly check-ins are how employees record actual progress against their approved goals each quarter.

### 8.1 When Can You Enter Check-Ins?

- Your goal sheet must be **LOCKED** (approved by your manager).
- The **active quarter** must be open. Only the current fiscal quarter is editable; past quarters are view-only.
- The active quarter is highlighted with an **"Active"** badge on its tab.

### 8.2 How to Enter a Check-In

1. Go to **Goals** → **Quarterly Check-in** tab.
2. Select the active quarter tab (e.g. **Q2**).
3. For each goal, enter the appropriate actual:
   - *Numeric / Percent goals* → enter your actual numeric value.
   - *Timeline goals* → enter the actual completion date.
   - *Zero-Defect goals* → tick the checkbox if the target was met with zero defects.
4. Select the **Achievement Status**:
   - **Not Started** — no progress recorded yet.
   - **On Track** — progressing as planned.
   - **Completed** — goal fully achieved.
5. A **progress bar** appears showing the computed score for that goal.
6. Click **Save Q[n] check-in** to save your actuals.

### 8.3 Progress Score Calculation

| UOM Type | Formula |
|----------|---------|
| Numeric Maximize | `(actual ÷ target) × 100`, capped at 100% |
| Numeric Minimize | `(target ÷ actual) × 100`, capped at 100% |
| Percent Maximize / Minimize | Same formula as numeric equivalents |
| Timeline | 100% if completed on or before target date, else 0% |
| Zero-Defect | 100% if checkbox ticked, else 0% |

The overall check-in score is the **weighted average** of all goal scores (using the weightage each goal was assigned).

### 8.4 Past and Future Quarters

- **Past quarters** are view-only. Previously entered actuals are visible but not editable.
- **Future quarters** show a locked placeholder until that quarter becomes active per the fiscal calendar.

---

## 9. Notifications

PerformIQ sends email notifications for the following events:

| Event | Who receives it |
|-------|-----------------|
| Goal sheet submitted | The employee's assigned manager |
| Goal sheet approved | The employee |
| Goal sheet returned | The employee |

> **Demo environment note:** Email delivery requires the `RESEND_API_KEY` environment variable. Without it, notification content is printed to the server console rather than sent. All workflow logic (approvals, returns, status changes) works normally regardless.

---

## 10. Frequently Asked Questions

**Q: I submitted my goals but my weightage total was not 100% — how did it go through?**  
The system validates weightage strictly on submission. A total below or above 100% is rejected with an error. If you are seeing a discrepancy after submission, an admin may have added a Shared KPI to your sheet post-submission, which is an admin-only action.

**Q: Can I edit my goals after submitting?**  
No. Once submitted, goal editing is locked until your manager either returns the sheet (back to DRAFT, editable) or approves it (LOCKED — permanently frozen).

**Q: My Quarterly Check-in tab is greyed out.**  
Check-ins require your sheet to be in **LOCKED** status. Your manager must approve the sheet first. If your sheet has been SUBMITTED for a long time without action, contact your manager.

**Q: There is a goal with a "Shared KPI" badge that I did not create.**  
Your admin has assigned a shared KPI to your sheet. You can adjust its weightage but cannot change its title or target — this is by design to ensure consistent measurement across recipients.

**Q: A past quarter's check-in shows incorrect values. Can I correct it?**  
Past quarters are read-only. Contact your admin to arrange a correction; this is not self-serviceable through the UI in the current implementation.

**Q: I do not see a Team link in the navigation.**  
The Team link is only shown to **Managers** and **Admins**. Employees see only Goals and Settings in the navigation.

**Q: Where can I see my overall performance score?**  
Per-goal progress bars are shown on the Quarterly Check-in tab. Your weighted overall score is computed from actuals and is visible there and in the Admin's Employee Completion table.

**Q: Can a manager see my DRAFT goals?**  
No. DRAFT goal sheets are only accessible to the employee who owns them. Managers see the sheet only after it is SUBMITTED.

**Q: Can I have more than 8 goals?**  
No. The system enforces a maximum of 8 goals per sheet. The **+ Add goal** button is hidden once you reach 8.

**Q: What happens if I log in with Google or GitHub?**  
OAuth accounts are linked by email. The system creates your account automatically on first OAuth sign-in and assigns the default Employee role. Your admin must update your role if you are a Manager or Admin.

**Q: What is a Thrust Area?**  
Thrust Areas are the strategic pillars your organisation has defined for the year (e.g. Customer Experience, Operational Efficiency). Each goal is tagged to one thrust area to help admin reporting group goals by strategic priority. They are seeded by the administrator.

**Q: Who can see the audit trail?**  
Only **Admins** have access to the audit trail through the Admin panel. Managers and employees cannot view it.

---

## 11. Demo Accounts Reference

All demo accounts use the same password: `AtomQuest@123`

| Role | Email | Pre-seeded state |
|------|-------|------------------|
| **Admin** | `admin@atomquest.demo` | Full access; seeded data for all charts and audit entries |
| **Manager** | `manager@atomquest.demo` | Team of 5 employees in mixed states |
| **Employee (blank)** | `employee@atomquest.demo` | DRAFT — create and submit goals live during a demo |
| **Employee** | `priya.sharma@atomquest.demo` | SUBMITTED — waiting for manager review |
| **Employee** | `arjun.mehta@atomquest.demo` | LOCKED + completed check-in + shared KPI assigned |
| **Employee** | `sam.okonkwo@atomquest.demo` | LOCKED + completed Q1 check-in |
| **Employee** | `jordan.lee@atomquest.demo` | RETURNED — sheet sent back with manager feedback |

**Recommended sequence to explore the full lifecycle:**

1. **Employee** (`employee@atomquest.demo`) → create goals → submit for approval.
2. **Manager** (`manager@atomquest.demo`) → review Priya or the live employee → approve & lock.
3. **Employee** (the one you approved) → enter quarterly check-in actuals.
4. **Admin** (`admin@atomquest.demo`) → view dashboard stats, charts, audit trail, and export CSV.

---

*For technical implementation details, see [`IMPLEMENTATION.md`](./IMPLEMENTATION.md).*  
*For API reference, see [`API.md`](./API.md).*  
*For architecture overview, see [`ARCHITECTURE.md`](./ARCHITECTURE.md).*
