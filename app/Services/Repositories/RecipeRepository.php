<?php

declare(strict_types=1);

namespace App\Services\Repositories;

use Illuminate\Support\Facades\Facade;

/**
 * RecipeRepository
 *
 * @method static \App\Http\Resources\Recipe get(string $id, bool $includeText = false, bool $includeNutrients = false, bool $includeIngredients = false, bool $includeSteps = false)
 */
class RecipeRepository extends Facade
{
    protected static function getFacadeAccessor()
    {
        return 'App\Repositories\RecipeRepositoryInterface';
    }
}
