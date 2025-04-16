import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Life Insurance Quotes | QuoteLinker',
  description: 'Get personalized life insurance quotes tailored to your needs. Compare term, whole, and universal life insurance options to protect your loved ones.',
  openGraph: {
    title: 'Life Insurance Quotes | QuoteLinker',
    description: 'Get personalized life insurance quotes tailored to your needs. Compare term, whole, and universal life insurance options to protect your loved ones.',
    type: 'website',
    url: 'https://quotelinker.com/insurance/life',
    images: [
      {
        url: '/og-life.png',
        width: 1200,
        height: 630,
        alt: 'Life Insurance Quotes | QuoteLinker',
      },
    ],
  },
};

export default function LifeInsurancePage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Life Insurance</h1>
          <p className="text-xl text-gray-600">Protect your loved ones with the right coverage</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Types of Life Insurance</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Term Life Insurance</h3>
                <p className="text-gray-600">Affordable coverage for a specific period, typically 10-30 years. Perfect for temporary needs like mortgage protection or children's education.</p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Whole Life Insurance</h3>
                <p className="text-gray-600">Permanent coverage that builds cash value over time. Provides lifelong protection and can be used as an investment vehicle.</p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Universal Life Insurance</h3>
                <p className="text-gray-600">Flexible permanent coverage with adjustable premiums and death benefits. Combines protection with investment opportunities.</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Benefits of Life Insurance</h2>
            <ul className="space-y-4 text-gray-600">
              <li className="flex items-center">
                <svg className="h-5 w-5 text-[#00E0FF] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Financial protection for your loved ones
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-[#00E0FF] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Cover final expenses and debts
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-[#00E0FF] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Replace lost income
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-[#00E0FF] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Fund children's education
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-[#00E0FF] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Leave a legacy
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-[#00E0FF] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Tax advantages
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-md mb-12">
          <h2 className="text-2xl font-semibold mb-4">How Much Coverage Do You Need?</h2>
          <p className="text-gray-600 mb-6">
            Consider these factors when determining your coverage amount:
          </p>
          <ul className="space-y-4 text-gray-600">
            <li className="flex items-center">
              <svg className="h-5 w-5 text-[#00E0FF] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Current and future financial obligations
            </li>
            <li className="flex items-center">
              <svg className="h-5 w-5 text-[#00E0FF] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Income replacement needs
            </li>
            <li className="flex items-center">
              <svg className="h-5 w-5 text-[#00E0FF] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Outstanding debts
            </li>
            <li className="flex items-center">
              <svg className="h-5 w-5 text-[#00E0FF] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Education expenses
            </li>
            <li className="flex items-center">
              <svg className="h-5 w-5 text-[#00E0FF] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Funeral and final expenses
            </li>
          </ul>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Ready to Get Started?</h2>
          <p className="text-gray-600 mb-6">
            Get a personalized quote in minutes and protect your loved ones' future.
          </p>
          <Link 
            href="/quote/life" 
            className="inline-block bg-[#00E0FF] text-white px-8 py-3 rounded-lg hover:bg-[#00E0FF]/90 transition-colors"
          >
            Get Your Quote
          </Link>
        </div>
      </div>
    </div>
  );
} 