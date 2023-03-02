# Payments

This file documents everything payment related.

## Stripe

### Configuring Stripe

This project makes use of stripe 'products' and 'prices' as a means of facilitating subscriptions. Whenever a subscription is made in this code base, a stripe price within a product gets bought. In your stripe dashboard, navigate to [products](https://dashboard.stripe.com/test/products/). Either create a new product or select an existing one. Every product has multiple prices, displayed in the pricing table in stripe. Only one of those can be used as a default Foodimus subscription. Presumably this'll be a price which is recurring and costs 9.99 per month. Copy the price id and set it as `STRIPE_DEFAULT_PRICE_ID`. The code base will look for `config/services.php -> stripe.default_subscription` and use that to start new subscriptions.

#### Webhook event

The code base exposes the route `/stripe/webhook` for handling Stripe webhook events. Make sure to register it in stripe and enable at least the following events:

- customer.subscription.created
- customer.subscription.updated
- customer.subscription.deleted
- customer.updated
- customer.deleted
- invoice.payment_action_required
