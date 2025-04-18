import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, insuranceType } = body;

    // Send confirmation email to customer
    await resend.emails.send({
      from: 'QuoteLinker <quotes@quotelinker.com>',
      to: email,
      subject: 'Your Quote Request Confirmation',
      html: `
        <h1>Thank you for your quote request!</h1>
        <p>Dear ${firstName},</p>
        <p>We've received your request for ${insuranceType} insurance. Our team will review your information and contact you shortly to discuss your options.</p>
        <p>In the meantime, if you have any questions, please don't hesitate to reach out to us.</p>
        <p>Best regards,<br>The QuoteLinker Team</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return NextResponse.json(
      { error: 'Failed to send confirmation email' },
      { status: 500 }
    );
  }
} 