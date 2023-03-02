<?php

declare(strict_types=1);

namespace App\Services\Repositories;

use Illuminate\Support\Facades\Facade;

/**
 * ShoppingListRepository
 *
 * @method static bool add(string $user_id, array $recipes)
 * @method static bool clear(string $user_id)
 * @method static \App\Http\Resources\ShoppingList getForRecipe(string $user_id, string $recipe_id)
 * @method static array getForRecipes(string $user_id, array $recipe_ids)
 * @method static \App\Http\Resources\ShoppingList getForMealPlan(string $user_id)
 */
class ShoppingListRepository extends Facade
{
    protected static function getFacadeAccessor()
    {
        return 'App\Repositories\ShoppingListRepositoryInterface';
    }
}
