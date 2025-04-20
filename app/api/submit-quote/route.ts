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
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  age: z.coerce.number().min(18, 'Must be at least 18 years old').max(85, 'Must be under 85 years old'),
  gender: z.enum(['male', 'female']),
  insuranceType: z.string(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
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
      age: validatedData.age.toString(),
      gender: validatedData.gender,
      insuranceType: validatedData.insuranceType,
      utmSource: validatedData.utmSource,
      utmMedium: validatedData.utmMedium,
      utmCampaign: validatedData.utmCampaign,
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
          age: validatedData.age,
          gender: validatedData.gender,
          insurance_type: validatedData.insuranceType,
          utm_source: validatedData.utmSource,
          utm_medium: validatedData.utmMedium,
          utm_campaign: validatedData.utmCampaign,
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

    // Send notification to agent
    await sendAgentNotificationEmail({
      to: process.env.NEW_LEAD_EMAIL || 'leads@quotelinker.com',
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      email: validatedData.email,
      phone: validatedData.phone,
      insuranceType: validatedData.insuranceType,
      age: validatedData.age,
      gender: validatedData.gender
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing quote submission:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
} 