'use client'

import React from 'react';
import { useRouter } from 'next/navigation';

const SupplementalHealthInsurance: React.FC = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F1218] to-[#1A1F2B] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
            Supplemental Health Insurance Quotes
          </h1>
          <p className="mt-4 text-xl text-gray-300">
            Enhance your health coverage with comprehensive supplemental plans
          </p>
        </div>

        <div className="mt-8 space-y-8 backdrop-blur-sm bg-white/5 p-8 rounded-xl border border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Why Choose Our Supplemental Health Insurance?</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Gap coverage
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Customizable benefits
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Affordable premiums
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Coverage Options</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Medicare Supplement
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Critical Illness
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Accident Insurance
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => router.push('/quote/supplemental-health')}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200"
            >
              Get Your Supplemental Health Insurance Quote
            </button>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-4 text-gray-300">
            <img src="/images/security-badge.svg" alt="Security Verified" className="h-12 w-12" />
            <p>Trusted by thousands of families nationwide</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplementalHealthInsurance; 