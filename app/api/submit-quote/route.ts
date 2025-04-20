import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sendConsumerConfirmationEmail, sendAgentNotificationEmail } from '@/lib/sendEmail';
import { handleFormSubmission } from '@/lib/form-handler';
import { createSalesforceLead } from '@/lib/salesforce';
import { supabase } from '@/lib/supabase';
import { sendConfirmationEmail } from '@/lib/email';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Define the form schema for validation
const quoteFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must have at least 10 digits'),
  zipCode: z.string().min(5, 'ZIP code is required'),
  age: z.string().min(1, 'Age is required'),
  insuranceType: z.enum(['auto', 'life', 'homeowners', 'disability', 'health', 'supplemental']),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  bestTimeToCall: z.string().optional(),
  preferredContactMethod: z.enum(['phone', 'sms']).optional()
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = quoteFormSchema.parse(body);

    // Create Salesforce lead
    const salesforceResponse = await createSalesforceLead({
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      email: validatedData.email,
      phone: validatedData.phone,
      zipCode: validatedData.zipCode,
      age: validatedData.age,
      insuranceType: validatedData.insuranceType,
      utmSource: validatedData.utmSource,
      utmMedium: validatedData.utmMedium,
      utmCampaign: validatedData.utmCampaign,
      bestTimeToCall: validatedData.bestTimeToCall,
      preferredContactMethod: validatedData.preferredContactMethod
    });

    if (!salesforceResponse.success) {
      throw new Error('Failed to create Salesforce lead');
    }

    // Store in Supabase
    const { error: supabaseError } = await supabase
      .from('quotes')
      .insert([
        {
          first_name: validatedData.firstName,
          last_name: validatedData.lastName,
          email: validatedData.email,
          phone: validatedData.phone,
          zip_code: validatedData.zipCode,
          age: validatedData.age,
          insurance_type: validatedData.insuranceType,
          utm_source: validatedData.utmSource,
          utm_medium: validatedData.utmMedium,
          utm_campaign: validatedData.utmCampaign,
          best_time_to_call: validatedData.bestTimeToCall,
          preferred_contact_method: validatedData.preferredContactMethod,
          status: 'new',
          source: 'QuoteLinker Form'
        }
      ]);

    if (supabaseError) {
      console.error('Supabase error:', supabaseError);
      throw new Error('Failed to store quote data');
    }

    // Send confirmation email
    await sendConfirmationEmail({
      to: validatedData.email,
      firstName: validatedData.firstName,
      insuranceType: validatedData.insuranceType
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Quote submission error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to submit quote' },
      { status: 400 }
    );
  }
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
} 