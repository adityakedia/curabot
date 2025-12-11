import {
  IconCheck,
  IconSparkles,
  IconBolt,
  IconTarget
} from '@tabler/icons-react';
import MarketingLayout from '@/components/layout/marketing-layout';
import { getPricingPlans } from '@/lib/stripe-pricing';
import PricingButton from '@/components/pricing/pricing-button';

export default async function PricingPage() {
  const pricingPlans = await getPricingPlans();

  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className='relative overflow-hidden bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/40 py-20 md:py-32'>
        {/* Subtle Background Elements */}
        <div className='absolute inset-0'>
          <div className='parallax-slow absolute top-20 left-10 h-96 w-96 animate-pulse rounded-full bg-gradient-to-br from-blue-100/15 to-purple-100/10 blur-3xl'></div>
          <div className='parallax-medium absolute right-20 bottom-32 h-80 w-80 animate-pulse rounded-full bg-gradient-to-br from-indigo-100/10 to-slate-100/8 blur-2xl delay-1000'></div>
        </div>

        <div className='relative z-10 container mx-auto px-6'>
          <div className='mx-auto max-w-4xl text-center'>
            {/* Badge */}
            <div className='mb-8 inline-flex items-center gap-2 rounded-full border border-gray-200/30 bg-white/70 px-4 py-2 text-sm font-medium tracking-wide text-gray-700 backdrop-blur-md'>
              <IconSparkles className='h-4 w-4 text-blue-500' />
              <span>Flexible Pricing Plans</span>
            </div>

            {/* Main Headline */}
            <h1 className='mb-6 text-4xl leading-tight font-black tracking-tight text-gray-900 md:text-6xl'>
              Simple, Transparent Pricing
            </h1>

            {/* Subtitle */}
            <p className='mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-gray-600'>
              Choose the plan that fits your creative workflow and scales with
              your success
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards Section */}
      <section className='relative overflow-hidden bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 py-20 md:py-32'>
        {/* Parallax Background Elements */}
        <div className='absolute inset-0'>
          <div className='parallax-slow animate-float absolute top-20 left-0 h-72 w-72 translate-x-[-50%] transform rounded-full bg-white/8 blur-2xl'></div>
          <div className='parallax-medium animate-float-delayed absolute right-0 bottom-20 h-96 w-96 translate-x-[50%] transform rounded-full bg-white/4 blur-3xl'></div>
        </div>

        <div className='relative z-10 container mx-auto px-6'>
          <div className='mx-auto grid max-w-6xl gap-8 md:grid-cols-3 md:gap-12'>
            {pricingPlans.map((plan, index) => (
              <div
                key={plan.id}
                className={`group relative transform rounded-3xl bg-white p-8 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:scale-105 hover:shadow-xl ${
                  index === 1 ? 'md:translate-y-8' : ''
                } ${plan.highlighted ? 'ring-2 ring-blue-400' : ''}`}
              >
                {/* Most Popular Badge */}
                {plan.highlighted && (
                  <div className='absolute -top-4 left-1/2 -translate-x-1/2 transform'>
                    <div className='inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 px-4 py-2 text-sm font-medium text-white'>
                      <IconBolt className='h-4 w-4' />
                      <span>Most Popular</span>
                    </div>
                  </div>
                )}

                <div className='relative z-10'>
                  {/* Plan Icon */}
                  <div className='mb-6'>
                    {index === 0 && (
                      <IconTarget className='h-12 w-12 text-blue-600' />
                    )}
                    {index === 1 && (
                      <IconSparkles className='h-12 w-12 text-purple-600' />
                    )}
                    {index === 2 && (
                      <IconBolt className='h-12 w-12 text-pink-600' />
                    )}
                  </div>

                  {/* Plan Title */}
                  <h3 className='mb-4 text-xl font-bold tracking-tight text-gray-900 md:text-2xl'>
                    {plan.name}
                  </h3>

                  {/* Plan Description */}
                  <p className='mb-6 leading-relaxed text-gray-600'>
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className='mb-8'>
                    <div className='flex items-baseline gap-2'>
                      <span className='text-4xl font-black text-gray-900'>
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: plan.currency.toUpperCase()
                        }).format(plan.price)}
                      </span>
                      <span className='text-gray-600'>/month</span>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className='mb-8 space-y-3'>
                    {plan.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className='flex items-center gap-3'
                      >
                        <IconCheck className='h-5 w-5 flex-shrink-0 text-green-500' />
                        <span className='text-gray-700'>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <PricingButton
                    plan={plan}
                    className={`flex w-full transform items-center justify-center gap-2 rounded-lg px-8 py-4 text-lg font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                      plan.highlighted
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                        : 'border-2 border-gray-200 bg-white text-gray-900 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
