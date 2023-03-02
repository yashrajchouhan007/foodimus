<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Collection;

/**
 * MealPlanDay
 *
 * @property int $day
 * @property string $date
 * @property float $calories
 * @property array $meals
 */
class MealPlanDay extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        /** @var Collection $mealplanItems */
        $meals = collect($this->meals);

        return [
            'day' => $this->day,
            'date' => $this->date,
            'calories' => $this->calories,
            'meals' => Meal::collection($meals),
        ];
    }
}
