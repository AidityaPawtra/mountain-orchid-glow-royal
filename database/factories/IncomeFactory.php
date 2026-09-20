<?php

namespace Database\Factories;

use App\Models\BumdesType;
use App\Models\Income;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Income>
 */
class IncomeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id' => 'inc-'.fake()->unique()->randomNumber(4),
            'bumdes_type_id' => BumdesType::factory(),
            'date' => fake()->date(),
            'source' => fake()->randomElement(['Unit Usaha', 'Sewa Lapangan', 'PAD Desa', 'BUMDes']),
            'category' => fake()->randomElement(['Penjualan', 'Sewa', 'Angsuran', 'Bantuan', 'Lainnya']),
            'description' => fake()->sentence(),
            'amount' => fake()->numberBetween(100000, 5000000),
            'proof' => null,
        ];
    }
}
