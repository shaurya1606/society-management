# Deployment Guide - Society Maintenance Tracker

This document provides deployment guidelines for deploying a production instance of the Society Maintenance Tracker application.

---

## 1. Pre-deployment Checklist

Ensure the following tasks are completed before initiating the production build:

| # | Task | Description | Status |
|---|------|-------------|--------|
| 1 | Database Provisioning | Set up a production PostgreSQL instance (e.g. Neon serverless). | Required |
| 2 | Environment Configuration | Prepare production secrets (`AUTH_SECRET`, `DATABASE_URL`). | Required |
| 3 | Middleware Config | Set `AUTH_TRUST_HOST=true` and `NEXT_PUBLIC_APP_URL` to the public address. | Required |
| 4 | Database Migrations | Run `pnpm drizzle:push` or apply SQL migration scripts against the prod DB. | Required |
| 5 | Provision Admins | Insert or signup initial administrative accounts. | Required |

---

## 2. Environment Variables

Define these environment keys in your target hosting platform (e.g., Vercel, Netlify, or VPS):

```env
DATABASE_URL=postgresql://user:password@hostname/dbname?sslmode=require
AUTH_SECRET=your-secure-auth-secret
NEXT_PUBLIC_APP_URL=https://society-maintenance-tracker.vercel.app
AUTH_TRUST_HOST=true
```

Do not commit these credentials to your public repository.

---

## 3. Build & Run

Run these commands inside your build environment:

```bash
# 1. Install dependencies
pnpm install

# 2. Compile and package the Next.js application
pnpm build

# 3. Start the production server
pnpm start
```

*Note: The Next.js production build automatically compiles API routes and the custom authentication `proxy.ts` middleware.*

---

## 4. Platform Notes

* **Vercel**: Fully compatible out-of-the-box. Add variables in the Vercel dashboard. The Edge-runtime middleware and Neon Serverless driver resolve seamlessly.
* **Self-hosted VPS**: Use `pm2` or a Docker container to run the compiled output. A reverse proxy (such as Nginx) should handle SSL encryption.
