'use client'

import Link from 'next/link'

const insuranceBasics = [
  {
    title: 'Understanding Insurance Types',
    content: [
      {
        subtitle: 'Life Insurance',
        description: 'Life insurance provides financial protection for your loved ones in the event of your death. It can help cover funeral expenses, replace lost income, pay off debts, and ensure your family\'s financial security.',
        keyPoints: [
          'Term Life: Coverage for a specific period (e.g., 10, 20, or 30 years)',
          'Whole Life: Permanent coverage with cash value accumulation',
          'Universal Life: Flexible premium payments with investment options'
        ]
      },
      {
        subtitle: 'Disability Insurance',
        description: 'Disability insurance protects your income if you become unable to work due to illness or injury. It ensures you can maintain your lifestyle and meet financial obligations during recovery.',
        keyPoints: [
          'Short-term: Covers 3-6 months of disability',
          'Long-term: Provides coverage for extended periods',
          'Own-occupation: Protects your specific occupation\'s income'
        ]
      },
      {
        subtitle: 'Supplemental Health Insurance',
        description: 'Supplemental health insurance fills gaps in your primary health coverage, helping with out-of-pocket costs and providing additional benefits not covered by your main policy.',
        keyPoints: [
          'Coverage for deductibles and copayments',
          'Additional benefits for specific conditions',
          'Cash benefits for hospital stays'
        ]
      }
    ]
  },
  {
    title: 'How Insurance Works',
    content: [
      {
        subtitle: 'Premiums and Coverage',
        description: 'Insurance premiums are the payments you make to maintain your coverage. The amount depends on various factors including your age, health, occupation, and the type and amount of coverage you choose.',
        keyPoints: [
          'Regular premium payments keep your coverage active',
          'Higher coverage amounts typically mean higher premiums',
          'Healthier individuals often qualify for lower rates'
        ]
      },
      {
        subtitle: 'Claims Process',
        description: 'When you need to use your insurance, you\'ll file a claim with your insurance company. The process varies by policy type but generally involves submitting documentation of your loss or need.',
        keyPoints: [
          'Documentation requirements vary by policy type',
          'Claims can be filed online, by phone, or through your agent',
          'Response times vary based on claim complexity'
        ]
      }
    ]
  }
]

const agentBenefits = [
  {
    title: 'Exclusive Lead Generation',
    description: 'Access high-intent leads that are actively seeking insurance coverage. Our AI-powered platform matches you with prospects who match your expertise and target market.',
    benefits: [
      'Pre-qualified leads ready to purchase',
      'Reduced time spent on cold calling',
      'Higher conversion rates',
      'Targeted lead matching based on your specialties'
    ]
  },
  {
    title: 'Streamlined Workflow',
    description: 'Our platform integrates with your existing tools and automates routine tasks, allowing you to focus on what matters most - closing deals and serving clients.',
    benefits: [
      'Automated lead follow-up',
      'CRM integration',
      'Document management',
      'Client communication tools'
    ]
  },
  {
    title: 'Business Growth Tools',
    description: 'Access resources and tools designed to help you grow your insurance business and provide better service to your clients.',
    benefits: [
      'Marketing materials and templates',
      'Training resources',
      'Performance analytics',
      'Commission tracking'
    ]
  }
]

export default function EducationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F1218] to-[#1A1F2B] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
            Insurance Education Center
          </h1>
          <p className="mt-4 text-xl text-gray-300">
            Learn about insurance basics and discover how our platform benefits agents
          </p>
        </div>

        {/* Insurance Basics Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Insurance Basics</h2>
          <div className="grid grid-cols-1 gap-8">
            {insuranceBasics.map((section) => (
              <div key={section.title} className="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-gray-800">
                <h3 className="text-2xl font-bold text-white mb-6">{section.title}</h3>
                <div className="space-y-8">
                  {section.content.map((item) => (
                    <div key={item.subtitle}>
                      <h4 className="text-xl font-semibold text-primary mb-3">{item.subtitle}</h4>
                      <p className="text-gray-300 mb-4">{item.description}</p>
                      <ul className="list-disc pl-6 space-y-2 text-gray-300">
                        {item.keyPoints.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agent Benefits Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Benefits for Insurance Agents</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {agentBenefits.map((benefit) => (
              <div key={benefit.title} className="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-gray-800">
                <h3 className="text-xl font-bold text-white mb-4">{benefit.title}</h3>
                <p className="text-gray-300 mb-6">{benefit.description}</p>
                <ul className="space-y-3">
                  {benefit.benefits.map((item) => (
                    <li key={item} className="flex items-start">
                      <svg className="h-6 w-6 text-primary flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <div className="space-x-4">
            <Link
              href="/quote/life"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200"
            >
              Get Insurance Quote
            </Link>
            <Link
              href="/agent/signup"
              className="inline-flex items-center px-6 py-3 border border-gray-700 text-base font-medium rounded-lg text-gray-300 bg-transparent hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200"
            >
              Become an Agent
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 