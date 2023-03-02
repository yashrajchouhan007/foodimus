<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        User::factory()->create([
            'id' => 1,
            'gender' => User::MALE,
            'firstname' => 'Arno',
            'email' => 'arno@wirelab.nl',
            'password' => bcrypt('test123'),
            'date_of_birth' => '1990-10-20',
        ]);

        User::factory()->create([
            'id' => 2,
            'gender' => User::MALE,
            'firstname' => 'Marten',
            'email' => 'marten@wirelab.nl',
            'password' => bcrypt('test123'),
            'date_of_birth' => '1990-10-20',
        ]);

        User::factory()->create([
            'id' => 3,
            'firstname' => 'Example',
            'middlename' => 'of',
            'lastname' => 'Customer',
            'gender' => User::MALE,
            'email' => 'example@wirelab.nl',
            'password' => bcrypt('test123'),
            'date_of_birth' => '1990-10-20',
        ]);

        User::factory()->create([
            'id' => 4,
            'firstname' => 'Dani',
            'email' => 'dani@wirelab.nl',
            'password' => bcrypt('test123'),
            'gender' => User::MALE,
            'password' => bcrypt('test123'),
            'date_of_birth' => '1990-10-20',
        ]);
    }
}
