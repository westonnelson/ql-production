import Link from 'next/link'
import Image from 'next/image'

export const dynamic = 'force-static'
export const preferredRegion = 'auto'
export const runtime = 'nodejs'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0F1218] text-white">
      {/* Hero Section */}
      <div className="relative isolate">
        <div className="mx-auto max-w-7xl px-6 pt-10 pb-24 sm:pb-32 lg:flex lg:py-40 lg:px-8">
          <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
            <h1 className="mt-10 text-4xl font-bold tracking-tight sm:text-6xl">
              Life Insurance Made Simple
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Get personalized life insurance quotes from top providers in minutes. No complicated forms, no hassle - just straightforward coverage for you and your loved ones.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Link
                href="/quote/life"
                className="rounded-md bg-primary px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-[#0F1218] transition-all duration-200"
              >
                Get Your Quote Now
              </Link>
              <Link 
                href="#how-it-works"
                className="text-lg font-semibold text-gray-300 hover:text-white"
              >
                Learn More <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-4">
              {['Fast & Easy', 'Best Rates', 'No Obligation', 'Expert Support'].map((feature) => (
                <div key={feature} className="flex items-center gap-x-2">
                  <div className="flex-shrink-0">
                    <div className="rounded-full bg-primary/10 p-1">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mt-0 lg:mr-0 lg:max-w-none xl:ml-32">
            <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
              <div className="w-[500px] h-[500px] flex items-center justify-center rounded-2xl bg-[#1D2432] p-8">
                <svg
                  className="w-64 h-64 text-primary"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12v4.7c0 4.67-3.13 8.96-7 10.12-3.87-1.16-7-5.45-7-10.12V6.3l7-3.12zm-2 9.57L8.12 11l-1.42 1.42L12 17.71l8.3-8.3-1.41-1.42-6.89 6.89-2-2.13z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How it Works Section */}
      <div id="how-it-works" className="bg-[#1D2432] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-primary">How It Works</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Simple Steps to Get Your Insurance Coverage
            </p>
            <p className="mt-4 text-lg text-gray-300">
              Our AI-powered platform connects you with a single licensed agent who specializes in your specific needs
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {[
                {
                  title: '1. Quick Information',
                  description: 'Fill out our simple 3-minute form with basic details about your insurance needs. Your data is protected with industry-standard encryption.',
                },
                {
                  title: '2. AI Matching',
                  description: 'Our advanced AI analyzes your profile and matches you with a licensed agent who specializes in your specific situation and requirements.',
                },
                {
                  title: '3. Personalized Service',
                  description: 'Work with your dedicated agent to get personalized quotes and expert guidance without the pressure of multiple competing offers.',
                },
              ].map((step) => (
                <div key={step.title} className="flex flex-col items-start">
                  <dt className="text-xl font-semibold leading-7 text-white">
                    {step.title}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-400">
                    <p className="flex-auto">{step.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          
          <div className="mt-16 bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Why Choose Our Platform?</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-primary flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Work with a single dedicated agent instead of multiple salespeople</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-primary flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Get personalized attention and expert guidance</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-primary flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Save time with our streamlined process</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Our Commitment to You</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-primary flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Your data is protected with industry-standard security</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-primary flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>No obligation to purchase any insurance</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-primary flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Our service is completely free for consumers</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-16 flex justify-center">
            <Link
              href="/quote/life"
              className="rounded-md bg-primary px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-[#1D2432] transition-all duration-200"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-[#0F1218] py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-lg text-gray-400">
              Find answers to common questions about our insurance matching service.
            </p>
          </div>
          
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-gray-800">
              <h3 className="text-xl font-semibold text-white mb-4">How do you protect my personal information?</h3>
              <p className="text-gray-300">
                We implement industry-standard encryption and security measures to protect your data. Your information is only shared with your matched agent, and we never sell your data to third parties. Our platform is compliant with all relevant data protection regulations.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-gray-800">
              <h3 className="text-xl font-semibold text-white mb-4">Why work with a single licensed agent?</h3>
              <p className="text-gray-300">
                Working with one dedicated agent provides personalized attention and eliminates the hassle of dealing with multiple salespeople. Our AI matches you with an agent who specializes in your specific needs, ensuring you get expert guidance without the pressure of multiple competing offers.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-gray-800">
              <h3 className="text-xl font-semibold text-white mb-4">How quickly can I get coverage?</h3>
              <p className="text-gray-300">
                After completing our 3-minute form, you'll be connected with an agent who can often provide same-day quotes. The actual policy can be approved in as little as 24-48 hours with some carriers, depending on your specific situation.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-gray-800">
              <h3 className="text-xl font-semibold text-white mb-4">Is your service really free?</h3>
              <p className="text-gray-300">
                Yes! Our service is completely free for consumers. We're paid by our network of qualified agents, so you can benefit from our AI matching service at no cost. There's no obligation to purchase any insurance.
              </p>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <Link
              href="/faq"
              className="inline-flex items-center px-6 py-3 border border-gray-700 text-base font-medium rounded-lg text-gray-300 bg-transparent hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200"
            >
              View All FAQs
            </Link>
          </div>
          
          <div className="mt-16">
            <Link
              href="/quote/life"
              className="block w-full rounded-md bg-primary px-8 py-4 text-center text-lg font-semibold text-white shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-[#0F1218] transition-all duration-200"
            >
              Ready to Get Started?
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 