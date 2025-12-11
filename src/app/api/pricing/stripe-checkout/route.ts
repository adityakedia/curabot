import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil'
});

export async function POST(request: NextRequest) {
  const { priceId } = await request.json();

  if (!priceId) {
    return NextResponse.json(
      { error: 'Price ID is required' },
      { status: 400 }
    );
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1
      }
    ],
    mode: 'subscription',
    success_url: `${request.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${request.nextUrl.origin}/pricing`
  });

  return NextResponse.json({ sessionId: session.id });
}
