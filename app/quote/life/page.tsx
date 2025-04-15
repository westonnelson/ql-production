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
  tobaccoUse: z.enum(['yes', 'no']).optional().or(z.literal('')),
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
  const [isFormTouched, setIsFormTouched] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    trigger,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      utmSource: utmSource || 'direct',
      tobaccoUse: '',
    },
    mode: 'onTouched',
  })

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true)
      setError(null)

      // First, submit the lead data
      const leadResponse = await fetch('/api/leads', {
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

      const leadResult = await leadResponse.json()

      if (!leadResponse.ok) {
        throw new Error(leadResult.error || 'Failed to submit form. Please try again.')
      }

      // Then, send the confirmation emails
      const emailResponse = await fetch('/api/send-confirmations', {
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

      const emailResult = await emailResponse.json()

      if (!emailResponse.ok) {
        console.error('Failed to send confirmation emails:', emailResult.error)
        // Don't throw here - we still want to redirect since the lead was saved
      }

      // Clear any existing errors
      setError(null)
      router.push('/thank-you/life')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.')
      console.error('Form submission error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = async () => {
    setIsFormTouched(true)
    const fields = stepFields[currentStep]
    const isValid = await trigger(fields)
    
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length))
      setError(null)
    } else {
      // Only show validation errors if user has interacted with the form
      const currentErrors = Object.entries(errors)
        .filter(([key]) => fields.includes(key as FormFields))
        .map(([_, value]) => value.message)
        .filter(Boolean)
      
      if (currentErrors.length > 0 && Object.keys(errors).some(field => fields.includes(field as FormFields))) {
        setError(currentErrors[0] || null)
      }
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setError(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F1218] to-[#1A1F2B] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
            Life Insurance Quote
          </h1>
          <p className="mt-4 text-xl text-gray-300">
            Get your personalized life insurance quote in minutes
          </p>
        </div>

        {error && isFormTouched && (
          <div className="mt-4 p-4 bg-red-900/20 backdrop-blur-sm border border-red-500/20 rounded-md animate-fade-in">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-8 backdrop-blur-sm bg-white/5 p-8 rounded-xl border border-gray-800">
          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex justify-between mb-4">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`flex-1 text-center transition-all duration-300 ${
                    step.id === currentStep ? 'scale-110' : 'opacity-50'
                  }`}
                >
                  <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-2 border-2 ${
                    step.id <= currentStep ? 'border-primary bg-primary/20' : 'border-gray-600 bg-gray-800'
                  }`}>
                    <span className="text-sm font-medium">{step.id}</span>
                  </div>
                  <div className={`text-sm font-medium ${
                    step.id <= currentStep ? 'text-primary' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </div>
                </div>
              ))}
            </div>
            <div className="relative">
              <div className="absolute top-0 h-1 bg-gray-800 w-full rounded-full"></div>
              <div
                className="absolute top-0 h-1 bg-gradient-to-r from-primary to-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-300">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      {...register('firstName')}
                      className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800/50 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm transition-all duration-200 hover:bg-gray-800/70"
                      placeholder="John"
                    />
                    {errors.firstName && touchedFields.firstName && (
                      <p className="mt-1 text-sm text-red-400 animate-fade-in">{errors.firstName.message}</p>
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
                      className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800/50 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm transition-all duration-200 hover:bg-gray-800/70"
                      placeholder="Doe"
                    />
                    {errors.lastName && touchedFields.lastName && (
                      <p className="mt-1 text-sm text-red-400 animate-fade-in">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="age" className="block text-sm font-medium text-gray-300">
                      Age
                    </label>
                    <input
                      type="number"
                      id="age"
                      {...register('age')}
                      className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800/50 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm transition-all duration-200 hover:bg-gray-800/70"
                      placeholder="35"
                    />
                    {errors.age && touchedFields.age && (
                      <p className="mt-1 text-sm text-red-400 animate-fade-in">{errors.age.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-300">
                      Gender
                    </label>
                    <select
                      id="gender"
                      {...register('gender')}
                      className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800/50 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm transition-all duration-200 hover:bg-gray-800/70"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                    {errors.gender && touchedFields.gender && (
                      <p className="mt-1 text-sm text-red-400 animate-fade-in">{errors.gender.message}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register('email')}
                    className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800/50 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm transition-all duration-200 hover:bg-gray-800/70"
                    placeholder="john@example.com"
                  />
                  {errors.email && touchedFields.email && (
                    <p className="mt-1 text-sm text-red-400 animate-fade-in">{errors.email.message}</p>
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
                    className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800/50 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm transition-all duration-200 hover:bg-gray-800/70"
                    placeholder="(555) 123-4567"
                  />
                  {errors.phone && touchedFields.phone && (
                    <p className="mt-1 text-sm text-red-400 animate-fade-in">{errors.phone.message}</p>
                  )}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="coverageAmount" className="block text-sm font-medium text-gray-300">
                    Coverage Amount
                  </label>
                  <select
                    id="coverageAmount"
                    {...register('coverageAmount')}
                    className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800/50 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm transition-all duration-200 hover:bg-gray-800/70"
                  >
                    <option value="">Select coverage amount</option>
                    {coverageAmounts.map((amount) => (
                      <option key={amount} value={amount}>
                        ${amount.toLocaleString()}
                      </option>
                    ))}
                  </select>
                  {errors.coverageAmount && touchedFields.coverageAmount && (
                    <p className="mt-1 text-sm text-red-400 animate-fade-in">{errors.coverageAmount.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="termLength" className="block text-sm font-medium text-gray-300">
                    Term Length
                  </label>
                  <select
                    id="termLength"
                    {...register('termLength')}
                    className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800/50 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm transition-all duration-200 hover:bg-gray-800/70"
                  >
                    <option value="">Select term length</option>
                    {termLengths.map((term) => (
                      <option key={term} value={term}>
                        {term} Years
                      </option>
                    ))}
                  </select>
                  {errors.termLength && touchedFields.termLength && (
                    <p className="mt-1 text-sm text-red-400 animate-fade-in">{errors.termLength.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="tobaccoUse" className="block text-sm font-medium text-gray-300">
                    Do you use tobacco products?
                  </label>
                  <select
                    id="tobaccoUse"
                    {...register('tobaccoUse')}
                    className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800/50 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm transition-all duration-200 hover:bg-gray-800/70"
                  >
                    <option value="">Select tobacco use</option>
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                  {errors.tobaccoUse && touchedFields.tobaccoUse && isFormTouched && (
                    <p className="mt-1 text-sm text-red-400 animate-fade-in">Please select yes or no</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-12">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="inline-flex items-center px-6 py-3 border border-gray-700 text-base font-medium rounded-lg text-gray-300 bg-transparent hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200"
              >
                Previous
              </button>
            )}
            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={nextStep}
                className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 ${
                  currentStep === 1 ? 'ml-auto' : ''
                }`}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Get Your Quote'
                )}
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