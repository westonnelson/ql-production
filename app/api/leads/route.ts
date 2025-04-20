import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createSalesforceLead } from '@/lib';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Define the lead data schema
const leadSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must have at least 10 digits'),
  zipCode: z.string().min(5, 'ZIP code is required'),
  age: z.string().min(1, 'Age is required'),
  insuranceType: z.enum(['auto', 'life', 'homeowners', 'disability', 'supplemental']),
  estimatedAmount: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  bestTimeToCall: z.string().optional(),
  preferredContactMethod: z.enum(['phone', 'sms']).optional()
});

type LeadData = z.infer<typeof leadSchema>;

// Function to handle Salesforce lead creation with error handling
async function handleSalesforceLead(data: LeadData) {
  try {
    const result = await createSalesforceLead({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      zipCode: data.zipCode,
      age: data.age,
      insuranceType: data.insuranceType,
      utmSource: data.utmSource,
      utmMedium: data.utmMedium,
      utmCampaign: data.utmCampaign,
      bestTimeToCall: data.bestTimeToCall,
      preferredContactMethod: data.preferredContactMethod
    });
    return { success: true, leadId: result.id };
  } catch (error) {
    console.error('Error creating Salesforce lead:', error);
    throw error;
  }
}

async function sendEmailNotifications(data: LeadData) {
  const supportEmail = process.env.SUPPORT_EMAIL;
  const newLeadEmail = process.env.NEW_LEAD_EMAIL;

  try {
    // Send email to support team
    await resend.emails.send({
      from: 'QuoteLinker <noreply@quotelinker.com>',
      to: supportEmail!,
      subject: 'New Lead: QuoteLinker Insurance',
      html: `
        <h2>New Lead Received</h2>
        <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>ZIP Code:</strong> ${data.zipCode}</p>
        <p><strong>Age:</strong> ${data.age}</p>
        <p><strong>Product Type:</strong> ${data.insuranceType}</p>
        ${data.estimatedAmount ? `<p><strong>Estimated Amount:</strong> ${data.estimatedAmount}</p>` : ''}
        ${data.bestTimeToCall ? `<p><strong>Best Time to Call:</strong> ${data.bestTimeToCall}</p>` : ''}
        ${data.preferredContactMethod ? `<p><strong>Preferred Contact Method:</strong> ${data.preferredContactMethod}</p>` : ''}
        ${data.utmSource ? `<p><strong>Source:</strong> ${data.utmSource}</p>` : ''}
      `,
    });

    // Send confirmation email to the lead
    await resend.emails.send({
      from: 'QuoteLinker <noreply@quotelinker.com>',
      to: data.email,
      subject: 'Thank You for Your Interest - QuoteLinker',
      html: `
        <h2>Thank You for Your Interest!</h2>
        <p>Dear ${data.firstName},</p>
        <p>Thank you for your interest in ${data.insuranceType} insurance through QuoteLinker. A licensed insurance agent will contact you shortly to discuss your needs and provide personalized quotes.</p>
        ${data.bestTimeToCall ? `<p>We'll make sure to contact you during your preferred time: ${data.bestTimeToCall}</p>` : ''}
        <p>Best regards,<br>The QuoteLinker Team</p>
      `,
    });
  } catch (error) {
    console.error('Email Error:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse and validate the request body
    const body = await request.json();
    const validatedData = leadSchema.parse(body);

    // Create lead in Salesforce
    const result = await handleSalesforceLead(validatedData);

    // Send email notifications
    await sendEmailNotifications(validatedData);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error processing lead:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { 
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
} 