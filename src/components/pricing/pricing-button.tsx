'use client';

import { useState } from 'react';
import log from '@/lib/logger';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';

interface PricingButtonProps {
  plan: {
    id: string;
    name: string;
    price: number;
    priceId: string | null;
    buttonText: string;
    buttonVariant: 'default' | 'outline';
  };
  className?: string;
}

export default function PricingButton({ plan, className }: PricingButtonProps) {
  const [loading, setLoading] = useState(false);
  const { isSignedIn } = useUser();

  // Free plan -> signup
  if (plan.price === 0) {
    return (
      <Button className={className} variant={plan.buttonVariant} asChild>
        <Link href='/auth/sign-up'>{plan.buttonText}</Link>
      </Button>
    );
  }

  // Paid plans
  const handleCheckout = async () => {
    // Check if user is signed in first
    if (!isSignedIn) {
      window.location.href = '/auth/sign-in?redirect_url=/pricing';
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/userdata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: plan.priceId })
      });

      const { sessionId } = await response.json();

      const stripe = await import('@stripe/stripe-js').then((mod) =>
        mod.loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
      );

      if (stripe) {
        await stripe.redirectToCheckout({ sessionId });
      }
    } catch (error) {
      log.error('Error during checkout:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      className={className}
      variant={plan.buttonVariant}
      onClick={handleCheckout}
      disabled={loading}
    >
      {loading
        ? 'Processing...'
        : isSignedIn
          ? plan.buttonText
          : 'Sign in to Subscribe'}
    </Button>
  );
}
