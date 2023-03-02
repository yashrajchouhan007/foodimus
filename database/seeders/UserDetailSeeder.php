<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\UserDetail;
use Illuminate\Database\Seeder;

class UserDetailSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        UserDetail::factory()->createMany([[
            'user_id' => 1,
            'apply_goals' => true,
            'unit_type' => UserDetail::METRIC,
            'weight' => 83.7,
            'height' => 5.84,
            'target_weight' => 80,
            'activity_level' => UserDetail::EXERCISE_ONCE_TWICE,
            'weekly_goal' => UserDetail::WEEKLY_LOSE_FULL_LBS,
        ], [
            'user_id' => 2,
            'apply_goals' => true,
            'unit_type' => UserDetail::METRIC,
            'weight' => 83.7,
            'height' => 5.84,
            'target_weight' => 80,
            'activity_level' => UserDetail::EXERCISE_ONCE_TWICE,
            'weekly_goal' => UserDetail::WEEKLY_LOSE_FULL_LBS,
        ], [
            'user_id' => 3,
            'apply_goals' => true,
            'unit_type' => UserDetail::METRIC,
            'weight' => 83.7,
            'height' => 5.84,
            'target_weight' => 80,
            'activity_level' => UserDetail::EXERCISE_ONCE_TWICE,
            'weekly_goal' => UserDetail::WEEKLY_LOSE_FULL_LBS,
        ], [
            'user_id' => 4,
            'apply_goals' => true,
            'unit_type' => UserDetail::METRIC,
            'weight' => 83.7,
            'height' => 5.84,
            'target_weight' => 80,
            'activity_level' => UserDetail::EXERCISE_ONCE_TWICE,
            'weekly_goal' => UserDetail::WEEKLY_LOSE_FULL_LBS,
        ]]);
    }
}
