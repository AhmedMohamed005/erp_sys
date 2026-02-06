# ERP System - Quick Start Guide

## Installation Steps

### 1. Run Migrations
```bash
cd backend/Erp_project
php artisan migrate
```

### 2. Seed Basic Data

#### Modules (if not already seeded)
```bash
php artisan db:seed --class=ModuleSeeder
```

#### Chart of Accounts (per company)
```bash
php artisan db:seed --class=ChartOfAccountsSeeder
# Enter company_id when prompted
```

## Creating Your First Company

### Option 1: Via API
```bash
curl -X POST http://localhost/register-company \
  -H "Content-Type: application/json" \
  -d '{
    "company_name": "My Company",
    "subdomain": "mycompany",
    "admin_name": "John Doe",
    "admin_email": "john@mycompany.com",
    "admin_password": "SecurePass123!",
    "admin_password_confirmation": "SecurePass123!",
    "modules": ["accounting"]
  }'
```

### Option 2: Via Tinker
```bash
php artisan tinker
```

```php
use App\Modules\Core\Models\Company;
use App\Models\User;
use App\Modules\Core\Models\Module;

// Create company
$company = Company::create([
    'name' => 'Test Company',
    'subdomain' => 'test',
    'is_active' => true
]);

// Create admin user
$user = User::create([
    'name' => 'Admin User',
    'email' => 'admin@test.com',
    'password' => bcrypt('password'),
    'company_id' => $company->id,
    'role' => 'admin'
]);

// Assign accounting module
$accountingModule = Module::where('key', 'accounting')->first();
$company->modules()->attach($accountingModule->id, ['status' => 'active']);

// Seed chart of accounts for this company
\Artisan::call('db:seed', ['--class' => 'ChartOfAccountsSeeder', '--company-id' => $company->id]);
```

## Creating a Super Admin

```bash
php artisan tinker
```

```php
use App\Models\User;

User::create([
    'name' => 'Super Admin',
    'email' => 'superadmin@erp.com',
    'password' => bcrypt('SuperSecure123!'),
    'role' => 'super_admin',
    'company_id' => null  // Super admins don't need a company
]);
```

## Testing the System

### 1. Login
```bash
# Use your auth system (Fortify)
# Login with credentials created above
```

### 2. Create an Invoice
```php
use App\Modules\Accounting\Models\Invoice;

Invoice::create([
    'company_id' => 1,
    'client_name' => 'ACME Corp',
    'total' => 5000.00,
    'status' => 'posted'  // This triggers journal entry creation
]);
```

### 3. Check Journal Entry Created
```php
use App\Modules\Accounting\Models\JournalEntry;

$entry = JournalEntry::with('lines.account')->latest()->first();
dd($entry->toArray());

// Verify balance
echo "Is Balanced: " . ($entry->is_balanced ? 'YES' : 'NO');
```

### 4. Create a Payment
```php
use App\Modules\Accounting\Models\Payment;

Payment::create([
    'company_id' => 1,
    'invoice_id' => 1,
    'amount' => 2500.00,
    'payment_date' => now(),
    'payment_method' => 'bank_transfer',
    'reference_number' => 'PAY-001'
]);
```

### 5. Generate Trial Balance
```php
use App\Modules\Accounting\Services\TrialBalanceService;

$service = new TrialBalanceService();
$trialBalance = $service->generate(1);  // company_id = 1

print_r($trialBalance);
```

## Common Operations

### Query Users for a Company
```php
// Manual filtering
$users = \App\Modules\Core\Models\User::where('company_id', 1)->get();

// Using scope
$users = \App\Modules\Core\Models\User::tenantUsers(1)->get();
```

### Bypass Tenant Filtering (Super Admin)
```php
Auth::loginUsingId($superAdminId);

// All models with BelongsToTenant will now show all records
$allInvoices = Invoice::all();  // Shows invoices from ALL companies
```

### Manually Bypass Tenant Filtering
```php
// Works for any user
$allInvoices = Invoice::withoutTenant()->get();
```

### Check Module Access
```php
$user = Auth::user();
$hasAccounting = $user->company->modules()
    ->where('key', 'accounting')
    ->wherePivot('status', 'active')
    ->exists();
```

### Validate Journal Entry Balance
```php
$entry = JournalEntry::find(1);

if (!$entry->validateBalance()) {
    echo "Entry is not balanced!";
    echo "Debits: " . $entry->total_debits;
    echo "Credits: " . $entry->total_credits;
}
```

## Troubleshooting

### Issue: Tenant filtering not working
**Solution:** Check if user is logged in and has `company_id` set
```php
$user = Auth::user();
echo "Company ID: " . $user->company_id;
```

### Issue: Super admin seeing filtered results
**Solution:** Verify role is exactly `super_admin`
```php
$user = Auth::user();
echo "Role: " . $user->role;
echo "Is Super Admin: " . ($user->isSuperAdmin() ? 'YES' : 'NO');
```

### Issue: Journal entry not created for invoice
**Solution:** 
1. Check invoice status is `posted` or `confirmed`
2. Check observers are registered in AppServiceProvider
3. Check required accounts exist

```php
// Check observers registered
// In AppServiceProvider::boot()
\App\Modules\Accounting\Models\Invoice::observe(\App\Observers\Accounting\InvoiceObserver::class);

// Check accounts exist
use App\Modules\Accounting\Models\Account;

$receivable = Account::where('company_id', 1)
    ->where('type', 'Asset')
    ->where('name', 'LIKE', '%receivable%')
    ->first();

$revenue = Account::where('company_id', 1)
    ->where('type', 'Revenue')
    ->first();

if (!$receivable || !$revenue) {
    echo "Required accounts missing!";
}
```

### Issue: Module access denied
**Solution:**
1. Check module is active for company
2. Check middleware is applied correctly

```php
// Check module status
$company = Company::find(1);
$accountingModule = $company->modules()
    ->where('key', 'accounting')
    ->first();

echo "Status: " . $accountingModule->pivot->status;
```

## Development Tips

### Adding a New Module

1. Create module entry in database:
```php
Module::create([
    'name' => 'Inventory',
    'key' => 'inventory'
]);
```

2. Assign to company:
```php
$company->modules()->attach($moduleId, ['status' => 'active']);
```

3. Create routes file:
```php
// routes/inventory.php
Route::middleware(['auth', 'module:inventory'])->prefix('inventory')->group(function () {
    // Routes here
});
```

4. Include in web.php:
```php
require __DIR__.'/inventory.php';
```

### Creating a New Tenant Model

```php
use App\Traits\BelongsToTenant;

class Product extends Model
{
    use BelongsToTenant;
    
    protected $fillable = ['company_id', 'name', 'price'];
}
```

Now automatically filtered by company_id!

## API Testing with Postman

### 1. Import Environment
Create variables:
- `base_url`: http://localhost
- `token`: Your auth token

### 2. Test Endpoints

**Register Company:**
```
POST {{base_url}}/register-company
Content-Type: application/json

{
  "company_name": "Test Co",
  "subdomain": "testco",
  "admin_name": "Admin",
  "admin_email": "admin@test.com",
  "admin_password": "Test123!",
  "admin_password_confirmation": "Test123!",
  "modules": ["accounting"]
}
```

**Get Trial Balance:**
```
GET {{base_url}}/accounting/trial-balance?grouped=true
Authorization: Bearer {{token}}
```

## Next Steps

1. ✅ Complete this quick start
2. [ ] Build frontend components
3. [ ] Add validation rules
4. [ ] Write unit tests
5. [ ] Add API documentation (Swagger/OpenAPI)
6. [ ] Implement caching for trial balance
7. [ ] Add background jobs for heavy reports
8. [ ] Set up audit logging

## Resources

- Main Implementation Guide: `IMPLEMENTATION_GUIDE.md`
- Database Schema: Run `php artisan db:show`
- Routes List: Run `php artisan route:list`
- Model List: Check `app/Modules/*/Models/`

---

Happy Coding! 🚀
