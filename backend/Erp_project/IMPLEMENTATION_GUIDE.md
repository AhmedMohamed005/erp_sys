# ERP System - Multi-Tenant Implementation Guide

## Overview
This ERP system has been fully configured with multi-tenant support, modular architecture, and a complete accounting module. Below is a comprehensive guide to the system.

---

## Phase 1: Core & Authentication ✅

### User Models

#### 1. Authentication User Model (`app/Models/User.php`)
- Used by Laravel Fortify for authentication
- Includes: `company_id`, `role` fields
- **Does NOT use BelongsToTenant trait** (prevents infinite loop)
- Methods:
  - `isSuperAdmin()`: Check if user is super admin
  - `isAdmin()`: Check if user is admin
  - `company()`: Relationship to Company

#### 2. Core User Model (`app/Modules/Core/Models/User.php`)
- Used for multi-tenant user management
- Includes soft deletes
- **Does NOT use BelongsToTenant trait** (prevents circular dependencies)
- Methods:
  - `isSuperAdmin()`: Check if user is super admin
  - `isAdmin()`: Check if user is admin
  - `scopeTenantUsers()`: Scope for filtering users by company
  - `company()`: Relationship to Company

### Database Changes

#### Migration: `2026_02_06_000001_add_soft_deletes_to_users_table.php`
```bash
php artisan migrate
```
Adds `deleted_at` column to users table for soft deletes.

### User Roles
- `super_admin`: Full system access, bypasses tenant filtering
- `admin`: Company admin with full company access
- `user`: Regular company user

### Tenant-safe Queries

```php
// Manual company filtering
$users = User::where('company_id', $companyId)->get();

// Using scope
$users = User::tenantUsers($companyId)->get();
$users = User::tenantUsers()->get(); // Uses auth user's company_id
```

---

## Phase 2: Core Platform ✅

### Company Registration

#### Controller: `CompanyRegistrationController`

**Register new company:**
```php
POST /register-company
{
    "company_name": "Acme Corp",
    "subdomain": "acme",
    "admin_name": "John Doe",
    "admin_email": "john@acme.com",
    "admin_password": "SecurePass123!",
    "admin_password_confirmation": "SecurePass123!",
    "modules": ["accounting", "inventory"]
}
```

**Assign modules to company:**
```php
POST /core/companies/{company}/modules
{
    "modules": ["accounting", "crm"]
}
```

**Toggle module status:**
```php
PATCH /core/companies/{company}/modules/toggle
{
    "module_key": "accounting",
    "status": "active" // or "inactive"
}
```

### Modules System

Modules are managed via the `modules` and `company_modules` tables:
- Each company can have multiple modules
- Modules have a `status` field: `active` or `inactive`

### Middleware: `CheckModuleAccess`

Protects module routes:
```php
Route::middleware(['auth', 'module:accounting'])->group(function () {
    // Accounting routes
});
```

**Features:**
- Super admins automatically bypass module checks
- Regular users must have the module active for their company
- Returns 403 if module not enabled

### Routes

#### Core Routes (`routes/core.php`)
- Company registration
- Module management (super admin only)
- User management

#### Accounting Routes (`routes/accounting.php`)
- Trial balance
- Accounts
- Journal entries
- Invoices
- Payments

---

## Phase 3: Accounting Module ✅

### Models

#### 1. Account (`app/Modules/Accounting/Models/Account.php`)
Chart of accounts with 5 types:
- Asset
- Liability
- Equity
- Revenue
- Expense

**Seedable using:**
```bash
php artisan db:seed --class=ChartOfAccountsSeeder
```

#### 2. JournalEntry (`app/Modules/Accounting/Models/JournalEntry.php`)
Main journal entry model with:
- `validateBalance()`: Ensures debits = credits
- `getTotalDebitsAttribute`: Get sum of debits
- `getTotalCreditsAttribute`: Get sum of credits
- `getIsBalancedAttribute`: Check if entry is balanced

#### 3. JournalEntryLine (`app/Modules/Accounting/Models/JournalEntryLine.php`)
Individual debit/credit lines for journal entries

#### 4. Invoice (`app/Modules/Accounting/Models/Invoice.php`)
- Automatically creates journal entry when status is `posted` or `confirmed`
- Journal entry: Debit Accounts Receivable, Credit Revenue

#### 5. Payment (`app/Modules/Accounting/Models/Payment.php`)
- Automatically creates journal entry on creation
- Journal entry: Debit Cash/Bank, Credit Accounts Receivable

### Observers

#### InvoiceObserver
Automatically creates journal entries when invoice is posted:
```
DR Accounts Receivable    XXX
    CR Sales Revenue           XXX
```

#### PaymentObserver
Automatically creates journal entries when payment is received:
```
DR Cash/Bank              XXX
    CR Accounts Receivable     XXX
```

### Trial Balance Service

#### `TrialBalanceService`

**Generate standard trial balance:**
```php
$service = new TrialBalanceService();
$trialBalance = $service->generate($companyId, $startDate, $endDate);
```

**Generate grouped by type:**
```php
$trialBalance = $service->generateByType($companyId, $startDate, $endDate);
```

**API Endpoint:**
```php
GET /accounting/trial-balance?start_date=2026-01-01&end_date=2026-12-31&grouped=true
```

Response:
```json
{
    "accounts": [...],
    "totals": {
        "debit": 50000.00,
        "credit": 50000.00,
        "difference": 0,
        "is_balanced": true
    },
    "period": {
        "start_date": "2026-01-01",
        "end_date": "2026-12-31"
    }
}
```

---

## Phase 4: Multi-Tenancy ✅

### BelongsToTenant Trait

**Updated features:**
- Automatically filters queries by `company_id`
- Automatically sets `company_id` on model creation
- **Super admins bypass all tenant filtering**
- Prevents `company_id` changes on updates

**Usage:**
```php
use App\Traits\BelongsToTenant;

class Invoice extends Model
{
    use BelongsToTenant;
}
```

**Skip tenant filtering:**
```php
$allInvoices = Invoice::withoutTenant()->get();
```

### Super Admin Access

Super admins have unrestricted access:
- Bypass tenant filtering on all queries
- Bypass module access checks
- Can query any company's data via API

**Check in code:**
```php
if (Auth::user()->isSuperAdmin()) {
    // Full access
}
```

---

## Database Migrations

Run all migrations:
```bash
php artisan migrate
```

### New Migrations Created:
1. `2026_02_06_000001_add_soft_deletes_to_users_table.php`
2. `2026_02_06_000100_create_payments_table.php`
3. `2026_02_06_000101_add_polymorphic_to_journal_entries.php`

---

## Seeding Data

### Chart of Accounts
```bash
php artisan db:seed --class=ChartOfAccountsSeeder
# Enter company_id when prompted
```

This seeds:
- 5 Asset accounts
- 3 Liability accounts
- 2 Equity accounts
- 3 Revenue accounts
- 7 Expense accounts

---

## API Usage Examples

### 1. Register Company
```bash
curl -X POST http://localhost/register-company \
  -H "Content-Type: application/json" \
  -d '{
    "company_name": "Test Company",
    "subdomain": "testco",
    "admin_name": "Admin User",
    "admin_email": "admin@testco.com",
    "admin_password": "SecurePass123!",
    "admin_password_confirmation": "SecurePass123!",
    "modules": ["accounting"]
  }'
```

### 2. Get Trial Balance
```bash
curl -X GET http://localhost/accounting/trial-balance \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -G \
  --data-urlencode "start_date=2026-01-01" \
  --data-urlencode "end_date=2026-12-31" \
  --data-urlencode "grouped=true"
```

### 3. Create Invoice (Auto-generates Journal Entry)
```bash
curl -X POST http://localhost/accounting/invoices \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "client_name": "ACME Corp",
    "total": 1000.00,
    "status": "posted"
  }'
```

### 4. Create Payment (Auto-generates Journal Entry)
```bash
curl POST http://localhost/accounting/payments \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "invoice_id": 1,
    "amount": 500.00,
    "payment_date": "2026-02-06",
    "payment_method": "bank_transfer"
  }'
```

---

## File Structure

```
backend/Erp_project/
├── app/
│   ├── Models/
│   │   └── User.php                           # Auth user model
│   ├── Modules/
│   │   ├── Core/
│   │   │   └── Models/
│   │   │       ├── Company.php
│   │   │       ├── Module.php
│   │   │       └── User.php                   # Core user model
│   │   └── Accounting/
│   │       ├── Controllers/
│   │       │   └── TrialBalanceController.php
│   │       ├── Models/
│   │       │   ├── Account.php
│   │       │   ├── Invoice.php
│   │       │   ├── JournalEntry.php
│   │       │   ├── JournalEntryLine.php
│   │       │   └── Payment.php
│   │       └── Services/
│   │           └── TrialBalanceService.php
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Core/
│   │   │       └── CompanyRegistrationController.php
│   │   └── Middleware/
│   │       └── CheckModuleAccess.php
│   ├── Observers/
│   │   └── Accounting/
│   │       ├── InvoiceObserver.php
│   │       └── PaymentObserver.php
│   ├── Traits/
│   │   ├── BelongsToTenant.php
│   │   └── SoftDeleteWithUser.php
│   └── Providers/
│       └── AppServiceProvider.php
├── database/
│   ├── migrations/
│   │   ├── 2026_02_06_000001_add_soft_deletes_to_users_table.php
│   │   ├── 2026_02_06_000100_create_payments_table.php
│   │   └── 2026_02_06_000101_add_polymorphic_to_journal_entries.php
│   └── seeders/
│       └── ChartOfAccountsSeeder.php
└── routes/
    ├── web.php
    ├── core.php
    └── accounting.php
```

---

## Key Features

### ✅ Completed
1. **Dual User Model System**
   - Auth User (Fortify)
   - Core User (Multi-tenant)

2. **Multi-Tenancy**
   - BelongsToTenant trait with super admin bypass
   - Automatic company_id filtering
   - Tenant-safe queries

3. **Module System**
   - Dynamic module activation
   - Module-based routing
   - Middleware protection

4. **Accounting Module**
   - Chart of Accounts (5 types)
   - Journal Entries with validation
   - Automatic journal entry creation for invoices/payments
   - Trial Balance reporting

5. **Company Registration**
   - Full company setup endpoint
   - Module assignment
   - First admin user creation

6. **Authorization**
   - Role-based access (super_admin, admin, user)
   - Module access control
   - Super admin privileges

---

## Next Steps

### Recommended Enhancements:
1. Create CRUD controllers for all Accounting models
2. Add validation rules for Journal Entry balance
3. Implement tax calculations
4. Add financial reports (P&L, Balance Sheet)
5. Create API documentation
6. Add unit tests for critical business logic
7. Implement audit logging
8. Add multi-currency support

---

## Testing

### Manual Testing Checklist:
- [ ] Run migrations
- [ ] Seed chart of accounts
- [ ] Register a company
- [ ] Login as admin
- [ ] Create an invoice
- [ ] Verify journal entry created
- [ ] Create a payment
- [ ] Verify journal entry created
- [ ] Generate trial balance
- [ ] Verify debits = credits

### Super Admin Testing:
- [ ] Create super admin user
- [ ] Verify access to all companies' data
- [ ] Verify module checks bypassed
- [ ] Verify tenant filtering bypassed on queries

---

## Support

For questions or issues, refer to:
- Laravel Documentation: https://laravel.com/docs
- Project specific documentation in `/docs`
- Database schema diagrams in `/docs/database`

---

## License

[Your License Here]
