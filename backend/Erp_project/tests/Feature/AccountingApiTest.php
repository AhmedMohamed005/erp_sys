<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Modules\Core\Models\User;
use App\Modules\Core\Models\Company;
use App\Modules\Core\Models\Module;
use App\Modules\Accounting\Models\Account;
use Database\Factories\CoreUserFactory;
use Database\Factories\AccountFactory;

class AccountingApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_get_accounts()
    {
        // Create company and user with accounting module enabled
        $company = \Database\Factories\CompanyFactory::new()->create();
        $user = CoreUserFactory::new()->create([
            'role' => \App\Constants\Roles::ADMIN,
            'company_id' => $company->id,
        ]);
        
        // Enable accounting module for the company
        $accountingModule = \Database\Factories\ModuleFactory::new()->create(['name' => 'Accounting', 'key' => 'accounting']);
        $company->modules()->attach($accountingModule->id, ['status' => 'active']);

        $token = $user->createToken('test-token')->plainTextToken;

        // Create some test accounts
        AccountFactory::new()->count(3)->create(['company_id' => $company->id]);

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
                         ->getJson('/api/accounting/accounts');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'accounts' => [
                         '*' => [
                             'id',
                             'company_id',
                             'code',
                             'name',
                             'type',
                             'created_at',
                             'updated_at'
                         ]
                     ]
                 ]);
    }

    public function test_authenticated_user_can_create_account()
    {
        // Create company and user with accounting module enabled
        $company = \Database\Factories\CompanyFactory::new()->create();
        $user = CoreUserFactory::new()->create([
            'role' => \App\Constants\Roles::ADMIN,
            'company_id' => $company->id,
        ]);
        
        // Enable accounting module for the company
        $accountingModule = \Database\Factories\ModuleFactory::new()->create(['name' => 'Accounting', 'key' => 'accounting']);
        $company->modules()->attach($accountingModule->id, ['status' => 'active']);

        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
                         ->postJson('/api/accounting/accounts', [
                             'code' => '1001',
                             'name' => 'Cash',
                             'type' => 'Asset'
                         ]);

        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'account' => [
                         'id',
                         'company_id',
                         'code',
                         'name',
                         'type'
                     ]
                 ]);

        $this->assertDatabaseHas('accounts', [
            'code' => '1001',
            'name' => 'Cash',
            'type' => 'Asset',
            'company_id' => $company->id
        ]);
    }

    public function test_trial_balance_api()
    {
        // Create company and user with accounting module enabled
        $company = \Database\Factories\CompanyFactory::new()->create();
        $user = CoreUserFactory::new()->create([
            'role' => \App\Constants\Roles::ADMIN,
            'company_id' => $company->id,
        ]);
        
        // Enable accounting module for the company
        $accountingModule = \Database\Factories\ModuleFactory::new()->create(['name' => 'Accounting', 'key' => 'accounting']);
        $company->modules()->attach($accountingModule->id, ['status' => 'active']);

        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
                         ->getJson('/api/accounting/trial-balance');

        // Debug: Print response if it fails
        if ($response->getStatusCode() !== 200) {
            $response->dump();
        }
        
        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'accounts',
                     'totals' => [
                         'debit',
                         'credit',
                         'difference',
                         'is_balanced'
                     ],
                     'period' => [
                         'start_date',
                         'end_date'
                     ]
                 ]);
    }
}