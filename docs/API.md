# API Documentation - Society Maintenance Tracker

This document provides details for all backend APIs implemented for the Society Maintenance Tracker.

All APIs return responses in a standardized JSON wrapper:
* **Success wrapper:**
  ```json
  {
    "ok": true,
    "data": {}
  }
  ```
* **Error wrapper:**
  ```json
  {
    "ok": false,
    "error": "Error message explanation"
  }
  ```

---

## 1. Complaints API

### Create Complaint
* **Method:** `POST`
* **Path:** `/api/complaints`
* **Access Level:** Resident
* **Request Body:**
  ```json
  {
    "title": "Leaking pipe in kitchen",
    "category": "Plumbing",
    "description": "The pipe under the sink is leaking water continuously.",
    "photoUrl": "https://example.com/uploads/leaking-pipe.jpg"
  }
  ```
  *Note: `photoUrl` is optional and can be left empty or set to `null`.*
* **Success Response (201 Created):**
  ```json
  {
    "ok": true,
    "data": {
      "complaint": {
        "id": "c7a6e1fa-6fbb-4e96-a94f-561b369c279c",
        "residentId": "user-uuid-123",
        "title": "Leaking pipe in kitchen",
        "category": "Plumbing",
        "description": "The pipe under the sink is leaking water continuously.",
        "photoUrl": "https://example.com/uploads/leaking-pipe.jpg",
        "status": "OPEN",
        "priority": "LOW",
        "resolvedAt": null,
        "createdAt": "2026-07-01T03:00:00.000Z",
        "updatedAt": null
      }
    }
  }
  ```
* **Error Response (400 Bad Request):**
  ```json
  {
    "ok": false,
    "error": "Invalid fields"
  }
  ```

### List Complaints
* **Method:** `GET`
* **Path:** `/api/complaints`
* **Access Level:** Resident or Admin (Behavior is role-scoped)
* **Query Parameters (Admin Only):**
  * `status` (string, optional, comma-separated) - e.g., `OPEN` or `OPEN,IN_PROGRESS`
  * `priority` (string, optional, comma-separated) - e.g., `HIGH,MEDIUM`
  * `category` (string, optional, comma-separated) - e.g., `Plumbing`
  * `from` (ISO datetime string, optional) - e.g., `2026-06-01T00:00:00Z`
  * `to` (ISO datetime string, optional) - e.g., `2026-07-01T00:00:00Z`
  * `overdueFirst` (`"true"` | `"false"`, optional)
* **Success Response (200 OK):**
  ```json
  {
    "ok": true,
    "data": {
      "complaints": [
        {
          "id": "c7a6e1fa-6fbb-4e96-a94f-561b369c279c",
          "residentId": "user-uuid-123",
          "title": "Leaking pipe in kitchen",
          "category": "Plumbing",
          "description": "The pipe under the sink is leaking water continuously.",
          "photoUrl": "https://example.com/uploads/leaking-pipe.jpg",
          "status": "OPEN",
          "priority": "LOW",
          "resolvedAt": null,
          "createdAt": "2026-07-01T03:00:00.000Z",
          "updatedAt": null
        }
      ]
    }
  }
  ```

### Get Complaint by ID
* **Method:** `GET`
* **Path:** `/api/complaints/[id]`
* **Access Level:** Resident (owner only) or Admin
* **Success Response (200 OK):**
  ```json
  {
    "ok": true,
    "data": {
      "complaint": {
        "id": "c7a6e1fa-6fbb-4e96-a94f-561b369c279c",
        "residentId": "user-uuid-123",
        "title": "Leaking pipe in kitchen",
        "category": "Plumbing",
        "description": "The pipe under the sink is leaking water continuously.",
        "photoUrl": "https://example.com/uploads/leaking-pipe.jpg",
        "status": "OPEN",
        "priority": "LOW",
        "resolvedAt": null,
        "createdAt": "2026-07-01T03:00:00.000Z",
        "updatedAt": null
      }
    }
  }
  ```
* **Error Response (404 Not Found):**
  ```json
  {
    "ok": false,
    "error": "Not found"
  }
  ```

---

## 2. Complaint Status API

### Transition Status
* **Method:** `PATCH`
* **Path:** `/api/complaints/[id]/status`
* **Access Level:** Admin
* **Request Body:**
  ```json
  {
    "status": "IN_PROGRESS",
    "note": "Plumber assigned and will visit today."
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "ok": true,
    "data": {
      "complaint": {
        "id": "c7a6e1fa-6fbb-4e96-a94f-561b369c279c",
        "residentId": "user-uuid-123",
        "title": "Leaking pipe in kitchen",
        "category": "Plumbing",
        "description": "The pipe under the sink is leaking water continuously.",
        "photoUrl": "https://example.com/uploads/leaking-pipe.jpg",
        "status": "IN_PROGRESS",
        "priority": "LOW",
        "resolvedAt": null,
        "createdAt": "2026-07-01T03:00:00.000Z",
        "updatedAt": "2026-07-01T03:15:00.000Z"
      }
    }
  }
  ```

---

## 3. Complaint Priority API

### Update Priority
* **Method:** `PATCH`
* **Path:** `/api/complaints/[id]/priority`
* **Access Level:** Admin
* **Request Body:**
  ```json
  {
    "priority": "HIGH"
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "ok": true,
    "data": {
      "complaint": {
        "id": "c7a6e1fa-6fbb-4e96-a94f-561b369c279c",
        "residentId": "user-uuid-123",
        "title": "Leaking pipe in kitchen",
        "category": "Plumbing",
        "description": "The pipe under the sink is leaking water continuously.",
        "photoUrl": "https://example.com/uploads/leaking-pipe.jpg",
        "status": "IN_PROGRESS",
        "priority": "HIGH",
        "resolvedAt": null,
        "createdAt": "2026-07-01T03:00:00.000Z",
        "updatedAt": "2026-07-01T03:20:00.000Z"
      }
    }
  }
  ```

---

## 4. Notices API

### List Notices
* **Method:** `GET`
* **Path:** `/api/notices`
* **Access Level:** Authenticated User
* **Success Response (200 OK):**
  ```json
  {
    "ok": true,
    "data": {
      "notices": [
        {
          "id": "notice-uuid-1",
          "title": "Water Shutdown Announcement",
          "body": "There will be a water supply outage from 10 AM to 2 PM for pipe cleaning.",
          "isImportant": true,
          "createdById": "admin-uuid-1",
          "createdAt": "2026-07-01T01:00:00.000Z",
          "updatedAt": null
        }
      ]
    }
  }
  ```

### Create Notice
* **Method:** `POST`
* **Path:** `/api/notices`
* **Access Level:** Admin
* **Request Body:**
  ```json
  {
    "title": "Water Shutdown Announcement",
    "body": "There will be a water supply outage from 10 AM to 2 PM for pipe cleaning.",
    "isImportant": true
  }
  ```
* **Success Response (201 Created):**
  ```json
  {
    "ok": true,
    "data": {
      "notice": {
        "id": "notice-uuid-1",
        "title": "Water Shutdown Announcement",
        "body": "There will be a water supply outage from 10 AM to 2 PM for pipe cleaning.",
        "isImportant": true,
        "createdById": "admin-uuid-1",
        "createdAt": "2026-07-01T01:00:00.000Z",
        "updatedAt": null
      }
    }
  }
  ```

---

## 5. Admin Dashboard API

### Get Dashboard Statistics
* **Method:** `GET`
* **Path:** `/api/admin/dashboard`
* **Access Level:** Admin
* **Success Response (200 OK):**
  ```json
  {
    "ok": true,
    "data": {
      "complaintCountsByStatus": [
        { "status": "OPEN", "count": 5 },
        { "status": "IN_PROGRESS", "count": 2 },
        { "status": "RESOLVED", "count": 12 }
      ],
      "complaintCountsByCategory": [
        { "category": "Plumbing", "count": 8 },
        { "category": "Electrical", "count": 4 },
        { "category": "Security", "count": 1 }
      ],
      "overdueCount": 3,
      "highPriorityOpenCount": 1,
      "latestComplaints": [
        {
          "id": "c7a6e1fa-6fbb-4e96-a94f-561b369c279c",
          "title": "Leaking pipe in kitchen",
          "category": "Plumbing",
          "status": "OPEN",
          "priority": "LOW",
          "residentId": "user-uuid-123",
          "residentName": "Arjun Mehta",
          "residentEmail": "employee@atomquest.demo",
          "createdAt": "2026-07-01T03:00:00.000Z",
          "resolvedAt": null
        }
      ]
    }
  }
  ```
