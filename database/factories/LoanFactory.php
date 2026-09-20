<?php

namespace Database\Factories;

use App\Models\InventoryItem;
use App\Models\Loan;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Loan>
 */
class LoanFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $borrowDate = fake()->dateTimeBetween('-1 month', 'now');
        $returnDate = (clone $borrowDate)->modify('+3 days');

        return [
            'id' => 'loan-'.fake()->unique()->randomNumber(4),
            'borrower_name' => fake()->name(),
            'phone' => fake()->phoneNumber(),
            'item_id' => InventoryItem::factory(),
            'item_name' => fake()->word(),
            'quantity' => fake()->numberBetween(1, 10),
            'borrow_date' => $borrowDate->format('Y-m-d'),
            'return_date' => $returnDate->format('Y-m-d'),
            'actual_return_date' => null,
            'purpose' => fake()->sentence(),
            'notes' => fake()->sentence(),
            'status' => 'borrowed',
        ];
    }
}
