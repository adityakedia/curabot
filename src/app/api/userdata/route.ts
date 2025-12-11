import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import {
  getUserByClerkId,
  createUser,
  linkStripeCustomer
} from '@/lib/temp-user-db';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil'
});

export async function POST(request: NextRequest) {
  const { priceId } = await request.json();
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get or create user in temp DB
  let user = getUserByClerkId(clerkUser.id);
  if (!user) {
    user = createUser(clerkUser.id);
  }

  // Get or create Stripe customer
  let stripeCustomerId = user.stripeCustomerId;
  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: clerkUser.emailAddresses[0].emailAddress,
      metadata: { clerkUserId: clerkUser.id }
    });
    stripeCustomerId = customer.id;
    linkStripeCustomer(clerkUser.id, stripeCustomerId);
  }

  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: `${request.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${request.nextUrl.origin}/pricing`
  });

  return NextResponse.json({ sessionId: session.id });
}
