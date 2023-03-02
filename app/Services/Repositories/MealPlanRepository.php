<?php

declare(strict_types=1);

namespace App\Services\Repositories;

use Illuminate\Support\Facades\Facade;

/**
 * MealPlanRepository
 *
 * @method static \App\Http\Resources\MealPlan get(string $user_id, string $from_date, bool $include_meals = false, bool $include_recipe = false, bool $include_nutrients = false)
 * @method static bool clear(string $user_id)
 * @method static bool generate(string $user_id)
 * @method static bool generateExtended(string $user_id, int $kcal_target, array $tags = null, array $distribution = null)
 */
class MealPlanRepository extends Facade
{
    protected static function getFacadeAccessor()
    {
        return 'App\Repositories\MealPlanRepositoryInterface';
    }
}
