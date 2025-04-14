'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function AgentRegister() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // TODO: Implement registration logic
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F1218] to-[#1A1F2B] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Create Agent Account</h1>
          <p className="mt-2 text-gray-300">
            Join our network of insurance professionals and grow your business
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-gray-800">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-300">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800/50 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-300">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800/50 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800/50 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800/50 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800/50 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                  className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800/50 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="agency" className="block text-sm font-medium text-gray-300">
                  Agency Name
                </label>
                <input
                  type="text"
                  id="agency"
                  name="agency"
                  required
                  className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800/50 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-300">
                  Insurance License Number
                </label>
                <input
                  type="text"
                  id="licenseNumber"
                  name="licenseNumber"
                  required
                  className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800/50 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 rounded border-gray-700 bg-gray-800/50 text-primary focus:ring-primary"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-300">
                I agree to the{' '}
                <Link href="/terms" className="text-primary hover:text-primary/80">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-primary hover:text-primary/80">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-300">
              Already have an account?{' '}
              <Link href="/agent/login" className="text-primary hover:text-primary/80">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 