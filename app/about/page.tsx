'use client'

import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F1218] to-[#1A1F2B] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
            Revolutionizing Insurance Connections
          </h1>
          <p className="mt-4 text-xl text-gray-300">
            Using AI to create meaningful connections between consumers and insurance professionals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div className="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-gray-800">
            <h2 className="text-2xl font-bold text-primary mb-4">Our Mission</h2>
            <p className="text-gray-300 leading-relaxed">
              We're transforming how people find and connect with insurance agents. Our AI-powered platform ensures you're matched with agents who truly understand your needs and can provide the right solutions for your unique situation.
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-gray-800">
            <h2 className="text-2xl font-bold text-primary mb-4">The Problem We're Solving</h2>
            <p className="text-gray-300 leading-relaxed">
              Traditional insurance shopping can be overwhelming and impersonal. We're changing that by using advanced AI to create meaningful connections that benefit both consumers and agents.
            </p>
          </div>
        </div>

        <div className="space-y-12 mb-16">
          <h2 className="text-3xl font-bold text-white text-center">How Our AI Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
              <div className="text-primary text-xl font-bold mb-3">1. Smart Matching</div>
              <p className="text-gray-300">Our AI analyzes your specific needs and preferences to find the perfect insurance agent match.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
              <div className="text-primary text-xl font-bold mb-3">2. Quality Verification</div>
              <p className="text-gray-300">We continuously monitor agent performance and customer satisfaction to ensure high-quality connections.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
              <div className="text-primary text-xl font-bold mb-3">3. Personalized Experience</div>
              <p className="text-gray-300">Get customized insurance recommendations based on your unique situation and requirements.</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-gray-800 mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Why Choose QuoteLinker?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">AI-Powered Matching</h3>
                <p className="mt-2 text-gray-300">Smart technology that understands your unique insurance needs</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">Quality Agents</h3>
                <p className="mt-2 text-gray-300">Verified professionals who prioritize your needs</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">Fast & Easy</h3>
                <p className="mt-2 text-gray-300">Get matched with the right agent in minutes</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">Personalized Service</h3>
                <p className="mt-2 text-gray-300">Customized solutions for your specific situation</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Get Started?</h2>
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