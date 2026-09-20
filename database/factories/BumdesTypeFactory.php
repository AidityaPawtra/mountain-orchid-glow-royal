<?php

namespace Database\Factories;

use App\Models\BumdesType;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<BumdesType>
 */
class BumdesTypeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->company();

        return [
            'id' => 'bumdes-'.Str::slug($name).'-'.fake()->unique()->randomNumber(3),
            'name' => $name,
            'category' => fake()->randomElement(['Perdagangan', 'Persewaan', 'Simpan Pinjam', 'Jasa']),
            'description' => fake()->sentence(),
            'status' => 'active',
        ];
    }
}
