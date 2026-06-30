# Society Maintenance Tracker

## Live Demo

> Deployment URL will be added after Vercel deployment.

## Demo Accounts

Pre-seeded accounts are available to log in instantly. The default credentials are:

* **Admin Demo (Admin role):** `admin@societytrack.demo` (Password: `Admin@123`)
* **Resident Demo 1 (Resident role):** `resident@societytrack.demo` (Password: `Resident@123`)
* **Resident Demo 2 (Resident role):** `amit.resident@societytrack.demo` (Password: `Resident@123`)
* **Resident Demo 3 (Resident role):** `priya.resident@societytrack.demo` (Password: `Resident@123`)

---

## Problem Statement

Housing society maintenance management is often handled through fragmented communication channels such as group chats, verbal requests, or paper logs. This causes several operational challenges:
1. **Lost Track of Issues**: Maintenance issues slip through the cracks, leading to resident frustration.
2. **Lack of Transparency**: Residents cannot track the status of their complaints, and admins lack an audit log of status updates.
3. **No Prioritization**: Urgency levels are not categorized, meaning high-priority safety hazards are treated the same as cosmetic problems.
4. **Unmonitored SLA**: Overdue complaints are not highlighted, preventing timely resolution.

---

## Solution Overview

The **Society Maintenance Tracker** is a full-stack web application that consolidates complaint tracking into a single, structured system. 
* **Residents** can submit maintenance complaints (specifying title, description, category, and photo links), view their complaint pipeline, track real-time status transitions, and check society announcements.
* **Admins** get access to an operational control panel to manage status transitions, adjust urgency priority, filter issues by status or category, monitor metrics (such as overdue or high-priority backlogs), and broadcast society-wide notices.

---

## Key Features

### Resident Features
* **Register/Login**: Standard email/password registration and credentials login, with support for third-party OAuth providers.
* **Submit Complaint**: Form to file a request with title, category, description, and an optional image link.
* **Track Complaints**: View a historical list of raised complaints, complete with real-time status badges and resolution dates.
* **Notices Board**: Read society-wide official notifications with critical updates pinned at the top.

### Admin Features
* **Global complaints panel**: Inspect all complaints submitted across the society.
* **Advanced Filters**: Search and sort issues by category, priority, status, or choose to list overdue complaints first.
* **Status Updates**: Advance status values (`OPEN`, `IN_PROGRESS`, `RESOLVED`) while attaching a transition explanation note.
* **Priority Updates**: Assign complaint urgency ratings (`LOW`, `MEDIUM`, `HIGH`).
* **Analytical Dashboard**: View real-time stat counts for status backlogs, category distributions, overdue logs, and high-priority open requests.
* **Announcements Management**: Publish notice circulars and pin critical announcements.

### Backend/System Features
* **Next.js App Router**: Optimized folder routing structure utilizing Server-Side rendering.
* **Role-based Authentication**: Route scoping checks using NextAuth v5 session parameters.
* **Transactional Audits**: Status updates and append-only status log entries are handled transactionally to prevent state drift.
* **Computed Overdue SLA**: Overdue complaints are dynamically computed at query time using the threshold set in the app settings, avoiding data synchronization issues.
* **Consistent API contract**: JSON success and error response shapes.

---

## Tech Stack

* **Core Framework**: Next.js (16.2.6) App Router
* **Language**: TypeScript (5.x)
* **Database**: PostgreSQL (Neon Serverless)
* **ORM**: Drizzle ORM (0.45.2)
* **Authentication**: NextAuth (5.0.0-beta.30)
* **Styling**: Tailwind CSS (4.x)
* **Components**: Tailwind CSS / Shadcn UI
* **Validation**: Zod (4.1.12)
* **Charts**: Recharts (3.8.1)
* **Target Deployment**: Vercel

---

## Application Routes

* `/login` - User registration & credentials login page
* `/signup` - Resident signup page
* `/dashboard` - Main resident quick-start dashboard
* `/complaints` - Resident's own complaints listing
* `/complaints/new` - File a new maintenance request
* `/notices` - Society notice board & admin notice publisher form
* `/admin/dashboard` - Admin operational dashboard and stats
* `/admin/complaints` - Admin complaint management control board
* `/settings` - User settings page

---

## API Documentation

*Refer to the full [API.md](./docs/API.md) documentation file for detailed payload and parameter configurations.*

### Complaints API
* `POST /api/complaints`: File a new complaint (Resident)
* `GET /api/complaints`: List resident's complaints (Resident) or search all complaints (Admin, supports filtering query parameters)
* `GET /api/complaints/[id]`: Retrieve single complaint details (Owner or Admin)

### Complaint Status API
* `PATCH /api/complaints/[id]/status`: Update status and insert transaction audit trail entry (Admin only)

### Complaint Priority API
* `PATCH /api/complaints/[id]/priority`: Update complaint priority (Admin only)

### Notices API
* `GET /api/notices`: Fetch all society notices, sorted with important pinned first (Authenticated users)
* `POST /api/notices`: Publish a new announcement notice (Admin only)

### Admin Dashboard API
* `GET /api/admin/dashboard`: Fetch stat summaries and latest complaints list (Admin only)

---

## Database Schema

*Refer to the full [DATABASE.md](./docs/DATABASE.md) or [SYSTEM_DESIGN.md](./docs/SYSTEM_DESIGN.md) for deeper schema documentation.*

### Core Tables
1. **`user`**: Stores credentials, emails, authentication metadata, and role flags (`EMPLOYEE`, `MANAGER`, `ADMIN`, `SUPER_ADMIN`, `USER`).
2. **`complaint`**: Records title, category, description, photoUrl links, and active state status/priorities.
3. **`complaint_status_history`**: Append-only log auditing status changes (tracking before status, target status, editor, notes, and timestamp).
4. **`notice`**: Stores society announcement messages and urgency flags.
5. **`email_log`**: Diagnostic logs tracking email dispatch history.
6. **`app_settings`**: Stores global configs (e.g. `overdueThresholdDays`).

### Complaint Lifecycle Model
Complaints are initiated as `OPEN` status and `LOW` priority. Admins can transition them through `IN_PROGRESS` and `RESOLVED` states. Every state transition is written to the database inside a database transaction ensuring consistent states.

### Overdue Detection Model
A complaint is computed as overdue if its current status is not `RESOLVED` and the duration since `createdAt` exceeds the `overdueThresholdDays` defined in `app_settings`.

---

## System Design Write-up

### Architecture
The application runs on Next.js Server Components for layout templates with client-side dynamic interfaces using standard hooks and REST APIs. Database operations are handled using type-safe queries via Drizzle ORM.

### Complaint History Model
The current status resides directly on the `complaint` record, whereas history tracking is managed in the append-only `complaint_status_history` table. Both updates occur inside a single SQL transaction blocks.

### Overdue Detection
Overdue flags are computed on-the-fly dynamically at database query time, eliminating the risk of stored state drift.

### Photo Handling
Photos are stored as plain absolute URL strings pointing to external resources in this MVP, removing immediate binary upload dependencies.

### Notification Flow
An `email_log` table tracks delivery history. Sending transactions are stubbed for the hackathon MVP, logging messages to the terminal console, but are ready to plug in via transactional SMTP or API providers (such as Resend).

### Scalability and Future Extensions
1. **Background Job Queues**: Transition heavy procedures (emails, image compressions) into background processing queues.
2. **Database Partitioning**: Partition audit tables chronologically as historical rows scale.

---

## Local Setup

Follow these steps to set up the project locally:

```bash
# 1. Clone the repository
git clone <repo-url>
cd society-maintenance-tracker

# 2. Install dependencies
pnpm install

# 3. Create env file from example
cp .example.env .env

# 4. Push schema to database
pnpm drizzle:push

# 5. Seed the society database (development database only)
pnpm seed:society

# 6. Start the development server
pnpm dev
```

---

## Environment Variables

The project reads configuration keys from `.env`. The template variables are:

* `DATABASE_URL`: Connection string of your PostgreSQL database (Neon serverless).
* `AUTH_SECRET`: Secret key used to encrypt NextAuth cookies (Generate using `openssl rand -base64 32`).
* `NEXT_PUBLIC_APP_URL`: Local or hosted app address (defaults to `http://localhost:3000`).
* `AUTH_TRUST_HOST`: Required when deploying to Vercel.
* `RESEND_API_KEY`: API access key for Resend email service.
* `ATOMQUEST_EMAIL_FROM`: sender address for notification mailers.
* `EMAIL_SERVICE`: Enable email verification/2FA flows.

---

## How to Run

* **Development mode**:
  ```bash
  pnpm dev
  ```
* **Production mode**:
  ```bash
  pnpm build
  pnpm start
  ```

---

## Validation Commands

To verify application stability and code styling, run:

```bash
# Run lint check
pnpm lint

# Run typescript compilation check
pnpm typecheck

# Build optimized production packages
pnpm build
```

---

## Manual Testing Checklist

*Refer to the full [TESTING.md](./docs/TESTING.md) guide for E2E validation steps.*

- [x] Resident can register/login
- [x] Resident can create complaint
- [x] Resident can view own complaints
- [x] Admin can view all complaints
- [x] Admin can filter complaints
- [x] Admin can update status
- [x] Status update creates history row
- [x] Admin can update priority
- [x] Admin can view dashboard metrics
- [x] Admin can create important notice
- [x] Resident can view notices
- [x] Production build passes

---

## Screenshots

> Screenshots will be added after final deployment testing.

---

## Known Limitations

* **Photo Attachments**: Upload is limited to text URL input in this MVP. File upload integration is planned.
* **Email dispatching**: The email dispatch pipeline is stowed in dry-run mode (outputs to console logs). Transactional mail is disabled by default.
* **Real-time syncing**: Updates to complaints require dashboard or manual list refreshes; no WebSocket channels are active.
* **Legacy Code**: Some legacy PerformIQ database models and check-in pages remain in the project code but are completely hidden from active menus.

---

## Future Scope

1. **Active Storage Handlers**: Enable binary uploads for attachments.
2. **Email Notifications**: Activate Resend Integration for automated status alert emails.
3. **WebSockets**: Introduce real-time updates for status transitions.
4. **AI classification**: Use AI models to classify categories or assign initial priorities based on text descriptions.

---

## Submission Notes

* GitHub repository is public.
* Development is merged into the `main` branch.
* Environment secrets, `.next` caches, and `node_modules` folders are gitignored.
* Build verification passed and can be run by running standard build commands.