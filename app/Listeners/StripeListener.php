<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Events\SubscriptionStatusChanged;
use App\Exceptions\NoAssociatedUserModel;
use App\Models\User;
use App\Notifications\PaymentSucceeded;
use Laravel\Cashier\Cashier;
use Laravel\Cashier\Events\WebhookReceived;

class StripeListener
{
    /**
     * Handle received Stripe webhooks.
     */
    public function handle(WebhookReceived $event): void
    {
        // Map invoice.payment_succeeded to handleInvoicePaymentSucceeded
        $fn = 'handle' . str_replace(' ', '', ucwords(
            preg_replace('/[^A-Za-z0-9\-]/', ' ', $event->payload['type'])
        ));

        if (method_exists($this, $fn)) {
            $this->{$fn}($event);
        }
    }

    /**
     * Handle invoice.payment_succeeded, send an email
     */
    public function handleInvoicePaymentSucceeded(WebhookReceived $event): void
    {
        $this->getUser($event)
            ->notify(new PaymentSucceeded());
    }

    public function handleCustomerSubscriptionUpdated(WebhookReceived $event): void
    {
        $user = $this->getUser($event);
        if (isset($event->payload['data']['object']['status'])) {
            event(new SubscriptionStatusChanged($user));
        }
    }

    /**
     * Get the associated user model from a stripe event
     *
     * @return User associated User model
     */
    private function getUser($event): User
    {
        // Prevent non-customer-specific function from calling this.
        if (! isset($event->payload['data']['object']['customer'])) {
            return null;
        }

        $stripeId = $event->payload['data']['object']['customer'];
        /** @var User $user */
        $user = Cashier::findBillable($stripeId);

        if (! $user) {
            throw new NoAssociatedUserModel($stripeId);
        }

        return $user;
    }
}
