import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

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
        { error: 'Failed to save quote' },
        { status: 500 }
      );
    }
    
    // Send confirmation email
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
      console.error('Error sending email:', emailError);
      // Continue even if email fails
    }
    
    return NextResponse.json({ id: data[0].id, success: true });
  } catch (error) {
    console.error('Error processing quote:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 