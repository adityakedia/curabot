import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { getUserByClerkId } from '@/lib/temp-user-db';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil'
});

// GET subscription status from Stripe
export async function GET() {
  const clerkUser = await currentUser();
  if (!clerkUser)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = getUserByClerkId(clerkUser.id);
  if (!user?.subscriptionId) return NextResponse.json({ subscription: null });

  // Get live data from Stripe
  const subscription = await stripe.subscriptions.retrieve(user.subscriptionId);

  // Convert to a simple object to safely read unknown Stripe response fields
  const raw = subscription as unknown as Record<string, any>;
  const currentPeriodEndUnix = raw.current_period_end ?? null;
  const cancelAtPeriodEnd = raw.cancel_at_period_end ?? null;

  return NextResponse.json({
    status: subscription.status,
    subscriptionId: subscription.id,
    currentPeriodEnd: currentPeriodEndUnix
      ? new Date(currentPeriodEndUnix * 1000)
      : null,
    cancelAtPeriodEnd
  });
}

// CANCEL subscription in Stripe
export async function DELETE() {
  const clerkUser = await currentUser();
  if (!clerkUser)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = getUserByClerkId(clerkUser.id);
  if (!user?.subscriptionId)
    return NextResponse.json({ error: 'No subscription' }, { status: 404 });

  await stripe.subscriptions.cancel(user.subscriptionId);

  return NextResponse.json({ success: true });
}
