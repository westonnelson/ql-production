import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    const data = await resend.emails.send({
      from: 'QL Production <onboarding@resend.dev>',
      to: email,
      subject: 'Test Email from QL Production',
      html: '<h1>Test Email</h1><p>This is a test email from QL Production. If you received this, the email functionality is working correctly!</p>'
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ success: false, error: 'Failed to send email' }, { status: 500 });
  }
} 