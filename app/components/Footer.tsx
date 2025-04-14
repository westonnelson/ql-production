import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-2">
            <Image
              src="/icon.png"
              alt="QuoteLinker"
              width={32}
              height={32}
              className="w-8 h-8"
              priority
            />
            <span className="text-xl font-semibold text-primary">QuoteLinker</span>
          </div>
          
          <nav className="flex space-x-6">
            <Link 
              href="/privacy"
              className="text-gray-500 hover:text-gray-900 text-sm"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/terms"
              className="text-gray-500 hover:text-gray-900 text-sm"
            >
              Terms of Service
            </Link>
          </nav>
          
          <div className="text-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} QuoteLinker. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
} 