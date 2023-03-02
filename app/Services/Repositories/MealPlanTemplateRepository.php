<?php

declare(strict_types=1);

namespace App\Services\Repositories;

use Illuminate\Support\Facades\Facade;

/**
 * MealPlanTemplateRepository
 *
 * @method static \App\Http\Resources\MealPlanTemplate create(array $data)
 * @method static \App\Http\Resources\MealPlanTemplate createFromDays( string $profileId, string $fromDate, string $toDate, string $name )
 * @method static \App\Http\Resources\MealPlanTemplate get(string $id, bool $includeMeals = false, bool $includeRecipe=false, bool $includeNutrients=false)
 * @method static \App\Http\Resources\MealPlanTemplate duplicate(string $id)
 * @method static \App\Http\Resources\MealPlanTemplate update(string $id, array $data)
 * @method static bool delete(string $id):
 * @method static \App\Http\Resources\MealPlanTemplates list(string $coachId = null, string $search = null, int $start = 0, int $count = 50, bool $includeMeals = false )
 * @method static bool activate(string $profileId, string $templateId)
 */
class MealPlanTemplateRepository extends Facade
{
    protected static function getFacadeAccessor()
    {
        return 'App\Repositories\MealPlanTemplateRepositoryInterface';
    }
}
