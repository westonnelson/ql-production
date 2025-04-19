import { NextResponse } from 'next/server';
import { z } from 'zod';
import jsforce from 'jsforce';
import { createClient } from '@supabase/supabase-js';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Validation schema for lead data
const leadSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  age: z.number().int().min(18).max(100),
  gender: z.enum(['male', 'female', 'other']),
  productType: z.enum(['life', 'disability', 'supplemental']),
  coverageAmount: z.number().int().optional(),
  termLength: z.number().int().optional(),
  tobaccoUse: z.boolean().optional(),
  utmSource: z.string().optional(),
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { leadId } = data;

    // Get lead data from Supabase
    const { data: lead, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single();

    if (error) {
      throw new Error(`Error fetching lead: ${error.message}`);
    }

    // Create Salesforce opportunity
    const conn = new jsforce.Connection({
      loginUrl: process.env.SALESFORCE_LOGIN_URL || 'https://login.salesforce.com'
    });

    await conn.login(
      process.env.SALESFORCE_USERNAME!,
      process.env.SALESFORCE_PASSWORD! + process.env.SALESFORCE_SECURITY_TOKEN!
    );

    const opportunity = {
      Name: `${lead.first_name} ${lead.last_name} - ${lead.insurance_type} Quote`,
      StageName: 'Prospecting',
      CloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      Amount: lead.coverage_amount || 0,
      Type: lead.insurance_type,
      LeadSource: lead.utm_source || 'Website'
    };

    const result = await conn.sobject('Opportunity').create(opportunity);

    if (!result.success) {
      throw new Error('Failed to create opportunity in Salesforce');
    }

    // Update lead with Salesforce opportunity ID
    await supabase
      .from('leads')
      .update({ salesforce_opportunity_id: result.id })
      .eq('id', leadId);

    return NextResponse.json({ success: true, opportunityId: result.id });
  } catch (error) {
    console.error('Error creating Salesforce opportunity:', error);
    return NextResponse.json(
      { error: 'Failed to create Salesforce opportunity' },
      { status: 500 }
    );
  }
} 