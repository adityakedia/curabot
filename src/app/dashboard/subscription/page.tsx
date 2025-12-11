import { currentUser } from '@clerk/nextjs/server';
import { getUserByClerkId } from '@/lib/temp-user-db';
import { getPricingPlans } from '@/lib/stripe-pricing';
import { PageContainer } from '@/components/dashboard-modern/page-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Zap } from 'lucide-react';
import { IconCheck } from '@tabler/icons-react';
import PricingButton from '@/components/pricing/pricing-button';

export default async function SubscriptionPage() {
  const user = await currentUser();
  const userData = user ? getUserByClerkId(user.id) : null;
  const pricingPlans = await getPricingPlans();
  const paidPlans = pricingPlans.filter((plan) => plan.price > 0);

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-8'>
        {/* Page Header */}
        <div className='space-y-2'>
          <h1 className='text-foreground text-3xl font-black tracking-tight md:text-4xl'>
            Subscription Management
          </h1>
          <p className='text-muted-foreground text-lg'>
            Manage your subscription and billing preferences
          </p>
        </div>

        {userData?.subscriptionStatus ? (
          /* Active Subscription */
          <Card className='bg-card border-border'>
            <CardHeader>
              <CardTitle className='text-card-foreground flex items-center gap-2'>
                <CreditCard className='h-5 w-5' />
                Current Subscription
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='flex items-center gap-2'>
                  <span className='text-card-foreground'>Status:</span>
                  <Badge
                    className={
                      userData.subscriptionStatus === 'active'
                        ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }
                  >
                    {userData.subscriptionStatus}
                  </Badge>
                </div>

                <div className='text-card-foreground'>
                  <span>Subscription ID: </span>
                  <code className='bg-muted text-muted-foreground rounded px-2 py-1 font-mono text-sm'>
                    {userData.subscriptionId}
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* No Subscription - Pricing Plans */
          <div className='py-12 text-center'>
            <div className='bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full'>
              <Zap className='text-muted-foreground h-8 w-8' />
            </div>
            <h3 className='text-foreground mb-2 text-xl font-bold'>
              No Active Subscription
            </h3>
            <p className='text-muted-foreground mb-8'>
              Choose a plan to unlock all features and start automating
            </p>

            <div className='mx-auto grid max-w-5xl gap-8 md:grid-cols-3'>
              {paidPlans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg ${
                    plan.highlighted ? 'border-primary shadow-md' : ''
                  }`}
                >
                  <CardHeader>
                    <CardTitle className='text-card-foreground'>
                      {plan.name}
                    </CardTitle>
                    <div className='text-foreground text-3xl font-bold'>
                      ${plan.price}
                      <span className='text-muted-foreground text-sm'>
                        /month
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className='mb-6 space-y-2'>
                      {plan.features.map((feature, index) => (
                        <li key={index} className='flex items-center gap-2'>
                          <IconCheck className='h-4 w-4 text-green-600 dark:text-green-400' />
                          <span className='text-card-foreground'>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <PricingButton plan={plan} className='w-full' />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
