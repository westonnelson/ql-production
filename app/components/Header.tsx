'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from './Logo';

export const Header: React.FC = () => {
  return (
    <header className="w-full py-4 px-6 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Logo />
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/about" className="text-gray-600 hover:text-[#06B6D4]">
            About
          </Link>
          <Link href="/insurance" className="text-gray-600 hover:text-[#06B6D4]">
            Insurance
          </Link>
          <Link href="/faq" className="text-gray-600 hover:text-[#06B6D4]">
            FAQ
          </Link>
          <Link
            href="/quote"
            className="bg-[#06B6D4] text-white px-4 py-2 rounded-md hover:bg-[#0891B2] transition-colors"
          >
            Get Your Quote
          </Link>
        </nav>
      </div>
    </header>
  );
}; 