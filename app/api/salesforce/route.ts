import { NextResponse } from 'next/server';
import { z } from 'zod';
import jsforce from 'jsforce';

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

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    // Validate environment variables
    const requiredEnvVars = [
      'SALESFORCE_CLIENT_ID',
      'SALESFORCE_CLIENT_SECRET',
      'SALESFORCE_USERNAME',
      'SALESFORCE_PASSWORD',
      'SALESFORCE_SECURITY_TOKEN',
    ];

    const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
    if (missingEnvVars.length > 0) {
      console.error('Missing required environment variables:', missingEnvVars);
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500, headers: corsHeaders }
      );
    }

    // Parse and validate request data
    const requestData = await request.json();
    console.log('Received Salesforce lead data:', JSON.stringify(requestData, null, 2));

    let validatedData;
    try {
      validatedData = leadSchema.parse(requestData);
      console.log('Validated lead data:', JSON.stringify(validatedData, null, 2));
    } catch (validationError) {
      console.error('Validation error:', validationError);
      return NextResponse.json(
        { error: 'Validation error', details: validationError },
        { status: 400, headers: corsHeaders }
      );
    }

    // Initialize Salesforce connection
    const conn = new jsforce.Connection({
      loginUrl: process.env.SALESFORCE_LOGIN_URL || 'https://login.salesforce.com'
    });

    // Authenticate with Salesforce
    await conn.login(
      process.env.SALESFORCE_USERNAME!,
      process.env.SALESFORCE_PASSWORD! + process.env.SALESFORCE_SECURITY_TOKEN!
    );

    // Prepare lead data for Salesforce
    const leadData = {
      FirstName: validatedData.firstName,
      LastName: validatedData.lastName,
      Email: validatedData.email,
      Phone: validatedData.phone,
      Age__c: validatedData.age,
      Gender__c: validatedData.gender,
      Product_Type__c: validatedData.productType,
      Coverage_Amount__c: validatedData.coverageAmount,
      Term_Length__c: validatedData.termLength,
      Tobacco_Use__c: validatedData.tobaccoUse,
      LeadSource: validatedData.utmSource || 'Website',
      Status: 'Open - Not Contacted',
      Company: 'Individual'  // Required by Salesforce
    };

    // Create lead in Salesforce
    const result = await conn.sobject('Lead').create(leadData);

    if (result.success) {
      return NextResponse.json(
        { 
          success: true, 
          message: 'Lead created successfully',
          leadId: result.id 
        },
        { headers: corsHeaders }
      );
    } else {
      throw new Error('Failed to create lead in Salesforce');
    }

  } catch (error) {
    console.error('Salesforce API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500, headers: corsHeaders }
    );
  }
} 