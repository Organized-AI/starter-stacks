import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Tool Stack Evaluator | Find Your Perfect Tech Stack',
  description: 'Get personalized AI tool stack recommendations in 2 minutes. From Next.js to FastAPI, find the perfect tech stack for your AI project.',
  keywords: [
    'AI tools',
    'tech stack',
    'developer tools',
    'Next.js',
    'FastAPI',
    'tech stack evaluator',
    'AI development',
    'recommendation engine'
  ],
  authors: [{ name: 'Organized AI' }],
  creator: 'Organized AI',
  publisher: 'Organized AI',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://stack.organizedai.vip',
    title: 'AI Tool Stack Evaluator | Find Your Perfect Tech Stack',
    description: 'Get personalized AI tool stack recommendations in 2 minutes. From Next.js to FastAPI, find the perfect tech stack for your AI project.',
    siteName: 'AI Tool Stack Evaluator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Tool Stack Evaluator | Find Your Perfect Tech Stack',
    description: 'Get personalized AI tool stack recommendations in 2 minutes. From Next.js to FastAPI, find the perfect tech stack for your AI project.',
    creator: '@OrganizedAI',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={cn(
        inter.className,
        'min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 antialiased'
      )}>
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}