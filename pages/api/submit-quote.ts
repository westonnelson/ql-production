import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '../../lib/email';
import { createSalesforceOpportunity } from '../../lib/salesforce';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const formData = req.body;
    const timestamp = new Date().toISOString();

    // 1. Store in Supabase
    const { data: submission, error: dbError } = await supabase
      .from('quote_submissions')
      .insert([
        {
          ...formData,
          timestamp,
          utm_source: formData.utm_source || null,
          utm_medium: formData.utm_medium || null,
          utm_campaign: formData.utm_campaign || null,
          utm_content: formData.utm_content || null,
          utm_term: formData.utm_term || null
        }
      ])
      .select()
      .single();

    if (dbError) throw dbError;

    // 2. Create Salesforce Opportunity
    try {
      await createSalesforceOpportunity(formData);
    } catch (sfError) {
      console.error('Salesforce integration error:', sfError);
      // Continue with the flow even if Salesforce fails
    }

    // 3. Send email notifications
    await Promise.all([
      // Consumer confirmation
      sendEmail({
        to: formData.email,
        subject: 'Your Insurance Quote Request',
        text: `Thank you for your interest in our insurance products. An agent will contact you shortly to discuss your quote request.`
      }),
      // Agent notification
      sendEmail({
        to: process.env.AGENT_EMAIL!,
        subject: 'New Insurance Quote Request',
        text: `New quote request received:\n\nName: ${formData.firstName} ${formData.lastName}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nInsurance Type: ${formData.insuranceType}\nBest Time to Call: ${formData.bestTimeToCall}`
      })
    ]);

    // 4. Return success with GTM event data
    return res.status(200).json({
      success: true,
      submission,
      gtmEvent: {
        event: 'quote_submission',
        insurance_type: formData.insuranceType,
        utm_source: formData.utm_source,
        utm_medium: formData.utm_medium,
        utm_campaign: formData.utm_campaign
      }
    });

  } catch (error) {
    console.error('Quote submission error:', error);
    return res.status(500).json({ 
      error: 'Failed to process quote submission',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 