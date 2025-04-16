import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Become an Agent - QuoteLinker',
  description: 'Join QuoteLinker as an insurance agent and grow your business with our innovative platform.',
};

export default function AgentPage() {
  return (
    <div className="min-h-screen bg-[#0F1218] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Become a QuoteLinker Agent</h1>
          <p className="text-xl text-gray-300">Join our network of successful insurance professionals</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <div className="bg-gray-800/50 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Why Join QuoteLinker?</h2>
            <ul className="space-y-4 text-gray-300">
              <li>• Access to high-quality insurance leads</li>
              <li>• Advanced lead management system</li>
              <li>• Competitive commission structure</li>
              <li>• Marketing support and resources</li>
              <li>• Real-time quote tracking</li>
              <li>• Dedicated agent support team</li>
            </ul>
          </div>

          <div className="bg-gray-800/50 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Requirements</h2>
            <ul className="space-y-4 text-gray-300">
              <li>• Valid insurance license</li>
              <li>• Minimum 2 years of experience</li>
              <li>• Clean background check</li>
              <li>• Professional references</li>
              <li>• E&O insurance coverage</li>
              <li>• Commitment to customer service</li>
            </ul>
          </div>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold mb-4">Ready to Get Started?</h2>
          <div className="space-x-4">
            <Link 
              href="/agent/register" 
              className="inline-block bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Register Now
            </Link>
            <Link 
              href="/agent/login" 
              className="inline-block bg-gray-700 text-white px-8 py-3 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Agent Login
            </Link>
          </div>
        </div>

        <div className="bg-gray-800/50 p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">How does the lead system work?</h3>
              <p className="text-gray-300">Our platform matches you with qualified leads based on your expertise and location. You'll receive real-time notifications when new leads are available.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">What types of insurance can I sell?</h3>
              <p className="text-gray-300">We offer opportunities in life insurance, disability insurance, supplemental health, and auto insurance. You can choose to specialize in one or multiple types.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">How are commissions structured?</h3>
              <p className="text-gray-300">Commission rates vary by product type and are based on your performance and experience level. Our competitive structure rewards successful agents.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 