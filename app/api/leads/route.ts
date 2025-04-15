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
    const data = await request.json();
    console.log('Received lead data:', JSON.stringify(data, null, 2));

    // Base required fields for all product types
    const baseRequiredFields = ['firstName', 'lastName', 'email', 'phone', 'age', 'productType'];
    
    // Product-specific required fields
    const productSpecificFields: Record<string, string[]> = {
      life: ['coverageAmount', 'termLength'],
      disability: ['occupation', 'employmentStatus', 'incomeRange'],
      supplemental: ['preExistingConditions', 'desiredCoverageType']
    };

    // Get all required fields based on product type
    const requiredFields = [
      ...baseRequiredFields,
      ...(productSpecificFields[data.productType] || [])
    ];

    // Check for missing fields
    const missingFields = requiredFields.filter(field => !data[field]);
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields', 
          details: missingFields 
        }),
        { status: 400 }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Prepare lead data based on product type
    const leadData: any = {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone,
      age: data.age,
      product_type: data.productType,
      created_at: new Date().toISOString()
    };

    // Add product-specific fields
    if (data.productType === 'life') {
      leadData.coverage_amount = data.coverageAmount;
      leadData.term_length = data.termLength;
      leadData.tobacco_use = data.tobaccoUse;
    } else if (data.productType === 'disability') {
      leadData.occupation = data.occupation;
      leadData.employment_status = data.employmentStatus;
      leadData.income_range = data.incomeRange;
    } else if (data.productType === 'supplemental') {
      leadData.pre_existing_conditions = data.preExistingConditions;
      leadData.desired_coverage_type = data.desiredCoverageType;
    }

    // Insert lead into database
    const { data: lead, error: dbError } = await supabase
      .from('leads')
      .insert([leadData])
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to save lead', 
          details: dbError 
        }),
        { status: 500 }
      );
    }

    console.log('Lead saved successfully:', JSON.stringify(lead, null, 2));

    // Send confirmation email
    try {
      console.log('Attempting to send confirmation email...');
      const confirmationResult = await sendConfirmationEmail(data);
      console.log('Confirmation email result:', confirmationResult);
      if (!confirmationResult.success) {
        console.error('Failed to send confirmation email:', confirmationResult.error);
      }
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // Don't fail the request if email fails
    }

    // Send lead notification email
    try {
      console.log('Attempting to send lead notification email...');
      const notificationResult = await sendLeadNotificationEmail(data);
      console.log('Lead notification email result:', notificationResult);
      if (!notificationResult.success) {
        console.error('Failed to send lead notification email:', notificationResult.error);
      }
    } catch (emailError) {
      console.error('Error sending lead notification email:', emailError);
      // Don't fail the request if email fails
    }

    return new Response(JSON.stringify({ success: true, lead }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Server error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { status: 500 }
    );
  }
} 