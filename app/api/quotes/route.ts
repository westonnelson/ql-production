import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Initialize Supabase with placeholder values if not available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder_key';
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Resend with a placeholder key if not available
const resendApiKey = process.env.RESEND_API_KEY || 'placeholder_key';
const resend = new Resend(resendApiKey);

// Function to check if Supabase is properly configured
function isSupabaseConfigured(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

// Function to check if Resend is properly configured
function isResendConfigured(): boolean {
  return !!process.env.RESEND_API_KEY;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'insuranceType', 'zipCode'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: 'Database integration not configured' },
        { status: 503 }
      );
    }
    
    // Insert quote into Supabase
    const { data, error } = await supabase
      .from('quotes')
      .insert([
        {
          first_name: body.firstName,
          last_name: body.lastName,
          email: body.email,
          phone: body.phone,
          insurance_type: body.insuranceType,
          zip_code: body.zipCode,
          status: 'new',
          created_at: new Date().toISOString(),
        },
      ])
      .select();
    
    if (error) {
      console.error('Error inserting quote:', error);
      return NextResponse.json(
        { error: 'Failed to save quote', details: error.message },
        { status: 500 }
      );
    }
    
    // Send confirmation email if Resend is configured
    if (isResendConfigured()) {
      try {
        await resend.emails.send({
          from: 'QuoteLinker <quotes@quotelinker.com>',
          to: body.email,
          subject: 'Your Insurance Quote Request',
          html: `
            <h1>Thank you for your quote request!</h1>
            <p>Hello ${body.firstName},</p>
            <p>We've received your request for ${body.insuranceType} insurance. Our team will review your information and get back to you shortly.</p>
            <p>Quote ID: ${data[0].id}</p>
            <p>If you have any questions, please don't hesitate to contact us.</p>
            <p>Best regards,<br>The QuoteLinker Team</p>
          `,
        });
      } catch (emailError) {
        console.warn('Failed to send confirmation email:', emailError);
        // Continue even if email fails
      }
    } else {
      console.warn('Email service not configured - skipping confirmation email');
    }
    
    return NextResponse.json({ id: data[0].id, success: true });
  } catch (error) {
    console.error('Error processing quote:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 