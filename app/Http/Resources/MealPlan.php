<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Collection;

/**
 * MealPlan
 *
 * @property array $days
 */
class MealPlan extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        /** @var Collection $days */
        $days = collect($this->days);

        return [
            'days' => MealPlanDay::collection($days),
        ];
    }
}
