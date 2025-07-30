'use client';

import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">AI</span>
            </div>
            <span className="hidden sm:inline">Stack Evaluator</span>
            <span className="sm:hidden">Stack</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Evaluate
            </Link>
            <Link 
              href="/compare" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Compare
            </Link>
            <Link 
              href="/stacks" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              All Stacks
            </Link>
            <Link 
              href="/about" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              About
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <Link 
              href="/cli" 
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
            >
              CLI Tool
            </Link>
            <Link 
              href="https://github.com/organized-ai/starter-stacks" 
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              GitHub
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              ) : (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={cn(
          "md:hidden border-t bg-white transition-all duration-200 ease-in-out overflow-hidden",
          isMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        )}>
          <nav className="py-4 space-y-4">
            <Link 
              href="/" 
              className="block px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Evaluate
            </Link>
            <Link 
              href="/compare" 
              className="block px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Compare
            </Link>
            <Link 
              href="/stacks" 
              className="block px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              All Stacks
            </Link>
            <Link 
              href="/about" 
              className="block px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <div className="px-4 pt-2 border-t">
              <Link 
                href="/cli" 
                className="block py-2 text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                CLI Tool
              </Link>
              <Link 
                href="https://github.com/organized-ai/starter-stacks" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full mt-2 btn-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                GitHub
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}