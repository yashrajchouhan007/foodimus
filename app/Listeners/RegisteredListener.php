<?php

declare(strict_types=1);

namespace App\Listeners;

use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Http;

class RegisteredListener
{
    /**
     * Handle received Stripe webhooks.
     */
    public function handle(Registered $event): void
    {
        $url = env('USER_EVENT_WEBHOOK_URL');
        $key = env('USER_EVENT_WEBHOOK_KEY');
        $env = env('APP_ENV');
        if (! $url || ! $key) {
            return;
        }
        /** @var \App\Models\User $user */
        $user = $event->user;
        if (! $user) {
            return;
        }

        Http::post($url, [
            'event' => 'new-user',
            'email' => $user->email,
            'first-name' => $user->firstname,
            'last-name' => $user->lastname,
            'stage' => $env,
            'api-key' => $key,
        ]);
    }
}
