'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import InputField from './InputField';
import SelectField from './SelectField';
import RadioGroup from './RadioGroup';
import ProgressBar from './ProgressBar';
import { toast } from 'react-hot-toast';
import { useFormAnalytics } from '../lib/hooks/useFormAnalytics';
import { supabase } from '../lib/supabase';

interface QuoteFormProps {
  insuranceType?: string;
  title?: string;
  subtitle?: string;
  utmSource?: string | null;
}

const INSURANCE_TYPES = {
  TERM_LIFE: 'term_life',
  PERMANENT_LIFE: 'permanent_life',
  SUPPLEMENTAL_HEALTH: 'supplemental_health',
  SHORT_TERM_DISABILITY: 'short_term_disability'
};

const INCOME_RANGES = [
  'Under $30,000',
  '$30,000 - $50,000',
  '$50,000 - $75,000',
  '$75,000 - $100,000',
  'Over $100,000'
];

const BEST_TIME_TO_CALL = [
  'Morning (9AM-12PM)',
  'Afternoon (12PM-5PM)',
  'Evening (5PM-8PM)'
];

const QuoteForm: React.FC<QuoteFormProps> = ({ 
  insuranceType = INSURANCE_TYPES.TERM_LIFE,
  title = 'Get Your Free Insurance Quote',
  subtitle = 'Compare competitive rates - No obligation required',
  utmSource = null
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State management
  const [startTime] = useState(Date.now());
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    zipCode: '',
    age: '',
    gender: '',
    insuranceType,
    householdSize: '',
    incomeRange: '',
    bestTimeToCall: '',
    coverageAmount: '',
    termLength: '',
    healthStatus: '',
    employmentStatus: '',
    preExistingConditions: false,
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    utm_content: '',
    utm_term: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setCurrentStep, trackSubmission } = useFormAnalytics({
    formId: 'quote-form',
    insuranceType,
    totalSteps: 4,
  });

  // Track UTM parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setFormData(prev => ({
      ...prev,
      utm_source: searchParams.get('utm_source') || '',
      utm_medium: searchParams.get('utm_medium') || '',
      utm_campaign: searchParams.get('utm_campaign') || '',
      utm_content: searchParams.get('utm_content') || '',
      utm_term: searchParams.get('utm_term') || ''
    }));
  }, []);

  useEffect(() => {
    setCurrentStep(currentStep);
  }, [currentStep, setCurrentStep]);

  // Track form abandonment on unmount
  useEffect(() => {
    return () => {
      const timeSpent = Date.now() - startTime;
      if (currentStep < 3) { // Only track if form wasn't completed
        trackSubmission({
          insuranceType,
          step: currentStep,
          timeSpent,
          utm_source: formData.utm_source,
          utm_medium: formData.utm_medium,
          utm_campaign: formData.utm_campaign
        });
      }
    };
  }, [currentStep, insuranceType, startTime, formData]);

  // Form validation
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (step) {
      case 1:
        if (!formData.firstName) newErrors.firstName = 'First name is required';
        if (!formData.lastName) newErrors.lastName = 'Last name is required';
        if (!formData.zipCode) {
          newErrors.zipCode = 'Zip code is required';
        } else if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
          newErrors.zipCode = 'Please enter a valid zip code';
        }
        if (!formData.age) {
          newErrors.age = 'Age is required';
        } else if (isNaN(Number(formData.age)) || Number(formData.age) < 18 || Number(formData.age) > 100) {
          newErrors.age = 'Please enter a valid age between 18 and 100';
        }
        break;
      case 2:
        if (!formData.householdSize) newErrors.householdSize = 'Household size is required';
        if (!formData.incomeRange) newErrors.incomeRange = 'Income range is required';
        if (!formData.insuranceType) newErrors.insuranceType = 'Insurance type is required';
        break;
      case 3:
        if (!formData.email) {
          newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Please enter a valid email';
        }
        if (!formData.phone) {
          newErrors.phone = 'Phone number is required';
        } else if (!/^\+?[\d\s-()]{10,}$/.test(formData.phone)) {
          newErrors.phone = 'Please enter a valid phone number';
        }
        if (!formData.bestTimeToCall) newErrors.bestTimeToCall = 'Best time to call is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleStepComplete = () => {
    setCurrentStep(prev => prev + 1);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate form data
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        throw new Error('Please fill in all required fields');
      }

      // Submit to Salesforce
      const sfResponse = await fetch('/api/salesforce-opportunity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          insuranceType: insuranceType,
          utm_source: utmSource,
          utm_campaign: formData.utm_campaign,
          utm_medium: formData.utm_medium,
        }),
      });

      if (!sfResponse.ok) {
        const sfError = await sfResponse.json();
        throw new Error(sfError.error || 'Failed to submit to Salesforce');
      }

      // Submit to Supabase
      const { error: supabaseError } = await supabase
        .from('quotes')
        .insert([
          {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            insurance_type: insuranceType,
            utm_source: utmSource,
            utm_campaign: formData.utm_campaign,
            utm_medium: formData.utm_medium,
            status: 'new',
            source: 'QuoteLinker Quote Form'
          }
        ]);

      if (supabaseError) {
        throw new Error('Failed to save quote data');
      }

      // Send confirmation email
      await fetch('/api/send-quote-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          insuranceType,
        }),
      });

      setShowSuccess(true);
      await trackSubmission(formData);
    } catch (err) {
      console.error('Form submission error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle step navigation
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      handleStepComplete();
    } else {
      toast.error('Please fix the errors before proceeding');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 sm:p-8">
      <div className="text-center mb-8">
        {/* Brand and Title */}
        <div className="flex justify-center mb-4">
          <Image
            src="/favicon-32x32.png"
            alt="Brand Logo"
            width={32}
            height={32}
            className="mb-4"
          />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2">{title}</h2>
        <p className="text-gray-600 text-sm sm:text-base mb-6">{subtitle}</p>

        {/* Trust Signals */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
          <div className="flex flex-col items-center p-3 bg-white rounded-lg border border-gray-100">
            <svg className="w-6 h-6 text-primary mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
            </svg>
            <span className="text-sm font-medium text-gray-700">Licensed Agent</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-white rounded-lg border border-gray-100">
            <svg className="w-6 h-6 text-primary mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
            </svg>
            <span className="text-sm font-medium text-gray-700">Secure Submission</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-white rounded-lg border border-gray-100">
            <svg className="w-6 h-6 text-primary mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            <span className="text-sm font-medium text-gray-700">No Obligation</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <ProgressBar currentStep={currentStep} totalSteps={3} />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="First Name"
                type="text"
                name="firstName"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={handleChange}
                error={errors.firstName}
                required
                className="w-full"
              />
              <InputField
                label="Last Name"
                type="text"
                name="lastName"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={handleChange}
                error={errors.lastName}
                required
                className="w-full"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Zip Code"
                type="text"
                name="zipCode"
                placeholder="Enter your zip code"
                value={formData.zipCode}
                onChange={handleChange}
                error={errors.zipCode}
                required
                className="w-full"
              />
              <InputField
                label="Age"
                type="number"
                name="age"
                placeholder="Enter your age"
                value={formData.age}
                onChange={handleChange}
                error={errors.age}
                required
                className="w-full"
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <InputField
              label="Household Size"
              type="number"
              name="householdSize"
              placeholder="Number of people in your household"
              value={formData.householdSize}
              onChange={handleChange}
              error={errors.householdSize}
              required
              className="w-full"
            />
            <SelectField
              label="Income Range"
              name="incomeRange"
              value={formData.incomeRange}
              onChange={handleChange}
              error={errors.incomeRange}
              options={INCOME_RANGES}
              required
              className="w-full"
            />
            <SelectField
              label="Insurance Type"
              name="insuranceType"
              value={formData.insuranceType}
              onChange={handleChange}
              error={errors.insuranceType}
              options={[
                { value: INSURANCE_TYPES.TERM_LIFE, label: 'Term Life Insurance' },
                { value: INSURANCE_TYPES.PERMANENT_LIFE, label: 'Permanent Life Insurance' },
                { value: INSURANCE_TYPES.SUPPLEMENTAL_HEALTH, label: 'Supplemental Health Insurance' },
                { value: INSURANCE_TYPES.SHORT_TERM_DISABILITY, label: 'Short-Term Disability Insurance' }
              ]}
              required
              className="w-full"
            />
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
                className="w-full"
              />
              <InputField
                label="Phone"
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                required
                className="w-full"
              />
            </div>
            <SelectField
              label="Best Time to Call"
              name="bestTimeToCall"
              value={formData.bestTimeToCall}
              onChange={handleChange}
              error={errors.bestTimeToCall}
              options={BEST_TIME_TO_CALL}
              required
              className="w-full"
            />
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-4 border-t border-gray-100">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-3 text-primary border-2 border-primary rounded-lg hover:bg-primary hover:text-white transition-colors duration-200 font-medium text-sm sm:text-base"
            >
              Previous
            </button>
          )}
          {currentStep < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className={`px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200 font-medium text-sm sm:text-base ${currentStep === 1 ? 'ml-auto' : ''}`}
            >
              Continue
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors duration-200 font-medium text-sm sm:text-base ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Get Your Quote'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default QuoteForm; 