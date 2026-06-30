# Database Schema - Society Maintenance Tracker

This document describes the PostgreSQL database schema for the Society Maintenance Tracker application as defined in `src/lib/dbconfig/schema.ts` (authentication & users) and `src/lib/dbconfig/society.ts` (society domain models).

---

## 1. Authentication & Users

### `user` (usersTable)
Stores user accounts, credentials, and access control roles.
* **id**: `text PK` (UUID)
* **name**: `text` (nullable)
* **email**: `text unique` (non-nullable)
* **emailVerified**: `timestamp` (nullable)
* **image**: `text` (nullable)
* **password**: `text` (nullable) - bcrypt password hash for credentials provider
* **role**: `roleEnum` (non-nullable, defaults to `EMPLOYEE`)
  * Values: `EMPLOYEE`, `MANAGER`, `ADMIN`, `SUPER_ADMIN`, `USER`
* **department**: `text` (nullable)
* **managerId**: `text FK -> user.id` (nullable)
* **isTwoFactorEnabled**: `boolean` (default `false`)
* **twoFactorConfirmationId**: `text` (nullable)
* **createdAt**: `timestamp` (defaults to current time)
* **updatedAt**: `timestamp` (updates automatically on modifications)

### NextAuth Adapter Tables
* **`account`**: Stores OAuth provider links.
* **`verificationToken`**: Email validation codes.
* **`resetPasswordToken`**: Reset password codes.
* **`twoFactorTokens`**: 2FA challenge logs.
* **`twoFactorConfirmation`**: Confirmed 2FA sessions.

---

## 2. Society Maintenance Domain

### `complaint` (complaintsTable)
Stores maintenance complaints filed by residents.
* **id**: `text PK` (UUID)
* **residentId**: `text FK -> user.id` (non-nullable, cascade restrict)
* **title**: `text` (non-nullable)
* **category**: `text` (non-nullable)
* **description**: `text` (non-nullable)
* **photoUrl**: `text` (nullable)
* **status**: `complaintStatusEnum` (non-nullable, defaults to `'OPEN'`)
  * Values: `OPEN`, `IN_PROGRESS`, `RESOLVED`
* **priority**: `complaintPriorityEnum` (non-nullable, defaults to `'MEDIUM'`)
  * Values: `LOW`, `MEDIUM`, `HIGH`
* **resolvedAt**: `timestamp` (nullable) - populated when status transitions to `RESOLVED`
* **createdAt**: `timestamp` (defaults to current time)
* **updatedAt**: `timestamp` (updates automatically on modifications)

### `complaint_status_history` (complaintStatusHistoryTable)
Append-only log auditing status changes over time.
* **id**: `text PK` (UUID)
* **complaintId**: `text FK -> complaint.id` (non-nullable, cascade delete)
* **fromStatus**: `complaintStatusEnum` (non-nullable)
* **toStatus**: `complaintStatusEnum` (non-nullable)
* **actorId**: `text FK -> user.id` (non-nullable, cascade restrict) - user making the update
* **note**: `text` (nullable) - optional explanation/comments on status update
* **createdAt**: `timestamp` (defaults to current time)

### `notice` (noticesTable)
Stores society-wide announcements published by the management.
* **id**: `text PK` (UUID)
* **title**: `text` (non-nullable)
* **body**: `text` (non-nullable)
* **isImportant**: `boolean` (non-nullable, defaults to `false`) - important notices pin to top
* **createdById**: `text FK -> user.id` (non-nullable, cascade restrict) - admin who posted
* **createdAt**: `timestamp` (defaults to current time)
* **updatedAt**: `timestamp` (updates automatically on modifications)

### `email_log` (emailLogsTable)
Logs notifications tracking diagnostic alerts.
* **id**: `text PK` (UUID)
* **recipientEmail**: `text` (non-nullable)
* **type**: `emailLogTypeEnum` (non-nullable)
  * Values: `STATUS_CHANGE`, `IMPORTANT_NOTICE`
* **relatedComplaintId**: `text FK -> complaint.id` (nullable, set null on delete)
* **relatedNoticeId**: `text FK -> notice.id` (nullable, set null on delete)
* **status**: `emailDeliveryStatusEnum` (non-nullable, defaults to `'SENT'`)
  * Values: `SENT`, `FAILED`
* **createdAt**: `timestamp` (defaults to current time)

### `app_settings` (appSettingsTable)
Global configuration variables.
* **id**: `text PK` (UUID)
* **overdueThresholdDays**: `integer` (non-nullable, default `7`) - threshold in days before a complaint is marked as overdue
* **createdAt**: `timestamp` (defaults to current time)
* **updatedAt**: `timestamp` (updates automatically on modifications)

---

## 3. Relationships Diagram

```
user (manager_id) ──► user
user ──► complaint (residentId)
complaint ──► complaint_status_history (complaintId)
user ──► complaint_status_history (actorId)
user ──► notice (createdById)
complaint ◄── email_log (relatedComplaintId)
notice ◄── email_log (relatedNoticeId)
```
