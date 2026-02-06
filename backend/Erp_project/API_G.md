# ERP System - Multi-Tenant API Structure Guide

## Overview

This ERP system is designed with **multi-tenancy**, **modular architecture**, and a **complete accounting module**. The following guide explains the structure for building APIs, modules, and multi-tenant access.

---

## 1️⃣ Core & Authentication

### User Models

#### Authentication User (`app/Models/User.php`)

* Laravel Fortify handles authentication
* Fields: `company_id`, `role`
* Methods:

  * `isSuperAdmin()`
  * `isAdmin()`
  * `company()` → relationship to Company
* Does not use `BelongsToTenant` to prevent loops

#### Core User (`app/Modules/Core/Models/User.php`)

* Multi-tenant user management
* Includes soft deletes
* Methods:

  * `isSuperAdmin()`
  * `isAdmin()`
  * `scopeTenantUsers()` → filter users by company
  * `company()`
* Does not use `BelongsToTenant` to avoid circular dependencies

### Roles

* `super_admin` → full system access, bypasses tenant filtering
* `admin` → company-level admin
* `user` → standard company user

### Tenant-safe Queries

```php
$users = User::tenantUsers()->get(); // filters by authenticated user's company
$users = User::tenantUsers($companyId)->get(); // manual filtering
```

---

## 2️⃣ Core Platform

### Company Registration

* Endpoint: `POST /register-company`
* Assign modules: `POST /core/companies/{company}/modules`
* Toggle module status: `PATCH /core/companies/{company}/modules/toggle`

### Modules System

* Tables: `modules`, `company_modules`
* Features:

  * Dynamic module activation per company
  * Middleware protection via `CheckModuleAccess`
  * Super admin bypass

### Middleware Example

```php
Route::middleware(['auth', 'module:accounting'])->group(function () {
    // Accounting routes
});
```

### Routes Organization

* `routes/core.php` → company registration, module management
* `routes/accounting.php` → accounting APIs
* All module routes loaded dynamically via `routes/api.php`:

```php
foreach (File::directories(app_path('Modules')) as $modulePath) {
    $routeFile = $modulePath . '/routes.php';
    if (file_exists($routeFile)) require $routeFile;
}
```

---

## 3️⃣ Accounting Module

### Models

* **Account** → Chart of accounts (Asset, Liability, Equity, Revenue, Expense)
* **JournalEntry** → validates balanced entries
* **JournalEntryLine** → individual debit/credit lines
* **Invoice** → auto creates journal entry when `posted` or `confirmed`
* **Payment** → auto creates journal entry on creation

### Observers

* `InvoiceObserver` → creates journal entry on invoice post
* `PaymentObserver` → creates journal entry on payment

### Services

* `TrialBalanceService` → generate trial balances, grouped or standard
* API: `GET /accounting/trial-balance?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD&grouped=true`

---

## 4️⃣ Multi-Tenancy

### BelongsToTenant Trait

* Auto filters `company_id` in queries
* Auto sets `company_id` on creation
* Super admins bypass tenant checks
* Skip filtering: `Invoice::withoutTenant()->get();`

### Super Admin Access

```php
if (Auth::user()->isSuperAdmin()) {
    // Full access, bypass module and tenant checks
}
```

---

## 5️⃣ Database & Seeding

* Run migrations: `php artisan migrate`
* Seed Chart of Accounts:

```bash
php artisan db:seed --class=ChartOfAccountsSeeder
```

---

## 6️⃣ API Examples

### Register Company

```bash
POST /register-company
{
  "company_name": "TestCo",
  "subdomain": "testco",
  "admin_name": "Admin User",
  "admin_email": "admin@testco.com",
  "admin_password": "SecurePass123!",
  "modules": ["accounting"]
}
```

### Get Trial Balance

```bash
GET /accounting/trial-balance?start_date=2026-01-01&end_date=2026-12-31&grouped=true
Authorization: Bearer YOUR_TOKEN
```

### Create Invoice

```bash
POST /accounting/invoices
{
  "client_name": "ACME Corp",
  "total": 1000.00,
  "status": "posted"
}
```

### Create Payment

```bash
POST /accounting/payments
{
  "invoice_id": 1,
  "amount": 500.00,
  "payment_date": "2026-02-06",
  "payment_method": "bank_transfer"
}
```

---

## 7️⃣ File Structure

```
app/
├── Models/User.php               # Auth user model
├── Modules/
│   ├── Core/
│   │   └── Models/User.php       # Core user model
│   └── Accounting/
│       ├── Controllers/
│       ├── Models/
│       └── Services/
├── Http/Controllers/Core/CompanyRegistrationController.php
├── Http/Middleware/CheckModuleAccess.php
├── Observers/Accounting/
├── Traits/
└── Providers/AppServiceProvider.php
routes/
├── web.php
├── core.php
└── accounting.php
database/
├── migrations/
└── seeders/
```

---

## 8️⃣ Key Features

* Dual user models (Auth + Core)
* Multi-tenancy with super admin bypass
* Module system with dynamic activation
* Accounting module with journal entries & trial balance
* Company registration and role-based access
* Automatic journal entries for invoices/payments

---

## 9️⃣ Recommended Next Steps

1. CRUD controllers for all Accounting models
2. Validation for journal entries
3. Tax calculations
4. Financial reports (P&L, Balance Sheet)
5. API documentation
6. Unit tests
7. Audit logging
8. Multi-currency support

---

## 10️⃣ Testing Checklist

* Run migrations & seed accounts
* Register a company
* Login as admin
* Create invoices & payments
* Verify journal entries
* Generate trial balance
* Super admin testing: bypass checks & access all companies

---

This Markdown file documents the **modular ERP architecture**, API usage, multi-tenancy rules, and project structure.
