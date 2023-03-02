<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\User;

class UserObserver
{
    /**
     * Handle the User "created" event.
     */
    public function created(User $user): void
    {
        $user->ensureStripeCustomerExists();
    }

    /**
     * Handle the User "updated" event.
     */
    public function updated(User $user): void
    {
        $user->updateStripeCustomer();
    }
}
