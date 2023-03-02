<?php

declare(strict_types=1);

namespace App\Nova;

use Drobee\NovaSluggable\Slug;
use Illuminate\Http\Request;
use Laravel\Nova\Fields\HasMany;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Markdown;
use Laravel\Nova\Fields\Text;

class Recipe extends Resource
{
    /**
     * The model the resource corresponds to.
     *
     * @var string
     */
    public static $model = \App\Models\Recipe::class;

    /**
     * The columns that should be searched.
     *
     * @var array
     */
    public static $search = ['slug'];

    public function title()
    {
        return $this->slug;
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

            Slug::make(__('slug'), 'slug')->slugSeparator('-')->slugUnique()->slugModel(static::$model),
            //Text::make(__('name'))->exceptOnForms()->displayUsing(function () {
            //    return $this->title();
            //}),
            Markdown::make(__('story'), 'story'),
            Text::make(__('suggestic_id'), 'suggestic_id')->readonly()->hideFromIndex(),

            HasMany::make(__('images'), 'images', \App\Nova\RecipeImage::class)->hideFromIndex(),

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
