<?php

namespace Database\Factories;

use App\Modules\Accounting\Models\Account;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Modules\Accounting\Models\Account>
 */
class AccountFactory extends Factory
{
    protected $model = Account::class;
    
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'company_id' => null, // Will be set by BelongsToTenant trait
            'code' => $this->faker->unique()->numerify('####'),
            'name' => $this->faker->word(),
            'type' => $this->faker->randomElement(Account::TYPES),
        ];
    }
}
