<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Laravel\Nova\Cards\Help;
use Laravel\Nova\Fields\Image as ImageInput;
use Laravel\Nova\Fields\Number;
use Laravel\Nova\Nova;
use Laravel\Nova\NovaApplicationServiceProvider;
use Laravel\Nova\Panel;

class NovaServiceProvider extends NovaApplicationServiceProvider
{
    /**
     * Bootstrap any application services.
     */
    public function boot()
    {
        parent::boot();
        \OptimistDigital\NovaSettings\NovaSettings::addSettingsFields(function () {
            return [
                Panel::make(
                    __('nova.search_page'),
                    [
                        ImageInput::make(__('nova.search_header_src'), 'search_header_src')->preview(
                            function ($value, $disk) {
                            return $value;
                        }
                        )->thumbnail(function ($value, $disk) {
                            return $value;
                        })->store(function (Request $request, $model) {
                            $fs = 's3';
                            $path = $request->search_header_src->store('content/headers', $fs);

                            /** @var mixed $disk */
                            $disk = \Illuminate\Support\Facades\Storage::disk($fs);
                            $url = $disk->url($path);
                            return $url;
                        })->disableDownload(),
                        Number::make(__('nova.search_header_focus_x'), 'search_header_focus_x')->min(0)->max(1)->step(
                            0.025
                        )->default(
                            0.5
                        )->hideFromIndex(),
                        Number::make(__('nova.search_header_focus_y'), 'search_header_focus_y')->min(0)->max(1)->step(
                            0.025
                        )->default(
                            0.5
                        )->hideFromIndex(),
                    ]
                ),
            ];
        });
    }

    /**
     * Get the tools that should be listed in the Nova sidebar.
     *
     * @return array
     */
    public function tools()
    {
        return [new \OptimistDigital\NovaSettings\NovaSettings()];
    }

    /**
     * Register any application services.
     */
    public function register()
    {
        //
    }

    /**
     * Register the Nova routes.
     */
    protected function routes()
    {
        Nova::routes()
            ->withAuthenticationRoutes()
            ->withPasswordResetRoutes()
            ->register();
    }

    /**
     * Register the Nova gate.
     *
     * This gate determines who can access Nova
     */
    protected function gate()
    {
        Gate::define('viewNova', function ($user) {
            /** @var \App\Models\User $user */
            return $user->allow_nova_access === 1;
        });
    }

    /**
     * Configure the Nova authorization services.
     */
    protected function authorization()
    {
        $this->gate();

        Nova::auth(function ($request) {
            return Gate::check('viewNova', [$request->user()]);
        });
    }

    /**
     * Get the cards that should be displayed on the default Nova dashboard.
     *
     * @return array
     */
    protected function cards()
    {
        return [new Help()];
    }

    /**
     * Get the extra dashboards that should be displayed on the Nova dashboard.
     *
     * @return array
     */
    protected function dashboards()
    {
        return [];
    }
}
