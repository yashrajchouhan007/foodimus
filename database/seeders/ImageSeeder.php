<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class ImageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        \App\Models\Image::factory()->createMany([
            [
                'id' => 1,
                'created_at' => '2021-12-22 12:50:03',
                'updated_at' => '2021-12-22 12:50:03',
                'src' => '/images/mealplan-hero-1.jpg',
                'focus_x' => 0.5,
                'focus_y' => 0.3,
            ],
            [
                'id' => 2,
                'created_at' => '2021-12-22 12:50:03',
                'updated_at' => '2021-12-22 12:50:03',
                'src' => '/images/header-1.jpg',
                'focus_x' => 0.5,
                'focus_y' => 0.3,
            ],
            [
                'id' => 3,
                'created_at' => '2021-12-22 12:50:03',
                'updated_at' => '2021-12-22 12:50:03',
                'src' => '/images/mealplan-hero-1.jpg',
                'focus_x' => 0.5,
                'focus_y' => 0.3,
            ],
            [
                'id' => 4,
                'created_at' => '2021-12-22 12:50:03',
                'updated_at' => '2021-12-22 12:50:03',
                'src' => '/images/header-1.jpg',
                'focus_x' => 0.5,
                'focus_y' => 0.3,
            ],
            [
                'id' => 5,
                'created_at' => null,
                'updated_at' => null,
                'src' => 'https://sg-data.storage.googleapis.com/images_bucket/ced8a7376985fe5b1c78745be5878ed8.png',
                'focus_x' => 0.5,
                'focus_y' => 0.3,
            ],
            [
                'id' => 6,
                'created_at' => null,
                'updated_at' => null,
                'src' => '/images/tessa.png',
                'focus_x' => 0.5,
                'focus_y' => 0.5,
            ],
            [
                'id' => 7,
                'created_at' => null,
                'updated_at' => null,
                'src' => '/images/tessa-signature.svg',
                'focus_x' => 0.5,
                'focus_y' => 0.5,
            ],
            [
                'id' => 8,
                'created_at' => null,
                'updated_at' => null,
                'src' => '/images/tessa2.jpg',
                'focus_x' => 0.5,
                'focus_y' => 0.3,
            ],
        ]);
    }
}
