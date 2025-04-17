import { Resend } from 'resend';
import { NextResponse } from 'next/server';

// Initialize Resend with a placeholder key if not available
const resendApiKey = process.env.RESEND_API_KEY || 'placeholder_key';
const resend = new Resend(resendApiKey);

// Function to check if Resend is properly configured
function isResendConfigured(): boolean {
  return !!process.env.RESEND_API_KEY;
}

export async function POST(request: Request) {
  try {
    // Check if Resend is configured
    if (!isResendConfigured()) {
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 503 }
      );
    }

    const { email } = await request.json();
    
    try {
      const { data, error } = await resend.emails.send({
        from: 'QL Production <onboarding@resend.dev>',
        to: email,
        subject: 'Test Email from QL Production',
        html: '<h1>Test Email</h1><p>This is a test email from QL Production. If you received this, the email functionality is working correctly!</p>'
      });

      if (error) {
        console.error('Error sending test email:', error);
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, data });
    } catch (error) {
      console.error('Error sending test email:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: error instanceof Error ? error.message : 'Failed to send email'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing test email request:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error'
      },
      { status: 500 }
    );
  }
} 