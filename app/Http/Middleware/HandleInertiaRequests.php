<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Ramsey\Uuid\Rfc4122\UuidV4;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     *
     * @return string|null
     */
    public function version(Request $request)
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array
     */
    public function share(Request $request)
    {
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'uuid' => UuidV4::uuid4(),
                'message' => fn () => $request->session()
                    ->get('message'),
                'success' => fn () => $request->session()
                    ->get('success'),
                'error' => fn () => $request->session()
                    ->get('error'),
            ],
            'gtmEvent' => fn () => $request->session()
                ->get('gtmEvent'),
        ]);
    }
}
