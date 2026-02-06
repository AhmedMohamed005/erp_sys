<?php

use App\Modules\Core\Models\User;
use App\Modules\Core\Models\Module;
use Database\Factories\CoreUserFactory;
use Illuminate\Support\Facades\Hash;

// Create a super admin user
$superAdmin = CoreUserFactory::new()->create([
    'role' => \App\Constants\Roles::SUPER_ADMIN,
]);

$token = $superAdmin->createToken('test-token')->plainTextToken;

// Create a test module
Module::create(['name' => 'Accounting', 'key' => 'accounting']);

// Test the API call directly
$response = app('test')->withHeader('Authorization', 'Bearer '.$token)
                       ->postJson('/api/companies', [
                           'company_name' => 'Test Company',
                           'admin_name' => 'Test Admin',
                           'admin_email' => 'admin@testcompany.com',
                           'admin_password' => 'password123',
                           'admin_password_confirmation' => 'password123',
                           'modules' => ['accounting']
                       ]);

echo "Status: " . $response->getStatusCode() . "\n";
echo "Content: " . $response->getContent() . "\n";