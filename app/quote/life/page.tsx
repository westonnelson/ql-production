'use client'

import { useState, Suspense } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { LifeQuoteFormData, QuoteStep, Gender, TobaccoUse, CoverageAmount, TermLength, EmailData } from '@/types/quote'
import { supabase } from '@/lib/supabaseClient'
import { useSearchParams, useRouter } from 'next/navigation'

const coverageAmounts = [150000, 250000, 500000, 700000, 1000000, 2000000] as const
const termLengths = [10, 20, 30] as const

const formSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  age: z.coerce.number().min(18, 'Must be at least 18 years old').max(85, 'Must be under 85 years old'),
  gender: z.enum(['male', 'female']),
  coverageAmount: z.coerce.number(),
  termLength: z.coerce.number(),
  tobaccoUse: z.enum(['yes', 'no']),
  utmSource: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

const steps: QuoteStep[] = [
  {
    id: 1,
    title: 'Personal Information',
    description: 'Tell us about yourself',
  },
  {
    id: 2,
    title: 'Contact Details',
    description: 'How can we reach you?',
  },
  {
    id: 3,
    title: 'Coverage Details',
    description: 'Choose your coverage options',
  },
]

type FormFields = keyof FormData

const stepFields: Record<number, FormFields[]> = {
  1: ['firstName', 'lastName', 'age', 'gender'],
  2: ['email', 'phone'],
  3: ['coverageAmount', 'termLength', 'tobaccoUse'],
}

function QuoteForm({ utmSource }: { utmSource: string | null }) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      utmSource: utmSource || undefined,
    },
    mode: 'onChange',
  })

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true)
      setError(null)

      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          coverageAmount: Number(data.coverageAmount),
          termLength: Number(data.termLength),
          age: Number(data.age),
          tobaccoUse: data.tobaccoUse === 'yes',
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit form')
      }

      router.push('/thank-you/life')
    } catch (err) {
      console.error('Error submitting form:', err)
      setError('An error occurred while submitting your request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = async () => {
    const fieldsToValidate = stepFields[currentStep]
    const isStepValid = await trigger(fieldsToValidate)

    if (isStepValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
      setError(null)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setError(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#0F1218] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            Life Insurance Quote
          </h1>
          <p className="mt-3 text-xl text-gray-300">
            Get your personalized life insurance quote in minutes
          </p>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-900/20 border border-red-500/20 rounded-md">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-8">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`flex-1 text-center ${
                    step.id <= currentStep ? 'text-primary' : 'text-gray-500'
                  }`}
                >
                  {step.title}
                </div>
              ))}
            </div>
            <div className="relative">
              <div className="absolute top-0 h-1 bg-gray-800 w-full rounded"></div>
              <div
                className="absolute top-0 h-1 bg-primary rounded transition-all duration-300"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-300">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    {...register('firstName')}
                    className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                  {errors.firstName && (
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
                    className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-400">{errors.lastName.message}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-300">
                    Age
                  </label>
                  <input
                    type="number"
                    id="age"
                    {...register('age')}
                    className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                  {errors.age && (
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
                    className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  {errors.gender && (
                    <p className="mt-1 text-sm text-red-400">{errors.gender.message}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  {...register('email')}
                  className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
                {errors.email && (
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
                  className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-400">{errors.phone.message}</p>
                )}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <label htmlFor="coverageAmount" className="block text-sm font-medium text-gray-300">
                  Coverage Amount
                </label>
                <select
                  id="coverageAmount"
                  {...register('coverageAmount')}
                  className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                >
                  <option value="">Select coverage amount</option>
                  {coverageAmounts.map((amount) => (
                    <option key={amount} value={amount}>
                      ${amount.toLocaleString()}
                    </option>
                  ))}
                </select>
                {errors.coverageAmount && (
                  <p className="mt-1 text-sm text-red-400">{errors.coverageAmount.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="termLength" className="block text-sm font-medium text-gray-300">
                  Term Length
                </label>
                <select
                  id="termLength"
                  {...register('termLength')}
                  className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                >
                  <option value="">Select term length</option>
                  {termLengths.map((term) => (
                    <option key={term} value={term}>
                      {term} Years
                    </option>
                  ))}
                </select>
                {errors.termLength && (
                  <p className="mt-1 text-sm text-red-400">{errors.termLength.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="tobaccoUse" className="block text-sm font-medium text-gray-300">
                  Do you use tobacco products?
                </label>
                <select
                  id="tobaccoUse"
                  {...register('tobaccoUse')}
                  className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                >
                  <option value="">Select tobacco use</option>
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
                {errors.tobaccoUse && (
                  <p className="mt-1 text-sm text-red-400">{errors.tobaccoUse.message}</p>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="inline-flex items-center px-4 py-2 border border-gray-700 text-sm font-medium rounded-md text-gray-300 bg-transparent hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Previous
              </button>
            )}
            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={nextStep}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default function LifeInsuranceQuote() {
  const searchParams = useSearchParams()
  const utmSource = searchParams.get('utm_source')

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuoteForm utmSource={utmSource} />
    </Suspense>
  )
} 