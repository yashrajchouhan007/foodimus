<?php

declare(strict_types=1);

return [
    'create' => [
        'success' => 'You\'ve been subscribed.',
        'exists' => 'You\'re already subscribed.',
        'error' => 'Something went wrong while creating your subscription, sorry for the inconvenience. Please contact our support.',
        'missing_payment_method' => 'Please add a valid payment method to start your subscription.',
        'missing_fields' => 'Please complete your profile before starting a subscription',
        'add_payment' => 'Please add a payment method before starting a subscription.',
    ],
    'payment_method' => [
        'save' => [
            'success' => 'Your payment method has been added.',
            'error' => 'Something went wrong while adding your payment method. Please contact our support.',
        ],
        'delete' => [
            'success' => 'Your payment method has been removed.',
            'error' => 'Something went wrong while removing your payment method. Please contact our support.',
        ],
        'set_default' => [
            'success' => 'Your default payment method has been updated.',
            'error' => 'Something went wrong while setting your default payment method. Please contact our support.',
        ],
    ],
    'unsubscribe' => [
        'success' => 'Your subscription has been cancelled.',
        'not_subscribed' => 'You have no active subscriptions.',
        'error' => 'Something went wrong while cancelling your subscription.',
    ],
    'middleware' => [
        'authentication_required' => 'You must be authenticated to access that page.',
        'subscription_required' => 'You must be subscribed to access that page.',
    ],
];
