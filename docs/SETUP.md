# Local Setup - Society Maintenance Tracker

This document provides a guide to setting up and running the Society Maintenance Tracker application on your local machine.

---

## 1. Prerequisites
* **Node.js**: Version 20.x or higher
* **Package Manager**: `pnpm` (or `npm`/`yarn`)
* **Database**: PostgreSQL (Neon serverless or local PostgreSQL instance)

---

## 2. Installation Steps

```bash
# 1. Clone the repository
git clone <repository-url>
cd society-maintenance-tracker

# 2. Install dependencies
pnpm install
```

---

## 3. Environment Variables Setup

Copy the example template:
```bash
cp .example.env .env
```
Open `.env` and configure the following parameters:

* `DATABASE_URL`: Your PostgreSQL database connection string.
* `AUTH_SECRET`: Secret token used to sign cookies. Generate a strong key using:
  ```bash
  openssl rand -base64 32
  ```

---

## 4. Database Setup

Drizzle ORM is used to sync schemas. Push the schema to your database:

```bash
pnpm drizzle:push
```

---

## 5. Running the Application

* **Development mode**:
  ```bash
  pnpm dev
  ```
  Open [http://localhost:3000](http://localhost:3000) to view the application.

* **Production mode**:
  ```bash
  pnpm build
  pnpm start
  ```
