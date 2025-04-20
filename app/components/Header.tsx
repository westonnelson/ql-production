'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from './Logo';
import { Button } from './ui/button';

export function Header() {
  return (
    <header className="w-full border-b bg-background">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Logo />
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/quote/life" className="text-muted-foreground hover:text-foreground transition-colors">
            Life Insurance
          </Link>
          <Link href="/quote/disability" className="text-muted-foreground hover:text-foreground transition-colors">
            Disability Insurance
          </Link>
          <Link href="/quote/health" className="text-muted-foreground hover:text-foreground transition-colors">
            Health Insurance
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/quote/life">
            <Button className="bg-primary hover:bg-primary-dark text-primary-foreground transition-colors">
              Get Quote
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
} 