interface TrackingParams {
  insuranceType: string;
  step: string;
  timeSpent: number;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}

export const trackFormSubmission = async (params: TrackingParams) => {
  try {
    const response = await fetch('/api/track-form-submission', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error('Failed to track form submission');
    }

    return await response.json();
  } catch (error) {
    console.error('Error tracking form submission:', error);
  }
};

export const trackFormAbandonment = async (params: TrackingParams) => {
  try {
    const response = await fetch('/api/track-form-abandonment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error('Failed to track form abandonment');
    }

    return await response.json();
  } catch (error) {
    console.error('Error tracking form abandonment:', error);
  }
}; 