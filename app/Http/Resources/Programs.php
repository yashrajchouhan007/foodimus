<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Collection;

class Programs extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        /** @var Collection $programs */
        $programs = collect($this['programs']);

        return [
            'has_next' => $this->has_next,
            'has_prev' => $this->has_prev,
            'programs' => Program::collection($programs),
        ];
    }
}
