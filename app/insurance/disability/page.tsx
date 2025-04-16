import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Disability Insurance - QuoteLinker',
  description: 'Learn about our disability insurance options and protect your income if you become unable to work.',
};

export default function DisabilityInsurancePage() {
  return (
    <div className="min-h-screen bg-[#0F1218] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Disability Insurance</h1>
          <p className="text-xl text-gray-300">Protect your income if you become unable to work</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <div className="bg-gray-800/50 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Types of Disability Insurance</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Short-Term Disability</h3>
                <p className="text-gray-300">Coverage for temporary disabilities, typically 3-6 months. Provides quick financial support during recovery.</p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Long-Term Disability</h3>
                <p className="text-gray-300">Extended coverage for serious disabilities that may last years or be permanent. Protects your long-term financial security.</p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Supplemental Disability</h3>
                <p className="text-gray-300">Additional coverage to complement employer-provided disability insurance. Ensures comprehensive protection.</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Key Benefits</h2>
            <ul className="space-y-4 text-gray-300">
              <li>• Income replacement during disability</li>
              <li>• Coverage for both accidents and illnesses</li>
              <li>• Flexible benefit periods</li>
              <li>• Customizable waiting periods</li>
              <li>• Portable coverage</li>
              <li>• Tax advantages</li>
            </ul>
          </div>
        </div>

        <div className="bg-gray-800/50 p-8 rounded-lg mb-12">
          <h2 className="text-2xl font-semibold mb-4">Why You Need Disability Insurance</h2>
          <div className="space-y-4 text-gray-300">
            <p>Consider these important points:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>1 in 4 workers will experience a disability during their career</li>
              <li>Social Security disability benefits may not be enough</li>
              <li>Employer coverage may be limited</li>
              <li>Protects your savings and retirement plans</li>
              <li>Ensures financial stability for your family</li>
            </ul>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Ready to Protect Your Income?</h2>
          <p className="text-gray-300 mb-6">
            Get a personalized quote and ensure your financial security.
          </p>
          <Link 
            href="/quote/disability" 
            className="inline-block bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Get Your Quote
          </Link>
        </div>
      </div>
    </div>
  );
} 