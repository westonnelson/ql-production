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

// Check if Supabase configuration is available
if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase configuration. Please check environment variables.');
}

const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

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
    
    // Validate the request body
    const validatedData = leadSchema.parse(body);
    
    // Check if Supabase is configured
    if (!supabase) {
      console.error('Supabase client not initialized. Skipping database operation.');
      
      // Still send emails even if database operation fails
      await sendConfirmationEmail({
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
      });

      await sendLeadNotificationEmail({
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
      });

      return NextResponse.json({ 
        success: true, 
        message: 'Lead processed (database operation skipped)',
        data: validatedData 
      }, { headers: corsHeaders });
    }
    
    // Insert the lead into Supabase
    const { data, error } = await supabase
      .from('leads')
      .insert([{
        first_name: validatedData.firstName,
        last_name: validatedData.lastName,
        email: validatedData.email,
        phone: validatedData.phone,
        age: validatedData.age,
        gender: validatedData.gender,
        product_type: validatedData.productType,
        coverage_amount: validatedData.coverageAmount,
        term_length: validatedData.termLength,
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
      }])
      .select()
      .single();

    if (error) {
      console.error('Error inserting lead:', error);
      return NextResponse.json(
        { error: 'Failed to submit lead' },
        { status: 500, headers: corsHeaders }
      );
    }

    // Send to Salesforce
    try {
      const salesforceResponse = await fetch(process.env.SALESFORCE_WEBHOOK_URL || 'https://quotelinker.com/api/salesforce/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lead: {
            FirstName: data.first_name,
            LastName: data.last_name,
            Email: data.email,
            Phone: data.phone,
            Age__c: data.age,
            Gender__c: data.gender,
            Product_Type__c: data.product_type,
            Coverage_Amount__c: data.coverage_amount,
            Term_Length__c: data.term_length,
            Tobacco_Use__c: data.tobacco_use,
            Occupation__c: data.occupation,
            Employment_Status__c: data.employment_status,
            Income_Range__c: data.income_range,
            Pre_Existing_Conditions__c: data.pre_existing_conditions,
            Desired_Coverage_Type__c: data.desired_coverage_type,
            LeadSource: data.utm_source,
            UTM_Medium__c: data.utm_medium,
            UTM_Campaign__c: data.utm_campaign,
            UTM_Content__c: data.utm_content,
            UTM_Term__c: data.utm_term,
            Funnel_Name__c: data.funnel_name,
            Funnel_Step__c: data.funnel_step,
            Funnel_Variant__c: data.funnel_variant,
            AB_Test_ID__c: data.ab_test_id,
            AB_Test_Variant__c: data.ab_test_variant,
            Status: 'New',
            Company: 'Individual',
          },
          supabaseId: data.id
        }),
      });

      if (!salesforceResponse.ok) {
        console.error('Error sending to Salesforce:', await salesforceResponse.text());
      }
    } catch (error) {
      console.error('Error sending to Salesforce:', error);
    }

    // Send confirmation email to customer
    await sendConfirmationEmail({
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
    });

    // Send notification email to support
    await sendLeadNotificationEmail({
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
    });

    return NextResponse.json({ success: true, data }, { headers: corsHeaders });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400, headers: corsHeaders }
      );
    }
    
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
} 