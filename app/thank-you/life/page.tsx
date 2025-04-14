'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ThankYouPage() {
  const router = useRouter()

  useEffect(() => {
    // Track conversion in GA4
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', {
        send_to: `${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}/AW-CONVERSION_ID`,
        value: 1.0,
        currency: 'USD',
      })
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Thank You!
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              We've received your life insurance quote request. One of our licensed agents will contact you shortly to discuss your options.
            </p>
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900">What happens next?</h3>
              <ul className="mt-4 text-sm text-gray-600 space-y-3">
                <li>✓ You'll receive a confirmation email shortly</li>
                <li>✓ A licensed agent will review your information</li>
                <li>✓ You'll receive a call within 24 hours</li>
              </ul>
            </div>
            <div className="mt-8">
              <button
                onClick={() => router.push('/')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Return Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 