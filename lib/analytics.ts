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

// Google Analytics and Google Ads Integration
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
      page_path: window.location.pathname,
    });
    // Initialize Google Ads if ID is available
    if (process.env.NEXT_PUBLIC_GOOGLE_ADS_ID) {
      window.gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ADS_ID);
    }
  }
};

// Track page views
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Track events
export const trackEvent = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track form submissions
export const trackFormSubmission = (formType: string, insuranceType: string) => {
  trackEvent({
    action: 'form_submission',
    category: formType,
    label: insuranceType,
  });

  // Track as conversion if Google Ads ID is available
  if (process.env.NEXT_PUBLIC_GOOGLE_ADS_ID) {
    window.gtag('event', 'conversion', {
      send_to: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID,
      value: 1.0,
      currency: 'USD',
    });
  }
};

// Track funnel steps
export const trackFunnelStep = ({
  funnelName,
  stepName,
  variant,
  abTestId,
}: {
  funnelName: string;
  stepName: string;
  variant?: string;
  abTestId?: string;
}) => {
  trackEvent({
    action: 'funnel_step',
    category: funnelName,
    label: stepName,
  });

  // Send additional data for A/B testing
  if (variant && abTestId) {
    trackEvent({
      action: 'ab_test_variant',
      category: abTestId,
      label: variant,
    });
  }
};

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