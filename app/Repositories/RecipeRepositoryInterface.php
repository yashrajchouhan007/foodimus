<?php

declare(strict_types=1);

namespace App\Repositories;

interface RecipeRepositoryInterface
{
    public function get(
        string $id,
        bool $includeText = false,
        bool $includeNutrients = false,
        bool $includeIngredients = false,
        bool $includeSteps = false,
    ): \App\Http\Resources\Recipe;
}
