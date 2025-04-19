'use client';

import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Define the form schema for validation
const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  company: z.string().optional(),
  source: z.string().optional(),
  description: z.string().optional(),
  insuranceType: z.string().optional(),
  estimatedAmount: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success?: boolean;
    message?: string;
    error?: string;
  }>({});

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      source: 'Website',
      description: '',
      insuranceType: '',
      estimatedAmount: '',
      utmSource: '',
      utmMedium: '',
      utmCampaign: '',
    },
  });

  // Get UTM parameters from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source');
    const utmMedium = urlParams.get('utm_medium');
    const utmCampaign = urlParams.get('utm_campaign');

    if (utmSource) setValue('utmSource', utmSource);
    if (utmMedium) setValue('utmMedium', utmMedium);
    if (utmCampaign) setValue('utmCampaign', utmCampaign);
  }, [setValue]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitStatus({});

    try {
      const response = await fetch('/api/salesforce', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus({
          success: true,
          message: 'Thank you for your submission! We will contact you soon.',
        });
        reset(); // Reset form on success
      } else {
        setSubmitStatus({
          success: false,
          error: result.error || 'Failed to submit form. Please try again.',
        });
      }
    } catch (error) {
      setSubmitStatus({
        success: false,
        error: 'An error occurred. Please try again later.',
      });
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
      
      {submitStatus.success && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md">
          {submitStatus.message}
        </div>
      )}
      
      {submitStatus.error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
          {submitStatus.error}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name *
            </label>
            <input
              id="firstName"
              type="text"
              {...register('firstName')}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.firstName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name *
            </label>
            <input
              id="lastName"
              type="text"
              {...register('lastName')}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.lastName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone *
            </label>
            <input
              id="phone"
              type="tel"
              {...register('phone')}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>
        </div>
        
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
            Company
          </label>
          <input
            id="company"
            type="text"
            {...register('company')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div>
          <label htmlFor="insuranceType" className="block text-sm font-medium text-gray-700 mb-1">
            Insurance Type
          </label>
          <select
            id="insuranceType"
            {...register('insuranceType')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select an option</option>
            <option value="Auto">Auto Insurance</option>
            <option value="Home">Home Insurance</option>
            <option value="Life">Life Insurance</option>
            <option value="Health">Health Insurance</option>
            <option value="Business">Business Insurance</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="estimatedAmount" className="block text-sm font-medium text-gray-700 mb-1">
            Estimated Amount
          </label>
          <input
            id="estimatedAmount"
            type="text"
            placeholder="$"
            {...register('estimatedAmount')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            id="description"
            rows={4}
            {...register('description')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          ></textarea>
        </div>
        
        <div>
          <input
            type="hidden"
            {...register('source')}
            value="Website Contact Form"
          />
          <input type="hidden" {...register('utmSource')} />
          <input type="hidden" {...register('utmMedium')} />
          <input type="hidden" {...register('utmCampaign')} />
        </div>
        
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-md text-white font-medium ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-brand hover:bg-brand-dark'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
} 