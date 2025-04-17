import { gtag, isGoogleAnalyticsConfigured, isGoogleAdsConfigured } from './gtag';

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

interface TrackEventParams {
  action: string
  category: string
  label: string
  value?: number
  variant_id?: string
  variant_name?: string
  error_message?: string
  time_spent?: number
  field_interactions?: string
  errors?: string
}

// Google Analytics and Google Ads Integration
declare global {
  interface Window {
    gtag: (
      command: string,
      action: string,
      params: {
        send_to?: string;
        value?: number;
        [key: string]: any;
      }
    ) => void;
    dataLayer: any[];
  }
}

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window === 'undefined') {
    return;
  }

  // Check if Google Analytics is configured
  if (!isGoogleAnalyticsConfigured()) {
    console.warn('Google Analytics is not configured');
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date().toISOString(), {});
  window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!, {
    page_path: window.location.pathname,
  });

  // Initialize Google Ads if configured
  if (isGoogleAdsConfigured()) {
    window.gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ADS_ID!, {});
  }
};

// Track page views
export const trackPageView = (url: string) => {
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }

  // Check if Google Analytics is configured
  if (!isGoogleAnalyticsConfigured()) {
    console.warn('Google Analytics is not configured - skipping page view tracking');
    return;
  }

  window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!, {
    page_path: url,
  });
};

// Track events
export function trackEvent(params: TrackEventParams) {
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }

  // Check if Google Analytics is configured
  if (!isGoogleAnalyticsConfigured()) {
    console.warn('Google Analytics is not configured - skipping event tracking');
    return;
  }

  window.gtag('event', params.action, {
    event_category: params.category,
    event_label: params.label,
    value: params.value,
    variant_id: params.variant_id,
    variant_name: params.variant_name,
    error_message: params.error_message,
    time_spent: params.time_spent,
    field_interactions: params.field_interactions,
    errors: params.errors,
  });
}

// Track form submissions
export const trackFormSubmission = (formType: string, insuranceType: string) => {
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }

  // Track event in Google Analytics if configured
  if (isGoogleAnalyticsConfigured()) {
    trackEvent({
      action: 'form_submission',
      category: formType,
      label: insuranceType,
    });
  }

  // Track as conversion in Google Ads if configured
  if (isGoogleAdsConfigured()) {
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
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }

  // Check if Google Analytics is configured
  if (!isGoogleAnalyticsConfigured()) {
    console.warn('Google Analytics is not configured - skipping funnel step tracking');
    return;
  }

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
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }

  // Check if Google Analytics is configured
  if (!isGoogleAnalyticsConfigured()) {
    console.warn('Google Analytics is not configured - skipping funnel step logging');
    return;
  }

  try {
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
  } catch (error) {
    console.warn('Failed to log funnel step:', error);
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
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }

  // Check if Google Analytics is configured
  if (!isGoogleAnalyticsConfigured()) {
    console.warn('Google Analytics is not configured - skipping form submission logging');
    return;
  }

  try {
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
  } catch (error) {
    console.warn('Failed to log form submission:', error);
  }
} 