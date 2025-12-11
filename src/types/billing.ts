/**
 * Billing and subscription type definitions
 * Contains interfaces for Stripe pricing, plans, and payment-related structures
 */

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  priceId: string;
  features: string[];
  buttonText: string;
  buttonVariant: 'default' | 'outline';
  highlighted?: boolean;
}

// Future billing types can go here
export interface SubscriptionDetails {
  // when you need subscription data
}

export interface PaymentMethod {
  // when you need payment method data
}
