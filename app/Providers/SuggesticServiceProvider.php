<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class SuggesticServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->bind(
            'App\Repositories\MealPlanRepositoryInterface',
            'App\Repositories\Suggestic\MealPlanRepository'
        );

        $this->app->bind('App\Repositories\MealRepositoryInterface', 'App\Repositories\Suggestic\MealRepository');

        $this->app->bind('App\Repositories\UserRepositoryInterface', 'App\Repositories\Suggestic\UserRepository');

        $this->app->bind(
            'App\Repositories\ProgramRepositoryInterface',
            'App\Repositories\Suggestic\ProgramRepository'
        );

        $this->app->bind(
            'App\Repositories\ProfileRepositoryInterface',
            'App\Repositories\Suggestic\ProfileRepository'
        );

        $this->app->bind(
            'App\Repositories\MealPlanTemplateRepositoryInterface',
            'App\Repositories\Suggestic\MealPlanTemplateRepository'
        );
        $this->app->bind(
            'App\Repositories\RecipeRepositoryInterface',
            'App\Repositories\Suggestic\RecipeRepository'
        );
        $this->app->bind(
            'App\Repositories\ShoppingListRepositoryInterface',
            'App\Repositories\Suggestic\ShoppingListRepository'
        );
    }
}
