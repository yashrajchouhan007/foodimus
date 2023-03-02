<?php

declare(strict_types=1);

namespace App\Nova;

use Drobee\NovaSluggable\Slug;
use Drobee\NovaSluggable\SluggableText;
use Illuminate\Http\Request;
use Laravel\Nova\Fields\BelongsTo;
use Laravel\Nova\Fields\Boolean;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Markdown;
use Laravel\Nova\Fields\Number;
use Laravel\Nova\Fields\Text;

class Program extends Resource
{
    /**
     * The model the resource corresponds to.
     *
     * @var string
     */
    public static $model = \App\Models\Program::class;

    /**
     * The single value that should be used to represent the resource when being displayed.
     *
     * @var string
     */
    public static $title = 'name';

    /**
     * The columns that should be searched.
     *
     * @var array
     */
    public static $search = ['name', 'slug'];

    /**
     * Get the fields displayed by the resource.
     *
     * @return array
     */
    public function fields(Request $request)
    {
        return [
            ID::make(__('ID'), 'id')->hideFromIndex(),

            Slug::make(__('slug'), 'slug')->hideFromIndex()->slugSeparator('-')->slugUnique()->slugModel(
                static::$model
            ),
            Boolean::make(__('published'), 'published'),
            Markdown::make(__('story'), 'story'),
            SluggableText::make(__('name'), 'name')->sortable()->slug(__('slug')),

            Number::make(__('total_days'), 'total_days')->min(1)->max(14)->step(1)->hideFromIndex(),

            Boolean::make(__('featured'), 'featured'),

            Text::make(__('suggestic_program_id'), 'suggestic_program_id'),
            Text::make(__('suggestic_template_id'), 'suggestic_template_id'),

            BelongsTo::make(__('influencer'), 'influencer', \App\Nova\Influencer::class)->searchable()->hideFromIndex(),
            BelongsTo::make(__('headerImage'), 'headerImage', \App\Nova\Image::class)->searchable()->hideFromIndex(),
            BelongsTo::make(__('heroImage'), 'heroImage', \App\Nova\Image::class)->searchable()->hideFromIndex(),

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
