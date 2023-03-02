<?php

declare(strict_types=1);

namespace App\Repositories;

interface MealPlanTemplateRepositoryInterface
{
    public function create(array $data): \App\Http\Resources\MealPlanTemplate;

    public function createFromDays(
        string $profileId,
        string $fromDate,
        string $toDate,
        string $name,
    ): \App\Http\Resources\MealPlanTemplate;

    public function get(
        string $id,
        bool $includeMeals = false,
        bool $includeRecipe = false,
        bool $includeNutrients = false
    ): \App\Http\Resources\MealPlanTemplate;

    public function duplicate(string $id): \App\Http\Resources\MealPlanTemplate;

    public function update(string $id, array $data): \App\Http\Resources\MealPlanTemplate;

    public function delete(string $id): bool;

    public function list(
        string $coachId = null,
        string $search = null,
        int $start = 0,
        int $count = 50,
        bool $includeMeals = false
    ): \App\Http\Resources\MealPlanTemplates;

    public function activate(string $profileId, string $templateId,): bool;
}
