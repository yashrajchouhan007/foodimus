<?php

declare(strict_types=1);

namespace App\Repositories;

interface MealPlanRepositoryInterface
{
    /**
     * Get current meal plan days
     *
     * @return mixed
     */
    public function get(
        string $user_id,
        string $from_date,
        bool $include_meals = false,
        bool $include_recipe = false,
        bool $include_nutrients = false
    ): \App\Http\Resources\MealPlan;

    public function clear(string $user_id): bool;

    public function generate(string $user_id): bool;

    public function generateExtended(
        string $user_id,
        int $kcal_target,
        array $tags = null,
        array $distribution = null
    ): bool;
}
