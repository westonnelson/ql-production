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
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  age: z.number().int().min(18).max(100),
  gender: z.enum(['male', 'female', 'other']),
  product_type: z.enum(['life', 'disability', 'supplemental']),
  // Optional fields based on product type
  coverage_amount: z.number().int().optional(),
  term_length: z.number().int().optional(),
  tobacco_use: z.boolean().optional(),
  occupation: z.string().optional(),
  employment_status: z.string().optional(),
  income_range: z.string().optional(),
  pre_existing_conditions: z.string().optional(),
  desired_coverage_type: z.string().optional(),
  // Tracking fields
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_content: z.string().optional(),
  utm_term: z.string().optional(),
  funnel_name: z.string().optional(),
  funnel_step: z.string().optional(),
  funnel_variant: z.string().optional(),
  ab_test_id: z.string().optional(),
  ab_test_variant: z.string().optional(),
});

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log('Received lead data:', data);

    // Initialize Supabase client
    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Failed to initialize database connection' },
        { status: 500 }
      );
    }

    // Validate the data
    const validatedData = leadSchema.parse(data);

    // Create the lead in the database
    const { data: lead, error: createError } = await supabase
      .from('leads')
      .insert([validatedData])
      .select()
      .single();

    if (createError) {
      console.error('Error creating lead:', createError);
      return NextResponse.json(
        { error: 'Failed to save lead', details: createError },
        { status: 500 }
      );
    }

    // Send confirmation email to the lead
    await sendConfirmationEmail(lead);

    // Send notification email to support and the submitting email
    await sendLeadNotificationEmail(lead);

    // TODO: Integrate with Salesforce
    // This will be implemented in the next phase
    // The lead data will be sent to Salesforce as an opportunity

    return NextResponse.json({ success: true, data: lead });
  } catch (error) {
    console.error('Error processing lead:', error);
    return NextResponse.json(
      { error: 'Failed to process lead', details: error },
      { status: 500 }
    );
  }
} 