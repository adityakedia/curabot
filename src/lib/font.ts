import { Geist, Geist_Mono } from 'next/font/google';
import { cn } from '@/lib/utils';

const fontSans = Geist({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans'
});

const fontMono = Geist_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono'
});

export const fontVariables = cn(fontSans.variable, fontMono.variable);
