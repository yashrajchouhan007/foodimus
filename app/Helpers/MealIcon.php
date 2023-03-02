<?php

declare(strict_types=1);

namespace App\Helpers;

const MEAL_ICON_PROPS = [
    'breakfast' => [
        'icon' => 'croissant',
        'color' => 'red',
    ],
    'lunch' => [
        'icon' => 'burger',
        'color' => 'yellow',
    ],
    'snack' => [
        'icon' => 'apple',
        'color' => 'green',
    ],
    'dinner' => [
        'icon' => 'dinner',
        'color' => 'purple',
    ],
    'evening-snack' => [
        'icon' => 'apple',
        'color' => 'pink',
    ],

    '__default' => [
        'icon' => 'apple',
        'color' => 'red',
    ],
];



class MealIcon
{
    public static function getProps(string $meal): array
    {
        if (! isset(MEAL_ICON_PROPS[$meal])) {
            $meal = '__default';
        }
        return MEAL_ICON_PROPS[$meal];
    }

    public static function getIcon(string $meal): string
    {
        return self::getProps($meal)['icon'];
    }

    public static function getColor(string $meal): string
    {
        return self::getProps($meal)['color'];
    }
}
