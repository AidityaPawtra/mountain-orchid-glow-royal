<?php

namespace Database\Factories;

use App\Models\SavingsLoan;
use App\Models\SavingsLoanPayment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SavingsLoanPayment>
 */
class SavingsLoanPaymentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id' => 'slp-'.fake()->unique()->randomNumber(4),
            'savings_loan_id' => SavingsLoan::factory(),
            'payment_date' => fake()->date(),
            'amount' => 500000,
            'notes' => 'Angsuran',
        ];
    }
}
