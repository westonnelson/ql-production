import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { sendConsumerConfirmationEmail, sendAgentNotificationEmail } from '@/lib/sendEmail';
import { createSalesforceOpportunity } from '@/lib/salesforce';
import { handleFormSubmission } from '@/lib/form-handler';

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
    const data = await request.json();
    const result = await handleFormSubmission(data);
    return NextResponse.json(result);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to submit form' },
      { status: 500 }
    );
  }
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
} 