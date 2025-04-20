'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFormAnalytics } from '@/lib/hooks/useFormAnalytics';
import ProgressBar from '@/components/ProgressBar';

// Define the form schema
const formSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  age: z.coerce.number().min(18, 'Must be at least 18 years old').max(85, 'Must be under 85 years old'),
  gender: z.enum(['male', 'female']),
  insuranceType: z.string(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;
type FormFields = keyof FormData;

const steps = [
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
];

const stepFields: Record<number, FormFields[]> = {
  1: ['firstName', 'lastName', 'age', 'gender'],
  2: ['email', 'phone'],
  3: ['insuranceType'],
};

interface QuoteFormProps {
  insuranceType: string;
  title?: string;
  subtitle?: string;
  utmSource?: string | null;
}

export default function QuoteForm({ 
  insuranceType,
  title = 'Get Your Free Insurance Quote',
  subtitle = 'Compare competitive rates - No obligation required',
  utmSource = null
}: QuoteFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormTouched, setIsFormTouched] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    trigger,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      insuranceType,
      utmSource: utmSource || 'direct',
    },
    mode: 'onTouched',
  });

  const { trackSubmission } = useFormAnalytics({
    formId: 'quote-form',
    insuranceType,
    totalSteps: steps.length,
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch('/api/submit-quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to submit form');
      }

      await trackSubmission(data);
      router.push(`/thank-you/${insuranceType}`);
    } catch (err) {
      console.error('Form submission error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    setIsFormTouched(true);
    const fields = stepFields[currentStep as keyof typeof stepFields];
    const isValid = await trigger(fields);
    
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
      setError(null);
    } else {
      const currentErrors = Object.entries(errors)
        .filter(([key]) => fields.includes(key as FormFields))
        .map(([_, value]) => value.message)
        .filter(Boolean);
      
      if (currentErrors.length > 0) {
        setError(currentErrors[0] || null);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError(null);
    }
  };

  return (
    <div className="container max-w-2xl py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600">{subtitle}</p>
      </div>

      <ProgressBar currentStep={currentStep} totalSteps={steps.length} />
      
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
        {/* Step content */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  {...register('firstName')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#06B6D4] focus:ring-[#06B6D4] sm:text-sm"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#06B6D4] focus:ring-[#06B6D4] sm:text-sm"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  {...register('age')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#06B6D4] focus:ring-[#06B6D4] sm:text-sm"
                />
                {errors.age && (
                  <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <select
                  id="gender"
                  {...register('gender')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#06B6D4] focus:ring-[#06B6D4] sm:text-sm"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                {errors.gender && (
                  <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                {...register('email')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#06B6D4] focus:ring-[#06B6D4] sm:text-sm"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                {...register('phone')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#06B6D4] focus:ring-[#06B6D4] sm:text-sm"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <label htmlFor="insuranceType" className="block text-sm font-medium text-gray-700">
                Insurance Type
              </label>
              <select
                id="insuranceType"
                {...register('insuranceType')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#06B6D4] focus:ring-[#06B6D4] sm:text-sm"
              >
                <option value="">Select insurance type</option>
                <option value={insuranceType}>{insuranceType.charAt(0).toUpperCase() + insuranceType.slice(1)} Insurance</option>
              </select>
              {errors.insuranceType && (
                <p className="mt-1 text-sm text-red-600">{errors.insuranceType.message}</p>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="mt-8 flex justify-between">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#06B6D4]"
            >
              Previous
            </button>
          )}
          
          {currentStep < steps.length ? (
            <button
              type="button"
              onClick={nextStep}
              className="ml-auto inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#06B6D4] hover:bg-[#0891B2] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#06B6D4]"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="ml-auto inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#06B6D4] hover:bg-[#0891B2] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#06B6D4] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Get Your Quote'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
} 