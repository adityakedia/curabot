import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { IconPhone, IconClock, IconHeart, IconShieldCheck, IconUsers } from '@tabler/icons-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'CuraBot - Caring Voice Companion for Medication Reminders',
  description: 'CuraBot is a trusted AI voice companion that helps elderly loved ones take their medications on time through gentle phone call reminders and daily wellness check-ins.',
  keywords: ['medication reminder', 'elderly care', 'caregiver support', 'senior health', 'voice assistant', 'medication adherence'],
};

export default async function Page() {
  const { userId } = await auth();

  if (userId) {
    redirect('/dashboard/patients');
  }

  return (
    <div className='min-h-screen bg-white'>
      {/* Header */}
      <header className='border-b border-gray-100'>
        <div className='container mx-auto flex items-center justify-between px-6 py-4'>
          <Link href='/' className='flex items-center gap-2'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-teal-600'>
              <IconPhone className='h-5 w-5 text-white' />
            </div>
            <span className='text-xl font-semibold text-gray-900'>CuraBot</span>
          </Link>
          <nav className='flex items-center gap-4'>
            <Link href='/auth/sign-in'>
              <Button variant='ghost' className='text-gray-600 hover:text-gray-900'>
                Sign In
              </Button>
            </Link>
            <Link href='/auth/sign-up'>
              <Button className='bg-teal-600 text-white hover:bg-teal-700'>
                Get Started
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className='border-b border-gray-100 bg-gradient-to-b from-teal-50 to-white'>
        <div className='container mx-auto px-6 py-20 md:py-28'>
          <div className='mx-auto max-w-3xl text-center'>
            <div className='mb-6 inline-flex items-center gap-2 rounded-full bg-teal-100 px-4 py-2 text-sm font-medium text-teal-800'>
              <IconShieldCheck className='h-4 w-4' />
              <span>Trusted by 2,000+ Caregivers</span>
            </div>
            
            <h1 className='mb-6 text-4xl font-bold leading-tight text-gray-900 md:text-5xl'>
              Never Worry About Missed Medications Again
            </h1>
            
            <p className='mb-8 text-lg text-gray-600 md:text-xl'>
              CuraBot makes gentle, personalized phone calls to remind your elderly loved ones to take their medications on time—giving you peace of mind, even when you can't be there.
            </p>
            
            <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
              <Link href='/auth/sign-up'>
                <Button className='w-full rounded-lg bg-teal-600 px-8 py-6 text-lg font-semibold text-white shadow-sm hover:bg-teal-700 sm:w-auto'>
                  Start Free 14-Day Trial
                </Button>
              </Link>
              <p className='text-sm text-gray-500'>No credit card required</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className='border-b border-gray-100 bg-gray-50 py-8'>
        <div className='container mx-auto px-6'>
          <div className='flex flex-col items-center justify-center gap-8 text-center text-sm text-gray-600 md:flex-row md:gap-12'>
            <div className='flex items-center gap-2'>
              <IconShieldCheck className='h-5 w-5 text-teal-600' />
              <span>HIPAA Compliant</span>
            </div>
            <div className='flex items-center gap-2'>
              <IconUsers className='h-5 w-5 text-teal-600' />
              <span>50,000+ Calls Made</span>
            </div>
            <div className='flex items-center gap-2'>
              <IconHeart className='h-5 w-5 text-teal-600' />
              <span>98% Satisfaction Rate</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className='py-20'>
        <div className='container mx-auto px-6'>
          <div className='mx-auto max-w-3xl text-center'>
            <h2 className='mb-4 text-3xl font-bold text-gray-900'>
              How CuraBot Works
            </h2>
            <p className='mb-16 text-lg text-gray-600'>
              Simple setup, reliable care. CuraBot handles the reminders so you can focus on what matters.
            </p>
          </div>
          
          <div className='mx-auto grid max-w-4xl gap-12 md:grid-cols-3'>
            {/* Step 1 */}
            <div className='text-center'>
              <div className='mb-4 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-xl font-bold text-teal-600'>
                  1
                </div>
              </div>
              <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                Set Up Schedule
              </h3>
              <p className='text-gray-600'>
                Enter medication times and your loved one's phone number. Takes less than 5 minutes.
              </p>
            </div>

            {/* Step 2 */}
            <div className='text-center'>
              <div className='mb-4 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-xl font-bold text-teal-600'>
                  2
                </div>
              </div>
              <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                CuraBot Calls
              </h3>
              <p className='text-gray-600'>
                At scheduled times, CuraBot makes a friendly call with a warm, natural voice they'll recognize.
              </p>
            </div>

            {/* Step 3 */}
            <div className='text-center'>
              <div className='mb-4 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-xl font-bold text-teal-600'>
                  3
                </div>
              </div>
              <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                Stay Informed
              </h3>
              <p className='text-gray-600'>
                Get notifications when calls are completed and track medication adherence over time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className='border-t border-gray-100 bg-gray-50 py-20'>
        <div className='container mx-auto px-6'>
          <div className='mx-auto max-w-3xl text-center'>
            <h2 className='mb-4 text-3xl font-bold text-gray-900'>
              Built for Caregivers, Loved by Families
            </h2>
            <p className='mb-16 text-lg text-gray-600'>
              Every feature designed with your family's wellbeing in mind.
            </p>
          </div>
          
          <div className='mx-auto grid max-w-5xl gap-8 md:grid-cols-2'>
            {/* Feature 1 */}
            <div className='rounded-xl bg-white p-8 shadow-sm'>
              <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-teal-100'>
                <IconPhone className='h-6 w-6 text-teal-600' />
              </div>
              <h3 className='mb-2 text-xl font-semibold text-gray-900'>
                Natural Voice Calls
              </h3>
              <p className='text-gray-600'>
                Not a robotic reminder—CuraBot speaks with a warm, patient voice that feels like a caring friend, not a machine.
              </p>
            </div>

            {/* Feature 2 */}
            <div className='rounded-xl bg-white p-8 shadow-sm'>
              <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-teal-100'>
                <IconClock className='h-6 w-6 text-teal-600' />
              </div>
              <h3 className='mb-2 text-xl font-semibold text-gray-900'>
                Flexible Scheduling
              </h3>
              <p className='text-gray-600'>
                Set multiple daily reminders for different medications. CuraBot adapts to your loved one's routine.
              </p>
            </div>

            {/* Feature 3 */}
            <div className='rounded-xl bg-white p-8 shadow-sm'>
              <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-teal-100'>
                <IconHeart className='h-6 w-6 text-teal-600' />
              </div>
              <h3 className='mb-2 text-xl font-semibold text-gray-900'>
                Wellness Check-Ins
              </h3>
              <p className='text-gray-600'>
                Beyond medications, CuraBot can ask how they're feeling and alert you if something seems off.
              </p>
            </div>

            {/* Feature 4 */}
            <div className='rounded-xl bg-white p-8 shadow-sm'>
              <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-teal-100'>
                <IconShieldCheck className='h-6 w-6 text-teal-600' />
              </div>
              <h3 className='mb-2 text-xl font-semibold text-gray-900'>
                Private & Secure
              </h3>
              <p className='text-gray-600'>
                HIPAA-compliant and encrypted. Your family's health information is protected with enterprise-grade security.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className='py-20'>
        <div className='container mx-auto px-6'>
          <div className='mx-auto max-w-3xl text-center'>
            <blockquote className='mb-6 text-xl italic text-gray-700 md:text-2xl'>
              "My mother lives alone 200 miles away. CuraBot calls her every morning and evening for her heart medication. For the first time in years, I don't wake up worried about whether she remembered her pills."
            </blockquote>
            <div className='text-gray-600'>
              <p className='font-semibold text-gray-900'>Sarah M.</p>
              <p className='text-sm'>Caregiver for her 82-year-old mother</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='border-t border-gray-100 bg-teal-600 py-16'>
        <div className='container mx-auto px-6 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-white'>
            Give Your Loved One the Care They Deserve
          </h2>
          <p className='mb-8 text-lg text-teal-100'>
            Join thousands of caregivers who trust CuraBot to help their families stay healthy.
          </p>
          <Link href='/auth/sign-up'>
            <Button className='rounded-lg bg-white px-8 py-6 text-lg font-semibold text-teal-600 shadow-sm hover:bg-gray-100'>
              Start Your Free Trial
            </Button>
          </Link>
          <p className='mt-4 text-sm text-teal-200'>
            14 days free • No credit card required • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className='border-t border-gray-100 py-12'>
        <div className='container mx-auto px-6'>
          <div className='flex flex-col items-center justify-between gap-6 md:flex-row'>
            <div className='flex items-center gap-2'>
              <div className='flex h-8 w-8 items-center justify-center rounded-full bg-teal-600'>
                <IconPhone className='h-4 w-4 text-white' />
              </div>
              <span className='font-semibold text-gray-900'>CuraBot</span>
            </div>
            <div className='flex gap-8 text-sm text-gray-600'>
              <Link href='/pricing' className='hover:text-gray-900'>Pricing</Link>
              <Link href='/faq' className='hover:text-gray-900'>FAQ</Link>
              <Link href='/auth/sign-in' className='hover:text-gray-900'>Sign In</Link>
            </div>
            <p className='text-sm text-gray-500'>
              © 2025 CuraBot. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
