<?php

declare(strict_types=1);

namespace App\Nova;

use Drobee\NovaSluggable\Slug;
use Illuminate\Http\Request;
use Laravel\Nova\Fields\BelongsTo;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Select;

class RecipeImage extends Resource
{
    /**
     * The model the resource corresponds to.
     *
     * @var string
     */
    public static $model = \App\Models\RecipeImage::class;

    /**
     * The columns that should be searched.
     *
     * @var array
     */
    public static $search = [];

    public function title()
    {
        return $this->id;
        //return preg_replace_callback('/(?:^|-)(.)/m', function ($matches) {
        //    $t = $matches[0];
        //    if (strlen($t) > 1) {
        //        return " " . strtoupper(substr($t, 1));
        //    }
        //    return strtoupper(substr($t, 0));
        //}, $this->slug);
    }

    /**
     * Get the fields displayed by the resource.
     *
     * @return array
     */
    public function fields(Request $request)
    {
        return [
            ID::make(__('ID'), 'id')->hideFromIndex(),
            BelongsTo::make(__('recipe'), 'recipe', \App\Nova\Recipe::class)->hideFromIndex(),
            BelongsTo::make(__('image'), 'image', \App\Nova\Image::class)->hideFromIndex(),
            Select::make(__('image_type'), 'image_type')->options([
                'hero' => 'Hero',
                'square' => 'Square',
            ])->displayUsingLabels()
                ->hideFromIndex(),
        ];
    }

    /**
     * Get the cards available for the request.
     *
     * @return array
     */
    public function cards(Request $request)
    {
        return [];
    }

    /**
     * Get the filters available for the resource.
     *
     * @return array
     */
    public function filters(Request $request)
    {
        return [];
    }

    /**
     * Get the lenses available for the resource.
     *
     * @return array
     */
    public function lenses(Request $request)
    {
        return [];
    }

    /**
     * Get the actions available for the resource.
     *
     * @return array
     */
    public function actions(Request $request)
    {
        return [];
    }
}
