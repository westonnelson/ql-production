import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/icon.png"
              alt="QuoteLinker"
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <span className="text-2xl font-bold text-primary">QuoteLinker</span>
          </Link>
          
          <nav className="hidden md:flex space-x-8">
            <Link 
              href="/quote/life"
              className="text-gray-500 hover:text-gray-900"
            >
              Life Insurance
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
} 