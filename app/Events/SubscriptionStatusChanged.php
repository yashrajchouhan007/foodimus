<?php

declare(strict_types=1);

namespace App\Events;

use Illuminate\Queue\SerializesModels;

class SubscriptionStatusChanged
{
    use SerializesModels;

    /**
     * The authenticated user.
     *
     * @var \App\Models\User
     */
    public $user;

    /**
     * Create a new event instance.
     *
     * @param  \App\Models\User  $user
     */
    public function __construct($user)
    {
        $this->user = $user;
    }
}
