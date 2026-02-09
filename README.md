<div align="center">

# 🏢 ERP System

### Enterprise Resource Planning — Multi-Tenant Platform

[![Live Demo](https://img.shields.io/badge/Live_Demo-erp--sys--blue.vercel.app-0070f3?style=for-the-badge&logo=vercel)](https://erp-sys-blue.vercel.app)
[![API](https://img.shields.io/badge/API-erpsys--production.up.railway.app-0B0D17?style=for-the-badge&logo=railway)](https://erpsys-production.up.railway.app/api/health)
[![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Laravel](https://img.shields.io/badge/Laravel_12-FF2D20?style=flat-square&logo=laravel&logoColor=white)](https://laravel.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://postgresql.org)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)](https://docker.com)

</div>

---

## 📋 Table of Contents

1. [Introduction](#1-introduction)
2. [Technology Stack](#2-technology-stack)
3. [System Architecture](#3-system-architecture)
4. [Multi-Tenant Design](#4-multi-tenant-design)
5. [Modular Structure](#5-modular-structure)
6. [Role-Based Access Control](#6-role-based-access-control-rbac)
7. [Accounting Module](#7-accounting-module--feature-breakdown)
8. [Security](#8-security)
9. [Deployment & Infrastructure](#9-deployment--infrastructure)
10. [User Flow](#10-user-flow)
11. [Live Demo Environment](#11-live-demo-environment)
12. [Scalability & Future Roadmap](#12-scalability--future-roadmap)
13. [Summary](#13-summary)

---

## 1. Introduction

A modern, cloud-hosted **Enterprise Resource Planning (ERP)** system designed to centralize and streamline business operations across multiple organizations from a single platform.

**Key highlights:**

- **Multi-tenant architecture** — complete data isolation between companies
- **Modular design** — activate only the modules each company needs
- **Role-based access** — granular permissions for Super Admins, Admins, and Users
- **Cloud-native deployment** — fully containerized, auto-scaling, zero-downtime
- **Production-ready** — live demo available with pre-loaded sample data

---

## 2. Technology Stack

| Layer | Technology | Purpose |
|:---|:---|:---|
| **Frontend** | React 19, Material UI 7, Vite | Responsive SPA with modern component library |
| **Backend** | Laravel 12 (PHP 8.2) | RESTful API with modular service architecture |
| **Database** | PostgreSQL | ACID-compliant relational data store |
| **Authentication** | Laravel Sanctum | Stateless token-based API authentication |
| **Web Server** | Nginx + PHP-FPM + Supervisor | High-performance request handling |
| **Containerization** | Docker | Reproducible builds and isolated runtime |
| **Backend Hosting** | Railway | Managed container deployment with auto-TLS |
| **Frontend Hosting** | Vercel | Edge-cached CDN with instant global delivery |

---

## 3. System Architecture

```
                    ┌──────────────────────────────────┐
                    │          End Users               │
                    │    (Browser / Mobile Browser)     │
                    └──────────────┬───────────────────┘
                                   │
                          HTTPS (TLS 1.3)
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         │                         │                         │
         ▼                         ▼                         ▼
┌─────────────────┐    ┌──────────────────────┐    ┌─────────────────┐
│   Vercel CDN    │    │   Railway Platform   │    │   Railway DB    │
│   ───────────   │    │   ────────────────   │    │   ──────────    │
│                 │    │                      │    │                 │
│  React 19 SPA   │───►│  Nginx (Reverse      │───►│  PostgreSQL    │
│  Static Assets  │REST│  Proxy + TLS)        │TCP │  Managed       │
│  Global Edge    │API │       │               │    │  Encrypted     │
│  Cache          │    │  PHP-FPM 8.2         │    │  Auto-Backup   │
│                 │    │  Laravel 12           │    │                 │
│                 │    │       │               │    │                 │
│                 │    │  Supervisor           │    │                 │
│                 │    │  (Process Manager)    │    │                 │
└─────────────────┘    └──────────────────────┘    └─────────────────┘
```

**Data flow:**
1. Users access the React SPA served from Vercel's global CDN
2. Frontend communicates with the backend via secure REST API calls
3. Laravel processes requests, enforces RBAC, applies tenant scoping
4. Data is read/written to PostgreSQL with automatic company isolation

---

## 4. Multi-Tenant Design

The system supports **unlimited companies** under a single deployment. Each company operates in a fully isolated environment:

| Aspect | Implementation |
|:---|:---|
| **Data Isolation** | Every database query is automatically scoped to the current tenant via the `BelongsToTenant` trait |
| **User Scoping** | Users belong to exactly one company and can only access their company's data |
| **Module Isolation** | Each company has its own set of activated modules |
| **Cross-Tenant Prevention** | Middleware + database-level constraints prevent any cross-company data access |
| **Super Admin Override** | Only the platform Super Admin can operate across all tenants |

> **Guarantee:** A company can never view, modify, or even detect the existence of another company's data.

---

## 5. Modular Structure

The ERP is built using a **plug-and-play modular architecture**. Modules can be activated or deactivated per company independently, allowing tailored configurations for each organization.

| Module | Core Features | Status |
|:---|:---|:---:|
| **Accounting** | Chart of Accounts, Journal Entries, Invoices, Payments, Reports | ✅ Live |
| **HR** | Employee Records, Departments, Attendance, Leave Management | 🔜 Planned |
| **Inventory** | Products, Stock Tracking, Purchase Orders, Warehouses | 🔜 Planned |

**Architecture benefits:**
- New modules are self-contained packages with their own Models, Controllers, and Routes
- Activating a module for a company requires zero code changes — it's a configuration toggle
- Modules cannot interfere with each other's data or logic
- Third-party modules can be integrated following the same contract

---

## 6. Role-Based Access Control (RBAC)

The system enforces **three distinct access tiers**, each with clearly defined boundaries:

### 🟣 Super Admin — Platform Owner

> Full administrative control over the entire platform.

| Permission | Scope | Description |
|:---|:---:|:---|
| Manage Companies | Global | Create, edit, activate, and deactivate tenant companies |
| Assign Modules | Global | Enable or disable modules per company |
| Manage All Users | Global | View and manage every user across all companies |
| Platform Dashboard | Global | System-wide statistics, health, and activity overview |

### 🔵 Company Admin — Organization Manager

> Full control within their own company's boundaries.

| Permission | Scope | Description |
|:---|:---:|:---|
| Manage Users | Company | Add, edit, deactivate, and remove users within the company |
| View Reports | Company | Access financial summaries, revenue, and expense analytics |
| Full Accounting Access | Company | Manage Chart of Accounts, Journal Entries, Invoices, Payments |
| Company Configuration | Company | Update company settings and preferences |

### 🟢 Company User — Staff Member

> Operational access to assigned module workflows.

| Permission | Scope | Description |
|:---|:---:|:---|
| Accounting Operations | Company | Create and manage Journal Entries, Invoices, and Payments |
| View Chart of Accounts | Company | Browse the account structure (read-only) |
| Daily Workflows | Company | Execute day-to-day accounting tasks |

> ⚠️ **Restriction:** Users cannot manage other users, view reports, or access any administrative settings.

---

## 7. Accounting Module — Feature Breakdown

### 7.1 Chart of Accounts
- Pre-configured **5-category** account structure: Assets, Liabilities, Equity, Revenue, Expenses
- Custom account creation with unique account codes
- Account type classification and hierarchical grouping
- Per-company account isolation

### 7.2 Journal Entries
- **Double-entry bookkeeping** — every entry enforces balanced debits and credits
- Multi-line entries with individual account targeting
- Reference numbers and descriptions for complete audit trails
- Date-based entry tracking with chronological ordering

### 7.3 Invoices
- Client invoice creation with itemized totals
- **Status lifecycle:** `Draft` → `Sent` → `Paid` → `Overdue`
- Automatic total calculation
- Client name and reference tracking
- Invoices automatically generate accounting journal entries:
  - Debit: Accounts Receivable
  - Credit: Revenue
- Each invoice is linked to its originating journal entry for auditability

### 7.4 Payments
- Payment recording linked to specific invoices
- **Multiple payment methods:** Cash, Bank Transfer, Check, Online Payment
- Payment reference numbers for bank reconciliation
- Notes field for additional context
- Payments automatically generate accounting journal entries:
  - Debit: Cash / Bank
  - Credit: Accounts Receivable
- Payments do not affect revenue, ensuring proper revenue recognition



### 7.5 Financial Reports *(Admin-only)*
- Revenue and expense summaries per company
- Filterable by custom date ranges
- Dashboard-level analytics with key financial indicators

### 7.6 Trial Balance
- Automatically generated per company and date range
- Aggregates debit and credit balances for all accounts
- Ensures total debits always equal total credits

---

## 8. Security

| Layer | Implementation | Detail |
|:---|:---|:---|
| **Authentication** | Laravel Sanctum | Stateless API tokens, automatic expiration, secure session handling |
| **Authorization** | Role-based middleware | Every API endpoint validates the user's role before processing |
| **Tenant Isolation** | `BelongsToTenant` trait | Queries are automatically scoped — no manual filtering needed |
| **Transport Security** | TLS 1.3 (HTTPS) | Enforced on all communication channels (API + frontend) |
| **Password Policy** | Server-enforced | Minimum 8 characters with mixed case, numbers, and special characters |
| **CORS Protection** | Whitelist-only | Only registered frontend origins can call the API |
| **Input Validation** | Laravel Form Requests | All inputs are validated and sanitized before processing |
| **SQL Injection Prevention** | Eloquent ORM | Parameterized queries by default, no raw SQL exposure |

---

## 9. Deployment & Infrastructure

### Production Environment

| Component | Platform | Endpoint |
|:---|:---|:---|
| **Backend API** | Railway (Docker Container) | `https://erpsys-production.up.railway.app` |
| **Frontend App** | Vercel (Edge CDN) | `https://erp-sys-blue.vercel.app` |
| **Database** | Railway (Managed PostgreSQL) | Private internal network |

### Infrastructure Highlights

| Feature | Description |
|:---|:---|
| **Containerized Deployment** | Docker image with Nginx + PHP-FPM + Supervisor for production reliability |
| **Zero-Downtime Deploys** | Rolling container updates with health check gates |
| **Auto-Scaling Frontend** | Vercel's edge network serves static assets from 70+ global locations |
| **Health Monitoring** | Automated `/api/health` endpoint polled every 30 seconds |
| **Automated Migrations** | Database schema updates run automatically on each deployment |
| **Encrypted at Rest** | PostgreSQL data encrypted on disk with managed key rotation |
| **Git-Driven CI/CD** | Push to `main` triggers automatic build → test → deploy pipeline |

---

## 10. User Flow

```
                              ┌───────────┐
                              │   Login   │
                              └─────┬─────┘
                                    │
                     ┌──────────────┼──────────────┐
                     │              │              │
                     ▼              ▼              ▼
            ┌────────────┐  ┌────────────┐  ┌────────────┐
            │ Super Admin│  │   Admin    │  │    User    │
            └──────┬─────┘  └──────┬─────┘  └──────┬─────┘
                   │               │               │
         ┌─────────┴──────┐  ┌────┴─────────┐     │
         │ Platform       │  │ Company      │     │
         │ Dashboard      │  │ Dashboard    │     │
         │                │  │              │     │
         ├─► Companies    │  ├─► Users      │     │
         │   (CRUD)       │  │   (CRUD)     │     │
         │                │  │              │     │
         ├─► Module       │  ├─► Reports &  │     │
         │   Assignment   │  │   Analytics  │     │
         │                │  │              │     │
         └─► User         │  └─► Accounting─┤     │
             Management   │       Module    │     │
                          │       │         │     │
                          │  ┌────┴────┐    │     │
                          │  │         │    │     │
                          │  ▼         ▼    ▼     ▼
                          │  ┌─────────────────────────┐
                          │  │    Accounting Module     │
                          │  │  ─────────────────────   │
                          │  │  • Chart of Accounts     │
                          │  │  • Journal Entries       │
                          │  │  • Invoices              │
                          │  │  • Payments              │
                          │  └─────────────────────────┘
                          │
                          └──────────────────────────────
```

---

## 11. Live Demo Environment

The system is deployed with **3 pre-configured companies** and sample accounting data for immediate evaluation.

### 🌐 Access URLs

| | URL |
|:---|:---|
| **Frontend** | https://erp-sys-blue.vercel.app |
| **Backend API** | https://erpsys-production.up.railway.app |

### 🏢 Demo Companies

| Company | Accounts | Journal Entries | Invoices | Payments | Active Modules |
|:---|:---:|:---:|:---:|:---:|:---|
| **Comp1** | 10 | 6 | 4 | 1 | Accounting |
| **TechVision Solutions** | 10 | 7 | 4 | 1 | Accounting, HR |
| **GlobalMart Industries** | 10 | 7 | 4 | 1 | Accounting, Inventory |

### 🔑 Demo Login Credentials

| Role | Email | Password |
|:---|:---|:---|
| **Super Admin** | `john@example.com` | `ErpSuperAdmin2026!X` |
| | | |
| **Comp1 — Admin** | `admin@gmail.com` | `Password123123..` |
| **Comp1 — User** | `fatima@comp1.com` | `UserPass2026!` |
| **Comp1 — User** | `youssef@comp1.com` | `UserPass2026!` |
| **Comp1 — User** | `layla@comp1.com` | `UserPass2026!` |
| | | |
| **TechVision — Admin** | `sara@techvision.com` | `SecurePass2026!` |
| **TechVision — User** | `khaled@techvision.com` | `UserPass2026!` |
| **TechVision — User** | `noor@techvision.com` | `UserPass2026!` |
| **TechVision — User** | `ali@techvision.com` | `UserPass2026!` |
| | | |
| **GlobalMart — Admin** | `omar@globalmart.com` | `SecurePass2026!` |
| **GlobalMart — User** | `hana@globalmart.com` | `UserPass2026!` |
| **GlobalMart — User** | `ziad@globalmart.com` | `UserPass2026!` |
| **GlobalMart — User** | `mona@globalmart.com` | `UserPass2026!` |

> **Tip:** Log in as different roles to see how the interface and available features change based on permissions.

---

## 12. Scalability & Future Roadmap

The modular architecture is designed to scale horizontally. Upcoming capabilities:

| Phase | Module / Feature | Description |
|:---:|:---|:---|
| **Phase 2** | HR Module | Employee records, departments, attendance tracking, leave management |
| **Phase 2** | Inventory Module | Product catalog, stock levels, purchase orders, warehouse management |
| **Phase 3** | CRM Module | Customer management, sales pipeline, communication history |
| **Phase 3** | Payroll Module | Salary computation, deductions, payslip generation |
| **Phase 4** | Advanced Reporting | Exportable PDF & Excel reports, interactive dashboard charts |
| **Phase 4** | Audit Logs | Full activity tracking across all modules for compliance |
| **Future** | Multi-Currency | International transaction handling with exchange rate support |
| **Future** | Arabic / RTL | Full localization and right-to-left layout for MENA region |

---

## 13. Summary

| | |
|:---|:---|
| **Architecture** | Multi-tenant, Modular, RESTful API |
| **Companies Supported** | Unlimited — each fully isolated |
| **Users per Company** | Unlimited — with role-based permissions |
| **Active Modules** | Accounting *(HR & Inventory next)* |
| **Access Levels** | Super Admin → Admin → User |
| **Deployment** | Cloud-hosted, Dockerized, CI/CD automated |
| **Security** | Token auth, RBAC middleware, tenant isolation, TLS encryption |
| **Status** | ✅ **Production — Live Demo Available** |

---


**[Open Live Demo →](https://erp-sys-blue.vercel.app)**


