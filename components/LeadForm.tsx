import { useState } from 'react';
import { useFormAnalytics } from '../lib/hooks/useFormAnalytics';

export default function LeadForm({ insuranceType = 'life' }: { insuranceType?: string }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // ... existing form data ...
  });

  const { trackStepCompletion, trackSuccess, trackError } = useFormAnalytics({
    insuranceType,
    currentStep,
    totalSteps: 3,
    formId: `lead_${insuranceType}`,
  });

  const handleStepComplete = () => {
    trackStepCompletion();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // ... existing submission logic ...

      // Track successful submission
      trackSuccess();

      // ... rest of success handling ...
    } catch (error) {
      if (error instanceof Error) {
        trackError(error);
      }
      // ... existing error handling ...
    }
  };

  // ... rest of component code ...
} 