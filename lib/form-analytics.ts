import { trackEvent } from './analytics'

export type FormVariant = {
  id: string
  name: string
  fields: string[]
  layout: string
  styling: string
}

export type FormMetrics = {
  startTime: number
  completionTime?: number
  fieldInteractions: Record<string, number>
  errors: Record<string, number>
  abandonmentStep?: number
}

let currentMetrics: FormMetrics | null = null

export function startFormTracking(insuranceType: string, variant: FormVariant) {
  currentMetrics = {
    startTime: Date.now(),
    fieldInteractions: {},
    errors: {},
  }

  trackEvent('form_start', {
    insurance_type: insuranceType,
    variant_id: variant.id,
    variant_name: variant.name,
  })
}

export function trackFieldInteraction(fieldName: string) {
  if (!currentMetrics) return

  currentMetrics.fieldInteractions[fieldName] = (currentMetrics.fieldInteractions[fieldName] || 0) + 1

  trackEvent('field_interaction', {
    field_name: fieldName,
    interaction_count: currentMetrics.fieldInteractions[fieldName],
  })
}

export function trackFieldError(fieldName: string, errorMessage: string) {
  if (!currentMetrics) return

  currentMetrics.errors[fieldName] = (currentMetrics.errors[fieldName] || 0) + 1

  trackEvent('field_error', {
    field_name: fieldName,
    error_message: errorMessage,
    error_count: currentMetrics.errors[fieldName],
  })
}

export function trackFormAbandonment(step: number) {
  if (!currentMetrics) return

  currentMetrics.abandonmentStep = step
  currentMetrics.completionTime = Date.now()

  trackEvent('form_abandonment', {
    step,
    time_spent: currentMetrics.completionTime - currentMetrics.startTime,
    field_interactions: currentMetrics.fieldInteractions,
    errors: currentMetrics.errors,
  })

  currentMetrics = null
}

export function trackFormCompletion(success: boolean) {
  if (!currentMetrics) return

  currentMetrics.completionTime = Date.now()

  trackEvent('form_completion', {
    success,
    time_spent: currentMetrics.completionTime - currentMetrics.startTime,
    field_interactions: currentMetrics.fieldInteractions,
    errors: currentMetrics.errors,
  })

  currentMetrics = null
}

// Function to get form performance metrics
export async function getFormPerformanceMetrics(
  insuranceType: string,
  timeframe: 'day' | 'week' | 'month' = 'day'
) {
  // This would typically query your analytics database
  // For now, we'll return a mock implementation
  return {
    completionRate: 0.75,
    averageTimeToComplete: 180, // seconds
    abandonmentRate: 0.25,
    topAbandonmentStep: 2,
    fieldErrorRates: {
      zipCode: 0.1,
      phone: 0.05,
      email: 0.03,
    },
    variantPerformance: {
      'variant-a': {
        completionRate: 0.8,
        averageTimeToComplete: 165,
      },
      'variant-b': {
        completionRate: 0.7,
        averageTimeToComplete: 195,
      },
    },
  }
} 