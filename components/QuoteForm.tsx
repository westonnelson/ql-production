import { useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useUtmParams, getFunnelConfig, getFunnelStep } from '@/lib/utm';
import { logFunnelStep, logFormSubmission } from '@/lib/analytics';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

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
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_content: z.string().optional(),
  utm_term: z.string().optional(),
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

// Combined schema with discriminated union
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

export default function QuoteForm({ insuranceType, initialData, onSuccess }: QuoteFormProps) {
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
      utm_source: searchParams.get('utm_source') || undefined,
      utm_medium: searchParams.get('utm_medium') || undefined,
      utm_campaign: searchParams.get('utm_campaign') || undefined,
      utm_content: searchParams.get('utm_content') || undefined,
      utm_term: searchParams.get('utm_term') || undefined,
    },
  });

  useEffect(() => {
    // Log funnel step view
    logFunnelStep({
      step: parseInt(currentStep, 10) || 1,
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
        utmParams: {
          utm_source: data.utm_source,
          utm_medium: data.utm_medium,
          utm_campaign: data.utm_campaign,
          utm_content: data.utm_content,
          utm_term: data.utm_term,
        },
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Base fields */}
      <div>
        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
          First Name
        </label>
        <input
          type="text"
          id="firstName"
          {...register('firstName')}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
            errors.firstName ? 'border-red-500' : ''
          }`}
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
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
            errors.lastName ? 'border-red-500' : ''
          }`}
        />
        {errors.lastName && (
          <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          {...register('email')}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
            errors.email ? 'border-red-500' : ''
          }`}
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
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
            errors.phone ? 'border-red-500' : ''
          }`}
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="age" className="block text-sm font-medium text-gray-700">
          Age
        </label>
        <input
          type="number"
          id="age"
          {...register('age', { valueAsNumber: true })}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
            errors.age ? 'border-red-500' : ''
          }`}
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
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
            errors.gender ? 'border-red-500' : ''
          }`}
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {errors.gender && (
          <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
        )}
      </div>

      {/* Insurance-specific fields */}
      {insuranceType === 'life' && (
        <>
          <div>
            <label htmlFor="coverageAmount" className="block text-sm font-medium text-gray-700">
              Coverage Amount
            </label>
            <input
              type="number"
              id="coverageAmount"
              {...register('coverageAmount', { valueAsNumber: true })}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                (errors as any).coverageAmount ? 'border-red-500' : ''
              }`}
            />
            {(errors as any).coverageAmount && (
              <p className="mt-1 text-sm text-red-600">{(errors as any).coverageAmount.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="termLength" className="block text-sm font-medium text-gray-700">
              Term Length (years)
            </label>
            <input
              type="number"
              id="termLength"
              {...register('termLength', { valueAsNumber: true })}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                (errors as any).termLength ? 'border-red-500' : ''
              }`}
            />
            {(errors as any).termLength && (
              <p className="mt-1 text-sm text-red-600">{(errors as any).termLength.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="tobaccoUse" className="block text-sm font-medium text-gray-700">
              Tobacco Use
            </label>
            <select
              id="tobaccoUse"
              {...register('tobaccoUse')}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                (errors as any).tobaccoUse ? 'border-red-500' : ''
              }`}
            >
              <option value="">Select</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
            {(errors as any).tobaccoUse && (
              <p className="mt-1 text-sm text-red-600">{(errors as any).tobaccoUse.message}</p>
            )}
          </div>
        </>
      )}

      {insuranceType === 'disability' && (
        <>
          <div>
            <label htmlFor="occupation" className="block text-sm font-medium text-gray-700">
              Occupation
            </label>
            <input
              type="text"
              id="occupation"
              {...register('occupation')}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                (errors as any).occupation ? 'border-red-500' : ''
              }`}
            />
            {(errors as any).occupation && (
              <p className="mt-1 text-sm text-red-600">{(errors as any).occupation.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="employmentStatus" className="block text-sm font-medium text-gray-700">
              Employment Status
            </label>
            <select
              id="employmentStatus"
              {...register('employmentStatus')}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                (errors as any).employmentStatus ? 'border-red-500' : ''
              }`}
            >
              <option value="">Select status</option>
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="self-employed">Self Employed</option>
            </select>
            {(errors as any).employmentStatus && (
              <p className="mt-1 text-sm text-red-600">{(errors as any).employmentStatus.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="incomeRange" className="block text-sm font-medium text-gray-700">
              Income Range
            </label>
            <select
              id="incomeRange"
              {...register('incomeRange')}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                (errors as any).incomeRange ? 'border-red-500' : ''
              }`}
            >
              <option value="">Select range</option>
              <option value="0-30000">$0 - $30,000</option>
              <option value="30001-50000">$30,001 - $50,000</option>
              <option value="50001-75000">$50,001 - $75,000</option>
              <option value="75001-100000">$75,001 - $100,000</option>
              <option value="100001+">$100,001+</option>
            </select>
            {(errors as any).incomeRange && (
              <p className="mt-1 text-sm text-red-600">{(errors as any).incomeRange.message}</p>
            )}
          </div>
        </>
      )}

      {insuranceType === 'auto' && (
        <>
          <div>
            <label htmlFor="vehicleYear" className="block text-sm font-medium text-gray-700">
              Vehicle Year
            </label>
            <input
              type="number"
              id="vehicleYear"
              {...register('vehicleYear', { valueAsNumber: true })}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                (errors as any).vehicleYear ? 'border-red-500' : ''
              }`}
            />
            {(errors as any).vehicleYear && (
              <p className="mt-1 text-sm text-red-600">{(errors as any).vehicleYear.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="vehicleMake" className="block text-sm font-medium text-gray-700">
              Vehicle Make
            </label>
            <input
              type="text"
              id="vehicleMake"
              {...register('vehicleMake')}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                (errors as any).vehicleMake ? 'border-red-500' : ''
              }`}
            />
            {(errors as any).vehicleMake && (
              <p className="mt-1 text-sm text-red-600">{(errors as any).vehicleMake.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="vehicleModel" className="block text-sm font-medium text-gray-700">
              Vehicle Model
            </label>
            <input
              type="text"
              id="vehicleModel"
              {...register('vehicleModel')}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                (errors as any).vehicleModel ? 'border-red-500' : ''
              }`}
            />
            {(errors as any).vehicleModel && (
              <p className="mt-1 text-sm text-red-600">{(errors as any).vehicleModel.message}</p>
            )}
          </div>
        </>
      )}

      {insuranceType === 'supplemental' && (
        <>
          <div>
            <label htmlFor="healthStatus" className="block text-sm font-medium text-gray-700">
              Health Status
            </label>
            <select
              id="healthStatus"
              {...register('healthStatus')}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                (errors as any).healthStatus ? 'border-red-500' : ''
              }`}
            >
              <option value="">Select status</option>
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
            </select>
            {(errors as any).healthStatus && (
              <p className="mt-1 text-sm text-red-600">{(errors as any).healthStatus.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="preExistingConditions" className="block text-sm font-medium text-gray-700">
              Pre-existing Conditions
            </label>
            <select
              id="preExistingConditions"
              {...register('preExistingConditions')}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                (errors as any).preExistingConditions ? 'border-red-500' : ''
              }`}
            >
              <option value="">Select</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
            {(errors as any).preExistingConditions && (
              <p className="mt-1 text-sm text-red-600">{(errors as any).preExistingConditions.message}</p>
            )}
          </div>
        </>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {isSubmitting ? 'Submitting...' : 'Get Quote'}
      </button>
    </form>
  );
} 