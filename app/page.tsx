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
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Life Insurance Made Simple
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Get personalized life insurance quotes from top providers in minutes. No complicated forms, no hassle - just straightforward coverage for you and your loved ones.
            </p>
            <div className="mt-8 flex items-center gap-x-6">
              <Link
                href="/quote/life"
                className="rounded-md bg-primary px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-[#0F1218] transition-all duration-200"
              >
                Get Your Quote Now
              </Link>
              <Link 
                href="/quote/life"
                className="text-lg font-semibold text-gray-300 hover:text-white"
              >
                Learn More <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-x-6">
              <div className="flex items-center gap-x-4">
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
          </div>
          <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mt-0 lg:mr-0 lg:max-w-none lg:flex-none xl:ml-32">
            <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
              <div className="rounded-2xl bg-[#1D2432] p-8 ring-1 ring-white/10">
                <Image
                  src="/apple-touch-icon.png"
                  alt="Security Shield"
                  width={300}
                  height={300}
                  className="w-[300px] h-[300px] object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How it Works Section */}
      <div id="how-it-works" className="bg-[#1D2432] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-primary">How QuoteLinker Works</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              We've simplified the process of finding the right life insurance coverage for you and your family.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {[
                {
                  title: '1. Answer Simple Questions',
                  description: 'Complete our easy-to-use form with basic information about yourself and your insurance needs.',
                  icon: (
                    <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  ),
                },
                {
                  title: '2. Compare Top Providers',
                  description: "We'll match you with the best life insurance providers based on your specific needs and profile.",
                  icon: (
                    <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  ),
                },
                {
                  title: '3. Get Your Coverage',
                  description: 'Choose the best option for you and get covered quickly with our streamlined application process.',
                  icon: (
                    <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                },
              ].map((step) => (
                <div key={step.title} className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                    {step.icon}
                    {step.title}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-400">
                    <p className="flex-auto">{step.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
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
              Find answers to common questions about life insurance and our quote process.
            </p>
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