<?php

namespace Database\Factories;

use App\Models\Notification;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Notification>
 */
class NotificationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id' => 'ntf-'.fake()->unique()->randomNumber(4),
            'title' => fake()->sentence(3),
            'body' => fake()->sentence(6),
            'time' => now(),
            'read' => false,
            'href' => null,
        ];
    }
}
