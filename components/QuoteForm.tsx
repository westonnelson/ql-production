import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import InputField from './InputField';
import ProgressBar from './ProgressBar';
import { toast } from 'react-hot-toast';

interface QuoteFormProps {
  insuranceType?: string;
}

const QuoteForm: React.FC<QuoteFormProps> = ({ insuranceType = 'general' }) => {
  const router = useRouter();
  const [utmParams, setUtmParams] = useState({ utm_source: '', utm_medium: '', utm_campaign: '' });
  const [formData, setFormData] = useState({ email: '', vehicleYear: '', insuranceType });
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = 3;  // Three-step process for new user signup

  useEffect(() => {
    // Capture UTM parameters for PPC tracking and dynamic landing page variation
    const query = router.query;
    setUtmParams({
      utm_source: (query.utm_source as string) || '',
      utm_medium: (query.utm_medium as string) || '',
      utm_campaign: (query.utm_campaign as string) || ''
    });
  }, [router.query]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Example: advance to step 2 when email is filled
  useEffect(() => {
    if (formData.email) {
      setCurrentStep(2);
    }
  }, [formData.email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submission = { ...formData, ...utmParams };
      const res = await fetch('/api/submit-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission),
      });

      if (res.ok) {
        toast.success('Quote submitted successfully!');
        router.push('/thank-you');
      } else {
        throw new Error('Failed to submit quote');
      }
    } catch (error) {
      toast.error('Failed to submit quote. Please try again.');
      console.error('Quote submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          label="Email"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          valid={formData.email.length > 0}
          required
        />
        {insuranceType === 'auto' && (
          <InputField
            label="Vehicle Year"
            type="number"
            name="vehicleYear"
            placeholder="Enter your vehicle year"
            value={formData.vehicleYear}
            onChange={handleChange}
            valid={!!formData.vehicleYear}
            required
          />
        )}
        {/* Insert additional fields for other insurance types as needed */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-4 bg-[#00E0FF] text-white font-medium rounded-md shadow-sm hover:bg-[#00E0FF]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00E0FF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Get Your Free Quote'}
        </button>
      </form>
    </div>
  );
};

export default QuoteForm; 