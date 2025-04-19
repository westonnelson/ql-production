'use client'

import { useState, Suspense } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useSearchParams, useRouter } from 'next/navigation'
import ProgressBar from '../../components/ProgressBar'

const coverageTypes = [
  'dwelling',
  'personal-property',
  'liability',
  'medical-payments',
  'loss-of-use',
  'other-structures'
] as const

const formSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  age: z.coerce.number().min(18, 'Must be at least 18 years old').max(100, 'Must be under 100 years old'),
  gender: z.enum(['male', 'female']),
  zipCode: z.string().min(5, 'Zip code must be at least 5 digits'),
  homeYearBuilt: z.number().min(1900).max(new Date().getFullYear()),
  homeSquareFootage: z.number().min(100, 'Home must be at least 100 square feet'),
  homeType: z.enum(['single-family', 'condo', 'townhouse', 'multi-family']),
  coverageTypes: z.array(z.enum(coverageTypes)).min(1, 'Select at least one coverage type'),
  claimsHistory: z.enum(['none', 'one', 'multiple']),
  utmSource: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

const steps = [
  {
    id: 1,
    title: 'Personal Information',
    description: 'Tell us about yourself',
  },
  {
    id: 2,
    title: 'Home Information',
    description: 'Details about your home',
  },
  {
    id: 3,
    title: 'Coverage Options',
    description: 'Choose your coverage types',
  },
]

type FormFields = keyof FormData

const stepFields: Record<number, FormFields[]> = {
  1: ['firstName', 'lastName', 'age', 'gender', 'email', 'phone', 'zipCode'],
  2: ['homeYearBuilt', 'homeSquareFootage', 'homeType'],
  3: ['coverageTypes', 'claimsHistory'],
}

function QuoteForm({ utmSource }: { utmSource: string | null }) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      utmSource: utmSource || 'direct',
      coverageTypes: [],
    },
  })

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true)
      setError(null)

      const response = await fetch('/api/submit-quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          insuranceType: 'homeowners',
        }),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Failed to submit form')
      }

      router.push('/thank-you/homeowners')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
      console.error('Form submission error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F1218] to-[#1A1F2B] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
            Homeowners Insurance Quote
          </h1>
          <p className="mt-4 text-xl text-gray-300">
            Get your personalized homeowners insurance quote in minutes
          </p>
        </div>

        <ProgressBar currentStep={currentStep} totalSteps={steps.length} />

        {error && (
          <div className="mt-4 p-4 bg-red-900/20 backdrop-blur-sm border border-red-500/20 rounded-md animate-fade-in">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-8 backdrop-blur-sm bg-white/5 p-8 rounded-xl border border-gray-800">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-300">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    {...register('firstName')}
                    className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800/50 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                  {errors.firstName && touchedFields.firstName && (
                    <p className="mt-1 text-sm text-red-400">{errors.firstName.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-300">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    {...register('lastName')}
                    className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800/50 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                  {errors.lastName && touchedFields.lastName && (
                    <p className="mt-1 text-sm text-red-400">{errors.lastName.message}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-300">
                    Age
                  </label>
                  <input
                    type="number"
                    id="age"
                    {...register('age')}
                    className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800/50 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                  {errors.age && touchedFields.age && (
                    <p className="mt-1 text-sm text-red-400">{errors.age.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-300">
                    Gender
                  </label>
                  <select
                    id="gender"
                    {...register('gender')}
                    className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800/50 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  {errors.gender && touchedFields.gender && (
                    <p className="mt-1 text-sm text-red-400">{errors.gender.message}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register('email')}
                    className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800/50 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                  {errors.email && touchedFields.email && (
                    <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    {...register('phone')}
                    className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800/50 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                  {errors.phone && touchedFields.phone && (
                    <p className="mt-1 text-sm text-red-400">{errors.phone.message}</p>
                  )}
                </div>
              </div>
              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-300">
                  ZIP Code
                </label>
                <input
                  type="text"
                  id="zipCode"
                  {...register('zipCode')}
                  className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800/50 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
                {errors.zipCode && touchedFields.zipCode && (
                  <p className="mt-1 text-sm text-red-400">{errors.zipCode.message}</p>
                )}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="homeYearBuilt" className="block text-sm font-medium text-gray-300">
                    Year Built
                  </label>
                  <input
                    type="number"
                    id="homeYearBuilt"
                    {...register('homeYearBuilt', { valueAsNumber: true })}
                    className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800/50 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                  {errors.homeYearBuilt && touchedFields.homeYearBuilt && (
                    <p className="mt-1 text-sm text-red-400">{errors.homeYearBuilt.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="homeSquareFootage" className="block text-sm font-medium text-gray-300">
                    Square Footage
                  </label>
                  <input
                    type="number"
                    id="homeSquareFootage"
                    {...register('homeSquareFootage', { valueAsNumber: true })}
                    className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800/50 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                  {errors.homeSquareFootage && touchedFields.homeSquareFootage && (
                    <p className="mt-1 text-sm text-red-400">{errors.homeSquareFootage.message}</p>
                  )}
                </div>
              </div>
              <div>
                <label htmlFor="homeType" className="block text-sm font-medium text-gray-300">
                  Home Type
                </label>
                <select
                  id="homeType"
                  {...register('homeType')}
                  className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800/50 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                >
                  <option value="">Select home type</option>
                  <option value="single-family">Single Family Home</option>
                  <option value="condo">Condominium</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="multi-family">Multi-Family Home</option>
                </select>
                {errors.homeType && touchedFields.homeType && (
                  <p className="mt-1 text-sm text-red-400">{errors.homeType.message}</p>
                )}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-4">
                  Coverage Types
                </label>
                <div className="space-y-4">
                  {coverageTypes.map((type) => (
                    <div key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        id={type}
                        value={type}
                        {...register('coverageTypes')}
                        className="h-4 w-4 rounded border-gray-700 bg-gray-800/50 text-primary focus:ring-primary"
                      />
                      <label htmlFor={type} className="ml-3 text-sm text-gray-300">
                        {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.coverageTypes && touchedFields.coverageTypes && (
                  <p className="mt-1 text-sm text-red-400">{errors.coverageTypes.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="claimsHistory" className="block text-sm font-medium text-gray-300">
                  Claims History
                </label>
                <select
                  id="claimsHistory"
                  {...register('claimsHistory')}
                  className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800/50 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                >
                  <option value="">Select claims history</option>
                  <option value="none">No Claims</option>
                  <option value="one">One Claim</option>
                  <option value="multiple">Multiple Claims</option>
                </select>
                {errors.claimsHistory && touchedFields.claimsHistory && (
                  <p className="mt-1 text-sm text-red-400">{errors.claimsHistory.message}</p>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between pt-6">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Back
              </button>
            )}
            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="ml-auto px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="ml-auto px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Get Your Quote'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default function HomeownersInsuranceQuote() {
  const searchParams = useSearchParams()
  const utmSource = searchParams?.get('utm_source') || null

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen bg-gray-50">
        <QuoteForm utmSource={utmSource} />
      </div>
    </Suspense>
  )
} 