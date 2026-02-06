<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Modules\Core\Models\Module;

class ModuleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create default modules
        Module::updateOrCreate(
            ['key' => 'accounting'],
            ['name' => 'Accounting']
        );
        
        Module::updateOrCreate(
            ['key' => 'crm'],
            ['name' => 'Customer Relationship Management']
        );
        
        Module::updateOrCreate(
            ['key' => 'inventory'],
            ['name' => 'Inventory Management']
        );
        
        Module::updateOrCreate(
            ['key' => 'hr'],
            ['name' => 'Human Resources']
        );
    }
}
