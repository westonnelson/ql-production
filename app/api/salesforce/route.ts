import { NextResponse } from 'next/server';
import { z } from 'zod';

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

    try {
      const validatedData = leadSchema.parse(requestData);
      console.log('Validated lead data:', JSON.stringify(validatedData, null, 2));
    } catch (validationError) {
      console.error('Validation error:', validationError);
      return NextResponse.json(
        { error: 'Validation error', details: validationError },
        { status: 400, headers: corsHeaders }
      );
    }

    // TODO: Implement Salesforce REST API integration
    // 1. Authenticate with Salesforce using OAuth 2.0
    // 2. Create Lead record in Salesforce
    // 3. Handle any errors and return appropriate response

    // Placeholder success response
    return NextResponse.json(
      { 
        success: true, 
        message: 'Salesforce integration pending implementation',
        data: requestData 
      },
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error('Salesforce API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500, headers: corsHeaders }
    );
  }
} 