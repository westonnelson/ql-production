'use client'

import { useState, Suspense } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useSearchParams, useRouter } from 'next/navigation'

const occupationTypes = [
  'Professional/Office Work',
  'Healthcare',
  'Education',
  'Sales',
  'Skilled Trade/Technical',
  'Service Industry',
  'Other'
] as const

const incomeRanges = [
  '30000-49999',
  '50000-74999',
  '75000-99999',
  '100000-149999',
  '150000-199999',
  '200000+'
] as const

const formSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  age: z.coerce.number().min(18, 'Must be at least 18 years old').max(65, 'Must be under 65 years old'),
  occupation: z.enum(occupationTypes),
  incomeRange: z.enum(incomeRanges),
  employmentStatus: z.enum(['employed', 'self-employed']),
  preExistingConditions: z.enum(['yes', 'no']),
  desiredCoverageAmount: z.enum(['1000', '2000', '3000', '4000', '5000']),
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
    title: 'Employment Details',
    description: 'Your work information',
  },
  {
    id: 3,
    title: 'Coverage Preferences',
    description: 'Choose your coverage options',
  },
]

type FormFields = keyof FormData

function QuoteForm({ utmSource }: { utmSource: string | null }) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [touchedFields, setTouchedFields] = useState<Record<FormFields, boolean>>({} as Record<FormFields, boolean>)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      utmSource: utmSource || '',
    },
  })

  const handleFieldBlur = (field: FormFields) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }))
  }

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/submit-quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          insuranceType: 'disability',
          coverageType: 'short-term',
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit form')
      }

      router.push('/thank-you/short-term-disability')
    } catch (error) {
      console.error('Error submitting form:', error)
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F1218] to-[#1A1F2B] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
            Short-Term Disability Insurance Quote
          </h1>
          <p className="mt-4 text-xl text-gray-300">
            Protect your income if you're unable to work due to illness or injury
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step.id <= currentStep ? 'bg-primary text-white' : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  {step.id}
                </div>
                <div className="mt-2 text-center">
                  <div className="text-sm font-medium text-white">{step.title}</div>
                  <div className="text-xs text-gray-400">{step.description}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="relative mt-4">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-between">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step.id <= currentStep ? 'bg-primary text-white' : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  {step.id}
                </div>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-gray-800">
            {/* Step 1: Personal Information */}
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
                      onBlur={() => handleFieldBlur('firstName')}
                      className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800/50 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
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
                      onBlur={() => handleFieldBlur('lastName')}
                      className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800/50 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    />
                    {errors.lastName && touchedFields.lastName && (
                      <p className="mt-1 text-sm text-red-400 animate-fade-in">{errors.lastName.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      {...register('email')}
                      onBlur={() => handleFieldBlur('email')}
                      className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800/50 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    />
                    {errors.email && touchedFields.email && (
                      <p className="mt-1 text-sm text-red-400 animate-fade-in">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      {...register('phone')}
                      onBlur={() => handleFieldBlur('phone')}
                      className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800/50 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    />
                    {errors.phone && touchedFields.phone && (
                      <p className="mt-1 text-sm text-red-400 animate-fade-in">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="age" className="block text-sm font-medium text-gray-300">
                      Age
                    </label>
                    <input
                      type="number"
                      id="age"
                      {...register('age')}
                      onBlur={() => handleFieldBlur('age')}
                      className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800/50 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    />
                    {errors.age && touchedFields.age && (
                      <p className="mt-1 text-sm text-red-400 animate-fade-in">{errors.age.message}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Employment Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="occupation" className="block text-sm font-medium text-gray-300">
                      Occupation
                    </label>
                    <select
                      id="occupation"
                      {...register('occupation')}
                      onBlur={() => handleFieldBlur('occupation')}
                      className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800/50 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    >
                      <option value="">Select occupation</option>
                      {occupationTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    {errors.occupation && touchedFields.occupation && (
                      <p className="mt-1 text-sm text-red-400 animate-fade-in">{errors.occupation.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="incomeRange" className="block text-sm font-medium text-gray-300">
                      Annual Income
                    </label>
                    <select
                      id="incomeRange"
                      {...register('incomeRange')}
                      onBlur={() => handleFieldBlur('incomeRange')}
                      className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800/50 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    >
                      <option value="">Select income range</option>
                      {incomeRanges.map((range) => (
                        <option key={range} value={range}>
                          ${range.split('-')[0]} - ${range.split('-')[1]}
                        </option>
                      ))}
                    </select>
                    {errors.incomeRange && touchedFields.incomeRange && (
                      <p className="mt-1 text-sm text-red-400 animate-fade-in">{errors.incomeRange.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="employmentStatus" className="block text-sm font-medium text-gray-300">
                      Employment Status
                    </label>
                    <select
                      id="employmentStatus"
                      {...register('employmentStatus')}
                      onBlur={() => handleFieldBlur('employmentStatus')}
                      className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800/50 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    >
                      <option value="">Select employment status</option>
                      <option value="employed">Employed</option>
                      <option value="self-employed">Self-Employed</option>
                    </select>
                    {errors.employmentStatus && touchedFields.employmentStatus && (
                      <p className="mt-1 text-sm text-red-400 animate-fade-in">{errors.employmentStatus.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="preExistingConditions" className="block text-sm font-medium text-gray-300">
                      Do you have any pre-existing conditions?
                    </label>
                    <select
                      id="preExistingConditions"
                      {...register('preExistingConditions')}
                      onBlur={() => handleFieldBlur('preExistingConditions')}
                      className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800/50 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    >
                      <option value="">Select an option</option>
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                    {errors.preExistingConditions && touchedFields.preExistingConditions && (
                      <p className="mt-1 text-sm text-red-400 animate-fade-in">{errors.preExistingConditions.message}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Coverage Preferences */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="desiredCoverageAmount" className="block text-sm font-medium text-gray-300">
                      Desired Monthly Benefit Amount
                    </label>
                    <select
                      id="desiredCoverageAmount"
                      {...register('desiredCoverageAmount')}
                      onBlur={() => handleFieldBlur('desiredCoverageAmount')}
                      className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800/50 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    >
                      <option value="">Select benefit amount</option>
                      <option value="1000">$1,000/month</option>
                      <option value="2000">$2,000/month</option>
                      <option value="3000">$3,000/month</option>
                      <option value="4000">$4,000/month</option>
                      <option value="5000">$5,000/month</option>
                    </select>
                    {errors.desiredCoverageAmount && touchedFields.desiredCoverageAmount && (
                      <p className="mt-1 text-sm text-red-400 animate-fade-in">{errors.desiredCoverageAmount.message}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-3 border border-gray-700 text-base font-medium rounded-lg text-gray-300 bg-transparent hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200"
              >
                Back
              </button>
            )}
            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={handleNext}
                className="ml-auto px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="ml-auto px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 disabled:opacity-50"
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

export default function ShortTermDisabilityQuote() {
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