import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Supplemental Health Insurance Quotes | QuoteLinker',
  description: 'Compare Medicare supplement insurance plans to fill coverage gaps. Get personalized quotes for Medigap plans that work alongside your Original Medicare coverage.',
  openGraph: {
    title: 'Supplemental Health Insurance Quotes | QuoteLinker',
    description: 'Compare Medicare supplement insurance plans to fill coverage gaps. Get personalized quotes for Medigap plans that work alongside your Original Medicare coverage.',
    type: 'website',
    url: 'https://quotelinker.com/insurance/supplemental-health',
    images: [
      {
        url: '/og-supplemental-health.png',
        width: 1200,
        height: 630,
        alt: 'Supplemental Health Insurance Quotes | QuoteLinker',
      },
    ],
  },
};

export default function SupplementalHealthPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Supplemental Health Insurance</h1>
          <p className="text-xl text-gray-600">Enhance your Medicare coverage with additional benefits</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-md">
            <h2 className="text-2xl font-semibold mb-4">What is Supplemental Health Insurance?</h2>
            <div className="space-y-6">
              <p className="text-gray-600">
                Supplemental health insurance, also known as Medigap, helps cover the "gaps" in Original Medicare coverage. 
                This includes out-of-pocket costs like deductibles, copayments, and coinsurance.
              </p>
              <div>
                <h3 className="text-lg font-medium mb-2">Key Features</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-[#00E0FF] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Works alongside Original Medicare
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-[#00E0FF] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Standardized benefits across plans
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-[#00E0FF] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Guaranteed renewable coverage
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-[#00E0FF] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    No network restrictions
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-[#00E0FF] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Coverage for foreign travel emergencies
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Benefits of Supplemental Coverage</h2>
            <ul className="space-y-4 text-gray-600">
              <li className="flex items-center">
                <svg className="h-5 w-5 text-[#00E0FF] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Predictable out-of-pocket costs
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-[#00E0FF] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Coverage for Medicare deductibles
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-[#00E0FF] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Protection against high medical expenses
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-[#00E0FF] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Freedom to choose any doctor
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-[#00E0FF] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Coverage for skilled nursing care
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-[#00E0FF] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Peace of mind for healthcare costs
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-md mb-12">
          <h2 className="text-2xl font-semibold mb-4">Who Needs Supplemental Health Insurance?</h2>
          <div className="space-y-4 text-gray-600">
            <p>Consider supplemental coverage if you:</p>
            <ul className="space-y-2">
              <li className="flex items-center">
                <svg className="h-5 w-5 text-[#00E0FF] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Want predictable healthcare costs
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-[#00E0FF] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Travel frequently
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-[#00E0FF] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Need frequent medical care
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-[#00E0FF] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Want to keep your current doctors
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-[#00E0FF] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Prefer comprehensive coverage
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Ready to Enhance Your Medicare Coverage?</h2>
          <p className="text-gray-600 mb-6">
            Get a personalized quote and find the right supplemental plan for your needs.
          </p>
          <Link 
            href="/quote/supplemental-health" 
            className="inline-block bg-[#00E0FF] text-white px-8 py-3 rounded-lg hover:bg-[#00E0FF]/90 transition-colors"
          >
            Get Your Quote
          </Link>
        </div>
      </div>
    </div>
  );
} 