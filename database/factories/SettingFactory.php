<?php

namespace Database\Factories;

use App\Models\Setting;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Setting>
 */
class SettingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'bumdes_name' => 'BUMDes Desa Wengkal',
            'village_name' => 'Desa Wengkal',
            'address' => 'Jl. Raya Wengkal No. 01, Kecamatan Wengkal',
            'phone' => '0812-3456-7890',
            'email' => 'bumdes@desawengkal.id',
            'admin_name' => 'Admin',
            'admin_username' => 'admin',
            'admin_email' => 'admin@bumdeswengkal.id',
        ];
    }
}
