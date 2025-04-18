import { useState, useEffect } from 'react';
import { useFormAnalytics } from '../lib/hooks/useFormAnalytics';

export default function LeadForm({ insuranceType = 'life' }: { insuranceType?: string }) {
  const [currentStep, setCurrentStep] = useState(1);
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
    trackSubmission();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // ... existing submission logic ...

      // Track successful submission
      trackSubmission();

      // ... rest of success handling ...
    } catch (error) {
      if (error instanceof Error) {
        trackSubmission(error);
      }
      // ... existing error handling ...
    }
  };

  // ... rest of component code ...
} 