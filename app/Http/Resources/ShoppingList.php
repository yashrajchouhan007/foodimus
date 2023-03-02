<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Helpers\Arrays;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * ShoppingList
 */
class ShoppingList extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'has_next' => $this->has_next,
            'has_prev' => $this->has_prev,
            'items' => $this->items,
        ];
    }

    public function getListItems()
    {
        return ShoppingListItem::collection(Arrays::flatten($this->items, function ($i) {
            /** @var \App\Http\Resources\ShoppingListItem $i */
            return ShoppingListItem::make($i)->getListItems();
        }));
    }

    public function getListItemIds()
    {
        return Arrays::flatten($this->items, function ($i) {
            /** @var \App\Http\Resources\ShoppingListItem $i */
            return ShoppingListItem::make($i)->getListItemIds();
        });
    }

    public function getRecipeIds()
    {
        return Arrays::flatten($this->items, function ($i) {
            /** @var \App\Http\Resources\ShoppingListItem $i */
            return ShoppingListItem::make($i)->getRecipeIds();
        });
    }
}
