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
              Simple Steps to Get Your Life Insurance Coverage
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {[
                {
                  title: '1. Quick Information',
                  description: 'Fill out our simple form with basic details about your insurance needs.',
                },
                {
                  title: '2. Compare Quotes',
                  description: 'Get matched with the best insurance providers based on your profile.',
                },
                {
                  title: '3. Get Coverage',
                  description: 'Choose your preferred plan and get covered in minutes.',
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