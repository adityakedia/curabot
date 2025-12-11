import Link from 'next/link';
import { IconSparkles, IconTarget, IconBolt } from '@tabler/icons-react';

export default function MarketingLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='w-full'>
      {/* Header */}
      <header className='relative z-50 w-full border-b border-gray-200/50 bg-white/95 backdrop-blur-sm'>
        <div className='container mx-auto flex h-16 items-center justify-between px-6'>
          <div className='flex items-center gap-8'>
            <Link
              href='/'
              className='text-2xl font-black tracking-tight text-gray-900'
            >
              ScreenFlow
            </Link>
            <nav className='hidden items-center gap-6 md:flex'>
              <Link
                href='/faq'
                className='text-sm font-medium text-gray-600 transition-colors hover:text-gray-900'
              >
                FAQ
              </Link>
            </nav>
          </div>
          <div className='flex items-center gap-3'>
            <button className='rounded-lg px-4 py-2 font-medium text-gray-600 transition-all duration-300 hover:bg-gray-50 hover:text-gray-900'>
              <Link href='/auth/sign-in'>Sign In</Link>
            </button>
            <button className='rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 font-semibold text-white shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl'>
              <Link href='/auth/sign-up'>Get Started</Link>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='w-full'>{children}</main>

      {/* Footer */}
      <footer className='relative overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900 text-white'>
        {/* Background Pattern */}
        <div className='absolute inset-0 opacity-10'>
          <div className='absolute top-20 left-20 h-32 w-32 rounded-full bg-white/10 blur-2xl'></div>
          <div className='absolute right-20 bottom-20 h-40 w-40 rounded-full bg-white/5 blur-3xl'></div>
        </div>

        <div className='relative z-10 container mx-auto px-6 py-16'>
          <div className='mb-12 grid grid-cols-1 gap-8 md:grid-cols-4'>
            {/* Brand */}
            <div>
              <h3 className='mb-4 text-xl font-bold tracking-tight md:text-2xl'>
                ScreenFlow
              </h3>
              <p className='leading-relaxed text-white/70'>
                Transform how you capture, organize, and create with visual
                references. Built for creative professionals.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className='mb-4 text-xl font-bold tracking-tight md:text-2xl'>
                Product
              </h4>
              <ul className='space-y-3'>
                <li>
                  <Link
                    href='/'
                    className='flex items-center gap-2 text-white/70 transition-colors hover:text-white'
                  >
                    <IconSparkles className='h-4 w-4' />
                    <span>Features</span>
                  </Link>
                </li>

                <li>
                  <Link
                    href='/faq'
                    className='flex items-center gap-2 text-white/70 transition-colors hover:text-white'
                  >
                    <IconBolt className='h-4 w-4' />
                    <span>FAQ</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className='mb-4 text-xl font-bold tracking-tight md:text-2xl'>
                Company
              </h4>
              <ul className='space-y-3'>
                <li>
                  <Link
                    href='/about'
                    className='text-white/70 transition-colors hover:text-white'
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href='/blog'
                    className='text-white/70 transition-colors hover:text-white'
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href='/careers'
                    className='text-white/70 transition-colors hover:text-white'
                  >
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className='mb-4 text-xl font-bold tracking-tight md:text-2xl'>
                Support
              </h4>
              <ul className='space-y-3'>
                <li>
                  <Link
                    href='/contact'
                    className='text-white/70 transition-colors hover:text-white'
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href='/help'
                    className='text-white/70 transition-colors hover:text-white'
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <a
                    href='mailto:support@screenflow.com'
                    className='text-white/70 transition-colors hover:text-white'
                  >
                    support@screenflow.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className='border-t border-white/10 pt-8'>
            <div className='flex flex-col items-center justify-between gap-4 md:flex-row'>
              <div className='text-sm text-white/60'>
                © 2024 ScreenFlow. All rights reserved.
              </div>
              <div className='flex items-center gap-6 text-sm'>
                <Link
                  href='/privacy'
                  className='text-white/60 transition-colors hover:text-white'
                >
                  Privacy Policy
                </Link>
                <Link
                  href='/terms'
                  className='text-white/60 transition-colors hover:text-white'
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
