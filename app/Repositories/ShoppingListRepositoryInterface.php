<?php

declare(strict_types=1);

namespace App\Repositories;

interface ShoppingListRepositoryInterface
{
    public function add(string $user_id, array $recipes): bool;

    public function clear(string $user_id): bool;

    public function getForRecipe(string $user_id, string $recipe_id): \App\Http\Resources\ShoppingList;

    public function getForRecipes(string $user_id, array $recipe_ids): array;

    public function getForMealPlan(string $user_id): \App\Http\Resources\ShoppingList;
}
