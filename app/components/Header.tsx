'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative w-8 h-8">
              <Image
                src="/logo.svg"
                alt="QuoteLinker"
                fill
                sizes="(max-width: 32px) 100vw"
                className="object-contain"
                priority
              />
            </div>
            <span className="text-2xl font-bold text-gray-900">QuoteLinker</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <div className="relative group">
              <button className="text-gray-600 hover:text-gray-900 transition-colors">
                Insurance Types
              </button>
              <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-1">
                  <Link href="/insurance/life" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Life Insurance</Link>
                  <Link href="/insurance/health" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Health Insurance</Link>
                  <Link href="/insurance/disability" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Disability Insurance</Link>
                  <Link href="/insurance/supplemental-health" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Supplemental Health</Link>
                  <Link href="/auto" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Auto Insurance</Link>
                </div>
              </div>
            </div>
            
            <div className="relative group">
              <button className="text-gray-600 hover:text-gray-900 transition-colors">
                Resources
              </button>
              <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-1">
                  <Link href="/education" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Education Hub</Link>
                  <Link href="/faq" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">FAQ</Link>
                  <Link href="/about" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">About Us</Link>
                  <Link href="/benefits" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Benefits</Link>
                </div>
              </div>
            </div>

            <Link 
              href="/#how-it-works"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              How it Works
            </Link>
            
            <Link
              href="/quote/life"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#00E0FF] hover:bg-[#00E0FF]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00E0FF] transition-colors"
            >
              Get Your Quote
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#00E0FF]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {!isMenuOpen ? (
              <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            ) : (
              <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <div className="space-y-1">
            <button className="w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50">
              Insurance Types
            </button>
            <div className="pl-4 space-y-1">
              <Link href="/insurance/life" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50">Life Insurance</Link>
              <Link href="/insurance/health" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50">Health Insurance</Link>
              <Link href="/insurance/disability" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50">Disability Insurance</Link>
              <Link href="/insurance/supplemental-health" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50">Supplemental Health</Link>
              <Link href="/auto" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50">Auto Insurance</Link>
            </div>
          </div>
          
          <div className="space-y-1">
            <button className="w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50">
              Resources
            </button>
            <div className="pl-4 space-y-1">
              <Link href="/education" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50">Education Hub</Link>
              <Link href="/faq" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50">FAQ</Link>
              <Link href="/about" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50">About Us</Link>
              <Link href="/benefits" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50">Benefits</Link>
            </div>
          </div>

          <Link 
            href="/#how-it-works"
            className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          >
            How it Works
          </Link>
          
          <Link
            href="/quote/life"
            className="block w-full text-center px-3 py-2 text-base font-medium text-white bg-[#00E0FF] hover:bg-[#00E0FF]/90"
          >
            Get Your Quote
          </Link>
        </div>
      </div>
    </header>
  );
} 