import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { sendConsumerConfirmationEmail, sendAgentNotificationEmail } from '@/lib/sendEmail';
import { createSalesforceOpportunity } from '@/lib/salesforce';
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

// Base schema for all insurance types
const baseSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  age: z.number().int().min(18).max(100),
  gender: z.enum(['male', 'female', 'other']),
  insuranceType: z.enum(['life', 'disability', 'auto', 'supplemental']),
  funnelName: z.string().optional(),
  funnelStep: z.string().optional(),
  funnelVariant: z.string().optional(),
  abTestId: z.string().optional(),
  abTestVariant: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmContent: z.string().optional(),
  utmTerm: z.string().optional(),
});

// Insurance-specific schemas
const lifeSchema = baseSchema.extend({
  insuranceType: z.literal('life'),
  coverageAmount: z.number().int().min(10000),
  termLength: z.number().int().min(5).max(30),
  tobaccoUse: z.boolean(),
});

const disabilitySchema = baseSchema.extend({
  insuranceType: z.literal('disability'),
  occupation: z.string().min(1, 'Occupation is required'),
  employmentStatus: z.enum(['full-time', 'part-time', 'self-employed']),
  incomeRange: z.string().min(1, 'Income range is required'),
});

const autoSchema = baseSchema.extend({
  insuranceType: z.literal('auto'),
  vehicleYear: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  vehicleMake: z.string().min(1, 'Vehicle make is required'),
  vehicleModel: z.string().min(1, 'Vehicle model is required'),
});

const supplementalSchema = baseSchema.extend({
  insuranceType: z.literal('supplemental'),
  healthStatus: z.enum(['excellent', 'good', 'fair', 'poor']),
  preExistingConditions: z.boolean(),
});

// Combined schema
const formSchema = z.discriminatedUnion('insuranceType', [
  lifeSchema,
  disabilitySchema,
  autoSchema,
  supplementalSchema,
]);

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'age', 'gender', 'insuranceType'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate phone number
    const phoneRegex = /^\+?[\d\s-()]{10,}$/;
    if (!phoneRegex.test(data.phone)) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // Validate age
    const age = Number(data.age);
    if (isNaN(age) || age < 18 || age > 100) {
      return NextResponse.json(
        { error: 'Age must be between 18 and 100' },
        { status: 400 }
      );
    }

    // Prepare quote data
    const quoteData = {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone,
      age: age,
      gender: data.gender,
      insurance_type: data.insuranceType,
      utm_source: data.utm_source || null,
      utm_medium: data.utm_medium || null,
      utm_campaign: data.utm_campaign || null,
      utm_content: data.utm_content || null,
      utm_term: data.utm_term || null,
      user_agent: data.userAgent || null,
      platform: data.platform || 'web',
      created_at: new Date().toISOString(),
      status: 'new'
    };

    // Insert into Supabase
    const { data: quote, error: insertError } = await supabase
      .from('quotes')
      .insert([quoteData])
      .select()
      .single();

    if (insertError) {
      console.error('Supabase insert error:', insertError);
      return NextResponse.json(
        { error: 'Failed to save quote' },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Quote submitted successfully',
      quoteId: quote.id
    });

  } catch (error) {
    console.error('Quote submission error:', error);
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