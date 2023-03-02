<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run()
    {
        $this->call(UserSeeder::class);
        $this->call(UserDetailSeeder::class);
        $this->call(AvatarSeeder::class);
        $this->call(ImageSeeder::class);
        $this->call(InfluencerSeeder::class);
        $this->call(ProgramSeeder::class);
    }
}
