<?php

declare(strict_types=1);

namespace App\Repositories\Suggestic;

use App\Helpers\Suggestic;

class RecipeRepository implements \App\Repositories\RecipeRepositoryInterface
{
    /**
     * Get a recipe by it's ID
     */
    public function get(
        string $id,
        bool $includeText = false,
        bool $includeNutrients = false,
        bool $includeIngredients = false,
        bool $includeSteps = false,
    ): \App\Http\Resources\Recipe {
        $id = Suggestic::ensureB64Id('Recipe', $id);

        $extraFields = [];

        if ($includeText) {
            $extraFields[] = 'text';
        }
        if ($includeIngredients) {
            $extraFields[] = <<<GQL
            ingredientLines
            ingredients{
                confirmed
                cpc
                name
                priority
                type
            }
            GQL;
        }
        if ($includeSteps) {
            $extraFields[] = <<<GQL
            instructions
            GQL;
        }
        if ($includeNutrients) {
            $extraFields[] = <<<GQL
            nutrientsPerServing{
                protein
                carbs
                calories
                fat
                fiber            
            }
            GQL;
        }

        $extraFieldStr = implode("\n", $extraFields);

        $query = <<<GQL
            query(
                \$id: ID!
            ){
              recipe(
                  id:\$id
              ){
                id
                databaseId
                cleanName
                name
                mainImage
                squareImage
                totalTimeInSeconds
                recipeType
                rating
                serving
                ${extraFieldStr}
              }
            }
            GQL;

        return \App\Http\Resources\Recipe::make(Suggestic::run(
            $query,
            userId: \Illuminate\Support\Facades\Auth::user()->suggestic_user,
            params: [
                'id' => $id,
            ]
        )->data->recipe);
    }
}
