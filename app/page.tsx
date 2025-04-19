import Link from 'next/link'
import Image from 'next/image'
import { CheckCircleIcon, ShieldCheckIcon, UserGroupIcon, ClockIcon, HeartIcon } from '@heroicons/react/24/outline'

export const dynamic = 'force-static'
export const preferredRegion = 'auto'
export const runtime = 'nodejs'

export default function HomePage() {
  const features = [
    {
      name: 'Fast & Easy',
      description: 'Get personalized life insurance quotes from top providers in minutes. No complicated forms, no hassle - just straightforward coverage for you and your loved ones.',
      icon: CheckCircleIcon,
    },
    {
      name: 'Best Rates',
      description: 'Our AI-powered platform connects you with a single licensed agent who specializes in your specific needs',
      icon: CheckCircleIcon,
    },
    {
      name: 'No Obligation',
      description: 'Work with your dedicated agent to get personalized quotes and expert guidance without the pressure of multiple competing offers.',
      icon: CheckCircleIcon,
    },
    {
      name: 'Expert Support',
      description: 'Our AI-powered platform connects you with a single licensed agent who specializes in your specific needs',
      icon: CheckCircleIcon,
    },
  ]

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
              Find Your Perfect Insurance Match
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Get matched with a licensed insurance agent who specializes in your needs. Our AI-powered platform finds the right coverage at the right price.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/quote"
                className="rounded-md bg-primary px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white transition-all duration-200"
              >
                Get Your Quote
              </Link>
              <Link
                href="/about"
                className="text-lg font-semibold text-gray-600 hover:text-gray-900"
              >
                Learn More <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Insurance Made Simple
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              We've revolutionized the insurance shopping experience. No more endless forms or unwanted calls - just personalized matches with top agents.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.name} className="flex flex-col">
                  <dt className="text-xl font-semibold leading-7 text-gray-900">
                    <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                      <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Value Props Section */}
      <div className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Why Choose Our Platform?</h3>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-start">
                  <CheckCircleIcon className="h-6 w-6 text-primary flex-shrink-0" />
                  <span className="ml-3">AI-powered matching for perfect agent fit</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-6 w-6 text-primary flex-shrink-0" />
                  <span className="ml-3">Licensed and vetted insurance professionals</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-6 w-6 text-primary flex-shrink-0" />
                  <span className="ml-3">No unwanted calls or spam</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-6 w-6 text-primary flex-shrink-0" />
                  <span className="ml-3">100% free service</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-gray-200 p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Commitment to You</h3>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-start">
                  <ShieldCheckIcon className="h-6 w-6 text-primary flex-shrink-0" />
                  <span className="ml-3">Your data is secure and never sold</span>
                </li>
                <li className="flex items-start">
                  <UserGroupIcon className="h-6 w-6 text-primary flex-shrink-0" />
                  <span className="ml-3">Only work with top-rated insurance agents</span>
                </li>
                <li className="flex items-start">
                  <ClockIcon className="h-6 w-6 text-primary flex-shrink-0" />
                  <span className="ml-3">Quick response times</span>
                </li>
                <li className="flex items-start">
                  <HeartIcon className="h-6 w-6 text-primary flex-shrink-0" />
                  <span className="ml-3">Dedicated support team</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link
              href="/quote"
              className="rounded-md bg-primary px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white transition-all duration-200"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Find answers to common questions about our insurance matching service.
            </p>
          </div>
          
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="bg-white p-8 rounded-xl border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">How do you protect my personal information?</h3>
              <p className="text-gray-600">
                We implement industry-standard encryption and security measures to protect your data. Your information is only shared with your matched agent, and we never sell your data to third parties. Our platform is compliant with all relevant data protection regulations.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Why work with a single licensed agent?</h3>
              <p className="text-gray-600">
                Working with one dedicated agent provides personalized attention and eliminates the hassle of dealing with multiple salespeople. Our AI matches you with an agent who specializes in your specific needs, ensuring you get expert guidance without the pressure of multiple competing offers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="relative isolate overflow-hidden bg-gray-50 px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-gray-900">
              Ready to find your perfect insurance match?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
              Get started now and receive personalized insurance quotes from top providers.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/quote"
                className="block w-full rounded-md bg-primary px-8 py-4 text-center text-lg font-semibold text-white shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white transition-all duration-200 sm:w-auto"
              >
                Get Your Quote
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 