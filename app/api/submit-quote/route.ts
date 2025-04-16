import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { sendConsumerConfirmationEmail, sendAgentNotificationEmail } from '@/lib/sendEmail';
import { createSalesforceOpportunity } from '@/lib/salesforce';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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
    const body = await request.json();
    
    // Validate the request body
    const validatedData = formSchema.parse(body);

    // Track the form submission in Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'form_submission', {
        event_category: 'quote_request',
        event_label: validatedData.insuranceType,
        funnel_name: validatedData.funnelName,
        funnel_step: validatedData.funnelStep,
        funnel_variant: validatedData.funnelVariant,
        ab_test_id: validatedData.abTestId,
        ab_test_variant: validatedData.abTestVariant,
        utm_source: validatedData.utmSource,
        utm_medium: validatedData.utmMedium,
        utm_campaign: validatedData.utmCampaign,
      });

      // Track as conversion if Google Ads ID is available
      if (process.env.NEXT_PUBLIC_GOOGLE_ADS_ID) {
        window.gtag('event', 'conversion', {
          send_to: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID,
          value: 1.0,
          currency: 'USD',
        });
      }
    }

    // Store the lead in the database
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert([
        {
          first_name: validatedData.firstName,
          last_name: validatedData.lastName,
          email: validatedData.email,
          phone: validatedData.phone,
          age: validatedData.age,
          gender: validatedData.gender,
          product_type: validatedData.insuranceType,
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
          // Insurance-specific fields
          ...(validatedData.insuranceType === 'life' && {
            coverage_amount: validatedData.coverageAmount,
            term_length: validatedData.termLength,
            tobacco_use: validatedData.tobaccoUse,
          }),
          ...(validatedData.insuranceType === 'disability' && {
            occupation: validatedData.occupation,
            employment_status: validatedData.employmentStatus,
            income_range: validatedData.incomeRange,
          }),
          ...(validatedData.insuranceType === 'auto' && {
            vehicle_year: validatedData.vehicleYear,
            vehicle_make: validatedData.vehicleMake,
            vehicle_model: validatedData.vehicleModel,
          }),
          ...(validatedData.insuranceType === 'supplemental' && {
            health_status: validatedData.healthStatus,
            pre_existing_conditions: validatedData.preExistingConditions ? 'Yes' : 'No',
          }),
        },
      ])
      .select()
      .single();

    if (leadError) {
      console.error('Error storing lead:', leadError);
      return NextResponse.json(
        { error: 'Failed to store lead', details: leadError },
        { status: 500, headers: corsHeaders }
      );
    }

    // Send notification emails and create Salesforce opportunity
    try {
      // Send confirmation email to consumer
      await sendConsumerConfirmationEmail(validatedData.email, validatedData.insuranceType);
      
      // Send notification email to agent
      await sendAgentNotificationEmail(validatedData.insuranceType, {
        first_name: validatedData.firstName,
        last_name: validatedData.lastName,
        email: validatedData.email,
        phone: validatedData.phone,
        age: validatedData.age,
        gender: validatedData.gender,
        product_type: validatedData.insuranceType,
        coverage_amount: validatedData.insuranceType === 'life' ? validatedData.coverageAmount : undefined,
        term_length: validatedData.insuranceType === 'life' ? validatedData.termLength : undefined,
        tobacco_use: validatedData.insuranceType === 'life' ? validatedData.tobaccoUse : undefined,
        occupation: validatedData.insuranceType === 'disability' ? validatedData.occupation : undefined,
        employment_status: validatedData.insuranceType === 'disability' ? validatedData.employmentStatus : undefined,
        income_range: validatedData.insuranceType === 'disability' ? validatedData.incomeRange : undefined,
        pre_existing_conditions: validatedData.insuranceType === 'supplemental' ? (validatedData.preExistingConditions ? 'Yes' : 'No') : undefined,
        utm_source: validatedData.utmSource,
        ab_test_variant: validatedData.abTestVariant,
        funnel_name: validatedData.funnelName,
        funnel_step: validatedData.funnelStep,
        funnel_variant: validatedData.funnelVariant,
        ab_test_id: validatedData.abTestId,
      });

      // Create Salesforce opportunity
      const sfResult = await createSalesforceOpportunity({
        first_name: validatedData.firstName,
        last_name: validatedData.lastName,
        email: validatedData.email,
        phone: validatedData.phone,
        age: validatedData.age,
        gender: validatedData.gender,
        product_type: validatedData.insuranceType,
        coverage_amount: validatedData.insuranceType === 'life' ? validatedData.coverageAmount : undefined,
        term_length: validatedData.insuranceType === 'life' ? validatedData.termLength : undefined,
        tobacco_use: validatedData.insuranceType === 'life' ? validatedData.tobaccoUse : undefined,
        occupation: validatedData.insuranceType === 'disability' ? validatedData.occupation : undefined,
        employment_status: validatedData.insuranceType === 'disability' ? validatedData.employmentStatus : undefined,
        income_range: validatedData.insuranceType === 'disability' ? validatedData.incomeRange : undefined,
        pre_existing_conditions: validatedData.insuranceType === 'supplemental' ? (validatedData.preExistingConditions ? 'Yes' : 'No') : undefined,
        utm_source: validatedData.utmSource,
        ab_test_variant: validatedData.abTestVariant,
        funnel_name: validatedData.funnelName,
        funnel_step: validatedData.funnelStep,
        funnel_variant: validatedData.funnelVariant,
        ab_test_id: validatedData.abTestId,
      });

      return NextResponse.json(
        { 
          success: true, 
          data: { 
            lead,
            salesforce: sfResult
          } 
        },
        { headers: corsHeaders }
      );
    } catch (error) {
      console.error('Error processing submission:', error);
      // We still return success if lead was stored but other operations failed
      return NextResponse.json(
        {
          success: true,
          warning: 'Lead stored but some operations failed',
          data: { lead },
        },
        { headers: corsHeaders }
      );
    }
  } catch (error) {
    console.error('Error processing quote submission:', error);
    return NextResponse.json(
      {
        error: 'Failed to process quote submission',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
} 