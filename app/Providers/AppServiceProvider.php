<?php

declare(strict_types=1);

namespace App\Providers;

use App\Models\User;
use App\Observers\UserObserver;
use App\Translator\JsonTranslator;
use Illuminate\Support\ServiceProvider;
use Illuminate\Translation\Translator;
use Stripe\Stripe;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register()
    {

        // Override the JSON Translator
        $this->app->extend('translator', function (Translator $translator) {
            $trans = new JsonTranslator($translator->getLoader(), $translator->getLocale());
            $trans->setFallback($translator->getFallback());
            return $trans;
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot()
    {
        // Set stripe api keys for facade usage outside of cashier
        Stripe::setApiKey(config('services.stripe.secret'));

        $this->registerObservers();

        error_reporting(E_ALL & ~E_DEPRECATED & ~E_NOTICE);
    }

    /**
     * Register all observers used in this project
     */
    private function registerObservers(): void
    {
        User::observe(UserObserver::class);
    }
}
