import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

interface FormAnalyticsProps {
  insuranceType: string;
  formId: string;
}

export const useFormAnalytics = ({ insuranceType, formId }: FormAnalyticsProps) => {
  const router = useRouter();
  const startTime = useRef(Date.now());
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getUtmParams = () => {
    return {
      utm_source: router.query.utm_source as string,
      utm_medium: router.query.utm_medium as string,
      utm_campaign: router.query.utm_campaign as string,
      utm_content: router.query.utm_content as string,
      utm_term: router.query.utm_term as string,
    };
  };

  const trackFormAbandonment = async () => {
    if (isSubmitting) return;

    const timeSpent = Math.round((Date.now() - startTime.current) / 1000);
    
    try {
      await fetch('/api/track-form-abandonment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          insuranceType,
          timeSpent,
          step: currentStep,
          formId,
          ...getUtmParams(),
        }),
      });
    } catch (error) {
      console.error('Error tracking form abandonment:', error);
    }
  };

  const trackFormCompletion = async () => {
    const totalTimeSpent = Math.round((Date.now() - startTime.current) / 1000);
    
    try {
      await fetch('/api/track-form-completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          insuranceType,
          totalTimeSpent,
          formId,
          ...getUtmParams(),
        }),
      });
    } catch (error) {
      console.error('Error tracking form completion:', error);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      trackFormAbandonment();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (!isSubmitting) {
        trackFormAbandonment();
      }
    };
  }, [currentStep, isSubmitting]);

  return {
    setCurrentStep,
    setIsSubmitting,
    trackFormCompletion,
  };
}; 