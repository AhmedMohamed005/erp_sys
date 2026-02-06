# ERP System - Complete Application Structure & Guide

> **Stack:** Laravel 12 · PHP 8.3 · PostgreSQL · Sanctum API Auth  
> **Architecture:** Multi-Tenant, Modular, Double-Entry Accounting

---

## Table of Contents

1. [Project Structure](#1-project-structure)
2. [What Has Been Implemented](#2-what-has-been-implemented)
3. [How Multi-Tenancy Works (Company Separation)](#3-how-multi-tenancy-works-company-separation)
4. [How Modules Work (Add / Remove / Toggle)](#4-how-modules-work-add--remove--toggle)
5. [Roles & Permissions](#5-roles--permissions)
6. [API Endpoints Summary](#6-api-endpoints-summary)
7. [How to Add a New Module (Developer Guide)](#7-how-to-add-a-new-module-developer-guide)
8. [Database Schema Overview](#8-database-schema-overview)

---

## 1. Project Structure

```
Erp_project/
│
├── app/
│   ├── Constants/
│   │   └── Roles.php                    # Role constants (super_admin, admin, user)
│   │
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AuthController.php       # Login, Register, Logout, User Info
│   │   │   ├── SuperAdminController.php # Company & Module management
│   │   │   ├── Core/
│   │   │   │   ├── CompanyRegistrationController.php  # Public company self-registration
│   │   │   │   └── UserController.php   # User CRUD (tenant-scoped)
│   │   │   └── Settings/
│   │   │       ├── PasswordController.php
│   │   │       └── ProfileController.php
│   │   │
│   │   ├── Middleware/
│   │   │   └── CheckModuleAccess.php    # Module access gate middleware
│   │   │
│   │   └── Requests/                    # Form request validations
│   │
│   ├── Models/
│   │   └── User.php                     # Base Laravel User model
│   │
│   ├── Modules/                         # ⭐ MODULAR ARCHITECTURE
│   │   ├── Core/                        # Core module (always active)
│   │   │   ├── Models/
│   │   │   │   ├── Company.php          # Company model (tenant)
│   │   │   │   ├── CompanyModule.php    # Pivot: company ↔ module
│   │   │   │   ├── Module.php           # Module definition model
│   │   │   │   └── User.php            # Extended User model (isSuperAdmin, etc.)
│   │   │   └── Services/
│   │   │
│   │   ├── Accounting/                  # ✅ Accounting module (IMPLEMENTED)
│   │   │   ├── Controllers/
│   │   │   │   ├── AccountingApiController.php  # All accounting API logic
│   │   │   │   ├── AccountController.php
│   │   │   │   └── TrialBalanceController.php
│   │   │   ├── Models/
│   │   │   │   ├── Account.php          # Chart of Accounts
│   │   │   │   ├── Invoice.php          # Invoices
│   │   │   │   ├── JournalEntry.php     # Journal Entries
│   │   │   │   ├── JournalEntryLine.php # Journal Entry Lines (debit/credit)
│   │   │   │   └── Payment.php          # Payments
│   │   │   └── Services/
│   │   │       └── TrialBalanceService.php  # Trial balance calculation
│   │   │
│   │   ├── HR/                          # 🔜 HR module (PLACEHOLDER)
│   │   │   └── Controllers/
│   │   │       └── HRApiController.php
│   │   │
│   │   └── Inventory/                   # 🔜 Inventory module (PLACEHOLDER)
│   │       └── Controllers/
│   │           └── InventoryApiController.php
│   │
│   ├── Observers/
│   │   └── Accounting/
│   │       ├── InvoiceObserver.php      # Auto journal entry on invoice sent
│   │       └── PaymentObserver.php      # Auto journal entry on payment
│   │
│   ├── Traits/
│   │   ├── BelongsToTenant.php          # ⭐ Multi-tenancy trait
│   │   └── SoftDeleteWithUser.php
│   │
│   └── Providers/
│       ├── AppServiceProvider.php       # Observer registration
│       └── FortifyServiceProvider.php
│
├── routes/
│   ├── api.php                # Auth routes (login, register, logout)
│   ├── super_admin_api.php    # Super admin routes (companies, modules)
│   ├── accounting_api.php     # Accounting module API routes
│   ├── hr_api.php             # HR module API routes
│   ├── inventory_api.php      # Inventory module API routes
│   ├── core.php               # Core routes (user CRUD, company registration)
│   ├── settings.php           # Profile & password settings
│   └── web.php                # Web routes (Inertia)
│
├── database/
│   ├── migrations/            # All database migrations
│   ├── seeders/
│   │   ├── DatabaseSeeder.php
│   │   ├── ModuleSeeder.php           # Seeds available modules
│   │   └── ChartOfAccountsSeeder.php  # Seeds default chart of accounts
│   └── factories/
│
├── bootstrap/
│   └── app.php                # Route registration & middleware aliases
│
└── erp_api_collection.json    # Postman collection (all endpoints)
```

---

## 2. What Has Been Implemented

### ✅ Core System
| Feature | Status | Description |
|---------|--------|-------------|
| User Authentication | ✅ Done | Register, Login, Logout via Sanctum tokens |
| Multi-Tenancy | ✅ Done | Automatic company_id filtering via `BelongsToTenant` trait |
| Role System | ✅ Done | Three roles: `super_admin`, `admin`, `user` |
| Company Registration | ✅ Done | Public endpoint for self-service company creation |
| User CRUD | ✅ Done | Full CRUD, scoped by company for non-super-admins |
| Module System | ✅ Done | Dynamic module activation/deactivation per company |
| Module Access Middleware | ✅ Done | `module.access:{key}` middleware gates module endpoints |

### ✅ Accounting Module (Fully Implemented)
| Feature | Status | Description |
|---------|--------|-------------|
| Chart of Accounts | ✅ Done | Create and list accounts (Asset, Liability, Equity, Revenue, Expense) |
| Journal Entries | ✅ Done | Double-entry with Debit = Credit validation |
| Invoices | ✅ Done | CRUD with statuses: draft, sent, paid, overdue, cancelled |
| Auto Journal Entries | ✅ Done | Observer creates journal entries when invoice status → `sent` |
| Payments | ✅ Done | Payment recording with auto journal entry creation |
| Trial Balance | ✅ Done | With optional grouping by account type |
| Income Statement | ✅ Done | Revenue - Expenses = Net Income |
| Balance Sheet | ✅ Done | Assets = Liabilities + Equity |
| Account Ledger | ✅ Done | Per-account transaction history |

### 🔜 Planned Modules
| Module | Status | Description |
|--------|--------|-------------|
| HR | Placeholder | Employee, Department, Attendance, Leave, Payroll |
| Inventory | Placeholder | Products, Warehouses, Stock, Purchase Orders |

---

## 3. How Multi-Tenancy Works (Company Separation)

Every company's data is **completely isolated**. Here's how:

### The `BelongsToTenant` Trait

Any model that uses `use BelongsToTenant;` gets automatic company isolation:

```
┌──────────────────────────────────────────────────────────┐
│                    BelongsToTenant Trait                  │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  1. READING DATA (Global Scope)                          │
│     Every query automatically adds:                      │
│     WHERE company_id = {logged-in user's company_id}     │
│                                                          │
│     → Company A users NEVER see Company B's data         │
│     → Super admins see ALL data (scope skipped)          │
│                                                          │
│  2. CREATING DATA                                        │
│     Automatically sets company_id = user's company_id    │
│     → No need to manually pass company_id                │
│                                                          │
│  3. UPDATING DATA                                        │
│     company_id CANNOT be changed on updates              │
│     → Prevents data from "moving" between companies      │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Which Models Use It?

All tenant-specific models use `BelongsToTenant`:
- `Account` (Chart of Accounts)
- `JournalEntry` (Journal Entries)
- `JournalEntryLine` (Journal Entry Lines)
- `Invoice` (Invoices)
- `Payment` (Payments)

### Example Flow

```
Company A (ID: 1)              Company B (ID: 2)
├── Users                      ├── Users
│   ├── Ahmed (company_id=1)   │   ├── Sara (company_id=2)
│   └── Ali (company_id=1)     │   └── Omar (company_id=2)
├── Accounts                   ├── Accounts
│   ├── Cash (company_id=1)    │   ├── Cash (company_id=2)
│   └── Revenue (company_id=1) │   └── Revenue (company_id=2)
├── Invoices                   ├── Invoices
│   └── INV-001 (company_id=1) │   └── INV-001 (company_id=2)
└── Journal Entries            └── Journal Entries
    └── JE-001 (company_id=1)      └── JE-001 (company_id=2)

When Ahmed calls GET /api/accounting/invoices:
  → Only sees invoices where company_id = 1
  → Company B's invoices are INVISIBLE

When Super Admin calls GET /api/accounting/invoices:
  → Sees ALL invoices from ALL companies
```

---

## 4. How Modules Work (Add / Remove / Toggle)

### Architecture Overview

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│   modules    │────▶│  company_modules  │◀────│  companies  │
│   table      │     │  (pivot table)    │     │   table     │
├─────────────┤     ├──────────────────┤     ├─────────────┤
│ id          │     │ company_id       │     │ id          │
│ name        │     │ module_id        │     │ name        │
│ key         │     │ status (active/  │     │ ...         │
│ description │     │         inactive)│     │             │
└─────────────┘     └──────────────────┘     └─────────────┘
```

### Available Modules (from `ModuleSeeder`)

| Key | Name | Description |
|-----|------|-------------|
| `accounting` | Accounting | Double-entry accounting, invoices, payments |
| `hr` | HR | Human resources (planned) |
| `inventory` | Inventory | Inventory management (planned) |

### How to Activate a Module for a Company

**API Call:** `POST /api/modules/toggle`

```json
{
    "company_id": 1,
    "module_key": "accounting",
    "status": "active"
}
```

**Requires:** Super Admin role

### How to Deactivate a Module

Same endpoint, change status to `inactive`:

```json
{
    "company_id": 1,
    "module_key": "accounting",
    "status": "inactive"
}
```

> When a module is `inactive`, all its API endpoints return **403 Forbidden** for that company's users.

### How Module Access Control Works

```
User Request → auth:sanctum → module.access:accounting → Controller
                  │                    │
                  │                    ├── Is Super Admin? → ALLOW (bypass)
                  │                    │
                  │                    ├── Has company_id? → No → 403
                  │                    │
                  │                    ├── Module exists? → No → 404
                  │                    │
                  │                    └── company_modules.status = 'active'?
                  │                            ├── Yes → ALLOW
                  │                            └── No  → 403
                  │
                  └── Token valid? → No → 401
```

### Checking Module Access via API

**Get all active modules for your company:**
```
GET /api/my-modules
```

**Check a specific module:**
```
GET /api/check-module/accounting
GET /api/check-module/hr
GET /api/check-module/inventory
```

### During Company Registration

When a company registers, they can choose which modules to activate:

```json
POST /register-company
{
    "company_name": "Acme Corp",
    "admin_name": "Admin",
    "admin_email": "admin@acme.com",
    "admin_password": "password123",
    "admin_password_confirmation": "password123",
    "modules": ["accounting"]     ← modules activated on signup
}
```

---

## 5. Roles & Permissions

| Role | Constant | Capabilities |
|------|----------|-------------|
| **Super Admin** | `super_admin` | See all companies' data, manage all companies, toggle modules, bypass all module checks, manage all users |
| **Admin** | `admin` | Manage users within own company, access activated modules, view own company info |
| **User** | `user` | Access activated modules for own company, view own data |

### Access Matrix

| Endpoint | Super Admin | Admin | User |
|----------|:-----------:|:-----:|:----:|
| List ALL companies | ✅ | ❌ (sees own only) | ❌ |
| Create company | ✅ | ❌ | ❌ |
| Toggle modules | ✅ | ❌ | ❌ |
| List all modules | ✅ | ❌ | ❌ |
| View my company | ✅ | ✅ | ✅ |
| Check my modules | ✅ | ✅ | ✅ |
| CRUD users (own company) | ✅ | ✅ | ✅ |
| CRUD users (any company) | ✅ | ❌ | ❌ |
| Accounting endpoints | ✅ (all data) | ✅ (own company) | ✅ (own company) |

---

## 6. API Endpoints Summary

### Auth (`/api`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/register` | No | Register new user |
| POST | `/api/login` | No | Login, returns token |
| POST | `/api/logout` | Yes | Revoke token |
| GET | `/api/user` | Yes | Get authenticated user |

### Company Registration
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register-company` | No | Self-service company registration |

### Super Admin (`/api`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/companies` | Super Admin | List all companies |
| POST | `/api/companies` | Super Admin | Create company |
| GET | `/api/companies/{id}` | Yes | Show company (own or super admin) |
| GET | `/api/my-company` | Yes | Get current user's company |
| GET | `/api/modules` | Super Admin | List all available modules |
| POST | `/api/modules/toggle` | Super Admin | Activate/deactivate module |
| GET | `/api/my-modules` | Yes | Get user's active modules |
| GET | `/api/check-module/{key}` | Yes | Check specific module access |

### Users (`/core`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/core/users` | Yes | List users (scoped by company) |
| GET | `/core/users/{id}` | Yes | Show user |
| POST | `/core/users` | Yes | Create user |
| PUT | `/core/users/{id}` | Yes | Update user |
| DELETE | `/core/users/{id}` | Yes | Delete user (soft delete) |

### Accounting (`/api/accounting`) — requires `module.access:accounting`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/accounting/accounts` | Yes | List accounts |
| POST | `/api/accounting/accounts` | Yes | Create account |
| GET | `/api/accounting/accounts/{id}/ledger` | Yes | Account ledger |
| GET | `/api/accounting/journal-entries` | Yes | List journal entries |
| POST | `/api/accounting/journal-entries` | Yes | Create journal entry |
| GET | `/api/accounting/journal-entries/{id}` | Yes | Show journal entry |
| GET | `/api/accounting/invoices` | Yes | List invoices |
| POST | `/api/accounting/invoices` | Yes | Create invoice |
| GET | `/api/accounting/invoices/{id}` | Yes | Show invoice |
| PATCH | `/api/accounting/invoices/{id}/status` | Yes | Update invoice status |
| GET | `/api/accounting/payments` | Yes | List payments |
| POST | `/api/accounting/payments` | Yes | Create payment |
| GET | `/api/accounting/trial-balance` | Yes | Trial balance report |
| GET | `/api/accounting/income-statement` | Yes | Income statement |
| GET | `/api/accounting/balance-sheet` | Yes | Balance sheet |

### HR (`/api/hr`) — requires `module.access:hr`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/hr/info` | Yes | Module info (placeholder) |

### Inventory (`/api/inventory`) — requires `module.access:inventory`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/inventory/info` | Yes | Module info (placeholder) |

---

## 7. How to Add a New Module (Developer Guide)

To add a new module (e.g., **CRM**), follow these steps:

### Step 1: Create Module Directory

```
app/Modules/CRM/
├── Controllers/
│   └── CRMApiController.php
├── Models/
│   └── Contact.php
└── Services/
```

### Step 2: Create the Controller

```php
<?php
// app/Modules/CRM/Controllers/CRMApiController.php

namespace App\Modules\CRM\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CRMApiController extends Controller
{
    public function info()
    {
        return response()->json([
            'module' => 'CRM',
            'status' => 'active',
            'version' => '1.0.0',
        ]);
    }

    // Add your methods here...
}
```

### Step 3: Create the Route File

```php
<?php
// routes/crm_api.php

use App\Modules\CRM\Controllers\CRMApiController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'module.access:crm'])
    ->prefix('crm')
    ->group(function () {
        Route::get('/info', [CRMApiController::class, 'info']);
        // Add your routes here...
    });
```

### Step 4: Register the Route File

In `bootstrap/app.php`, add to the API array:

```php
api: [
    __DIR__.'/../routes/api.php',
    __DIR__.'/../routes/super_admin_api.php',
    __DIR__.'/../routes/accounting_api.php',
    __DIR__.'/../routes/hr_api.php',
    __DIR__.'/../routes/inventory_api.php',
    __DIR__.'/../routes/crm_api.php',          // ← Add this
],
```

### Step 5: Add Module to Database

Add to `ModuleSeeder.php` or insert directly:

```php
Module::create([
    'name' => 'CRM',
    'key' => 'crm',
    'description' => 'Customer Relationship Management',
]);
```

Then run: `php artisan db:seed --class=ModuleSeeder`

### Step 6: Create Models with Tenant Isolation

```php
<?php
// app/Modules/CRM/Models/Contact.php

namespace App\Modules\CRM\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongsToTenant;

class Contact extends Model
{
    use BelongsToTenant;  // ← This ensures company isolation

    protected $fillable = ['name', 'email', 'phone', 'company_id'];
}
```

### Step 7: Activate for a Company

```
POST /api/modules/toggle
{
    "company_id": 1,
    "module_key": "crm",
    "status": "active"
}
```

That's it! The middleware automatically blocks access if the module isn't active for a company.

---

## 8. Database Schema Overview

```
┌──────────────┐       ┌──────────────────┐       ┌──────────────┐
│   companies  │───┐   │  company_modules  │   ┌───│   modules    │
├──────────────┤   │   ├──────────────────┤   │   ├──────────────┤
│ id           │   └──▶│ company_id  (FK) │   │   │ id           │
│ name         │       │ module_id   (FK) │◀──┘   │ name         │
│ deleted_at   │       │ status           │       │ key          │
└──────┬───────┘       └──────────────────┘       │ description  │
       │                                          └──────────────┘
       │
       │  ┌──────────────┐
       └─▶│    users     │
          ├──────────────┤    ┌──────────────────┐
          │ id           │    │    accounts       │
          │ name         │    ├──────────────────┤
          │ email        │    │ id               │
          │ password     │    │ code             │
          │ role         │    │ name             │
          │ company_id   │───▶│ type             │
          └──────────────┘    │ company_id  (FK) │
                              └────────┬─────────┘
                                       │
        ┌──────────────────┐           │
        │  journal_entries │           │
        ├──────────────────┤           │
        │ id               │           │
        │ date             │     ┌─────┴──────────────────┐
        │ description      │     │ journal_entry_lines    │
        │ reference_number │     ├────────────────────────┤
        │ company_id  (FK) │◀────│ journal_entry_id (FK)  │
        │ journalable_type │     │ account_id        (FK) │──▶ accounts
        │ journalable_id   │     │ debit                  │
        └──────────────────┘     │ credit                 │
                                 │ company_id        (FK) │
        ┌──────────────────┐     └────────────────────────┘
        │    invoices      │
        ├──────────────────┤     ┌────────────────────────┐
        │ id               │     │      payments          │
        │ client_name      │     ├────────────────────────┤
        │ total            │◀────│ invoice_id    (FK)     │
        │ status           │     │ amount                 │
        │ company_id  (FK) │     │ payment_date           │
        └──────────────────┘     │ payment_method         │
                                 │ company_id    (FK)     │
                                 └────────────────────────┘

Legend:
  FK = Foreign Key
  ──▶ = belongs to / references
  company_id on every tenant model = multi-tenancy key
```

---

## Quick Start

```bash
# 1. Install dependencies
composer install

# 2. Copy env and set DB credentials
cp .env.example .env
# Edit .env → DB_CONNECTION=pgsql, DB_DATABASE=erp_db, etc.

# 3. Generate key
php artisan key:generate

# 4. Run migrations
php artisan migrate

# 5. Seed modules and chart of accounts
php artisan db:seed

# 6. Start server
php artisan serve

# 7. Import Postman collection
# File: erp_api_collection.json
```
