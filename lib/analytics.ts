/// <reference path="../types/gtag.d.ts" />

import { gtag, isGoogleAnalyticsConfigured, isGoogleAdsConfigured } from './gtag';

interface FunnelStepData {
  step: number;
  insuranceType: string;
  funnelName?: string;
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

interface TrackingData {
  insuranceType: string;
  step?: number;
  timeSpent?: number;
  totalTime?: number;
  errorType?: string;
  errorMessage?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
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
        currency?: string;
        transaction_id?: string;
        event_category?: string;
        event_label?: string;
        source?: string;
        medium?: string;
        campaign?: string;
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
export const trackFormSubmission = async (data: TrackingData) => {
  try {
    await fetch('/api/track-form-submission', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error('Error tracking form submission:', error);
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

export interface FormSubmissionData {
  insuranceType: string;
  source?: {
    source?: string;
    medium?: string;
    campaign?: string;
  };
}

export const logFormSubmission = async (data: FormSubmissionData) => {
  try {
    // Log to Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'form_submission', {
        event_category: 'lead',
        event_label: data.insuranceType,
        source: data.source?.source,
        medium: data.source?.medium,
        campaign: data.source?.campaign
      });
    }

    // Log to Google Ads Conversion Tracking
    if (typeof window !== 'undefined' && window.gtag && process.env.NEXT_PUBLIC_ADS_CONVERSION_ID) {
      window.gtag('event', 'conversion', {
        send_to: `${process.env.NEXT_PUBLIC_ADS_CONVERSION_ID}/form_submission`,
        value: 1.0,
        currency: 'USD',
        transaction_id: ''
      });
    }

    return true;
  } catch (error) {
    console.error('Error logging form submission:', error);
    return false;
  }
};

// Track form abandonment
export const trackFormAbandonment = async (data: TrackingData) => {
  try {
    await fetch('/api/track-form-abandonment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error('Error tracking form abandonment:', error);
  }
};

// Track successful form completion
export const trackFormSuccess = async (data: TrackingData) => {
  try {
    await fetch('/api/track-form-success', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error('Error tracking form success:', error);
  }
};

// Track form errors
export const trackFormError = async (data: TrackingData) => {
  try {
    await fetch('/api/track-form-error', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error('Error tracking form error:', error);
  }
};

// Initialize Google Tag Manager
export function initializeGTM(gtmId: string) {
  if (typeof window === 'undefined') {
    return;
  }

  // Add GTM script
  const script = document.createElement('script');
  script.innerHTML = `
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${gtmId}');
  `;
  document.head.appendChild(script);

  // Initialize dataLayer
  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).dataLayer.push({
    'gtm.start': new Date().getTime(),
    event: 'gtm.js'
  });

  // Add GTM noscript iframe
  const noscript = document.createElement('noscript');
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.googletagmanager.com/ns.html?id=${gtmId}`;
  iframe.height = '0';
  iframe.width = '0';
  iframe.style.display = 'none';
  iframe.style.visibility = 'hidden';
  noscript.appendChild(iframe);
  document.body.insertBefore(noscript, document.body.firstChild);
} 