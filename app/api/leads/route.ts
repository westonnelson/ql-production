import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sendConfirmationEmail, sendLeadNotificationEmail } from '@/lib/email'
import type { SupabaseClient } from '@supabase/supabase-js'

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Environment check:', {
  hasSupabaseUrl: !!supabaseUrl,
  hasServiceKey: !!supabaseServiceKey,
  nodeEnv: process.env.NODE_ENV
});

// Remove the global supabase client
// let supabase: SupabaseClient | null = null;

// Function to get Supabase client
function getSupabaseClient() {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase configuration:', {
      url: supabaseUrl ? 'present' : 'missing',
      key: supabaseServiceKey ? 'present' : 'missing'
    });
    return null;
  }

  try {
    return createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    });
  } catch (error) {
    console.error('Error initializing Supabase client:', error);
    return null;
  }
}

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
    // Parse request data
    const requestData = await request.json();
    console.log('Received lead data:', JSON.stringify(requestData, null, 2));

    // Parse numeric fields
    const parsedData = {
      ...requestData,
      coverageAmount: requestData.coverageAmount ? parseInt(requestData.coverageAmount.toString().replace(/[$,]/g, ''), 10) : undefined,
      termLength: requestData.termLength ? parseInt(requestData.termLength.toString(), 10) : undefined,
      age: parseInt(requestData.age.toString(), 10),
      tobaccoUse: requestData.tobaccoUse === 'yes' || requestData.tobaccoUse === true,
    };

    // Validate the data
    try {
      const validatedData = leadSchema.parse(parsedData);
      console.log('Validated lead data:', JSON.stringify(validatedData, null, 2));
    } catch (validationError) {
      console.error('Validation error:', validationError);
      return NextResponse.json(
        { error: 'Validation error', details: validationError },
        { status: 400, headers: corsHeaders }
      );
    }

    // Initialize Supabase client
    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Failed to initialize database connection' },
        { status: 500, headers: corsHeaders }
      );
    }

    // Prepare lead data based on product type
    const leadData: any = {
      first_name: parsedData.firstName,
      last_name: parsedData.lastName,
      email: parsedData.email,
      phone: parsedData.phone,
      age: parsedData.age,
      gender: parsedData.gender,
      created_at: new Date().toISOString()
    };

    // Add product-specific fields
    if (parsedData.productType === 'life') {
      leadData.coverage_amount = Number(parsedData.coverageAmount);
      leadData.term_length = Number(parsedData.termLength);
      leadData.tobacco_use = parsedData.tobaccoUse;
    } else if (parsedData.productType === 'disability') {
      leadData.occupation = parsedData.occupation;
      leadData.employment_status = parsedData.employmentStatus;
      leadData.income_range = parsedData.incomeRange;
    } else if (parsedData.productType === 'supplemental') {
      leadData.pre_existing_conditions = parsedData.preExistingConditions;
      leadData.desired_coverage_type = parsedData.desiredCoverageType;
    }

    // Add tracking fields if present
    if (parsedData.utmSource) leadData.utm_source = parsedData.utmSource;
    if (parsedData.utmMedium) leadData.utm_medium = parsedData.utmMedium;
    if (parsedData.utmCampaign) leadData.utm_campaign = parsedData.utmCampaign;
    if (parsedData.utmContent) leadData.utm_content = parsedData.utmContent;
    if (parsedData.utmTerm) leadData.utm_term = parsedData.utmTerm;
    if (parsedData.funnelName) leadData.funnel_name = parsedData.funnelName;
    if (parsedData.funnelStep) leadData.funnel_step = parsedData.funnelStep;
    if (parsedData.funnelVariant) leadData.funnel_variant = parsedData.funnelVariant;
    if (parsedData.abTestId) leadData.ab_test_id = parsedData.abTestId;
    if (parsedData.abTestVariant) leadData.ab_test_variant = parsedData.abTestVariant;

    // Insert lead into database
    const { data: lead, error: dbError } = await supabase
      .from('leads')
      .insert([leadData])
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to save lead', details: dbError },
        { status: 500, headers: corsHeaders }
      );
    }

    console.log('Lead saved successfully:', JSON.stringify(lead, null, 2));

    // Send confirmation email
    let confirmationResult;
    try {
      console.log('Attempting to send confirmation email...');
      confirmationResult = await sendConfirmationEmail(parsedData);
      console.log('Confirmation email result:', confirmationResult);
      if (!confirmationResult.success) {
        console.error('Failed to send confirmation email:', confirmationResult.error);
      }
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // Don't fail the request if email fails
    }

    // Send lead notification email
    let notificationResult;
    try {
      console.log('Attempting to send lead notification email...');
      notificationResult = await sendLeadNotificationEmail(parsedData);
      console.log('Lead notification email result:', notificationResult);
      if (!notificationResult.success) {
        console.error('Failed to send lead notification email:', notificationResult.error);
      }
    } catch (emailError) {
      console.error('Error sending lead notification email:', emailError);
      // Don't fail the request if email fails
    }

    // Chain to other services
    const serviceResponses = await Promise.allSettled([
      // Send email notification
      fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'lead', data: parsedData }),
      }),
      // Send to Salesforce
      fetch('/api/salesforce', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedData),
      }),
    ]);

    // Log service responses
    serviceResponses.forEach((response, index) => {
      if (response.status === 'rejected') {
        console.error(`Service ${index} error:`, response.reason);
      } else {
        console.log(`Service ${index} response:`, response.value);
      }
    });

    return NextResponse.json(
      { 
        success: true, 
        lead,
        emailStatus: {
          confirmation: confirmationResult?.success || false,
          notification: notificationResult?.success || false
        },
        services: serviceResponses.map((response, index) => ({
          service: index === 0 ? 'email' : 'salesforce',
          status: response.status,
          ...(response.status === 'fulfilled' ? { data: response.value } : { error: response.reason }),
        })),
      },
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500, headers: corsHeaders }
    );
  }
} 