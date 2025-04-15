import React, { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { logFunnelStep, logFormSubmission } from '../lib/analytics';
import { useUtmParams, getFunnelConfig, getFunnelStep } from '@/lib/utm';

// Base schema for all insurance types
const baseSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  age: z.number().int().min(18).max(100),
  gender: z.enum(['male', 'female', 'other']),
  insuranceType: z.enum(['life', 'disability', 'auto', 'supplemental']),
  funnelName: z.string().optional(),
  funnelStep: z.string().optional(),
  funnelVariant: z.string().optional(),
  abTestId: z.string().optional(),
  abTestVariant: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmContent: z.string().optional(),
  utmTerm: z.string().optional(),
});

// Insurance-specific schemas
const lifeSchema = baseSchema.extend({
  insuranceType: z.literal('life'),
  coverageAmount: z.number().int().min(10000),
  termLength: z.number().int().min(5).max(30),
  tobaccoUse: z.boolean(),
});

const disabilitySchema = baseSchema.extend({
  insuranceType: z.literal('disability'),
  occupation: z.string().min(1, 'Occupation is required'),
  employmentStatus: z.enum(['full-time', 'part-time', 'self-employed']),
  incomeRange: z.string().min(1, 'Income range is required'),
});

const autoSchema = baseSchema.extend({
  insuranceType: z.literal('auto'),
  vehicleYear: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  vehicleMake: z.string().min(1, 'Vehicle make is required'),
  vehicleModel: z.string().min(1, 'Vehicle model is required'),
});

const supplementalSchema = baseSchema.extend({
  insuranceType: z.literal('supplemental'),
  healthStatus: z.enum(['excellent', 'good', 'fair', 'poor']),
  preExistingConditions: z.boolean(),
});

// Combined schema
const formSchema = z.discriminatedUnion('insuranceType', [
  lifeSchema,
  disabilitySchema,
  autoSchema,
  supplementalSchema,
]);

type FormData = z.infer<typeof formSchema>;

interface QuoteFormProps {
  insuranceType: string;
  initialData?: Partial<FormData>;
  onSuccess?: (data: FormData) => void;
}

const QuoteForm: React.FC<QuoteFormProps> = ({ insuranceType, initialData, onSuccess }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const utmParams = useUtmParams();
  const funnelConfig = getFunnelConfig(pathname);
  const currentStep = getFunnelStep(pathname);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...initialData,
      insuranceType: insuranceType as FormData['insuranceType'],
      utmSource: searchParams.get('utm_source') || undefined,
      utmMedium: searchParams.get('utm_medium') || undefined,
      utmCampaign: searchParams.get('utm_campaign') || undefined,
      utmContent: searchParams.get('utm_content') || undefined,
      utmTerm: searchParams.get('utm_term') || undefined,
    },
  });

  useEffect(() => {
    // Log funnel step view
    logFunnelStep({
      step: currentStep,
      insuranceType,
      funnelName: funnelConfig.name,
      funnelVariant: funnelConfig.variant,
      abTestId: funnelConfig.abTestId,
      abTestVariant: funnelConfig.abTestVariant
    });
  }, [currentStep, insuranceType, funnelConfig]);

  const onSubmit = async (data: FormData) => {
    try {
      // Log form submission
      logFormSubmission({
        insuranceType,
        formData: data,
        utmParams,
        funnelName: funnelConfig.name,
        funnelStep: currentStep,
        funnelVariant: funnelConfig.variant,
        abTestId: funnelConfig.abTestId,
        abTestVariant: funnelConfig.abTestVariant
      });

      // Submit form data
      const response = await fetch('/api/submit-quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      if (onSuccess) {
        onSuccess(data);
      }

      // Navigate to success page
      router.push(`/quote/${insuranceType}/success`);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F1218] to-[#1A1F2B] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
            {insuranceType.charAt(0).toUpperCase() + insuranceType.slice(1)} Insurance Quote
          </h1>
          <p className="mt-4 text-xl text-gray-300">
            Get your personalized {insuranceType} insurance quote in minutes
          </p>
        </div>

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

        {error && (
          <div className="mt-4 p-4 bg-red-900/20 backdrop-blur-sm border border-red-500/20 rounded-md animate-fade-in">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-8 backdrop-blur-sm bg-white/5 p-8 rounded-xl border border-gray-800">
          {/* Step 1: Personal Information */}
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
                    {...register('age', { valueAsNumber: true })}
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
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && touchedFields.gender && (
                    <p className="mt-1 text-sm text-red-400 animate-fade-in">{errors.gender.message}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Contact Details */}
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

          {/* Step 3: Insurance-specific fields */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {insuranceType === 'auto' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label htmlFor="vehicleYear" className="block text-sm font-medium text-gray-300">
                        Vehicle Year
                      </label>
                      <input
                        type="number"
                        id="vehicleYear"
                        {...register('vehicleYear', { valueAsNumber: true })}
                        className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800/50 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm transition-all duration-200 hover:bg-gray-800/70"
                        placeholder="2024"
                      />
                      {errors.vehicleYear && touchedFields.vehicleYear && (
                        <p className="mt-1 text-sm text-red-400 animate-fade-in">{errors.vehicleYear.message}</p>
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
                        className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800/50 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm transition-all duration-200 hover:bg-gray-800/70"
                        placeholder="Toyota"
                      />
                      {errors.vehicleMake && touchedFields.vehicleMake && (
                        <p className="mt-1 text-sm text-red-400 animate-fade-in">{errors.vehicleMake.message}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="vehicleModel" className="block text-sm font-medium text-gray-300">
                        Vehicle Model
                      </label>
                      <input
                        type="text"
                        id="vehicleModel"
                        {...register('vehicleModel')}
                        className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800/50 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm transition-all duration-200 hover:bg-gray-800/70"
                        placeholder="Camry"
                      />
                      {errors.vehicleModel && touchedFields.vehicleModel && (
                        <p className="mt-1 text-sm text-red-400 animate-fade-in">{errors.vehicleModel.message}</p>
                      )}
                    </div>
                  </div>
                </>
              )}

              {insuranceType === 'life' && (
                <>
                  <div>
                    <label htmlFor="coverageAmount" className="block text-sm font-medium text-gray-300">
                      Coverage Amount
                    </label>
                    <select
                      id="coverageAmount"
                      {...register('coverageAmount', { valueAsNumber: true })}
                      className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800/50 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm transition-all duration-200 hover:bg-gray-800/70"
                    >
                      <option value="">Select coverage amount</option>
                      <option value="100000">$100,000</option>
                      <option value="250000">$250,000</option>
                      <option value="500000">$500,000</option>
                      <option value="1000000">$1,000,000</option>
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
                      {...register('termLength', { valueAsNumber: true })}
                      className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800/50 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm transition-all duration-200 hover:bg-gray-800/70"
                    >
                      <option value="">Select term length</option>
                      <option value="10">10 Years</option>
                      <option value="20">20 Years</option>
                      <option value="30">30 Years</option>
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
                      {...register('tobaccoUse', { valueAsNumber: true })}
                      className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800/50 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm transition-all duration-200 hover:bg-gray-800/70"
                    >
                      <option value="">Select tobacco use</option>
                      <option value="0">No</option>
                      <option value="1">Yes</option>
                    </select>
                    {errors.tobaccoUse && touchedFields.tobaccoUse && (
                      <p className="mt-1 text-sm text-red-400 animate-fade-in">{errors.tobaccoUse.message}</p>
                    )}
                  </div>
                </>
              )}

              {insuranceType === 'disability' && (
                <>
                  <div>
                    <label htmlFor="occupation" className="block text-sm font-medium text-gray-300">
                      Occupation
                    </label>
                    <input
                      type="text"
                      id="occupation"
                      {...register('occupation')}
                      className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800/50 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm transition-all duration-200 hover:bg-gray-800/70"
                      placeholder="Software Engineer"
                    />
                    {errors.occupation && touchedFields.occupation && (
                      <p className="mt-1 text-sm text-red-400 animate-fade-in">{errors.occupation.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="employmentStatus" className="block text-sm font-medium text-gray-300">
                      Employment Status
                    </label>
                    <select
                      id="employmentStatus"
                      {...register('employmentStatus')}
                      className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800/50 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm transition-all duration-200 hover:bg-gray-800/70"
                    >
                      <option value="">Select employment status</option>
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="self-employed">Self-employed</option>
                    </select>
                    {errors.employmentStatus && touchedFields.employmentStatus && (
                      <p className="mt-1 text-sm text-red-400 animate-fade-in">{errors.employmentStatus.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="incomeRange" className="block text-sm font-medium text-gray-300">
                      Annual Income Range
                    </label>
                    <select
                      id="incomeRange"
                      {...register('incomeRange')}
                      className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800/50 text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm transition-all duration-200 hover:bg-gray-800/70"
                    >
                      <option value="">Select income range</option>
                      <option value="0-50000">$0 - $50,000</option>
                      <option value="50000-100000">$50,000 - $100,000</option>
                      <option value="100000-150000">$100,000 - $150,000</option>
                      <option value="150000+">$150,000+</option>
                    </select>
                    {errors.incomeRange && touchedFields.incomeRange && (
                      <p className="mt-1 text-sm text-red-400 animate-fade-in">{errors.incomeRange.message}</p>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 border border-gray-700 text-base font-medium rounded-lg text-gray-300 bg-transparent hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200"
              >
                Back
              </button>
            )}
            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={nextStep}
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
  );
};

export default QuoteForm; 