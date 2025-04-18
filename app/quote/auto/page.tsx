'use client'

import { useState, Suspense } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useSearchParams, useRouter } from 'next/navigation'
import ProgressBar from '@/app/components/ProgressBar'

const currentYear = new Date().getFullYear()
const vehicleYears = Array.from(
  { length: currentYear - 1900 + 1 },
  (_, i) => currentYear - i
)

const coverageTypes = [
  'comprehensive',
  'collision',
  'liability',
  'personal-injury-protection',
  'uninsured-motorist',
  'medical-payments'
] as const

const formSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  age: z.coerce.number().min(16, 'Must be at least 16 years old').max(100, 'Must be under 100 years old'),
  gender: z.enum(['male', 'female']),
  zipCode: z.string().min(5, 'Zip code must be at least 5 digits'),
  vehicleYear: z.number().min(1900).max(new Date().getFullYear() + 1),
  vehicleMake: z.string().min(1, 'Vehicle make is required'),
  vehicleModel: z.string().min(1, 'Vehicle model is required'),
  coverageTypes: z.array(z.enum(coverageTypes)).min(1, 'Select at least one coverage type'),
  drivingHistory: z.enum(['clean', 'minor-violations', 'major-violations']),
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
    title: 'Vehicle Information',
    description: 'Details about your vehicle',
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
  2: ['vehicleYear', 'vehicleMake', 'vehicleModel'],
  3: ['coverageTypes', 'drivingHistory'],
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
          insuranceType: 'auto',
        }),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Failed to submit form')
      }

      router.push('/thank-you/auto')
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
            Auto Insurance Quote
          </h1>
          <p className="mt-4 text-xl text-gray-300">
            Get your personalized auto insurance quote in minutes
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
                  <label htmlFor="vehicleYear" className="block text-sm font-medium text-gray-300">
                    Vehicle Year
                  </label>
                  <select
                    id="vehicleYear"
                    {...register('vehicleYear', { valueAsNumber: true })}
                    className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800/50 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  >
                    <option value="">Select year</option>
                    {vehicleYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  {errors.vehicleYear && touchedFields.vehicleYear && (
                    <p className="mt-1 text-sm text-red-400">{errors.vehicleYear.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="vehicleMake" className="block text-sm font-medium text-gray-300">
                    Vehicle Make
                  </label>
                  <input
                    type="text"
                    id="vehicleMake"
                    {...register('vehicleMake')}
                    className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800/50 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                  {errors.vehicleMake && touchedFields.vehicleMake && (
                    <p className="mt-1 text-sm text-red-400">{errors.vehicleMake.message}</p>
                  )}
                </div>
              </div>
              <div>
                <label htmlFor="vehicleModel" className="block text-sm font-medium text-gray-300">
                  Vehicle Model
                </label>
                <input
                  type="text"
                  id="vehicleModel"
                  {...register('vehicleModel')}
                  className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800/50 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
                {errors.vehicleModel && touchedFields.vehicleModel && (
                  <p className="mt-1 text-sm text-red-400">{errors.vehicleModel.message}</p>
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
                <label htmlFor="drivingHistory" className="block text-sm font-medium text-gray-300">
                  Driving History
                </label>
                <select
                  id="drivingHistory"
                  {...register('drivingHistory')}
                  className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800/50 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                >
                  <option value="">Select driving history</option>
                  <option value="clean">Clean Record</option>
                  <option value="minor-violations">Minor Violations</option>
                  <option value="major-violations">Major Violations</option>
                </select>
                {errors.drivingHistory && touchedFields.drivingHistory && (
                  <p className="mt-1 text-sm text-red-400">{errors.drivingHistory.message}</p>
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

export default function AutoInsuranceQuote() {
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