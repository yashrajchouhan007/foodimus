<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Events\SubscriptionStatusChanged;
use Illuminate\Support\Facades\Http;

class SubscriptionStatusChangedListener
{
    /**
     * Handle received Stripe webhooks.
     */
    public function handle(SubscriptionStatusChanged $event): void
    {
        /** @var \App\Models\User $user */
        $user = $event->user->fresh();
        if (! $user) {
            return;
        }
        $url = env('USER_EVENT_WEBHOOK_URL');
        $key = env('USER_EVENT_WEBHOOK_KEY');
        $env = env('APP_ENV');
        if (! $url || ! $key) {
            return;
        }
        $no_payment_method = count($user->paymentMethods()) === 0;

        if ($user->onTrial()) {
            Http::post($url, [
                'event' => 'trial-started',
                'email' => $user->email,
                'no-payment-method' => $no_payment_method,
                'stage' => $env,
                'api-key' => $key,
            ]);
        } elseif ($user->subscribed()) {
            Http::post($url, [
                'event' => 'subscription-active',
                'email' => $user->email,
                'no-payment-method' => $no_payment_method,
                'stage' => $env,
                'api-key' => $key,
            ]);
        } else {
            // TODO: this will run on every status change event when the user is not subscribed
            // this shouldn't matter that much right now since at this point we're only moving
            // the user between segments in Flodesk, but we should fix this at some point

            Http::post($url, [
                'event' => 'subscription-expired',
                'email' => $user->email,
                'no-payment-method' => $no_payment_method,
                'stage' => $env,
                'api-key' => $key,
            ]);
        }
    }
}
