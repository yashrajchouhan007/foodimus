<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\DeletePaymentMethodRequest;
use App\Http\Requests\SavePaymentMethodRequest;
use App\Http\Requests\SetDefaultPaymentMethodRequest;
use App\Models\User;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class PaymentMethodController extends Controller
{
    public function subscribe(Request $request): RedirectResponse
    {
        return redirect()->route('user-subscription', [
            'modal' => 'add-payment-method',
            'internalRedirect' => $request->internalRedirect,
        ]);
    }

    /**
     * Set a new default payment method based
     *
     * @param SetDefaultPaymentMethodRequest $request Instance of the validated request
     * @return RedirectResponse redirect
     */
    public function setDefault(SetDefaultPaymentMethodRequest $request): RedirectResponse
    {
        /** @var User $user */
        $user = Auth::user();

        try {
            $user->updateDefaultPaymentMethod($request['id']);
        } catch (Exception $e) {
            Log::error($e);
            return redirect($request['internalRedirect']['error'] ?? route('user-subscription'))->with(
                'error',
                trans('subscriptions.payment_method.set_default.error')
            );
        }

        return redirect($request['internalRedirect']['success'] ?? route('user-subscription'))->with(
            'success',
            trans('subscriptions.payment_method.set_default.success')
        );
    }

    /**
     * Display a form for adding a new payment method
     *
     * @return Inertia\Response Rendered form
     */
    public function create(Request $request): Response
    {
        /** @var User $user */
        $user = Auth::user();

        return Inertia::render('PaymentMethod/Create', [
            // A "Setup Intent" indicates to Stripe the intention to charge a customer's payment method for the first time.
            'client_secret' => $user->createSetupIntent()
                ->client_secret,
            // Forward redirects if needed
            'internalRedirect' => [
                'success' => $request['internalRedirect']['success'] ?? null,
                'error' => $request['internalRedirect']['error'] ?? null,
            ],
        ]);
    }

    /**
     * Delete the given payment method
     *
     * @return RedirectResponse redirect
     */
    public function delete(DeletePaymentMethodRequest $request): RedirectResponse
    {
        /** @var User $user */
        $user = Auth::user();

        try {
            $user->findPaymentMethod($request['id'])->delete();

            $remaining = $user->paymentMethods();
            if (count($remaining) > 0) {
                // If the user has other payment methods, set one of them as the new default
                $user->updateDefaultPaymentMethod($remaining[0]->id);
            }
        } catch (Exception $e) {
            Log::error($e);
            return redirect($request['internalRedirect']['error'] ?? route('user-subscription'))->with(
                'error',
                trans('subscriptions.payment_method.delete.error')
            );
        }

        return redirect($request['internalRedirect']['success'] ?? route('user-subscription'))->with(
            'success',
            trans('subscriptions.payment_method.delete.success')
        );
    }

    /**
     * Save a payment method after stripe form submission
     *
     * @return RedirectResponse Redirect
     */
    public function save(SavePaymentMethodRequest $request): RedirectResponse
    {
        /** @var User $user */
        $user = Auth::user();

        try {
            $user->addPaymentMethodFromToken($request['intent']['payment_method']);
        } catch (Exception $e) {
            Log::error($e);
            return redirect($request['internalRedirect']['error'] ?? route('payment_method.create'))
                ->with('error', trans('subscriptions.payment_method.save.error'));
        }

        return redirect($request['internalRedirect']['success'] ?? route('user-subscription'))->with(
            'success',
            trans('subscriptions.payment_method.save.success')
        );
    }
}
