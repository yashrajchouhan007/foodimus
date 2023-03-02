<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Helpers\Suggestic;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * MealPlanTemplates
 *
 * @property mixed $ingredient
 * @property mixed $quantity
 * @property mixed $floatQuantity
 * @property mixed $recipeServings
 * @property mixed $numberOfServings
 * @property mixed $unit
 * @property mixed $id
 * @property mixed $recipeId
 * @property mixed $listitemSet
 */
class ShoppingListItem extends JsonResource
{
    public function getUnscaledQuantity(): null|float
    {
        $float = null;
        try {
            $float = $this->floatQuantity;
        } catch (\Exception $e) {
            $float = $this->quantity;
        }
        return $float;
    }

    public function getQuantity(): float
    {
        $float = $this->getUnscaledQuantity();
        if ($float === null) {
            return null;
        }
        $recipeServings = 1;
        try {
            $recipeServings = $this->recipeServings ?? 1;
        } catch (\Exception $e) {
        }
        $numberOfServings = 1;
        try {
            $numberOfServings = $this->numberOfServings ?? 1;
        } catch (\Exception $e) {
        }

        return $float * ($numberOfServings / $recipeServings);
    }

    public function getListItems(): array
    {
        $ids = null;
        if (isset($this->id) && $this->id !== null) {
            $ids = [$this];
        } elseif (isset($this->listitemSet) && $this->listitemSet !== null) {
            $ids = collect($this->listitemSet->edges)
                ->map(function ($e) {
                    return $e->node;
                })->toArray();
        }
        if ($ids === null) {
            throw new \Exception('Unsupported');
        }
        return $ids;
    }

    public function getListItemIds(): array
    {
        $ids = null;
        if (isset($this->id) && $this->id !== null) {
            $ids = [Suggestic::ensureDbId('ListItem', $this->id)];
        } elseif (isset($this->listitemSet) && $this->listitemSet !== null) {
            $ids = collect($this->listitemSet->edges)
                ->map(function ($e) {
                    return Suggestic::ensureDbId('ListItem', $e->node->id);
                })->toArray();
        }
        if ($ids === null) {
            throw new \Exception('Unsupported');
        }
        return $ids;
    }

    public function getRecipeIds(): array
    {
        $ids = null;
        if (isset($this->recipeId) && $this->recipeId !== null) {
            $ids = [Suggestic::ensureDbId('Recipe', $this->recipeId)];
        } elseif (isset($this->listitemSet) && $this->listitemSet !== null) {
            $ids = collect($this->listitemSet->edges)
                ->map(function ($e) {
                    return Suggestic::ensureDbId('Recipe', $e->node->recipeId);
                })->toArray();
        }
        if ($ids === null) {
            throw new \Exception('Unsupported');
        }
        return $ids;
    }
}
