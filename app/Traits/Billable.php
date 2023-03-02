<?php

declare(strict_types=1);

namespace App\Traits;

use App\Exceptions\AlreadySubscribedException;
use Laravel\Cashier\Billable as CashierBillable;
use Laravel\Cashier\PaymentMethod;
use Laravel\Cashier\Subscription;
use Stripe\Customer;

/**
 * Extension of the Cashier Billable trait
 */
trait Billable
{
    // Import all cashier billable functions
    use CashierBillable {
        // All functions in this block get overridden and extended with this trait
        updateStripeCustomer as traitUpdateStripeCustomer;

    }

    /**
     * Create a stripe subscription
     *
     * @param string|null $stripePlan Name of the stripe plan to subscribe to
     * @return Subscription Instance of the new subscription
     */
    public function subscribe(?string $stripePlan = null, ?bool & $isNew = null): Subscription
    {
        $stripePlan = $stripePlan ?: config('services.stripe.default_subscription');

        $this->ensureStripeCustomerExists();

        if ($this->subscribed()) {
            $sub = $this->subscription();
            if ($sub->onGracePeriod()) {
                // If a subsciption exists but is going to end, we'll resume it
                if ($sub->hasPrice($stripePlan)) {
                    // the user was using the same plan before, we can simply resume it
                    $sub->resume();
                    $isNew = false;
                } else {
                    // the user was using another plan before, we need to swap plans
                    $sub->swap($stripePlan);
                    $isNew = false;
                }
                return $this->subscription();
            }
            throw new AlreadySubscribedException();
        }

        $paymentMethodId = null;
        if (! empty($this->defaultPaymentMethod())) {
            $paymentMethodId = $this->defaultPaymentMethod()
                ->id;
        }

        $isNew = true;
        return $this->newSubscription('default', $stripePlan)
            ->trialDays(7)
            ->create($paymentMethodId, $this->getStripeSubscriptionData());
    }

    /**
     * Get the data required for the Laravel\Cashier\Subscription::create function
     *
     * @return array Array of stripe subscription data
     */
    abstract public function getStripeSubscriptionData(): array;

    /**
     * Get an array of all stripe customer parameters as expecter by Stripe\Customer::create
     *
     * @return array Array of stripe customer parameters
     */
    abstract public function getStripeCustomerParams(): array;

    /**
     * Unsubscribe object from all subscriptions
     *
     * @return self instance of current object
     */
    public function unsubscribe(): self
    {
        $this->subscriptions->each(function (Subscription $subscription) {
            if ($subscription->active()) {
                $subscription->cancel();
            }
        });

        return $this;
    }

    /**
     * Ensure that a stripe customer instance exists for this object
     */
    public function ensureStripeCustomerExists(): self
    {
        if (empty($this->hasStripeId())) {
            $this->createOrGetStripeCustomer($this->getStripeCustomerParams());
        }

        return $this;
    }

    /**
     * Add a payment method
     *
     * @param bool $default Whether the card must be set as the default payment method
     * @return PaymentMethod Newly created payment method
     */
    public function addPaymentMethodFromToken(string $paymentMethodToken, bool $default = true): PaymentMethod
    {
        $this->ensureStripeCustomerExists();
        $paymentMethod = $this->addPaymentMethod($paymentMethodToken);

        if ($default) {
            $this->updateStripeCustomer([
                'invoice_settings' => [
                    'default_payment_method' => $paymentMethod->id,
                ],
            ]);
        }

        return $paymentMethod;
    }

    /**
     * Update the underlying Stripe customer information for the model.
     *
     * @overrides Laravel\Cashier\Concerns\ManagesCustomers::updateStripeCustomer
     */
    public function updateStripeCustomer(?array $options = []): Customer
    {
        $this->ensureStripeCustomerExists();

        return $this->traitUpdateStripeCustomer(array_merge($this->getStripeCustomerParams(), $options));
    }
}
