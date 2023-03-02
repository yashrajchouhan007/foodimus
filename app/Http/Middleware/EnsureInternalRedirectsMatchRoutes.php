<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

class EnsureInternalRedirectsMatchRoutes
{
    /**
     * Handle an incoming request. A number of controller function allow for dynamic redirect based on form input. This
     * opens up a security issue where external script could cause this code base to redirect sensitive form data to any
     * website. To prevent such a thing from happening, this middleware ensure that internal redirects can only point to
     * existing routes.
     *
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        if ($request->has('internalRedirect')) {
            $input = $request->all();
            // Handle strings/ints being set as field
            $redirects = is_array($input['internalRedirect']) ? $input['internalRedirect'] : [];
            $routes = Route::getRoutes();

            foreach ($redirects as $redirectField => $redirectValue) {
                try {
                    // Prevent null values
                    if (! is_string($redirectValue)) {
                        throw new \Exception();
                    }
                    $routes->match(Request::create($redirectValue));
                    // route exists, all good
                } catch (\Exception $e) {
                    // route doesn't exist, bad! We're going to remove the redirect
                    unset($input['internalRedirect'][$redirectField]);
                }
            }

            $request->replace($input);
        }

        return $next($request);
    }
}
