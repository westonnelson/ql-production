import { createClient } from '@supabase/supabase-js'
import { sendConsumerConfirmationEmail, sendAgentNotificationEmail } from './sendEmail'
import { logFormSubmission } from './analytics'
import { createSalesforceOpportunity } from './salesforce'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export type FormSubmission = {
  insuranceType: 'auto' | 'life' | 'homeowners' | 'disability' | 'supplemental'
  firstName: string
  lastName: string
  email: string
  phone: string
  age: number
  gender: 'male' | 'female' | 'other'
  zipCode?: string
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
  // Disability specific fields
  occupation?: string
  employmentStatus?: string
  incomeRange?: string
  preExistingConditions?: boolean
  desiredCoverageType?: string
  // Supplemental specific fields
  healthStatus?: string
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
    await logFormSubmission({
      insuranceType: data.insuranceType,
      formData: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        age: data.age,
        gender: data.gender,
        zipCode: data.zipCode,
        coverageAmount: data.coverageAmount,
        termLength: data.termLength,
        tobaccoUse: data.tobaccoUse,
      },
      utmParams: {
        utm_source: data.utmSource,
        utm_medium: data.utmMedium,
        utm_campaign: data.utmCampaign,
        utm_term: data.utmTerm,
        utm_content: data.utmContent,
      },
      funnelName: 'default',
      funnelStep: 'complete',
      funnelVariant: 'control',
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