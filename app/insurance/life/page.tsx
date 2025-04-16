import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Life Insurance - QuoteLinker',
  description: 'Learn about our life insurance options and get a quote tailored to your needs.',
};

export default function LifeInsurancePage() {
  return (
    <div className="min-h-screen bg-[#0F1218] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Life Insurance</h1>
          <p className="text-xl text-gray-300">Protect your loved ones with the right coverage</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <div className="bg-gray-800/50 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Types of Life Insurance</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Term Life Insurance</h3>
                <p className="text-gray-300">Affordable coverage for a specific period, typically 10-30 years. Perfect for temporary needs like mortgage protection or children's education.</p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Whole Life Insurance</h3>
                <p className="text-gray-300">Permanent coverage that builds cash value over time. Provides lifelong protection and can be used as an investment vehicle.</p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Universal Life Insurance</h3>
                <p className="text-gray-300">Flexible permanent coverage with adjustable premiums and death benefits. Combines protection with investment opportunities.</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Benefits of Life Insurance</h2>
            <ul className="space-y-4 text-gray-300">
              <li>• Financial protection for your loved ones</li>
              <li>• Cover final expenses and debts</li>
              <li>• Replace lost income</li>
              <li>• Fund children's education</li>
              <li>• Leave a legacy</li>
              <li>• Tax advantages</li>
            </ul>
          </div>
        </div>

        <div className="bg-gray-800/50 p-8 rounded-lg mb-12">
          <h2 className="text-2xl font-semibold mb-4">How Much Coverage Do You Need?</h2>
          <p className="text-gray-300 mb-6">
            Consider these factors when determining your coverage amount:
          </p>
          <ul className="space-y-4 text-gray-300">
            <li>• Current and future financial obligations</li>
            <li>• Income replacement needs</li>
            <li>• Outstanding debts</li>
            <li>• Education expenses</li>
            <li>• Funeral and final expenses</li>
          </ul>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Ready to Get Started?</h2>
          <p className="text-gray-300 mb-6">
            Get a personalized quote in minutes and protect your loved ones' future.
          </p>
          <Link 
            href="/quote/life" 
            className="inline-block bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Get Your Quote
          </Link>
        </div>
      </div>
    </div>
  );
} 