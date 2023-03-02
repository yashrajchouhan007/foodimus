<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Events\SubscriptionStatusChanged;
use App\Exceptions\AlreadySubscribedException;
use App\Exceptions\NoPaymentMethodException;
use App\Helpers\Pricing;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Stripe\Exception\InvalidRequestException;

class SubscriptionController extends Controller
{
    public function view(Request $request)
    {
        $modal = $request->modal;
        $data = [];

        /** @var User $user */
        $user = Auth::user();
        $data['invoices'] = $user->invoicesIncludingPending()
            ->map(function ($invoice) {
                return array_merge($invoice->toArray(), [
                    // Prerender calculated functions for the frontend
                    'props' => [
                        'date' => $invoice->date(),
                        'total' => $invoice->total(),
                    ],
                ]);
            });
        $subscription = $user->subscription();
        $stripe_sub = $subscription === null ? null : $subscription->asStripeSubscription();
        if ($stripe_sub !== null) {
            $data['subscription'] = [
                'status' => $stripe_sub->status,
                'cancel_at_period_end' => $stripe_sub->cancel_at_period_end,
                'renewal' => null,
                'payment_type' => null,
            ];
            if ($subscription->hasPrice(config('services.stripe.default_subscription'))) {
                $data['subscription']['payment_type'] = 'monthly';
            } elseif ($subscription->hasPrice(config('services.stripe.yearly_subscription'))) {
                $data['subscription']['payment_type'] = 'yearly';
            }
            if ($stripe_sub->status === 'trialing' && $stripe_sub->trial_end !== null) {
                $data['subscription']['renewal'] = Carbon::createFromTimeStamp($stripe_sub->trial_end)
                    ->toIso8601String();
            } elseif ($stripe_sub->current_period_end !== null) {
                $data['subscription']['renewal'] = Carbon::createFromTimeStamp($stripe_sub->current_period_end)
                    ->toIso8601String();
            }
        }

        $data['payment_methods'] = $user->paymentMethods();
        $data['default_payment_method'] = $user->defaultPaymentMethod();
        $data['prices'] = \App\Helpers\Pricing::getPricingOptions($user);
        if ($modal === 'add-payment-method') {
            $data['add_payment_method'] = \App\Helpers\User::getPaymentMethodDetails($user);
        }
        return Inertia::render('MyFoodimus/user/Subscription', $data);
    }

    /**
     * Cancel all subscriptions
     *
     * @return RedirectResponse Redirect to user-subscription with flash message
     */
    public function cancel(): RedirectResponse
    {
        /** @var User $user */
        $user = Auth::user();

        if (! $user->subscription()) {
            return redirect()->route('user-subscription')
                ->with('message', trans('subscriptions.unsubscribe.not_subscribed'));
        }

        try {
            $user->unsubscribe();
        } catch (Exception $e) {
            Log::error($e);
            return redirect()->route('user-subscription')
                ->with('error', trans('subscriptions.unsubscribe.error'));
        }

        return redirect()->route('user-subscription')
            ->with('success', trans('subscriptions.unsubscribe.success'));
    }

    /**
     * Start the subscription flow for the authenticated user
     *
     * @return RedirectResponse Redirect depending on the subscription state
     */
    public function subscribe(Request $request): RedirectResponse
    {
        /** @var User $user */
        $user = Auth::user();
        if ($user->subscribed() && ! $user->subscription()->onGracePeriod()) {
            return redirect()->route('user-subscription')
                ->with('message', trans('subscriptions.create.exists'));
        }

        $param = [
            'paymentType' => $request->paymentType ?? 'monthly',
        ];

        if ($user->paymentMethods()->count() < 1) {
            return redirect()->route('payment_method.create', [
                // Set the redirect routes to the subscription flow
                'internalRedirect' => [
                    'success' => route('subscription.subscribe', $param),
                    'error' => route('user-subscription'),
                ],
            ])->with('message', trans('subscriptions.create.add_payment'));
        }

        if ($request->redirect !== null) {
            $param['redirect'] = $request->redirect;
        }
        if ($request->redirectUrl !== null) {
            $param['redirectUrl'] = $request->redirectUrl;
        }
        return redirect()->route('subscription.create', $param);
    }

    /**
     * Subscribe the currently authenticated user to the default stripe subscription
     *
     * @return RedirectResponse Redirect to user-subscription with a flash message
     */
    public function create(Request $request): RedirectResponse
    {
        /** @var User $user */
        $user = Auth::user();
        $paymentType = $request->paymentType;
        $sub = null;
        $sub_new = null;
        try {
            if ($request->paymentType === 'yearly') {
                $sub = $user->subscribe(config('services.stripe.yearly_subscription'), $sub_new);
            } else {
                $paymentType = 'monthly';
                $sub = $user->subscribe(config('services.stripe.default_subscription'), $sub_new);
            }
        } catch (AlreadySubscribedException $e) {
            return redirect()->route('user-subscription')
                ->with('message', trans('subscriptions.create.exists'));
        } catch (NoPaymentMethodException $e) {
            throw $e;
            return redirect()->route('user-subscription')
                ->with('error', trans('subscriptions.create.missing_payment_method'));
        } catch (InvalidRequestException $e) {
            switch ($e->getStripeCode()) {
                case 'resource_missing':
                    return redirect()->route('user-subscription')
                        ->with('error', trans('subscriptions.create.missing_payment_method'));
                case 'parameter_missing':
                    return redirect()->route('user-subscription')
                        ->with('error', trans('subscriptions.create.missing_fields'));
            }

            Log::error($e);
            return redirect()->route('user-subscription')
                ->with('error', trans('subscriptions.create.error'));
        } catch (Exception $e) {
            Log::error($e);
            return redirect()->route('user-subscription')
                ->with('error', trans('subscriptions.create.error'));
        }
        event(new SubscriptionStatusChanged($user));

        // pass GTM event to the front end if a conversion has occurred
        if ($sub_new === true) {
            try {
                $amount = '0.00';
                $currency = 'USD';
                $pricing = Pricing::getPricingOptions($user)[$paymentType];
                $amount = strval($pricing['amount']);
                $currency = $pricing['currency'];

                $stripe_sub = $sub === null ? null : $sub->asStripeSubscription();
                Log::info('Attach GTM event');
                session()
                    ->flash('gtmEvent', [
                        [
                            'ecommerce' => null,
                        ],
                        [
                            'event' => 'purchase',
                            'ecommerce' => [
                                'purchase' => [
                                    'currencyCode' => $currency,
                                    'actionField' => [
                                        'id' => $stripe_sub->latest_invoice,
                                        // Transaction ID. Required for purchases and refunds.
                                        'affiliation' => 'Foodimus',
                                        'revenue' => $amount,
                                        // Total transaction value (incl. tax and shipping)
                                        'tax' => '0',
                                        'shipping' => '0',
                                    ],
                                    'products' => [
                                        [
                                            'name' => "Foodimus ${paymentType} plan - trial",
                                            'id' => "${paymentType}_trial",
                                            'price' => $amount,
                                            'quantity' => 1,
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ]);
            } catch (\Exception $e) {
                \Sentry\captureException($e);
                Log::error($e);
            }
        } else {
            Log::info('Not attaching GTM event');
        }
        if ($request->redirect !== null) {
            return redirect()->route($request->redirect);
        }
        if ($request->redirectUrl !== null) {
            return redirect($request->redirectUrl);
        }
        return redirect()->route('user-subscription')
            ->with('success', trans('subscriptions.create.success'));
    }
}
