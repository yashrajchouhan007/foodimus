<?php

declare(strict_types=1);

namespace App\Providers;

use App\Events\SubscriptionStatusChanged;
use App\Listeners\RegisteredListener;
use App\Listeners\StripeListener;
use App\Listeners\SubscriptionStatusChangedListener;
use Illuminate\Auth\Events\Registered;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Laravel\Cashier\Events\WebhookHandled;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array
     */
    protected $listen = [
        Registered::class => [RegisteredListener::class],
        SubscriptionStatusChanged::class => [SubscriptionStatusChangedListener::class],
        WebhookHandled::class => [StripeListener::class],
    ];

    /**
     * Register any events for your application.
     */
    public function boot()
    {
        //
    }
}
