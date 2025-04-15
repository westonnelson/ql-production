import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sendConfirmationEmail, sendLeadNotificationEmail } from '@/lib/email'

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase configuration. Please check environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});

// Validation schema for lead submission
const leadSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  age: z.number().int().min(18).max(100),
  gender: z.enum(['male', 'female', 'other']),
  productType: z.enum(['life', 'disability', 'supplemental']),
  // Optional fields based on product type
  coverageAmount: z.number().int().optional(),
  termLength: z.number().int().optional(),
  tobaccoUse: z.boolean().optional(),
  occupation: z.string().optional(),
  employmentStatus: z.string().optional(),
  incomeRange: z.string().optional(),
  preExistingConditions: z.string().optional(),
  desiredCoverageType: z.string().optional(),
  // Tracking fields
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmContent: z.string().optional(),
  utmTerm: z.string().optional(),
  funnelName: z.string().optional(),
  funnelStep: z.string().optional(),
  funnelVariant: z.string().optional(),
  abTestId: z.string().optional(),
  abTestVariant: z.string().optional(),
});

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received request body:', JSON.stringify(body, null, 2));
    
    // Validate the request body
    let validatedData;
    try {
      validatedData = leadSchema.parse(body);
      console.log('Validated data:', JSON.stringify(validatedData, null, 2));
    } catch (validationError) {
      console.error('Validation error:', validationError);
      return NextResponse.json(
        { error: 'Invalid form data', details: validationError },
        { status: 400, headers: corsHeaders }
      );
    }

    // Check Supabase connection
    if (!supabase) {
      console.error('Supabase client not initialized');
      return NextResponse.json(
        { error: 'Database connection error' },
        { status: 500, headers: corsHeaders }
      );
    }
    
    // Insert the lead into Supabase
    try {
      // Sanitize and format the data
      const leadRecord = {
        first_name: validatedData.firstName.trim(),
        last_name: validatedData.lastName.trim(),
        email: validatedData.email.trim().toLowerCase(),
        phone: validatedData.phone.replace(/\D/g, ''), // Remove non-digits
        age: Number(validatedData.age),
        gender: validatedData.gender,
        product_type: validatedData.productType,
        coverage_amount: Number(validatedData.coverageAmount),
        term_length: Number(validatedData.termLength),
        tobacco_use: validatedData.tobaccoUse,
        occupation: validatedData.occupation,
        employment_status: validatedData.employmentStatus,
        income_range: validatedData.incomeRange,
        pre_existing_conditions: validatedData.preExistingConditions,
        desired_coverage_type: validatedData.desiredCoverageType,
        utm_source: validatedData.utmSource,
        utm_medium: validatedData.utmMedium,
        utm_campaign: validatedData.utmCampaign,
        utm_content: validatedData.utmContent,
        utm_term: validatedData.utmTerm,
        funnel_name: validatedData.funnelName,
        funnel_step: validatedData.funnelStep,
        funnel_variant: validatedData.funnelVariant,
        ab_test_id: validatedData.abTestId,
        ab_test_variant: validatedData.abTestVariant,
      };

      console.log('Attempting to insert lead with data:', JSON.stringify(leadRecord, null, 2));

      const { data, error } = await supabase
        .from('leads')
        .insert([leadRecord])
        .select()
        .single();

      if (error) {
        console.error('Supabase insert error:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        
        // Check for specific error types
        if (error.code === '42P01') {
          return NextResponse.json(
            { error: 'Database table not found', details: error.message },
            { status: 500, headers: corsHeaders }
          );
        } else if (error.code === '23505') {
          return NextResponse.json(
            { error: 'A lead with this information already exists', details: error.message },
            { status: 400, headers: corsHeaders }
          );
        } else {
          return NextResponse.json(
            { 
              error: 'Database error',
              details: error.message,
              code: error.code
            },
            { status: 500, headers: corsHeaders }
          );
        }
      }

      console.log('Successfully inserted lead:', JSON.stringify(data, null, 2));

      // Send confirmation emails
      try {
        await Promise.all([
          sendConfirmationEmail({
            firstName: validatedData.firstName,
            lastName: validatedData.lastName,
            email: validatedData.email,
            phone: validatedData.phone,
            age: validatedData.age,
            gender: validatedData.gender,
            productType: validatedData.productType,
            coverageAmount: validatedData.coverageAmount,
            termLength: validatedData.termLength,
            tobaccoUse: validatedData.tobaccoUse,
            occupation: validatedData.occupation,
            employmentStatus: validatedData.employmentStatus,
            incomeRange: validatedData.incomeRange,
            preExistingConditions: validatedData.preExistingConditions,
            desiredCoverageType: validatedData.desiredCoverageType,
            utmSource: validatedData.utmSource,
            abTestVariant: validatedData.abTestVariant
          }),
          sendLeadNotificationEmail({
            firstName: validatedData.firstName,
            lastName: validatedData.lastName,
            email: validatedData.email,
            phone: validatedData.phone,
            age: validatedData.age,
            gender: validatedData.gender,
            productType: validatedData.productType,
            coverageAmount: validatedData.coverageAmount,
            termLength: validatedData.termLength,
            tobaccoUse: validatedData.tobaccoUse,
            occupation: validatedData.occupation,
            employmentStatus: validatedData.employmentStatus,
            incomeRange: validatedData.incomeRange,
            preExistingConditions: validatedData.preExistingConditions,
            desiredCoverageType: validatedData.desiredCoverageType,
            utmSource: validatedData.utmSource,
            abTestVariant: validatedData.abTestVariant
          })
        ]);
        console.log('Successfully sent confirmation emails');
      } catch (emailError) {
        console.error('Error sending emails:', emailError);
        // Continue with success response but log the error
      }

      return NextResponse.json({ 
        success: true,
        message: 'Lead saved!',
        data: data
      }, { headers: corsHeaders });

    } catch (dbError) {
      console.error('Database operation error:', dbError);
      return NextResponse.json(
        { 
          error: 'Database error',
          details: dbError instanceof Error ? dbError.message : 'Unknown database error'
        },
        { status: 500, headers: corsHeaders }
      );
    }
  } catch (err) {
    console.error('API route error:', err);
    return NextResponse.json(
      { error: 'Server error', details: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500, headers: corsHeaders }
    );
  }
} 