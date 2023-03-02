<?php

declare(strict_types=1);

namespace App\Helpers;

const TO_TASTE_INGREDIENTS = ['salt', 'pepper'];

class Ingredients
{
    public static function getQuantity(\App\Http\Resources\ShoppingListItem $i)
    {
        $item = [
            'amount' => $i->getQuantity(),
            'unit' => strtolower($i->unit),
        ];

        if ($item['amount'] === 0) {
            $item['amount'] = 1;
            $item['unit'] = null;
        }
        if ($item['unit'] === 'portion') {
            if (
                $i->getUnscaledQuantity() === 1.0
                && in_array(Slugify::slugify($i->ingredient), TO_TASTE_INGREDIENTS, true)
            ) {
                $item['amount'] = null;
                $item['unit'] = null;
            } else {
                $item['unit'] = null;
            }
        }
        return $item;
    }
}
