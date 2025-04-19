import { Gtag } from '@/types/gtag';

// Google Analytics configuration
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;

// Check if Google Analytics is configured
export const isGoogleAnalyticsConfigured = () => {
  return !!GA_MEASUREMENT_ID;
};

// Check if Google Ads is configured
export const isGoogleAdsConfigured = () => {
  return !!GOOGLE_ADS_ID;
};

// Initialize Google Analytics
export const gtag: Gtag = (command, action, params) => {
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }

  window.gtag(command, action, params);
}; 