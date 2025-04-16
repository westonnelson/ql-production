import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Auto Insurance Quotes | QuoteLinker',
  description: 'Get your personalized auto insurance quote in minutes. Compare rates from top providers and save on your car insurance.',
  openGraph: {
    title: 'Auto Insurance Quotes | QuoteLinker',
    description: 'Get your personalized auto insurance quote in minutes. Compare rates from top providers and save on your car insurance.',
    type: 'website',
    url: 'https://quotelinker.com/auto',
    images: [
      {
        url: '/og-auto.png',
        width: 1200,
        height: 630,
        alt: 'Auto Insurance Quotes | QuoteLinker',
      },
    ],
  },
};

const AutoInsurance: React.FC = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Auto Insurance Quotes
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Get your personalized auto insurance quote in minutes
          </p>
        </div>

        <div className="mt-8 space-y-8 bg-white p-8 rounded-xl border border-gray-200 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Why Choose Our Auto Insurance?</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-[#00E0FF] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Competitive rates and discounts
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-[#00E0FF] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  24/7 claims service
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-[#00E0FF] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Flexible payment options
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Coverage Options</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-[#00E0FF] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Liability coverage
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-[#00E0FF] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Collision coverage
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-[#00E0FF] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Comprehensive coverage
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => router.push('/quote/auto')}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-[#00E0FF] hover:bg-[#00E0FF]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00E0FF] transition-all duration-200"
            >
              Get Your Auto Insurance Quote
            </button>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-4 text-gray-600">
            <img src="/images/security-badge.svg" alt="Security Verified" className="h-12 w-12" />
            <p>Trusted by thousands of drivers nationwide</p>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Powered by QuoteLinker and AI
          </p>
        </div>
      </div>
    </div>
  );
};

export default AutoInsurance; 