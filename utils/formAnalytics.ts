interface FormAnalyticsData {
  insuranceType: string;
  timeSpent?: number;
  totalTimeSpent?: number;
  step?: number;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}

export const trackFormAbandonment = async (data: FormAnalyticsData) => {
  try {
    const response = await fetch('/api/track-form-abandonment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to track form abandonment');
    }

    return await response.json();
  } catch (error) {
    console.error('Error tracking form abandonment:', error);
  }
};

export const trackFormCompletion = async (data: FormAnalyticsData) => {
  try {
    const response = await fetch('/api/track-form-completion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to track form completion');
    }

    return await response.json();
  } catch (error) {
    console.error('Error tracking form completion:', error);
  }
};

export const getUtmParams = () => {
  if (typeof window === 'undefined') return {};

  const urlParams = new URLSearchParams(window.location.search);
  return {
    utm_source: urlParams.get('utm_source') || undefined,
    utm_medium: urlParams.get('utm_medium') || undefined,
    utm_campaign: urlParams.get('utm_campaign') || undefined,
    utm_content: urlParams.get('utm_content') || undefined,
    utm_term: urlParams.get('utm_term') || undefined,
  };
}; 