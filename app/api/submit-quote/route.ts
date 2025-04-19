import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { sendConsumerConfirmationEmail, sendAgentNotificationEmail } from '@/lib/sendEmail';
import { handleFormSubmission } from '@/lib/form-handler';

// Initialize Supabase client with placeholder values if not available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder_key';
const supabase = createClient(supabaseUrl, supabaseKey);

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Define the form schema for validation
const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must have at least 10 digits'),
  zipCode: z.string().min(5, 'ZIP code is required'),
  company: z.string().optional(),
  source: z.string().optional(),
  description: z.string().optional(),
  insuranceType: z.enum(['auto', 'life', 'homeowners', 'disability', 'supplemental']),
  estimatedAmount: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  bestTimeToCall: z.string().optional(),
  preferredContactMethod: z.enum(['phone', 'sms']).optional()
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate the request body
    const body = await request.json();
    const validatedData = formSchema.parse(body);

    // Handle form submission
    const result = await handleFormSubmission(validatedData);

    // Send confirmation email to consumer
    await sendConsumerConfirmationEmail({
      to: validatedData.email,
      firstName: validatedData.firstName,
      insuranceType: validatedData.insuranceType
    });

    // Send notification to agent
    await sendAgentNotificationEmail({
      to: validatedData.email,
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      email: validatedData.email,
      phone: validatedData.phone,
      insuranceType: validatedData.insuranceType,
      estimatedAmount: validatedData.estimatedAmount
    });

    return NextResponse.json({
      ...result
    });
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