'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import InputField from './InputField';
import SelectField from './SelectField';
import RadioGroup from './RadioGroup';
import ProgressBar from './ProgressBar';
import { toast } from 'react-hot-toast';

interface QuoteFormProps {
  insuranceType?: string;
  title?: string;
  subtitle?: string;
}

const QuoteForm: React.FC<QuoteFormProps> = ({ 
  insuranceType = 'general',
  title = 'Get Your Free Quote',
  subtitle = 'Compare rates from top providers'
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State management
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    insuranceType,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [utmParams, setUtmParams] = useState({
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    utm_content: '',
    utm_term: ''
  });

  // Track UTM parameters
  useEffect(() => {
    setUtmParams({
      utm_source: searchParams.get('utm_source') || '',
      utm_medium: searchParams.get('utm_medium') || '',
      utm_campaign: searchParams.get('utm_campaign') || '',
      utm_content: searchParams.get('utm_content') || '',
      utm_term: searchParams.get('utm_term') || ''
    });
  }, [searchParams]);

  // Form validation
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (step) {
      case 1:
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
        break;
      case 2:
        if (!formData.firstName) {
          newErrors.firstName = 'First name is required';
        }
        if (!formData.lastName) {
          newErrors.lastName = 'Last name is required';
        }
        break;
      case 3:
        if (!formData.age) {
          newErrors.age = 'Age is required';
        } else if (isNaN(Number(formData.age)) || Number(formData.age) < 18 || Number(formData.age) > 100) {
          newErrors.age = 'Please enter a valid age between 18 and 100';
        }
        if (!formData.gender) {
          newErrors.gender = 'Gender is required';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(currentStep)) {
      toast.error('Please fix the errors before proceeding');
      return;
    }

    setIsSubmitting(true);

    try {
      const submission = {
        ...formData,
        ...utmParams,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        platform: 'web'
      };

      const res = await fetch('/api/submit-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission)
      });

      if (!res.ok) {
        throw new Error('Failed to submit quote');
      }

      const data = await res.json();
      
      // Track conversion
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'quote_submission', {
          'event_category': 'quote',
          'event_label': insuranceType,
          'value': 1
        });
      }

      toast.success('Quote submitted successfully!');
      router.push(`/thank-you/${insuranceType}`);
    } catch (error) {
      console.error('Quote submission error:', error);
      toast.error('Failed to submit quote. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle step navigation
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    } else {
      toast.error('Please fix the errors before proceeding');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-100">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600">{subtitle}</p>
      </div>

      <ProgressBar currentStep={currentStep} totalSteps={3} />

      <form onSubmit={handleSubmit} className="space-y-6 mt-8">
        {currentStep === 1 && (
          <div className="space-y-4">
            <InputField
              label="Email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
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
            />
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <InputField
              label="First Name"
              type="text"
              name="firstName"
              placeholder="Enter your first name"
              value={formData.firstName}
              onChange={handleChange}
              error={errors.firstName}
              required
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
            />
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <InputField
              label="Age"
              type="number"
              name="age"
              placeholder="Enter your age"
              value={formData.age}
              onChange={handleChange}
              error={errors.age}
              required
              min="18"
              max="100"
            />
            <RadioGroup
              label="Gender"
              name="gender"
              options={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'other', label: 'Other' }
              ]}
              value={formData.gender}
              onChange={(value) => handleChange({ target: { name: 'gender', value } } as any)}
              error={errors.gender}
              required
            />
          </div>
        )}

        <div className="flex justify-between mt-8">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00E0FF]"
            >
              Previous
            </button>
          )}
          
          {currentStep < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-4 py-2 text-sm font-medium text-white bg-[#00E0FF] rounded-md hover:bg-[#00E0FF]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00E0FF]"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-[#00E0FF] rounded-md hover:bg-[#00E0FF]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00E0FF] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Get Your Free Quote'}
            </button>
          )}
        </div>
      </form>

      <div className="mt-6 text-center text-sm text-gray-500">
        <p>By submitting this form, you agree to our Terms of Service and Privacy Policy</p>
      </div>
    </div>
  );
};

export default QuoteForm; 