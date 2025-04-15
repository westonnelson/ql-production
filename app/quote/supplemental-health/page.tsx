'use client'

import { useState, Suspense } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useSearchParams, useRouter } from 'next/navigation'

const healthStatusOptions = [
  'Excellent',
  'Good',
  'Fair',
  'Poor'
] as const

const primaryInsuranceTypes = [
  'Employer Group Plan',
  'Individual Plan',
  'Medicare',
  'Medicaid',
  'Other'
] as const

const formSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  age: z.coerce.number().min(18, 'Must be at least 18 years old').max(85, 'Must be under 85 years old'),
  zipCode: z.string().min(5, 'Zip code must be at least 5 digits'),
  primaryInsuranceType: z.enum(primaryInsuranceTypes),
  healthStatus: z.enum(healthStatusOptions),
  preExistingConditions: z.enum(['yes', 'no']),
  desiredCoverageType: z.enum(['hospital', 'critical-illness', 'accident', 'dental', 'vision']),
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
    title: 'Health Information',
    description: 'Your health details',
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
      // TODO: Implement form submission logic
      console.log('Form data:', data)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      // Redirect to thank you page
      router.push('/thank-you/supplemental-health')
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F1218] to-[#1A1F2B] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
            Supplemental Health Insurance Quote
          </h1>
          <p className="mt-4 text-xl text-gray-300">
            Fill the gaps in your primary health insurance coverage
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

                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-300">
                      Zip Code
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      {...register('zipCode')}
                      onBlur={() => handleFieldBlur('zipCode')}
                      className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800/50 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    />
                    {errors.zipCode && touchedFields.zipCode && (
                      <p className="mt-1 text-sm text-red-400 animate-fade-in">{errors.zipCode.message}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Health Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="primaryInsuranceType" className="block text-sm font-medium text-gray-300">
                      Primary Insurance Type
                    </label>
                    <select
                      id="primaryInsuranceType"
                      {...register('primaryInsuranceType')}
                      onBlur={() => handleFieldBlur('primaryInsuranceType')}
                      className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800/50 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    >
                      <option value="">Select insurance type</option>
                      {primaryInsuranceTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    {errors.primaryInsuranceType && touchedFields.primaryInsuranceType && (
                      <p className="mt-1 text-sm text-red-400 animate-fade-in">{errors.primaryInsuranceType.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="healthStatus" className="block text-sm font-medium text-gray-300">
                      General Health Status
                    </label>
                    <select
                      id="healthStatus"
                      {...register('healthStatus')}
                      onBlur={() => handleFieldBlur('healthStatus')}
                      className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800/50 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    >
                      <option value="">Select health status</option>
                      {healthStatusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    {errors.healthStatus && touchedFields.healthStatus && (
                      <p className="mt-1 text-sm text-red-400 animate-fade-in">{errors.healthStatus.message}</p>
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
                    <label htmlFor="desiredCoverageType" className="block text-sm font-medium text-gray-300">
                      Desired Coverage Type
                    </label>
                    <select
                      id="desiredCoverageType"
                      {...register('desiredCoverageType')}
                      onBlur={() => handleFieldBlur('desiredCoverageType')}
                      className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800/50 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    >
                      <option value="">Select coverage type</option>
                      <option value="hospital">Hospital Indemnity</option>
                      <option value="critical-illness">Critical Illness</option>
                      <option value="accident">Accident Insurance</option>
                      <option value="dental">Dental Insurance</option>
                      <option value="vision">Vision Insurance</option>
                    </select>
                    {errors.desiredCoverageType && touchedFields.desiredCoverageType && (
                      <p className="mt-1 text-sm text-red-400 animate-fade-in">{errors.desiredCoverageType.message}</p>
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

export default function SupplementalHealthQuote() {
  const searchParams = useSearchParams()
  const utmSource = searchParams.get('utm_source')

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuoteForm utmSource={utmSource} />
    </Suspense>
  )
} 