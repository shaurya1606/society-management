# Manual Testing Guide - Society Maintenance Tracker

This document provides a manual testing checklist and verification guide for the evaluator to validate the Society Maintenance Tracker application.

---

## 1. Authentication & Role Scopes

* [ ] **Pre-seeded Demo Accounts Login**:
  * Navigate to the login page (`/login`).
  * Verify you can click one-click fill buttons or enter the credentials manually.
  * Verify successful login redirects to `/dashboard`.
* [ ] **Navbar Layout Scoping**:
  * Log in as a resident (Employee/User): Verify `My Complaints`, `New Complaint`, and `Notices` are visible. Verify `Admin Dashboard` and `Admin Complaints` links are **hidden**.
  * Log in as an Admin: Verify `Admin Dashboard` and `Admin Complaints` links are **visible** alongside the general links.

---

## 2. Resident Flows

* [ ] **Create New Complaint (`/complaints/new`)**:
  * Navigate to `/complaints/new` (or click "File a New Complaint" on the home dashboard).
  * Leave required fields blank: Click Submit and verify form validation errors display.
  * Fill in Title, Category (e.g. Plumbing), Description, and a mock Photo URL: Click Submit and verify the success notification displays.
  * Verify the application redirects to `/complaints` after successful submission.
* [ ] **View My Complaints (`/complaints`)**:
  * Verify the newly created complaint appears at the top of the list.
  * Check that details (Title, Category, Description, and Creation Date) are rendered correctly.
  * Verify the status badge defaults to `OPEN` and priority badge defaults to `LOW`.
  * Click on the "View Attachment File" link (if a photo URL was supplied) and verify it opens correctly.

---

## 3. Admin Flows

* [ ] **Admin Complaints Management (`/admin/complaints`)**:
  * Log in as an Admin.
  * Navigate to `/admin/complaints`. Verify you can see all complaints submitted in the system.
  * Verify the filter controls (Status, Priority, Category keyword search, and Show Overdue First checkbox) fetch filtered lists dynamically on click.
* [ ] **Transition Complaint Status**:
  * On a complaint, select `IN_PROGRESS` or `RESOLVED` in the Status dropdown.
  * Enter an optional update note (e.g., "Plumber scheduled for afternoon visit").
  * Click the "Update" button under Update Status.
  * Verify a success message displays, the complaint list refreshes, and the status badge updates.
* [ ] **Update Complaint Priority**:
  * On a complaint, select `HIGH` or `MEDIUM` in the Priority dropdown.
  * Click the "Update" button under Update Priority.
  * Verify a success message displays, the complaint list refreshes, and the priority badge updates.
* [ ] **Admin Dashboard (`/admin/dashboard`)**:
  * Navigate to `/admin/dashboard`.
  * Verify the Stat Cards render counts for Overdue complaints, High Priority Open complaints, and total counts by status.
  * Verify the category count breakdown aligns with actual complaints.
  * Verify the "Latest Complaints Activity" list displays recent complaints with resident details (Resident Name, Resident Email, and Creation Date).

---

## 4. Notices & Announcements Flow

* [ ] **Read Notices (`/notices`)**:
  * Navigate to `/notices`.
  * Verify you can see society announcements.
  * Check that notices marked as "Important" are pinned at the top and highlighted with a distinct amber border/badge.
* [ ] **Publish New Notice (Admin Only)**:
  * Log in as an Admin and navigate to `/notices`.
  * Verify the "Publish New Notice" form is visible in the sidebar.
  * Fill in Title, Body, and check "Mark as Important": Click "Publish Announcement".
  * Verify the success message displays, the form clears, and the notice list refreshes automatically.
  * Verify the new notice is pinned to the top of the list.
* [ ] **Notice Security Scope (Non-Admin)**:
  * Log in as a resident and navigate to `/notices`.
  * Verify the "Publish New Notice" form is **completely hidden**.
