<?php

namespace Database\Factories;

use App\Modules\Core\Models\Module;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Modules\Core\Models\Module>
 */
class ModuleFactory extends Factory
{
    protected $model = Module::class;
    
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->word(),
            'key' => fake()->unique()->word(),
        ];
    }
}
