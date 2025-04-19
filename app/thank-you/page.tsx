import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import Script from 'next/script';

export default function ThankYouPage() {
  return (
    <>
      <Script id="google-ads-conversion">
        {`
          gtag('event', 'conversion', {
            'send_to': '${process.env.NEXT_PUBLIC_ADS_CONVERSION_ID}/lead',
            'value': 1.0,
            'currency': 'USD'
          });
        `}
      </Script>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Thank You!</span>
                <span className="block text-[#06B6D4]">We'll Be in Touch Soon</span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                Thank you for your interest in our insurance products. A licensed insurance agent will contact you shortly to discuss your needs and provide personalized quotes.
              </p>
              <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                <div className="rounded-md shadow">
                  <a
                    href="/"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#06B6D4] hover:bg-[#0891B2] md:py-4 md:text-lg md:px-10"
                  >
                    Return to Home
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-16">
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">What to Expect</h2>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-[#06B6D4] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-700">A licensed insurance agent will contact you within 24 hours</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-[#06B6D4] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-700">Personalized quotes based on your specific needs</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-[#06B6D4] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-700">Expert guidance to help you make an informed decision</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
} 