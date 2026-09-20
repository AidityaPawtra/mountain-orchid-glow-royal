<?php

namespace Database\Factories;

use App\Models\InventoryItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<InventoryItem>
 */
class InventoryItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $quantity = fake()->numberBetween(10, 100);

        return [
            'id' => 'item-'.fake()->unique()->randomNumber(4),
            'name' => fake()->words(2, true),
            'category' => fake()->randomElement(['Perlengkapan', 'Elektronik', 'Peralatan Dapur', 'Lainnya']),
            'quantity' => $quantity,
            'borrowed' => fake()->numberBetween(0, (int) ($quantity / 2)),
            'condition' => fake()->randomElement(['Baik', 'Rusak Ringan', 'Rusak Berat']),
        ];
    }
}
