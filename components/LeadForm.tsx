import { useState, useEffect } from 'react';
import { useFormAnalytics } from '../lib/hooks/useFormAnalytics';

export default function LeadForm({ insuranceType = 'life' }: { insuranceType?: string }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    insuranceType,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setCurrentStep: updateFormStep, trackSubmission } = useFormAnalytics({
    formId: 'lead-form',
    insuranceType,
    totalSteps: 3,
  });

  useEffect(() => {
    updateFormStep(currentStep);
  }, [currentStep, updateFormStep]);

  const handleStepComplete = () => {
    trackSubmission(formData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // ... existing submission logic ...

      // Track successful submission
      await trackSubmission(formData);

      setShowSuccess(true);
    } catch (error) {
      if (error instanceof Error) {
        await trackSubmission({ ...formData, error: error.message });
      }
      // ... existing error handling ...
    }
  };

  // ... rest of component code ...
} 