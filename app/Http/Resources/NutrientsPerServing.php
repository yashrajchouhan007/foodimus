<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

/**
 * NutrientsPerServing
 *
 * @property float $protein
 * @property float $carbs
 * @property float $calories
 * @property float $fat
 * @property float $fiber
 */
class NutrientsPerServing extends JsonResource
{
}
