'use client'

import { useState, Suspense } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { LifeQuoteFormData, QuoteStep, Gender, TobaccoUse, CoverageAmount, TermLength, EmailData } from '@/types/quote'
import { supabase } from '@/lib/supabaseClient'
import { useSearchParams, useRouter } from 'next/navigation'
import ProgressBar from '@/components/ProgressBar'
import Button from '@/components/Button'

const coverageAmounts = [150000, 250000, 500000, 700000, 1000000, 2000000] as const
const termLengths = [10, 15, 20, 30] as const
const permanentTypes = ['whole-life', 'universal-life', 'limited-pay-10', 'limited-pay-15', 'limited-pay-20'] as const

const formSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  age: z.coerce.number().min(18, 'Must be at least 18 years old').max(85, 'Must be under 85 years old'),
  gender: z.enum(['male', 'female']),
  insuranceType: z.enum(['term', 'permanent']),
  coverageAmount: z.string().refine((val) => {
    const num = Number(val.toString().replace(/[$,]/g, ''));
    return !isNaN(num) && coverageAmounts.includes(num as typeof coverageAmounts[number]);
  }, 'Please select a coverage amount'),
  termLength: z.string().optional().refine((val) => {
    if (!val) return true;
    const num = Number(val);
    return !isNaN(num) && termLengths.includes(num as typeof termLengths[number]);
  }, 'Please select a term length'),
  permanentType: z.enum(permanentTypes).optional(),
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
  3: ['insuranceType', 'coverageAmount', 'termLength', 'permanentType', 'tobaccoUse'],
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
      coverageAmount: '',
      termLength: '',
    },
    mode: 'onTouched',
  })

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true)
      setError(null)

      // Format and sanitize the data
      const formData = {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone,
        age: Number(data.age),
        gender: data.gender,
        product_type: 'life' as const,
        coverage_amount: Number(data.coverageAmount.toString().replace(/[$,]/g, '')),
        term_length: Number(data.termLength),
        tobacco_use: data.tobaccoUse === 'yes' ? true : false,
        utm_source: data.utmSource
      };

      console.log('Submitting form data:', JSON.stringify(formData, null, 2));

      const leadResponse = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const responseText = await leadResponse.text();
      console.log('Raw response:', responseText);

      let leadResult;
      try {
        leadResult = JSON.parse(responseText);
        console.log('Parsed response:', JSON.stringify(leadResult, null, 2));
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        throw new Error('Invalid response from server');
      }

      if (!leadResponse.ok) {
        console.error('Server error response:', {
          status: leadResponse.status,
          statusText: leadResponse.statusText,
          result: leadResult
        });
        throw new Error(
          leadResult.error || 
          (leadResult.details ? JSON.stringify(leadResult.details) : 'Failed to submit form. Please try again.')
        );
      }

      // Clear any existing errors and redirect
      setError(null)
      router.push('/thank-you/life')
    } catch (err) {
      console.error('Form submission error:', err)
      setError(
        err instanceof Error 
          ? err.message 
          : 'An unexpected error occurred. Please try again.'
      )
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
    <div className="container max-w-2xl py-8">
      <ProgressBar currentStep={currentStep} totalSteps={steps.length} />
      
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
        {/* Step content */}
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
              <label htmlFor="insuranceType" className="block text-sm font-medium text-gray-300">
                Insurance Type
              </label>
              <select
                id="insuranceType"
                {...register('insuranceType')}
                className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800/50 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm transition-all duration-200 hover:bg-gray-800/70"
              >
                <option value="">Select insurance type</option>
                <option value="term">Term Life Insurance</option>
                <option value="permanent">Permanent Life Insurance</option>
              </select>
              {errors.insuranceType && touchedFields.insuranceType && (
                <p className="mt-1 text-sm text-red-400 animate-fade-in">{errors.insuranceType.message}</p>
              )}
            </div>

            {watch('insuranceType') === 'term' && (
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
            )}

            {watch('insuranceType') === 'permanent' && (
              <div>
                <label htmlFor="permanentType" className="block text-sm font-medium text-gray-300">
                  Permanent Insurance Type
                </label>
                <select
                  id="permanentType"
                  {...register('permanentType')}
                  className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800/50 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm transition-all duration-200 hover:bg-gray-800/70"
                >
                  <option value="">Select permanent insurance type</option>
                  <option value="whole-life">Whole Life Insurance</option>
                  <option value="universal-life">Universal Life Insurance</option>
                  <option value="limited-pay-10">Limited Pay 10</option>
                  <option value="limited-pay-15">Limited Pay 15</option>
                  <option value="limited-pay-20">Limited Pay 20</option>
                </select>
                {errors.permanentType && touchedFields.permanentType && (
                  <p className="mt-1 text-sm text-red-400 animate-fade-in">{errors.permanentType.message}</p>
                )}
              </div>
            )}

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
        
        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4 mt-8">
          {currentStep > 1 && (
            <Button
              variant="secondary"
              onClick={prevStep}
              type="button"
            >
              Previous
            </Button>
          )}
          {currentStep < steps.length ? (
            <Button
              onClick={nextStep}
              type="button"
              className={currentStep === 1 ? 'ml-auto' : ''}
            >
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="ml-auto"
            >
              {isSubmitting ? 'Processing...' : 'Get Your Quote'}
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}

export default function LifeQuotePage() {
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