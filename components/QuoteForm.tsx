'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { z } from 'zod';
import { useFormAnalytics } from '@/lib/hooks/useFormAnalytics';

// Define the base form schema
const baseFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must have at least 10 digits'),
  zipCode: z.string().min(5, 'ZIP code is required'),
  age: z.string().min(1, 'Age is required'),
  insuranceType: z.enum(['auto', 'life', 'homeowners', 'disability', 'health', 'supplemental']),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  bestTimeToCall: z.string().optional(),
  preferredContactMethod: z.enum(['phone', 'sms']).optional()
});

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
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    zipCode: '',
    age: '',
    insuranceType,
    utmSource: utmSource || '',
    bestTimeToCall: '',
    preferredContactMethod: 'phone'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { trackSubmission } = useFormAnalytics({
    formId: 'quote-form',
    insuranceType,
    totalSteps: 1,
  });

  const validateForm = (): boolean => {
    try {
      baseFormSchema.parse(formData);
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        err.errors.forEach((error) => {
          if (error.path) {
            newErrors[error.path[0]] = error.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/submit-quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to submit form');
      }

      await trackSubmission(formData);
      router.push(`/thank-you/${insuranceType}`);
    } catch (err) {
      console.error('Form submission error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      toast.error('Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">{title}</h2>
          <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
        </div>

        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">{error}</div>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`block w-full rounded-md shadow-sm ${
                      errors.firstName ? 'border-red-300' : 'border-gray-300'
                    } focus:border-[#00E0FF] focus:ring-[#00E0FF] sm:text-sm`}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`block w-full rounded-md shadow-sm ${
                      errors.lastName ? 'border-red-300' : 'border-gray-300'
                    } focus:border-[#00E0FF] focus:ring-[#00E0FF] sm:text-sm`}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full rounded-md shadow-sm ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  } focus:border-[#00E0FF] focus:ring-[#00E0FF] sm:text-sm`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <div className="mt-1">
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className={`block w-full rounded-md shadow-sm ${
                    errors.phone ? 'border-red-300' : 'border-gray-300'
                  } focus:border-[#00E0FF] focus:ring-[#00E0FF] sm:text-sm`}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                  ZIP Code
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="zipCode"
                    id="zipCode"
                    required
                    value={formData.zipCode}
                    onChange={handleChange}
                    className={`block w-full rounded-md shadow-sm ${
                      errors.zipCode ? 'border-red-300' : 'border-gray-300'
                    } focus:border-[#00E0FF] focus:ring-[#00E0FF] sm:text-sm`}
                  />
                  {errors.zipCode && (
                    <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                  Age
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="age"
                    id="age"
                    required
                    min="18"
                    max="100"
                    value={formData.age}
                    onChange={handleChange}
                    className={`block w-full rounded-md shadow-sm ${
                      errors.age ? 'border-red-300' : 'border-gray-300'
                    } focus:border-[#00E0FF] focus:ring-[#00E0FF] sm:text-sm`}
                  />
                  {errors.age && (
                    <p className="mt-1 text-sm text-red-600">{errors.age}</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="bestTimeToCall" className="block text-sm font-medium text-gray-700">
                Best Time to Call
              </label>
              <div className="mt-1">
                <select
                  name="bestTimeToCall"
                  id="bestTimeToCall"
                  value={formData.bestTimeToCall}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#00E0FF] focus:ring-[#00E0FF] sm:text-sm"
                >
                  <option value="">Select a time</option>
                  <option value="morning">Morning (9AM-12PM)</option>
                  <option value="afternoon">Afternoon (12PM-5PM)</option>
                  <option value="evening">Evening (5PM-8PM)</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="preferredContactMethod" className="block text-sm font-medium text-gray-700">
                Preferred Contact Method
              </label>
              <div className="mt-1">
                <select
                  name="preferredContactMethod"
                  id="preferredContactMethod"
                  value={formData.preferredContactMethod}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#00E0FF] focus:ring-[#00E0FF] sm:text-sm"
                >
                  <option value="phone">Phone</option>
                  <option value="sms">SMS</option>
                </select>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#00E0FF] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00E0FF] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Get Your Quote'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 