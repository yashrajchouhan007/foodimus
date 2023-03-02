<?php

declare(strict_types=1);

namespace App\Nova;

use Illuminate\Http\Request;
use Laravel\Nova\Fields\DateTime;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Image as ImageInput;
use Laravel\Nova\Fields\Select;
use Laravel\Nova\Fields\Text;

class Avatar extends Resource
{
    /**
     * The model the resource corresponds to.
     *
     * @var string
     */
    public static $model = \App\Models\Avatar::class;

    /**
     * The columns that should be searched.
     *
     * @var array
     */
    public static $search = ['id', 'src', 'description'];

    public function title()
    {
        return $this->description !== null ? $this->description : $this->src;
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
            // todo: switch to s3
            ImageInput::make(__('src'), 'src')->preview(function ($value, $disk) {
                return $value;
            })->thumbnail(function ($value, $disk) {
                return $value;
            })->store(function (Request $request, $model) {
                $fs = 's3';
                $path = $request->src->store('image', $fs);

                /** @var mixed $disk */
                $disk = \Illuminate\Support\Facades\Storage::disk($fs);
                $url = $disk->url($path);
                return [
                    'src' => $url,
                    'fs' => $fs,
                    'path' => $path,
                ];
            })->readonly(function () {
                return $this->resource->exists;
            })->disableDownload(),
            Select::make(__('orientation'), 'orientation')->options([
                'left' => 'Facing left',
                'right' => 'Facing right',
                'front' => 'Facing camera',
            ])->nullable()
                ->displayUsingLabels()
                ->sortable(),
            Text::make(__('description'), 'description')->sortable(),

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
