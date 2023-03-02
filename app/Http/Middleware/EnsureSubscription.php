<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EnsureSubscription
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        /** @var App\Models\User $user */
        $user = Auth::user();

        if (! $user) {
            return redirect(route('user-subscription'))
                ->with('error', trans('subscriptions.middleware.authentication_required'));
        }

        if (! $user->subscription_override && ! $user->subscribed()) {
            return redirect(route('user-subscription'))
                ->with('error', trans('subscriptions.middleware.subscription_required'));
        }

        return $next($request);
    }
}
