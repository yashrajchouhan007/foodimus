<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * UserDetail
 *
 * @property mixed $id
 * @property mixed $user_id
 * @property mixed $apply_goals
 * @property mixed $unit_type
 * @property mixed $height
 * @property mixed $weight
 * @property mixed $target_weight
 * @property mixed $activity_level
 * @property mixed $weekly_goal
 * @property mixed $created_at
 * @property mixed $updated_at
 * @property mixed $timezone
 */
class UserDetail extends Model
{
    use HasFactory;

    public const IMPERIAL = 1;

    public const METRIC = 2;

    public const NO_EXERCISE = 'NOT_ACTIVE';

    public const EXERCISE_ONCE_TWICE = 'EXERCISE_1';

    public const EXERCISE_THRICE_PLUS = 'EXERCISE_2';

    public const WEEKLY_MAINTAIN = 'MAINTAIN';

    public const WEEKLY_LOSE_HALF_LBS = 'GOAL_1';

    public const WEEKLY_LOSE_FULL_LBS = 'GOAL_2';

    public const WEEKLY_LOSE_ONE_AND_HALF_LBS = 'GOAL_3';

    public const WEEKLY_LOSE_FOUR_LBS = 'GOAL_4';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'apply_goals',
        'unit_type',
        'height',
        'weight',
        'target_weight',
        'activity_level',
        'weekly_goal',
    ];
}
