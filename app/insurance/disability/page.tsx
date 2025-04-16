import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Disability Insurance Quotes | QuoteLinker',
  description: 'Compare disability insurance plans to protect your income. Get personalized quotes for short-term and long-term disability coverage that fits your needs.',
  openGraph: {
    title: 'Disability Insurance Quotes | QuoteLinker',
    description: 'Compare disability insurance plans to protect your income. Get personalized quotes for short-term and long-term disability coverage that fits your needs.',
    type: 'website',
    url: 'https://quotelinker.com/insurance/disability',
    images: [
      {
        url: '/og-disability.png',
        width: 1200,
        height: 630,
        alt: 'Disability Insurance Quotes | QuoteLinker',
      },
    ],
  },
};

export default function DisabilityInsurancePage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Disability Insurance</h1>
          <p className="text-xl text-gray-600">Protect your income if you become unable to work</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Types of Disability Insurance</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Short-Term Disability</h3>
                <p className="text-gray-600">Coverage for temporary disabilities, typically 3-6 months. Provides quick financial support during recovery.</p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Long-Term Disability</h3>
                <p className="text-gray-600">Extended coverage for serious disabilities that may last years or be permanent. Protects your long-term financial security.</p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Supplemental Disability</h3>
                <p className="text-gray-600">Additional coverage to complement employer-provided disability insurance. Ensures comprehensive protection.</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Key Benefits</h2>
            <ul className="space-y-4 text-gray-600">
              <li className="flex items-center">
                <svg className="h-5 w-5 text-[#00E0FF] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Income replacement during disability
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-[#00E0FF] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Coverage for both accidents and illnesses
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-[#00E0FF] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Flexible benefit periods
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-[#00E0FF] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Customizable waiting periods
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-[#00E0FF] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Portable coverage
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
          <h2 className="text-2xl font-semibold mb-4">Why You Need Disability Insurance</h2>
          <div className="space-y-4 text-gray-600">
            <p>Consider these important points:</p>
            <ul className="space-y-2">
              <li className="flex items-center">
                <svg className="h-5 w-5 text-[#00E0FF] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                1 in 4 workers will experience a disability during their career
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-[#00E0FF] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Social Security disability benefits may not be enough
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-[#00E0FF] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Employer coverage may be limited
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-[#00E0FF] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Protects your savings and retirement plans
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-[#00E0FF] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Ensures financial stability for your family
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Ready to Protect Your Income?</h2>
          <p className="text-gray-600 mb-6">
            Get a personalized quote and ensure your financial security.
          </p>
          <Link 
            href="/quote/disability" 
            className="inline-block bg-[#00E0FF] text-white px-8 py-3 rounded-lg hover:bg-[#00E0FF]/90 transition-colors"
          >
            Get Your Quote
          </Link>
        </div>
      </div>
    </div>
  );
} 