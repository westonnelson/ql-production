import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createSalesforceLead, createSalesforceOpportunity, isSalesforceConfigured } from '@/lib';
import { createAircallContact, createAircallCall, sendAircallSMS, isAircallConfigured } from '@/lib/aircall';

// Define the form schema for validation
const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must have at least 10 digits'),
  zipCode: z.string().min(5, 'ZIP code is required'),
  age: z.string().min(1, 'Age is required'),
  company: z.string().optional(),
  source: z.string().optional(),
  description: z.string().optional(),
  insuranceType: z.string().min(1, 'Insurance type is required'),
  estimatedAmount: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  bestTimeToCall: z.string().optional(),
  preferredContactMethod: z.enum(['phone', 'sms']).optional()
});

// Salesforce API configuration
const SALESFORCE_API_URL = process.env.SALESFORCE_API_URL || 'https://your-salesforce-instance.salesforce.com/services/data/v57.0/sobjects/Lead';
const SALESFORCE_ACCESS_TOKEN = process.env.SALESFORCE_ACCESS_TOKEN;

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Validate the form data
    const validatedData = formSchema.parse(body);
    
    // Check if Salesforce is configured
    if (!isSalesforceConfigured()) {
      console.warn('Salesforce is not configured');
      return NextResponse.json(
        { error: 'Salesforce integration is not configured' },
        { status: 500 }
      );
    }

    // Create lead in Salesforce
    const leadResult = await createSalesforceLead(validatedData);
    
    // Create opportunity in Salesforce
    const opportunityResult = await createSalesforceOpportunity({
      ...validatedData,
      stageName: 'New',
      closeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      leadId: leadResult.id
    });

    // Handle Aircall integration if configured
    let aircallContactId;
    if (isAircallConfigured()) {
      // Create contact in Aircall
      const aircallContact = await createAircallContact({
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        phone: validatedData.phone,
        metadata: {
          insuranceType: validatedData.insuranceType,
          estimatedAmount: validatedData.estimatedAmount,
          utmSource: validatedData.utmSource,
          utmMedium: validatedData.utmMedium,
          utmCampaign: validatedData.utmCampaign,
          leadId: leadResult.id,
          opportunityId: opportunityResult.id
        }
      });

      aircallContactId = aircallContact.id;

      // Handle preferred contact method
      if (validatedData.preferredContactMethod === 'phone' && validatedData.bestTimeToCall) {
        // Schedule a call
        await createAircallCall({
          contactId: aircallContactId,
          direction: 'outbound',
          scheduledAt: validatedData.bestTimeToCall,
          metadata: {
            insuranceType: validatedData.insuranceType,
            estimatedAmount: validatedData.estimatedAmount
          }
        });
      } else if (validatedData.preferredContactMethod === 'sms') {
        // Send SMS
        await sendAircallSMS({
          contactId: aircallContactId,
          message: `Hi ${validatedData.firstName}, thank you for your interest in our insurance services. A representative will contact you shortly to discuss your needs.`
        });
      }
    }

    // Return success response with all IDs
    return NextResponse.json({
      success: true,
      leadId: leadResult.id,
      opportunityId: opportunityResult.id,
      aircallContactId
    });
  } catch (error) {
    console.error('Error processing form submission:', error);
    
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