'use client'

import { useState } from 'react'
import Link from 'next/link'

const faqs = [
  {
    category: 'Life Insurance',
    questions: [
      {
        q: "How does QuoteLinker's AI match me with the right agent?",
        a: "Our advanced AI technology analyzes multiple factors including your coverage needs, budget, and preferences to connect you with agents who specialize in your specific situation. This ensures you get personalized attention and expert guidance."
      },
      {
        q: "How quickly can I get life insurance coverage?",
        a: "The process can be very quick! After completing our 3-minute form, you'll be connected with an agent who can often provide same-day quotes. The actual policy can be approved in as little as 24-48 hours with some carriers."
      },
      {
        q: "Do I need a medical exam to get life insurance?",
        a: "Not always. Many carriers now offer no-exam policies. Your matched agent will help you understand which options are best for your situation and can often find coverage without requiring a medical exam."
      },
      {
        q: "How much life insurance coverage do I need?",
        a: "While everyone's situation is different, a common recommendation is 10-15 times your annual income. Our AI-powered platform will help calculate a personalized recommendation based on your specific circumstances."
      }
    ]
  },
  {
    category: 'Disability Insurance',
    questions: [
      {
        q: "What types of disability insurance are available?",
        a: "We offer both short-term and long-term disability insurance options. Short-term typically covers 3-6 months, while long-term can provide coverage for several years or until retirement age."
      },
      {
        q: "How much of my income can disability insurance cover?",
        a: "Typically, disability insurance can replace 60-70% of your income. Your matched agent will help you understand the exact coverage amounts available based on your occupation and income level."
      },
      {
        q: "Can I get disability insurance if I'm self-employed?",
        a: "Yes! Self-employed individuals often have an even greater need for disability coverage. Our platform specializes in connecting self-employed professionals with agents who understand their unique needs."
      }
    ]
  },
  {
    category: 'Supplemental Health Insurance',
    questions: [
      {
        q: "What does supplemental health insurance cover?",
        a: "Supplemental health insurance can cover various gaps in your primary health insurance, including deductibles, copayments, and additional services not covered by your main policy."
      },
      {
        q: "Do I need supplemental health insurance if I have Medicare?",
        a: "Many Medicare beneficiaries find supplemental coverage valuable as it can help cover out-of-pocket costs and provide additional benefits. Your matched agent can explain the specific advantages for your situation."
      },
      {
        q: "How does supplemental health insurance work with my primary insurance?",
        a: "Supplemental insurance works alongside your primary health insurance to provide additional coverage and benefits. It can help pay for deductibles, copays, and other out-of-pocket expenses."
      }
    ]
  },
  {
    category: 'Working with QuoteLinker',
    questions: [
      {
        q: "Is your service really free?",
        a: "Yes! Our service is completely free for consumers. We're paid by our network of qualified agents, so you can benefit from our AI matching service at no cost."
      },
      {
        q: "How do you ensure agent quality?",
        a: "We carefully vet all agents in our network and continuously monitor customer satisfaction. Our AI system also learns from feedback to improve matches over time."
      },
      {
        q: "What happens after I submit my information?",
        a: "You'll be quickly matched with an appropriate agent who will contact you within 24 hours. They'll provide personalized quotes and help you understand your options without any pressure."
      },
      {
        q: "Can I compare multiple quotes?",
        a: "Absolutely! Your matched agent will help you compare options from different carriers to find the best coverage and rates for your situation."
      }
    ]
  }
]

export default function FAQPage() {
  const [openCategory, setOpenCategory] = useState<string>('Life Insurance')
  const [openQuestions, setOpenQuestions] = useState<Record<string, boolean>>({})

  const toggleQuestion = (category: string, index: number) => {
    const key = `${category}-${index}`
    setOpenQuestions(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F1218] to-[#1A1F2B] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-xl text-gray-300">
            Get answers to common questions about our AI-powered insurance matching service
          </p>
        </div>

        <div className="space-y-8">
          {faqs.map((category) => (
            <div key={category.category} className="bg-white/5 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden">
              <button
                className="w-full px-8 py-6 text-left focus:outline-none"
                onClick={() => setOpenCategory(category.category)}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">{category.category}</h2>
                  <svg
                    className={`w-6 h-6 text-primary transition-transform ${
                      openCategory === category.category ? 'transform rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              {openCategory === category.category && (
                <div className="px-8 pb-6">
                  <div className="space-y-4">
                    {category.questions.map((faq, index) => (
                      <div key={index} className="border-t border-gray-800 pt-4">
                        <button
                          className="w-full text-left focus:outline-none"
                          onClick={() => toggleQuestion(category.category, index)}
                        >
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-white">{faq.q}</h3>
                            <svg
                              className={`w-5 h-5 text-primary transition-transform ${
                                openQuestions[`${category.category}-${index}`] ? 'transform rotate-180' : ''
                              }`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </button>
                        {openQuestions[`${category.category}-${index}`] && (
                          <p className="mt-4 text-gray-300 leading-relaxed">{faq.a}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-white mb-6">Ready to find your perfect insurance match?</h2>
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