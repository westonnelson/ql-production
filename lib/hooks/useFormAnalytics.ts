import { useEffect, useState } from 'react';
import { trackFormSubmission, trackFormAbandonment, trackFormSuccess, trackFormError } from '../analytics';

interface UseFormAnalyticsProps {
  insuranceType: string;
  currentStep: number;
  totalSteps: number;
  formId?: string;
}

interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}

export function useFormAnalytics({
  insuranceType,
  currentStep,
  totalSteps,
  formId = 'default',
}: UseFormAnalyticsProps) {
  const [startTime] = useState(Date.now());
  const [utmParams, setUtmParams] = useState<UtmParams>({});

  // Track UTM parameters
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const searchParams = new URLSearchParams(window.location.search);
    setUtmParams({
      utm_source: searchParams.get('utm_source') || undefined,
      utm_medium: searchParams.get('utm_medium') || undefined,
      utm_campaign: searchParams.get('utm_campaign') || undefined,
      utm_content: searchParams.get('utm_content') || undefined,
      utm_term: searchParams.get('utm_term') || undefined,
    });
  }, []);

  // Track form abandonment on unmount
  useEffect(() => {
    return () => {
      const timeSpent = Date.now() - startTime;
      if (currentStep < totalSteps) {
        trackFormAbandonment({
          insuranceType,
          timeSpent,
          step: currentStep,
          formId,
          ...utmParams,
        });
      }
    };
  }, [currentStep, totalSteps, insuranceType, startTime, formId, utmParams]);

  const trackStepCompletion = () => {
    trackFormSubmission({
      insuranceType,
      step: currentStep,
      formId,
      ...utmParams,
    });
  };

  const trackSuccess = () => {
    const totalTimeSpent = Date.now() - startTime;
    trackFormSuccess({
      insuranceType,
      totalTimeSpent,
      formId,
      ...utmParams,
    });
  };

  const trackError = (error: Error) => {
    trackFormError({
      insuranceType,
      step: currentStep,
      formId,
      errorType: error.name,
      errorMessage: error.message,
      ...utmParams,
    });
  };

  return {
    trackStepCompletion,
    trackSuccess,
    trackError,
  };
} 