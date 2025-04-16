import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Supplemental Health Insurance - QuoteLinker',
  description: 'Learn about our supplemental health insurance options to enhance your Medicare coverage.',
};

export default function SupplementalHealthPage() {
  return (
    <div className="min-h-screen bg-[#0F1218] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Supplemental Health Insurance</h1>
          <p className="text-xl text-gray-300">Enhance your Medicare coverage with additional benefits</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <div className="bg-gray-800/50 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">What is Supplemental Health Insurance?</h2>
            <div className="space-y-6">
              <p className="text-gray-300">
                Supplemental health insurance, also known as Medigap, helps cover the "gaps" in Original Medicare coverage. 
                This includes out-of-pocket costs like deductibles, copayments, and coinsurance.
              </p>
              <div>
                <h3 className="text-lg font-medium mb-2">Key Features</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Works alongside Original Medicare</li>
                  <li>• Standardized benefits across plans</li>
                  <li>• Guaranteed renewable coverage</li>
                  <li>• No network restrictions</li>
                  <li>• Coverage for foreign travel emergencies</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Benefits of Supplemental Coverage</h2>
            <ul className="space-y-4 text-gray-300">
              <li>• Predictable out-of-pocket costs</li>
              <li>• Coverage for Medicare deductibles</li>
              <li>• Protection against high medical expenses</li>
              <li>• Freedom to choose any doctor</li>
              <li>• Coverage for skilled nursing care</li>
              <li>• Peace of mind for healthcare costs</li>
            </ul>
          </div>
        </div>

        <div className="bg-gray-800/50 p-8 rounded-lg mb-12">
          <h2 className="text-2xl font-semibold mb-4">Who Needs Supplemental Health Insurance?</h2>
          <div className="space-y-4 text-gray-300">
            <p>Consider supplemental coverage if you:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Want predictable healthcare costs</li>
              <li>Travel frequently</li>
              <li>Need frequent medical care</li>
              <li>Want to keep your current doctors</li>
              <li>Prefer comprehensive coverage</li>
            </ul>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Ready to Enhance Your Medicare Coverage?</h2>
          <p className="text-gray-300 mb-6">
            Get a personalized quote and find the right supplemental plan for your needs.
          </p>
          <Link 
            href="/quote/supplemental-health" 
            className="inline-block bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Get Your Quote
          </Link>
        </div>
      </div>
    </div>
  );
} 