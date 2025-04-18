import { useEffect, useRef } from 'react';
import { useUtmParams } from '../utm';

interface FormAnalyticsProps {
  formId: string;
  insuranceType: string;
  totalSteps: number;
}

export function useFormAnalytics({ formId, insuranceType, totalSteps }: FormAnalyticsProps) {
  const startTime = useRef(Date.now());
  const currentStep = useRef(1);
  const utmParams = useUtmParams();

  const trackSubmission = async (formData: any) => {
    try {
      const timeSpent = Math.round((Date.now() - startTime.current) / 1000);
      await fetch('/api/track-form-submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formId,
          insuranceType,
          timeSpent,
          step: currentStep.current,
          totalSteps,
          formData,
          ...utmParams,
        }),
      });
    } catch (error) {
      console.error('Error tracking form submission:', error);
    }
  };

  const trackAbandonment = async () => {
    try {
      const timeSpent = Math.round((Date.now() - startTime.current) / 1000);
      await fetch('/api/track-form-abandonment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formId,
          insuranceType,
          timeSpent,
          step: currentStep.current,
          totalSteps,
          ...utmParams,
        }),
      });
    } catch (error) {
      console.error('Error tracking form abandonment:', error);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      trackAbandonment();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      trackAbandonment();
    };
  }, []);

  return {
    setCurrentStep: (step: number) => {
      currentStep.current = step;
    },
    trackSubmission,
  };
} 