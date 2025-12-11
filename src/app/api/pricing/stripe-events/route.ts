import { NextRequest, NextResponse } from 'next/server';
import log from '@/lib/logger';
import { getUserByStripeId, updateSubscription } from '@/lib/temp-user-db';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil'
});

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    log.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
  }

  log.info('Stripe webhook event received', { type: event.type });

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      log.info('Checkout completed for customer', {
        customer: session.customer
      });
      break;

    case 'invoice.payment_succeeded':
      // Read invoice properties from a raw object to handle API-version differences
      const rawInvoice = event.data.object as unknown as Record<string, any>;
      if (rawInvoice.subscription) {
        const user = getUserByStripeId(rawInvoice.customer as string);
        if (user) {
          updateSubscription(user.clerkUserId, {
            subscriptionStatus: 'active',
            subscriptionId: String(rawInvoice.subscription),
            priceId: rawInvoice.lines?.data?.[0]?.price?.id
          });
          log.info('Subscription activated for user', {
            userId: user.clerkUserId
          });
        }
      }
      break;

    case 'customer.subscription.deleted':
      const subscription = event.data.object as Stripe.Subscription;
      const user = getUserByStripeId(subscription.customer as string);
      if (user) {
        updateSubscription(user.clerkUserId, {
          subscriptionStatus: 'canceled'
        });
        log.info('Subscription canceled for user', {
          userId: user.clerkUserId
        });
      }
      break;
  }

  return NextResponse.json({ received: true });
}
