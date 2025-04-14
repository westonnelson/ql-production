import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-[#0F1218] border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/apple-touch-icon.png"
              alt="QuoteLinker"
              width={40}
              height={40}
              className="w-10 h-10"
              priority
            />
            <span className="text-2xl font-bold text-white">QuoteLinker</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/#how-it-works"
              className="text-gray-300 hover:text-white transition-colors"
            >
              How it Works
            </Link>
            <Link 
              href="/privacy"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Privacy
            </Link>
            <Link 
              href="/terms"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/quote/life"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
            >
              Get Your Quote
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
} 