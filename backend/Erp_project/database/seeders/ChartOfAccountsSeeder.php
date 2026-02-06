<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Modules\Accounting\Models\Account;

class ChartOfAccountsSeeder extends Seeder
{
    /**
     * Run the chart of accounts seeder.
     * 
     * Note: This should be run per company after company creation
     */
    public function run(): void
    {
        $companyId = $this->command->ask('Enter company_id to seed accounts for:');

        if (!$companyId) {
            $this->command->error('Company ID is required');
            return;
        }

        $accounts = [
            // Assets
            ['company_id' => $companyId, 'code' => '1000', 'name' => 'Cash', 'type' => 'Asset'],
            ['company_id' => $companyId, 'code' => '1010', 'name' => 'Bank Account', 'type' => 'Asset'],
            ['company_id' => $companyId, 'code' => '1200', 'name' => 'Accounts Receivable', 'type' => 'Asset'],
            ['company_id' => $companyId, 'code' => '1500', 'name' => 'Inventory', 'type' => 'Asset'],
            ['company_id' => $companyId, 'code' => '1800', 'name' => 'Equipment', 'type' => 'Asset'],
            
            // Liabilities
            ['company_id' => $companyId, 'code' => '2000', 'name' => 'Accounts Payable', 'type' => 'Liability'],
            ['company_id' => $companyId, 'code' => '2100', 'name' => 'Sales Tax Payable', 'type' => 'Liability'],
            ['company_id' => $companyId, 'code' => '2500', 'name' => 'Long-term Debt', 'type' => 'Liability'],
            
            // Equity
            ['company_id' => $companyId, 'code' => '3000', 'name' => 'Owner\'s Equity', 'type' => 'Equity'],
            ['company_id' => $companyId, 'code' => '3100', 'name' => 'Retained Earnings', 'type' => 'Equity'],
            
            // Revenue
            ['company_id' => $companyId, 'code' => '4000', 'name' => 'Sales Revenue', 'type' => 'Revenue'],
            ['company_id' => $companyId, 'code' => '4100', 'name' => 'Service Revenue', 'type' => 'Revenue'],
            ['company_id' => $companyId, 'code' => '4900', 'name' => 'Other Income', 'type' => 'Revenue'],
            
            // Expenses
            ['company_id' => $companyId, 'code' => '5000', 'name' => 'Cost of Goods Sold', 'type' => 'Expense'],
            ['company_id' => $companyId, 'code' => '6000', 'name' => 'Salaries Expense', 'type' => 'Expense'],
            ['company_id' => $companyId, 'code' => '6100', 'name' => 'Rent Expense', 'type' => 'Expense'],
            ['company_id' => $companyId, 'code' => '6200', 'name' => 'Utilities Expense', 'type' => 'Expense'],
            ['company_id' => $companyId, 'code' => '6300', 'name' => 'Office Supplies Expense', 'type' => 'Expense'],
            ['company_id' => $companyId, 'code' => '6400', 'name' => 'Insurance Expense', 'type' => 'Expense'],
            ['company_id' => $companyId, 'code' => '6500', 'name' => 'Depreciation Expense', 'type' => 'Expense'],
        ];

        foreach ($accounts as $account) {
            Account::create($account);
        }

        $this->command->info('Chart of accounts seeded successfully for company ' . $companyId);
    }
}
