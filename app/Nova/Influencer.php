<?php

declare(strict_types=1);

namespace App\Nova;

use App\Nova\Helpers\NovaFields;
use Drobee\NovaSluggable\Slug;
use Drobee\NovaSluggable\SluggableText;
use Illuminate\Http\Request;
use Inspheric\Fields\Url;
use Laravel\Nova\Fields\BelongsTo;
use Laravel\Nova\Fields\Boolean;
use Laravel\Nova\Fields\DateTime;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Markdown;
use Laravel\Nova\Fields\Text;

class Influencer extends Resource
{
    /**
     * The model the resource corresponds to.
     *
     * @var string
     */
    public static $model = \App\Models\Influencer::class;

    /**
     * The single value that should be used to represent the resource when being displayed.
     *
     * @var string
     */
    public static $title = 'full_name';

    /**
     * The columns that should be searched.
     *
     * @var array
     */
    public static $search = ['title', 'full_name', 'short_name', 'slug'];

    /**
     * Get the fields displayed by the resource.
     *
     * @return array
     */
    public function fields(Request $request)
    {
        return [
            BelongsTo::make(__('avatar'), 'avatar', \App\Nova\Avatar::class)->searchable()->hideFromIndex(),
            BelongsTo::make(__('heroImage'), 'heroImage', \App\Nova\Image::class)->nullable()
                ->searchable()
                ->hideFromIndex(),
            //TODO: check if we're using this:
            //BelongsTo::make(__('headerImage'), 'headerImage', \App\Nova\Image::class)->searchable()->hideFromIndex(),
            BelongsTo::make(__('overlayImage'), 'overlayImage', \App\Nova\Image::class)->nullable()
                ->searchable()
                ->hideFromIndex(),
            BelongsTo::make(__('signatureImage'), 'signatureImage', \App\Nova\Image::class)->nullable()->searchable()
                ->hideFromIndex(),

            ID::make(__('ID'), 'id')->hideFromIndex(),

            Text::make(__('title'), 'title')->sortable(),
            SluggableText::make(__('full_name'), 'full_name')->sortable()->slug(__('slug')),
            Slug::make(__('slug'), 'slug')->hideFromIndex()->slugSeparator('-')->slugUnique()->slugModel(
                static::$model
            ),
            Text::make(__('short_name'), 'short_name')->hideFromIndex(),

            Boolean::make(__('published'), 'published'),

            Markdown::make(__('header_box_text_mobile'), 'header_box_text_mobile')->hideFromIndex(),
            Markdown::make(__('header_box_text_desktop'), 'header_box_text_desktop')->hideFromIndex(),
            ...NovaFields::themeColorField(__('header_box_button_color'), 'header_box_button_color'),

            Text::make(__('header_box_button_text'), 'header_box_button_text')->hideFromIndex(),

            Markdown::make(__('story'), 'story'),

            ...NovaFields::themeColorField(__('header_color'), 'header_color'),

            ...NovaFields::themeColorField(__('logo_color'), 'logo_color'),

            Url::make(__('instagram_url'), 'instagram_url')->hideFromIndex(),
            Url::make(__('facebook_url'), 'facebook_url')->hideFromIndex(),

            Markdown::make(__('testimonial'), 'testimonial')->hideFromIndex(),

            DateTime::make(__('created_at'), 'created_at')->readOnly(true)->hideFromIndex(),
            DateTime::make(__('updated_at'), 'updated_at')->readOnly(true)->hideFromIndex(),
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
