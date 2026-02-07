# Giving Her E.V.E – System Architecture (Admin & Dynamic Website)

## 1. Introduction
This document describes the proposed **system architecture** for the *Giving Her E.V.E* platform, focusing on:
- A powerful **Admin system** for managing content and operations
- A **fully dynamic public website** with minimal hard-coded content
- Clean separation of concerns for scalability, security, and maintainability

The architecture follows modern best practices used in NGO platforms, SaaS systems, and headless CMS-driven websites.

---

## 2. Architectural Goals

The system is designed to:
- Eliminate hard-coded text and values in the frontend
- Allow admins to update campaigns, stories, and content without touching code
- Support future growth (mobile app, integrations, reporting)
- Enforce security and data integrity

Core principles:
- **Frontend is presentation-only**
- **Backend owns business logic and truth**
- **Database stores all dynamic content**

---

## 3. High-Level System Architecture

```
+--------------------+        +----------------------+
|                    |        |                      |
|   Admin Dashboard  |        |   Public Website     |
|   (React)          |        |   (React)            |
|                    |        |                      |
+---------+----------+        +----------+-----------+
          |                                |
          |        REST / JSON API         |
          +--------------+----------------+
                         |
                 +-------v-------+
                 |               |
                 |   Backend     |
                 |   API Layer   |
                 |               |
                 +-------+-------+
                         |
                 +-------v-------+
                 |               |
                 |   Database    |
                 |               |
                 +---------------+
```

### Explanation
- Both the **Admin Dashboard** and **Public Website** communicate only with the backend
- The backend exposes APIs for content, campaigns, donations, and admin operations
- The database is never accessed directly by the frontend

---

## 4. Logical Layered Architecture

```
Presentation Layer (React)
│
├── Public Website
│   ├── Home
│   ├── Campaigns
│   ├── Stories
│   ├── About
│   └── Contact
│
├── Admin Dashboard
│   ├── Content Management
│   ├── Campaign Management
│   ├── Donations
│   └── Messages
│
└── API Communication Layer (HTTP)

------------------------------------------------

Application Layer (Backend)
│
├── Authentication & Authorization
├── Business Logic
├── Validation
├── Content Workflow (Draft / Publish)
└── Reporting & Aggregation

------------------------------------------------

Data Layer
│
├── Relational Database
├── Media Storage (Images)
└── Audit Logs
```

---

## 5. Admin System Architecture

### 5.1 Admin Responsibilities

The Admin system acts as a **content management and operational control center**.

Admin capabilities:
- Create, edit, publish, and archive content
- Manage campaigns and fundraising goals
- View donations and campaign progress
- Respond to contact messages
- Upload and manage media assets

---

### 5.2 Admin Functional Modules

```
Admin Dashboard
│
├── Authentication
│   └── Login / Logout
│
├── Content Management
│   ├── Success Stories
│   ├── Testimonials
│   ├── Community Updates
│   └── FAQs
│
├── Campaign Management
│   ├── Create Campaign
│   ├── Edit Campaign
│   ├── Activate / Complete
│   └── Campaign Updates
│
├── Donations
│   └── View Transactions (Read-only)
│
├── Communication
│   ├── Contact Messages
│   └── Newsletter Subscribers
│
└── Media Library
    ├── Image Uploads
    └── Asset Management
```

Each module maps to:
- One or more database tables
- Backend API endpoints
- Admin UI pages

---

## 6. Dynamic Content Architecture

### 6.1 Content Ownership

All dynamic content lives in the **backend + database**, not in JSX.

Frontend responsibility:
- Fetch data
- Render UI
- Handle loading and error states

Backend responsibility:
- Validate content
- Enforce publish rules
- Expose only published content publicly

---

### 6.2 Draft vs Published Workflow

```
Admin creates content
        ↓
Saved as DRAFT
        ↓
Admin reviews
        ↓
PUBLISHED
        ↓
Visible on Public Website
```

Benefits:
- Safe editing
- No accidental public changes
- Professional content workflow

---

## 7. Backend API Architecture

### 7.1 Public APIs (Unauthenticated)

```
GET /api/campaigns
GET /api/campaigns/active
GET /api/stories
GET /api/testimonials
GET /api/faqs
```

These endpoints:
- Return only published content
- Are cached for performance

---

### 7.2 Admin APIs (Authenticated)

```
POST   /api/admin/campaigns
PUT    /api/admin/campaigns/{id}
DELETE /api/admin/campaigns/{id}

POST   /api/admin/stories
PUT    /api/admin/stories/{id}
```

Security:
- Admin-only access
- Token-based authentication

---

## 8. Data Architecture Overview

### Example Core Entities

```
Campaign
- id
- title
- description
- goal_amount
- amount_raised
- status
- start_date
- end_date

Story
- id
- title
- excerpt
- content
- image_url
- status

Donation
- id
- amount
- campaign_id
- donor_reference
- created_at
```

This structure ensures:
- Data normalization
- Easy reporting
- Clear relationships

---

## 9. Scalability & Future Extensions

This architecture supports:
- Mobile applications
- Third-party donation gateways
- Analytics dashboards
- Role-based access (Admin, Editor)
- Internationalization (multiple languages)

---

## 10. Conclusion

The proposed system architecture transforms *Giving Her E.V.E* from a static website into a **dynamic, scalable, and professional platform**.

Key takeaways:
- JSX defines layout, not content
- Backend controls data and workflow
- Admin system doubles as a custom CMS

This foundation allows the platform to grow sustainably while empowering non-technical administrators to manage content confidently.

