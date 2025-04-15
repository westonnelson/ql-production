import { gtag } from './gtag';

interface FunnelStepData {
  step: number;
  insuranceType: string;
  funnelName?: string;
  funnelVariant?: string;
  abTestId?: string;
  abTestVariant?: string;
}

interface FormSubmissionData {
  insuranceType: string;
  formData: Record<string, any>;
  utmParams: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
    utm_term?: string;
  };
  funnelName?: string;
  funnelStep?: string;
  funnelVariant?: string;
  abTestId?: string;
  abTestVariant?: string;
}

export async function logFunnelStep({
  step,
  insuranceType,
  funnelName = 'default',
  funnelVariant = 'control',
  abTestId,
  abTestVariant,
}: FunnelStepData): Promise<void> {
  // Log to Google Analytics
  gtag('event', 'funnel_step', {
    event_category: 'Quote Funnel',
    event_label: `${insuranceType} Insurance - Step ${step}`,
    value: step,
    funnel_name: funnelName,
    funnel_variant: funnelVariant,
    ab_test_id: abTestId,
    ab_test_variant: abTestVariant,
  });

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Funnel Step:', {
      step,
      insuranceType,
      funnelName,
      funnelVariant,
      abTestId,
      abTestVariant,
    });
  }
}

export async function logFormSubmission({
  insuranceType,
  formData,
  utmParams,
  funnelName = 'default',
  funnelStep = 'complete',
  funnelVariant = 'control',
  abTestId,
  abTestVariant,
}: FormSubmissionData): Promise<void> {
  // Log to Google Analytics
  gtag('event', 'form_submission', {
    event_category: 'Quote Form',
    event_label: `${insuranceType} Insurance Quote`,
    value: 1,
    ...formData,
    ...utmParams,
    funnel_name: funnelName,
    funnel_step: funnelStep,
    funnel_variant: funnelVariant,
    ab_test_id: abTestId,
    ab_test_variant: abTestVariant,
  });

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Form Submission:', {
      insuranceType,
      formData,
      utmParams,
      funnelName,
      funnelStep,
      funnelVariant,
      abTestId,
      abTestVariant,
    });
  }
} 