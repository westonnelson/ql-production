'use client'

import Link from 'next/link'

const insuranceTypes = [
  {
    title: 'Life Insurance',
    description: 'Protect your loved ones and secure their financial future',
    benefits: [
      {
        title: 'Financial Security',
        description: 'Provide your family with financial protection and peace of mind'
      },
      {
        title: 'Debt Coverage',
        description: 'Ensure your debts don't become a burden for your family'
      },
      {
        title: 'Estate Planning',
        description: 'Create a lasting legacy and minimize estate tax impact'
      },
      {
        title: 'Flexible Options',
        description: 'Choose from term or permanent coverage to match your needs'
      }
    ],
    cta: {
      text: 'Get Life Insurance Quote',
      link: '/quote/life'
    }
  },
  {
    title: 'Disability Insurance',
    description: 'Protect your income and maintain your lifestyle if you're unable to work',
    benefits: [
      {
        title: 'Income Protection',
        description: 'Replace up to 70% of your income if you can't work due to illness or injury'
      },
      {
        title: 'Customizable Coverage',
        description: 'Choose short-term, long-term, or both types of coverage'
      },
      {
        title: 'Occupation Protection',
        description: 'Coverage tailored to your specific occupation and income level'
      },
      {
        title: 'Flexible Benefits',
        description: 'Options for partial disability and rehabilitation benefits'
      }
    ],
    cta: {
      text: 'Get Disability Quote',
      link: '/quote/disability'
    }
  },
  {
    title: 'Supplemental Health Insurance',
    description: 'Fill the gaps in your primary health insurance coverage',
    benefits: [
      {
        title: 'Out-of-Pocket Coverage',
        description: 'Help with deductibles, copayments, and coinsurance'
      },
      {
        title: 'Additional Benefits',
        description: 'Coverage for services not included in your primary plan'
      },
      {
        title: 'Cash Benefits',
        description: 'Direct payments to help with expenses during recovery'
      },
      {
        title: 'Flexible Use',
        description: 'Use benefits for any purpose - medical or non-medical expenses'
      }
    ],
    cta: {
      text: 'Explore Supplemental Health',
      link: '/quote/supplemental'
    }
  }
]

export default function BenefitsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F1218] to-[#1A1F2B] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
            Insurance Benefits
          </h1>
          <p className="mt-4 text-xl text-gray-300">
            Discover how our AI-powered insurance matching can protect what matters most
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {insuranceTypes.map((type) => (
            <div key={type.title} className="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-gray-800">
              <h2 className="text-2xl font-bold text-white mb-4">{type.title}</h2>
              <p className="text-gray-300 mb-8">{type.description}</p>
              
              <div className="space-y-6 mb-8">
                {type.benefits.map((benefit) => (
                  <div key={benefit.title} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">{benefit.title}</h3>
                      <p className="mt-2 text-gray-300">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href={type.cta.link}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 w-full justify-center"
              >
                {type.cta.text}
              </Link>
            </div>
          ))}
        </div>

        <div className="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-gray-800 mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Why Choose QuoteLinker?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-primary text-4xl font-bold mb-2">100%</div>
              <h3 className="text-lg font-medium text-white mb-2">Free Service</h3>
              <p className="text-gray-300">No cost to you - we're paid by our network of qualified agents</p>
            </div>
            <div className="text-center">
              <div className="text-primary text-4xl font-bold mb-2">24/7</div>
              <h3 className="text-lg font-medium text-white mb-2">AI-Powered Matching</h3>
              <p className="text-gray-300">Get matched with the perfect agent for your needs anytime</p>
            </div>
            <div className="text-center">
              <div className="text-primary text-4xl font-bold mb-2">5★</div>
              <h3 className="text-lg font-medium text-white mb-2">Customer Satisfaction</h3>
              <p className="text-gray-300">Consistently high ratings from satisfied customers</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Find the perfect insurance coverage with our AI-powered matching service
          </p>
          <div className="space-x-4">
            <Link
              href="/quote/life"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200"
            >
              Get Life Insurance Quote
            </Link>
            <Link
              href="/quote/disability"
              className="inline-flex items-center px-6 py-3 border border-gray-700 text-base font-medium rounded-lg text-gray-300 bg-transparent hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200"
            >
              Explore Disability Insurance
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 