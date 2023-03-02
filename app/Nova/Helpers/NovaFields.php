<?php

declare(strict_types=1);

namespace App\Nova\Helpers;

use Laravel\Nova\Fields\Select;
use Laravel\Nova\Fields\Text;

const THEME_COLOR_LABELS = [
    'purple' => 'Purple',
    'green' => 'Green',
    'yellow' => 'Yellow',
    'pink' => 'Pink',
    'blue' => 'Blue',
    'red' => 'Red',
];
const THEME_COLOR_VALUES = [
    'purple' => '#5952c1',
    'green' => '#29b49c',
    'yellow' => '#f8c444',
    'pink' => '#f59ab5',
    'blue' => '#2663D6',
    'red' => '#f05478',
];
class NovaFields
{
    public static function themeColorField(string $title, string $field): array
    {
        // TODO: this should probably be a custom field type
        return [
            Select::make($title, $field)->options(
                THEME_COLOR_LABELS
            )->displayUsingLabels()->onlyOnForms()->hideFromIndex(),
            Text::make($title, $field)->displayUsing(function ($value) {
                if (! isset(THEME_COLOR_VALUES[$value])) {
                    return $value;
                }
                $color = THEME_COLOR_VALUES[$value];
                if (isset(THEME_COLOR_LABELS[$value])) {
                    $value = THEME_COLOR_LABELS[$value];
                }
                return "<div class='flex items-center' style='gap:.5rem;'><div style='background-color:${color};border-radius:3px;border:solid thin rgba(0,0,0,0.25);' class='inline-block w-4 h-4'></div><span>${value}</span></div>";
            })->asHtml()
                ->exceptOnForms()
                ->hideFromIndex(),
        ];
    }
}
