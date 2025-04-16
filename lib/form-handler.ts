import { createClient } from '@supabase/supabase-js'
import { sendConsumerConfirmationEmail, sendAgentNotificationEmail } from './sendEmail'
import { trackConversion } from './analytics'
import { createSalesforceOpportunity } from './salesforce'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export type FormSubmission = {
  insuranceType: 'auto' | 'life' | 'homeowners'
  firstName: string
  lastName: string
  email: string
  phone: string
  age: number
  gender: 'male' | 'female'
  zipCode: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmTerm?: string
  utmContent?: string
  // Auto specific fields
  vehicleYear?: number
  vehicleMake?: string
  vehicleModel?: string
  coverageTypes?: string[]
  drivingHistory?: 'clean' | 'minor-violations' | 'major-violations'
  // Life specific fields
  coverageAmount?: number
  termLength?: number
  permanentType?: string
  tobaccoUse?: boolean
  // Homeowners specific fields
  homeYearBuilt?: number
  homeSquareFootage?: number
  homeType?: string
  claimsHistory?: 'none' | 'one' | 'multiple'
}

export async function handleFormSubmission(data: FormSubmission) {
  try {
    // 1. Store in database
    const { data: lead, error: dbError } = await supabase
      .from('leads')
      .insert([
        {
          ...data,
          status: 'new',
          created_at: new Date().toISOString(),
          source: data.utmSource || 'direct',
          medium: data.utmMedium,
          campaign: data.utmCampaign,
          term: data.utmTerm,
          content: data.utmContent,
        },
      ])
      .select()
      .single()

    if (dbError) throw dbError

    // 2. Track conversion in analytics
    await trackConversion({
      insuranceType: data.insuranceType,
      leadId: lead.id,
      utmSource: data.utmSource,
      utmMedium: data.utmMedium,
      utmCampaign: data.utmCampaign,
      utmTerm: data.utmTerm,
      utmContent: data.utmContent,
    })

    // 3. Send confirmation email to the user
    await sendConsumerConfirmationEmail(data.email, {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone,
      age: data.age,
      gender: data.gender,
      product_type: data.insuranceType,
      coverage_amount: data.coverageAmount,
      term_length: data.termLength,
      tobacco_use: data.tobaccoUse,
      utm_source: data.utmSource,
    })

    // 4. Send notification email to the agent
    await sendAgentNotificationEmail({
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone,
      age: data.age,
      gender: data.gender,
      product_type: data.insuranceType,
      coverage_amount: data.coverageAmount,
      term_length: data.termLength,
      tobacco_use: data.tobaccoUse,
      utm_source: data.utmSource,
    })

    // 5. Create Salesforce opportunity
    await createSalesforceOpportunity({
      ...data,
      leadId: lead.id,
    })

    return { success: true, leadId: lead.id }
  } catch (error) {
    console.error('Form submission error:', error)
    throw error
  }
}

// Function to get conversion metrics
export async function getConversionMetrics(timeframe: 'day' | 'week' | 'month' = 'day') {
  const { data, error } = await supabase
    .from('leads')
    .select('insurance_type, status, created_at, source, medium, campaign')
    .gte('created_at', new Date(Date.now() - getTimeframeMs(timeframe)).toISOString())

  if (error) throw error

  return data
}

function getTimeframeMs(timeframe: 'day' | 'week' | 'month'): number {
  switch (timeframe) {
    case 'day':
      return 24 * 60 * 60 * 1000
    case 'week':
      return 7 * 24 * 60 * 60 * 1000
    case 'month':
      return 30 * 24 * 60 * 60 * 1000
  }
} 