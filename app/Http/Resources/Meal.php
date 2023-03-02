<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Meal
 *
 * @property string $id
 * @property int $maxNumOfServings
 * @property float $calories
 * @property string $meal
 * @property int $numOfServings
 * @property Recipe $recipe
 */
class Meal extends JsonResource
{
}
