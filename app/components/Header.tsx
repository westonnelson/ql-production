'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from './Logo';
import { Button } from './ui/button';

export function Header() {
  return (
    <header className="w-full border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Logo />
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/quote/life" className="text-gray-600 hover:text-gray-900">
            Life Insurance
          </Link>
          <Link href="/quote/disability" className="text-gray-600 hover:text-gray-900">
            Disability Insurance
          </Link>
          <Link href="/quote/health" className="text-gray-600 hover:text-gray-900">
            Health Insurance
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/quote/life">
            <Button className="bg-[#00E0FF] hover:bg-[#00c8e6] text-white">
              Get Quote
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
} 