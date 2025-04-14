import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-[#1D2432] border-t border-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-8">
          <div className="flex items-center space-x-2">
            <div className="relative w-8 h-8">
              <Image
                src="/apple-touch-icon.png"
                alt="QuoteLinker"
                fill
                sizes="(max-width: 32px) 100vw"
                className="object-contain"
                priority
              />
            </div>
            <span className="text-xl font-semibold text-white">QuoteLinker</span>
          </div>
          
          <nav className="flex flex-wrap justify-center gap-6">
            <Link 
              href="/quote/life"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              How it Works
            </Link>
            <Link 
              href="/quote/life"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Benefits
            </Link>
            <Link 
              href="/quote/life"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              FAQ
            </Link>
            <Link 
              href="/privacy"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/terms"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Terms of Service
            </Link>
          </nav>
          
          <div className="text-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} QuoteLinker. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
} 