<?php

declare(strict_types=1);

namespace App\Helpers;

class Pricing
{
    public static function getPricingOptions(\App\Models\User $user): array
    {
        //TODO: get these from Stripe
        return [
            'monthly' => [
                'currency' => 'USD',
                'amount' => 16.99,
            ],
            'yearly' => [
                'currency' => 'USD',
                'amount' => 99,
            ],
        ];
    }
}
