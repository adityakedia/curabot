import { IconSparkles, IconQuestionMark } from '@tabler/icons-react';
import MarketingLayout from '@/components/layout/marketing-layout';

export default function FAQPage() {
  const faqs = [
    {
      question: 'What is ScreenFlow?',
      answer:
        'ScreenFlow is an AI-powered visual reference platform that helps creative professionals capture, organize, and create with visual content. Simply save images, screenshots, and references from anywhere on the web, and our AI automatically organizes them by style, color, and concept.'
    },
    {
      question: 'How does the AI organization work?',
      answer:
        'Our AI analyzes your visual references and automatically tags them based on style, color palette, composition, and conceptual themes. It connects similar references and helps you discover patterns in your collection that you might not have noticed.'
    },
    {
      question: 'Do I need design skills to use ScreenFlow?',
      answer:
        'No! ScreenFlow is designed for anyone who works with visual content - designers, researchers, marketers, writers, and creative professionals. You simply save what inspires you, and our AI handles the complex organization.'
    },
    {
      question: 'What kind of content can I capture?',
      answer:
        'You can capture images, screenshots, web pages, social media posts, design inspirations, color palettes, typography samples, and any other visual content that inspires your creative work.'
    },
    {
      question: 'How do I export my collections?',
      answer:
        'ScreenFlow provides powerful export tools to create mood boards, style guides, presentations, and portfolios. You can customize layouts, add annotations, and export in various formats including PDF, PNG, and PowerPoint.'
    },
    {
      question: 'Is there a free plan?',
      answer:
        'Yes! Our Free plan includes up to 100 visual references and basic organization features. You can upgrade to Pro or Enterprise plans for unlimited storage, advanced AI features, and team collaboration.'
    },
    {
      question: 'Can I collaborate with my team?',
      answer:
        'Absolutely! ScreenFlow supports team collaboration with shared collections, commenting, version control, and permission management. Perfect for design teams, agencies, and creative departments.'
    },
    {
      question: 'How secure is my content?',
      answer:
        'We take security seriously. All your visual references are encrypted, stored securely, and only accessible to you and your team members. We never share your content with third parties.'
    }
  ];

  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className='relative overflow-hidden bg-gradient-to-br from-gray-50/80 via-slate-50/60 to-zinc-50/40 py-20 md:py-32'>
        {/* Subtle Background Elements */}
        <div className='absolute inset-0'>
          <div className='parallax-slow absolute top-20 left-10 h-96 w-96 animate-pulse rounded-full bg-gradient-to-br from-gray-100/12 to-slate-100/8 blur-3xl'></div>
          <div className='parallax-medium absolute right-20 bottom-32 h-80 w-80 animate-pulse rounded-full bg-gradient-to-br from-zinc-100/8 to-gray-100/6 blur-2xl delay-1000'></div>
        </div>

        <div className='relative z-10 container mx-auto px-6'>
          <div className='mx-auto max-w-4xl text-center'>
            {/* Badge */}
            <div className='mb-8 inline-flex items-center gap-2 rounded-full border border-gray-200/30 bg-white/70 px-4 py-2 text-sm font-medium tracking-wide text-gray-700 backdrop-blur-md'>
              <IconQuestionMark className='h-4 w-4 text-slate-500' />
              <span>Common Questions</span>
            </div>

            {/* Main Headline */}
            <h1 className='mb-6 text-4xl leading-tight font-black tracking-tight text-gray-900 md:text-6xl'>
              Frequently Asked Questions
            </h1>

            {/* Subtitle */}
            <p className='mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-gray-600'>
              Everything you need to know about ScreenFlow and how it can
              transform your creative workflow
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className='relative bg-white py-20 md:py-32'>
        <div className='container mx-auto px-6'>
          <div className='mx-auto max-w-4xl space-y-6'>
            {faqs.map((faq, index) => (
              <div
                key={index}
                className='group rounded-2xl border border-gray-100 bg-white p-8 shadow-lg transition-all duration-500 hover:border-gray-200 hover:shadow-xl'
              >
                <h3 className='mb-4 text-xl font-bold tracking-tight text-gray-900 md:text-2xl'>
                  {faq.question}
                </h3>
                <p className='leading-relaxed text-gray-600'>{faq.answer}</p>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className='mt-16 text-center'>
            <div className='mb-6 inline-flex items-center gap-2 rounded-full bg-gray-50 px-4 py-2 text-sm font-medium tracking-wide text-gray-700'>
              <IconSparkles className='h-4 w-4 text-blue-500' />
              <span>Still have questions?</span>
            </div>
            <h3 className='mb-4 text-xl font-bold tracking-tight text-gray-900 md:text-2xl'>
              Get in touch with our team
            </h3>
            <p className='mx-auto mb-8 max-w-2xl leading-relaxed text-gray-600'>
              Our support team is here to help you get the most out of
              ScreenFlow
            </p>
            <button className='mx-auto flex transform items-center gap-2 rounded-lg bg-gray-900 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl'>
              <span>Contact Support</span>
            </button>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
