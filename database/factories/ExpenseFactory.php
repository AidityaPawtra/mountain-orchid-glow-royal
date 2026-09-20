<?php

namespace Database\Factories;

use App\Models\BumdesType;
use App\Models\Expense;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Expense>
 */
class ExpenseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id' => 'exp-'.fake()->unique()->randomNumber(4),
            'bumdes_type_id' => BumdesType::factory(),
            'date' => fake()->date(),
            'category' => fake()->randomElement(['Operasional', 'Pemeliharaan', 'Kegiatan', 'ATK', 'Gaji', 'Transport']),
            'purpose' => fake()->words(2, true),
            'description' => fake()->sentence(),
            'amount' => fake()->numberBetween(50000, 2000000),
            'proof' => null,
        ];
    }
}
