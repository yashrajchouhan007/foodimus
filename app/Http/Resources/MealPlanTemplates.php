<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Collection;

/**
 * MealPlanTemplates
 *
 * @property bool has_next
 * @property bool has_prev
 * @property array templates
 */
class MealPlanTemplates extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        /** @var Collection $templates */
        $templates = collect($this['templates']);
        return [
            'has_next' => $this->has_next,
            'has_prev' => $this->has_prev,
            'templates' => MealPlanTemplate::collection($templates),
        ];
    }
}
