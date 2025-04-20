import React from 'react';
import { Hero } from './components/Hero';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <Hero />
      </main>
    </div>
  );
} 