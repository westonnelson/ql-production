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
  age: z.number().min(18, 'Must be at least 18 years old').max(85, 'Must be under 85 years old'),
  gender: z.enum(['male', 'female']),
  coverageAmount: z.number(),
  termLength: z.number(),
  tobaccoUse: z.enum(['yes', 'no']),
  utmSource: z.string().optional(),
}) as any // temporary fix for type issues

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

function QuoteForm({ utmSource }: { utmSource: string | null }) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      utmSource: utmSource || undefined,
    },
  })

  const onSubmit = async (data: LifeQuoteFormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      // Insert into Supabase
      const { error: supabaseError } = await supabase
        .from('leads')
        .insert([data])

      if (supabaseError) throw supabaseError

      const emailData: EmailData = {
        firstName: data.firstName,
        email: data.email,
        coverageAmount: data.coverageAmount.toString(),
        termLength: data.termLength.toString(),
      }

      // Send confirmation email
      const confirmationResponse = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'confirmation',
          data: emailData,
        }),
      })

      if (!confirmationResponse.ok) {
        throw new Error('Failed to send confirmation email')
      }

      // Send lead notification email
      const leadResponse = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'lead',
          data: {
            ...data,
            coverageAmount: data.coverageAmount.toString(),
            termLength: data.termLength.toString(),
          },
        }),
      })

      if (!leadResponse.ok) {
        throw new Error('Failed to send lead notification email')
      }

      // Redirect to thank you page
      router.push('/thank-you/life')
    } catch (err) {
      console.error('Error submitting form:', err)
      setError('An error occurred while submitting your request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
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
                    <p className="mt-1 text-sm text-red-400">{errors.firstName.message?.toString()}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    {...register('lastName')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName.message?.toString()}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                    Age
                  </label>
                  <input
                    type="number"
                    id="age"
                    {...register('age', { valueAsNumber: true })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                  {errors.age && (
                    <p className="mt-1 text-sm text-red-600">{errors.age.message?.toString()}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                    Gender
                  </label>
                  <select
                    id="gender"
                    {...register('gender')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  {errors.gender && (
                    <p className="mt-1 text-sm text-red-600">{errors.gender.message?.toString()}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  {...register('email')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message?.toString()}</p>
                )}
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  {...register('phone')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message?.toString()}</p>
                )}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Coverage Amount
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {coverageAmounts.map((amount) => (
                    <div key={amount} className="relative">
                      <input
                        type="radio"
                        id={`coverage-${amount}`}
                        value={amount}
                        {...register('coverageAmount', { valueAsNumber: true })}
                        className="peer sr-only"
                      />
                      <label
                        htmlFor={`coverage-${amount}`}
                        className="flex items-center justify-center p-4 bg-white border rounded-lg cursor-pointer hover:bg-gray-50 peer-checked:border-primary peer-checked:text-primary"
                      >
                        ${amount.toLocaleString()}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.coverageAmount && (
                  <p className="mt-1 text-sm text-red-600">{errors.coverageAmount.message?.toString()}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Term Length
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {termLengths.map((years) => (
                    <div key={years} className="relative">
                      <input
                        type="radio"
                        id={`term-${years}`}
                        value={years}
                        {...register('termLength', { valueAsNumber: true })}
                        className="peer sr-only"
                      />
                      <label
                        htmlFor={`term-${years}`}
                        className="flex items-center justify-center p-4 bg-white border rounded-lg cursor-pointer hover:bg-gray-50 peer-checked:border-primary peer-checked:text-primary"
                      >
                        {years} Years
                      </label>
                    </div>
                  ))}
                </div>
                {errors.termLength && (
                  <p className="mt-1 text-sm text-red-600">{errors.termLength.message?.toString()}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Do you use tobacco products?
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {['no', 'yes'].map((option) => (
                    <div key={option} className="relative">
                      <input
                        type="radio"
                        id={`tobacco-${option}`}
                        value={option}
                        {...register('tobaccoUse')}
                        className="peer sr-only"
                      />
                      <label
                        htmlFor={`tobacco-${option}`}
                        className="flex items-center justify-center p-4 bg-white border rounded-lg cursor-pointer hover:bg-gray-50 peer-checked:border-primary peer-checked:text-primary capitalize"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.tobaccoUse && (
                  <p className="mt-1 text-sm text-red-600">{errors.tobaccoUse.message?.toString()}</p>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between pt-5">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Previous
              </button>
            )}
            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={nextStep}
                className="ml-auto inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
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

export default function LifeInsuranceQuote() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LifeQuoteContent />
    </Suspense>
  )
}

function LifeQuoteContent() {
  const searchParams = useSearchParams()
  const utmSource = searchParams.get('utm_source')

  return <QuoteForm utmSource={utmSource} />
} 