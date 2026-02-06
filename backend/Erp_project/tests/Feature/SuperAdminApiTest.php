<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Modules\Core\Models\User;
use App\Modules\Core\Models\Company;
use App\Modules\Core\Models\Module;
use Database\Factories\CoreUserFactory;
use Illuminate\Support\Facades\Hash;

class SuperAdminApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_super_admin_can_list_all_companies()
    {
        $superAdmin = CoreUserFactory::new()->create([
            'role' => \App\Constants\Roles::SUPER_ADMIN,
        ]);

        $token = $superAdmin->createToken('test-token')->plainTextToken;

        // Create some test companies
        \Database\Factories\CompanyFactory::new()->count(3)->create();

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
                         ->getJson('/api/companies');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'companies' => [
                         '*' => [
                             'id',
                             'name',
                             'is_active',
                             'created_at',
                             'updated_at'
                         ]
                     ]
                 ]);
    }

    public function test_super_admin_can_get_single_company()
    {
        $superAdmin = CoreUserFactory::new()->create([
            'role' => \App\Constants\Roles::SUPER_ADMIN,
        ]);

        $token = $superAdmin->createToken('test-token')->plainTextToken;

        // Create a test company
        $company = \Database\Factories\CompanyFactory::new()->create();

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
                         ->getJson("/api/companies/{$company->id}");

        $response->assertStatus(200)
                 ->assertJson([
                     'company' => [
                         'id' => $company->id,
                         'name' => $company->name
                     ]
                 ]);
    }

    public function test_regular_user_cannot_access_super_admin_endpoints()
    {
        $regularUser = CoreUserFactory::new()->create([
            'role' => \App\Constants\Roles::USER,
        ]);

        $token = $regularUser->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
                         ->getJson('/api/companies');

        $response->assertStatus(403); // Forbidden
    }

    public function test_super_admin_can_create_company()
    {
        $superAdmin = CoreUserFactory::new()->create([
            'role' => \App\Constants\Roles::SUPER_ADMIN,
        ]);

        $token = $superAdmin->createToken('test-token')->plainTextToken;

        // Create a test module
        \Database\Factories\ModuleFactory::new()->create(['name' => 'Accounting', 'key' => 'accounting']);

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
                         ->postJson('/api/companies', [
                             'company_name' => 'Test Company',
                             'admin_name' => 'Test Admin',
                             'admin_email' => 'admin@testcompany.com',
                             'admin_password' => 'password123',
                             'admin_password_confirmation' => 'password123',
                             'modules' => ['accounting']
                         ]);

        // Debug: Print response content if it fails
        if ($response->getStatusCode() !== 201) {
            $response->dump();
        }
        
        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'message',
                     'company',
                     'user'
                 ]);

        $this->assertDatabaseHas('companies', [
            'name' => 'Test Company'
        ]);

        $this->assertDatabaseHas('users', [
            'email' => 'admin@testcompany.com',
            'role' => \App\Constants\Roles::ADMIN
        ]);
    }

    public function test_super_admin_can_toggle_module()
    {
        $superAdmin = CoreUserFactory::new()->create([
            'role' => \App\Constants\Roles::SUPER_ADMIN,
        ]);

        $token = $superAdmin->createToken('test-token')->plainTextToken;

        // Create a company and module
        $company = \Database\Factories\CompanyFactory::new()->create();
        $module = \Database\Factories\ModuleFactory::new()->create(['name' => 'Accounting', 'key' => 'accounting']);

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
                         ->postJson('/api/modules/toggle', [
                             'company_id' => $company->id,
                             'module_key' => 'accounting',
                             'status' => 'active'
                         ]);

        $response->assertStatus(200)
                 ->assertJson([
                     'message' => 'Module status updated successfully'
                 ]);

        $this->assertDatabaseHas('company_modules', [
            'company_id' => $company->id,
            'module_id' => $module->id,
            'status' => 'active'
        ]);
    }
}