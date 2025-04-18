# Form Analytics

This document outlines the form analytics implementation in the QuoteLinker application.

## Overview

Form analytics track user interactions with quote forms, including submissions, abandonments, and completions. This data is used to optimize the user experience and improve conversion rates.

## Data Collection

The following events are tracked:

1. **Form Submissions**: When a user successfully submits a form
2. **Form Abandonments**: When a user leaves a form without completing it
3. **Form Completions**: When a user completes all steps of a form
4. **Form Errors**: When a user encounters an error during form submission

## Database Schema

Form analytics data is stored in the `form_analytics` table in Supabase:

```sql
CREATE TABLE form_analytics (
  id SERIAL PRIMARY KEY,
  form_id VARCHAR(255) NOT NULL,
  insurance_type VARCHAR(50) NOT NULL,
  event_type VARCHAR(50) NOT NULL,
  time_spent INTEGER,
  step INTEGER,
  total_steps INTEGER,
  form_data JSONB,
  utm_source VARCHAR(255),
  utm_medium VARCHAR(255),
  utm_campaign VARCHAR(255),
  utm_term VARCHAR(255),
  utm_content VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

The following API endpoints are used for form analytics:

1. `/api/track-form-submission` - Track form submissions
2. `/api/track-form-abandonment` - Track form abandonments
3. `/api/track-form-completion` - Track form completions
4. `/api/track-form-error` - Track form errors

## Usage

### Tracking Form Submissions

```typescript
import { trackFormSubmission } from '@/lib/analytics';

// In your form submission handler
const handleSubmit = async (data) => {
  try {
    // Submit form data to your API
    const response = await fetch('/api/submit-quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    // Track the submission
    await trackFormSubmission({
      formId: 'life-insurance-form',
      insuranceType: 'life',
      formData: data,
      utmParams: {
        source: utmSource,
        medium: utmMedium,
        campaign: utmCampaign,
      },
    });

    // Handle success
  } catch (error) {
    // Handle error
  }
};
```

### Tracking Form Abandonments

```typescript
import { useFormAnalytics } from '@/lib/hooks/useFormAnalytics';

// In your form component
const { trackAbandonment } = useFormAnalytics({
  formId: 'life-insurance-form',
  insuranceType: 'life',
  totalSteps: 3,
});

// The hook automatically tracks abandonments when the user leaves the page
```

## Analytics Dashboard

The analytics data is displayed in the admin dashboard at `/admin/dashboard`. The dashboard shows:

1. Total form submissions
2. Conversion rate
3. Average time on site
4. Bounce rate
5. Form submissions over time

## Metrics API

The `/api/metrics` endpoint provides aggregated metrics for the admin dashboard:

```typescript
// Example response
{
  "formSubmissions": 150,
  "conversionRate": 12.5,
  "averageTimeOnSite": 180,
  "bounceRate": 45.2,
  "timestamp": "2024-03-21T12:00:00.000Z"
}
```

## UTM Tracking

Form analytics include UTM parameters to track marketing campaign performance:

- `utm_source`: The source of the traffic (e.g., google, facebook)
- `utm_medium`: The medium of the traffic (e.g., cpc, email)
- `utm_campaign`: The campaign name
- `utm_term`: The search term (for paid search)
- `utm_content`: The content of the ad (for A/B testing)

## Best Practices

1. **Consistent Form IDs**: Use consistent form IDs across your application
2. **Complete UTM Parameters**: Include all relevant UTM parameters in your marketing links
3. **Error Tracking**: Track form errors to identify and fix issues
4. **Regular Analysis**: Regularly analyze the data to identify trends and opportunities for improvement

## Troubleshooting

If you encounter issues with form analytics:

1. Check the browser console for errors
2. Verify that the API endpoints are working correctly
3. Check the Supabase logs for database errors
4. Ensure that the form IDs are consistent 