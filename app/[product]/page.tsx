import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { notFound } from 'next/navigation';

interface ProductPageProps {
  params: {
    product: string;
  };
}

const productData = {
  'term-life': {
    title: 'Term Life Insurance',
    description: 'Protect your loved ones with affordable term life insurance coverage in Minnesota.',
    benefits: [
      'Fixed premiums for the duration of your term',
      'Coverage amounts from $50,000 to $2,000,000',
      'Terms available from 10 to 30 years',
      'No medical exam options available',
      'Convertible to permanent life insurance',
    ],
    features: [
      'Death benefit paid to your beneficiaries',
      'Flexible payment options',
      'Portable coverage that goes with you',
      'Minnesota-specific coverage options',
      'Competitive rates from top carriers',
    ],
  },
  'auto': {
    title: 'Auto Insurance',
    description: 'Comprehensive auto insurance coverage tailored for Minnesota drivers.',
    benefits: [
      'Liability coverage for accidents',
      'Collision and comprehensive coverage',
      'Uninsured/underinsured motorist protection',
      'Personal injury protection',
      'Roadside assistance',
    ],
    features: [
      '24/7 claims service',
      'Multi-car discounts',
      'Safe driver discounts',
      'Minnesota-specific coverage options',
      'Flexible payment plans',
    ],
  },
  'home': {
    title: 'Home Insurance',
    description: 'Protect your Minnesota home with comprehensive coverage.',
    benefits: [
      'Dwelling coverage',
      'Personal property protection',
      'Liability coverage',
      'Additional living expenses',
      'Natural disaster protection',
    ],
    features: [
      'Coverage for Minnesota-specific risks',
      'Optional flood insurance',
      'Home security discounts',
      'Bundling discounts with auto',
      '24/7 claims service',
    ],
  },
  'short-term-disability': {
    title: 'Short-Term Disability Insurance',
    description: 'Income protection when you need it most in Minnesota.',
    benefits: [
      'Income replacement during disability',
      'Coverage for accidents and illnesses',
      'Flexible benefit periods',
      'Optional waiting periods',
      'Portable coverage',
    ],
    features: [
      'Coverage up to 24 months',
      'Monthly benefit options',
      'Minnesota-specific coverage',
      'Easy claims process',
      'Supplemental to other coverage',
    ],
  },
};

export async function generateMetadata({ params }: ProductPageProps) {
  const product = productData[params.product as keyof typeof productData];
  
  if (!product) {
    return {
      title: 'Product Not Found - QuoteLinker',
    };
  }

  return {
    title: `${product.title} in Minnesota | QuoteLinker`,
    description: product.description,
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = productData[params.product as keyof typeof productData];

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="bg-white">
          <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">{product.title}</span>
                <span className="block text-[#06B6D4]">in Minnesota</span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                {product.description}
              </p>
              <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                <div className="rounded-md shadow">
                  <a
                    href="/quote"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#06B6D4] hover:bg-[#0891B2] md:py-4 md:text-lg md:px-10"
                  >
                    Get Your Quote
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-16">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Benefits</h2>
                  <ul className="space-y-4">
                    {product.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="h-6 w-6 text-[#06B6D4] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="ml-3 text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Features</h2>
                  <ul className="space-y-4">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="h-6 w-6 text-[#06B6D4] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="ml-3 text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 