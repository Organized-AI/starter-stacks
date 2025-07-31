import { Metadata } from 'next';
import EvaluationFlow from '@/components/evaluation/EvaluationFlow';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://stack.organizedai.vip'),
  title: 'AI Tool Stack Evaluator | Find Your Perfect Tech Stack in 2 Minutes',
  description: 'Get personalized AI tool stack recommendations in 2 minutes. From Next.js to FastAPI, find the perfect tech stack for your AI project based on your experience and timeline.',
  keywords: ['AI', 'tech stack', 'recommendations', 'developer tools', 'machine learning', 'artificial intelligence', 'framework', 'evaluation'],
  authors: [{ name: 'Organized AI' }],
  creator: 'Organized AI',
  publisher: 'Organized AI',
  category: 'technology',
  openGraph: {
    title: 'AI Tool Stack Evaluator | Find Your Perfect Tech Stack',
    description: 'Get personalized AI tool stack recommendations in 2 minutes. From Next.js to FastAPI, find the perfect tech stack for your AI project.',
    url: 'https://stack.organizedai.vip',
    siteName: 'AI Tool Stack Evaluator',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI Tool Stack Evaluator - Find Your Perfect Tech Stack',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Tool Stack Evaluator | Find Your Perfect Tech Stack',
    description: 'Get personalized AI tool stack recommendations in 2 minutes.',
    creator: '@OrganizedAI',
    images: ['/og-image.png'],
  },
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
};

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Find Your Perfect{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Tech Stack
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Get personalized recommendations in 2 minutes. From rapid prototypes to enterprise solutions, 
              discover the ideal tech stack for your AI project.
            </p>
            <div className="flex items-center justify-center gap-8 text-sm text-gray-500 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>10 AI-optimized stacks</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>2-minute evaluation</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Personalized recommendations</span>
              </div>
            </div>
          </div>

          {/* Evaluation Flow */}
          <EvaluationFlow />

          {/* Features Section */}
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Get recommendations in under 30 seconds based on your specific needs and timeline.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">AI-Optimized</h3>
              <p className="text-gray-600">Every stack is specifically chosen and evaluated for AI tool development and deployment.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Experience-Based</h3>
              <p className="text-gray-600">Recommendations tailored to your technical background, from beginner to expert level.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}