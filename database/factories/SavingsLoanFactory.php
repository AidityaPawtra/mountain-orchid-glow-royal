<?php

namespace Database\Factories;

use App\Models\SavingsLoan;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SavingsLoan>
 */
class SavingsLoanFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $amount = fake()->numberBetween(1, 10) * 500000;
        $installment = (int) ($amount / 3);

        return [
            'id' => 'sl-'.fake()->unique()->randomNumber(4),
            'borrower_name' => fake()->name(),
            'phone' => fake()->phoneNumber(),
            'address' => fake()->address(),
            'loan_date' => fake()->date(),
            'due_date' => fake()->date(),
            'loan_amount' => $amount,
            'installment_amount' => $installment,
            'total_paid' => 0,
            'purpose' => fake()->sentence(),
            'notes' => fake()->sentence(),
            'status' => 'active',
        ];
    }
}
