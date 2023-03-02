<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Influencer;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class FinishAccountSetupController extends Controller
{
    /**
     * Display the finish account view.
     *
     * @return \Illuminate\View\View
     */
    public function create(Request $request)
    {
        $data = [
            'email' => $request->email,
            'token' => $request->route('token'),
            'has_payment_method' => false,
            'has_password' => false,
        ];
        /** @var User $user */
        $user = Auth::user();
        $data['has_password'] = $user !== null && $user->password !== null;
        $payment_method = $user === null ? null : $user->defaultPaymentMethod();
        if ($payment_method !== null) {
            //TODO: do we need to do further checks?
            $data['has_payment_method'] = true;
        }

        return Inertia::render('MyFoodimus/onboarding/FinishAccount', $data);
    }

    /**
     * Handle an incoming finish account request.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // Here we will attempt to reset the user's password. If it is successful we
        // will update the password on an actual user model and persist it to the
        // database. Otherwise we will parse the error and return the response.
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user) use ($request) {
                $user->forceFill([
                    'password' => Hash::make($request->password),
                    'remember_token' => Str::random(60),
                ])->save();
                Auth::login($user);
                event(new PasswordReset($user));
            }
        );

        // If the password was successfully reset, we will redirect the user back to
        // the application's home authenticated view. If there is an error we can
        // redirect them back to where they came from with their error message.
        if ($status === Password::PASSWORD_RESET) {
            $c = null;
            if ($request->c) {
                try {
                    $c = json_decode(base64_decode($request->c, true));
                    if (gettype($c) !== 'object') {
                        $c = null;
                    }
                } catch (\Exception $e) {
                    $c = null;
                }
            }

            if ($c) {
                if ($c->f === 'a') {
                    // original "a" onboarding flow
                    return Redirect::route('setup-payment', [
                        'referer' => $request->referer,
                        'c' => $request->c,
                    ]);
                }
            }
            return Redirect::route('subscription.create', [
                'redirectUrl' => route(
                    'redirect',
                    [
                        'defaultUrl' => route('search', [
                            'section' => 'meal-plan',
                        ]),
                        'referer' => $request->
referer,
                    ]
                ),
            ]);
        }

        throw ValidationException::withMessages([
            'email' => [trans($status)],
        ]);
    }

    /**
     * Handle an incoming finish account request.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function paymentView(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        if ($user->subscriptions()->count()) {
            return redirect()->route('user-subscription');
        }
        $data = [
            'details' => \App\Helpers\User::getPaymentMethodDetails($user),
            'prices' => \App\Helpers\Pricing::getPricingOptions($user),
        ];
        $influencerImage = null;
        $testimonials = [];
        if ($request->referer !== null) {
            try {
                list($type, $slug) = explode(':', $request->referer, 2);
                switch ($type) {
                    case 'ambassador':
                    case 'influencer': //legacy links
                        try {
                            $influencer = Influencer::whereSlug($slug)->whereNotNull('testimonial')->wherePublished(
                                true
                            )->with('overlayImage', 'avatar')->first();
                            if ($influencer !== null) {
                                $influencerImage = $influencer->overlayImage->src;
                                $testimonials[] = [
                                    'slug' => $influencer->slug,
                                    'avatar' => $influencer->avatar,
                                    'name' => $influencer->full_name,
                                    'text' => $influencer->testimonial,
                                ];
                            }
                        } catch (\Exception $e) {
                            \Sentry\captureException($e);
                            Log::error($e);
                        }
                        break;
                    case 'meal-plan':
                        break;
                }
            } catch (\Exception $e) {
                Log::warning($e);
            }
        }
        if ($influencerImage === null) {
            try {
                $influencerImage = Influencer::whereSlug('tessa-moorman')->with('overlayImage')->first()
                    ->overlayImage->src;
            } catch (\Exception $e) {
                \Sentry\captureException($e);
            }
        }
        if (count($testimonials) < 3) {
            try {
                $rest = 3 - count($testimonials);
                $influencers = Influencer::whereNotIn('slug', array_map(function ($i) {
                    return $i['slug'];
                }, $testimonials))->whereNotNull('testimonial')
                    ->wherePublished(true)
                    ->inRandomOrder()
                    ->take($rest)
                    ->get();
                foreach ($influencers as $influencer) {
                    $testimonials[] = [
                        'slug' => $influencer->slug,
                        'avatar' => $influencer->avatar,
                        'name' => $influencer->full_name,
                        'text' => $influencer->testimonial,
                    ];
                }
            } catch (\Exception $e) {
                \Sentry\captureException($e);
                Log::error($e);
            }
        }
        $data['appExampleBackground'] = $influencerImage;
        $data['testimonials'] = $testimonials;
        return Inertia::render('MyFoodimus/onboarding/AddPayment', $data);
    }
}
