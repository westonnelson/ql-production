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
  }
}

// Function to check if Google Analytics is properly configured
export function isGoogleAnalyticsConfigured(): boolean {
  return !!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
}

// Function to check if Google Ads is properly configured
export function isGoogleAdsConfigured(): boolean {
  return !!process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
}

export const gtag = (
  command: string,
  action: string,
  params: {
    send_to?: string;
    value?: number;
    [key: string]: any;
  } = {}
) => {
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }

  try {
    window.gtag(command, action, params);
  } catch (error) {
    console.warn('Failed to send Google Analytics event:', error);
  }
}; 