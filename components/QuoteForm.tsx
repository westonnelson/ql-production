import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import InputField from './InputField';
import ProgressBar from './ProgressBar';

interface QuoteFormProps {
  insuranceType?: string;
}

const QuoteForm: React.FC<QuoteFormProps> = ({ insuranceType = 'general' }) => {
  const router = useRouter();
  const [utmParams, setUtmParams] = useState({ utm_source: '', utm_medium: '', utm_campaign: '' });
  const [formData, setFormData] = useState({ email: '', vehicleYear: '', insuranceType });
  const [currentStep, setCurrentStep] = useState(1);
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
    // Combine formData and UTM parameters for the submission
    const submission = { ...formData, ...utmParams };
    const res = await fetch('/api/submit-quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submission),
    });
    if (res.ok) {
      console.log('Quote submitted successfully');
    }
  };

  return (
    <div className="quote-form-container">
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      <form onSubmit={handleSubmit}>
        <InputField
          label="Email"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          valid={formData.email.length > 0}
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
          />
        )}
        {/* Insert additional fields for other insurance types as needed */}
        <button type="submit" className="cta-button">Get Your Free Quote</button>
      </form>
      <style jsx>{`
        .quote-form-container {
          max-width: 800px;
          margin: 2rem auto;
          padding: 1rem;
        }

        .cta-button {
          background-color: #0055a4;
          color: #fff;
          padding: 1em 2em;
          border: none;
          border-radius: 5px;
          font-size: 1.1em;
          cursor: pointer;
          transition: background-color 0.3s ease;
          width: 100%;
          margin-top: 1rem;
        }

        .cta-button:hover {
          background-color: #004080;
        }
      `}</style>
    </div>
  );
};

export default QuoteForm; 