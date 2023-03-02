<?php

declare(strict_types=1);

namespace App\Helpers;

use App\Models\Recipe;
use Illuminate\Support\Collection;
use Symfony\Component\HttpKernel\Exception\ServiceUnavailableHttpException;

class Recipes
{
    /**
     * getRemoteRecipesForMeals
     *
     * @param  mixed $meals
     */
    public static function getRemoteRecipesForMeals(Collection $meals): Collection
    {
        return $meals->map(function ($meal) {
            /** @var \App\Http\Resources\Meal $meal */
            return $meal->recipe;
        });
    }

    /**
     * getLocalRecipesForMeals
     *
     * @param  mixed $meals
     */
    public static function getLocalRecipesForMeals(Collection $meals): array
    {
        $remoteRecipes = self::getRemoteRecipesForMeals($meals);
        return self::getLocalRecipes($remoteRecipes);
    }

    /**
     * getLocalRecipes
     *
     * @param  mixed $remoteRecipes
     */
    public static function getLocalRecipes(Collection $remoteRecipes): array
    {
        $recipeIds = collect(array_keys(Arrays::byKey($remoteRecipes, 'databaseId')));

        if (! \App\Http\Resources\Recipe::ensureLocal($remoteRecipes)) {
            error_log('Unable to sync recipes');
            throw new ServiceUnavailableHttpException();
        }
        $recipes = Arrays::byKey(Recipe::whereIn('suggestic_id', $recipeIds)->get(), 'suggestic_id');
        return $recipes;
    }
}
