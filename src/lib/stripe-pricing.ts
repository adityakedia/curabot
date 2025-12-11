import Stripe from 'stripe';
import { PricingPlan } from '../types/billing';
import log from './logger';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil'
});

export async function getPricingPlans(): Promise<PricingPlan[]> {
  try {
    const prices = await stripe.prices.list({
      active: true,
      expand: ['data.product'],
      limit: 100
    });

    const plans: PricingPlan[] = [];

    for (const price of prices.data) {
      const product = price.product as Stripe.Product;

      if (price.unit_amount === null || price.unit_amount === undefined)
        continue;
      if (!product.active) continue;

      log.debug('Stripe price loaded', {
        priceId: price.id,
        nickname: price.nickname,
        productName: product.name
      });

      const plan: PricingPlan = {
        id: price.id,
        name: price.nickname || product.name,
        description: product.description || '',
        price: price.unit_amount / 100,
        currency: price.currency,
        priceId: price.id,
        features: [
          price.metadata?.Bot || price.metadata?.Bots,
          price.metadata?.Flows,
          price.metadata?.Model || price.metadata?.Models
        ].filter(Boolean),
        buttonText: 'Subscribe',
        buttonVariant: 'default',
        highlighted: false
      };

      plans.push(plan);
    }

    return plans.sort((a, b) => a.price - b.price);
  } catch (error) {
    log.error('Error fetching pricing from Stripe:', error);
    return []; // This was missing - always return an array
  }
}
