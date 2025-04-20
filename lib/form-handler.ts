import { createClient } from '@supabase/supabase-js'
import { sendConsumerConfirmationEmail, sendAgentNotificationEmail } from './sendEmail'
import { logFormSubmission } from './analytics'
import { createSalesforceLead, createSalesforceOpportunity } from '.'
import { createAircallContact, createAircallCall, sendAircallSMS, isAircallConfigured } from './aircall'

// Initialize Supabase with placeholder values if not available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface FormSubmission {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  zipCode: string;
  age: string;
  gender: string;
  insuranceType: string;
  estimatedAmount?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  bestTimeToCall?: string;
  preferredContactMethod?: 'phone' | 'sms';
  company?: string;
  source?: string;
  description?: string;
}

export const handleFormSubmission = async (data: FormSubmission) => {
  try {
    // 1. Log form submission to analytics
    await logFormSubmission({
      insuranceType: data.insuranceType,
      source: {
        source: data.utmSource,
        medium: data.utmMedium,
        campaign: data.utmCampaign
      }
    });

    // 2. Store in Supabase
    const { error: supabaseError } = await supabase
      .from('leads')
      .insert([
        {
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone: data.phone,
          zip_code: data.zipCode,
          insurance_type: data.insuranceType,
          estimated_amount: data.estimatedAmount,
          utm_source: data.utmSource,
          utm_medium: data.utmMedium,
          utm_campaign: data.utmCampaign
        }
      ]);

    if (supabaseError) {
      console.warn('Supabase storage failed:', supabaseError);
    }

    // 3. Send confirmation email to consumer
    try {
      await sendConsumerConfirmationEmail({
        to: data.email,
        firstName: data.firstName,
        insuranceType: data.insuranceType
      });
    } catch (emailError) {
      console.warn('Consumer email failed:', emailError);
    }

    // 4. Send notification to agent
    try {
      await sendAgentNotificationEmail({
        to: process.env.NEW_LEAD_EMAIL || 'leads@quotelinker.com',
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        insuranceType: data.insuranceType,
        age: parseInt(data.age),
        gender: data.gender,
        estimatedAmount: data.estimatedAmount
      });
    } catch (emailError) {
      console.warn('Agent notification failed:', emailError);
    }

    // 5. Create Salesforce lead
    const lead = await createSalesforceLead(data);
    
    // 6. Create Salesforce opportunity
    await createSalesforceOpportunity({
      ...data,
      leadId: lead.id,
      stageName: 'New',
      closeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
    });

    // 7. Handle Aircall integration if configured
    if (isAircallConfigured()) {
      const aircallContact = await createAircallContact({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        metadata: {
          insuranceType: data.insuranceType,
          estimatedAmount: data.estimatedAmount,
          utmSource: data.utmSource,
          utmMedium: data.utmMedium,
          utmCampaign: data.utmCampaign,
          leadId: lead.id
        }
      });

      // Handle preferred contact method
      if (data.preferredContactMethod === 'phone' && data.bestTimeToCall) {
        await createAircallCall({
          contactId: aircallContact.id,
          direction: 'outbound',
          scheduledAt: data.bestTimeToCall,
          metadata: {
            insuranceType: data.insuranceType,
            estimatedAmount: data.estimatedAmount
          }
        });
      } else if (data.preferredContactMethod === 'sms') {
        await sendAircallSMS({
          contactId: aircallContact.id,
          message: `Hi ${data.firstName}, thank you for your interest in our insurance services. A representative will contact you shortly to discuss your needs.`
        });
      }
    }

    return { success: true, leadId: lead.id };
  } catch (error) {
    console.error('Error handling form submission:', error);
    throw error;
  }
};

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