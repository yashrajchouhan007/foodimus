<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class AvatarSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        \App\Models\Avatar::factory()->createMany([
            [
                'id' => 2,
                'created_at' => '2021-12-22 12:51:11',
                'updated_at' => '2021-12-22 12:51:11',
                'src' => '/images/tessa-avatar.png',
                'orientation' => 'right',
            ],
        ]);
    }
}
