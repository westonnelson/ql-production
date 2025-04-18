import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      insuranceType,
    } = body;

    // Send confirmation email to consumer
    await resend.emails.send({
      from: 'QuoteLinker <noreply@quotelinker.com>',
      to: email,
      subject: `Your ${insuranceType} Quote Request Has Been Received`,
      html: `
        <h2>Thank You for Your Quote Request</h2>
        <p>Dear ${firstName},</p>
        <p>Thank you for requesting a quote for ${insuranceType}. We have received your information and a licensed agent will contact you shortly to discuss your options.</p>
        <p>If you have any immediate questions, please don't hesitate to call us at (555) 123-4567.</p>
        <p>Best regards,<br>The QuoteLinker Team</p>
      `
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending consumer notification:', error);
    return NextResponse.json(
      { error: 'Failed to send consumer notification' },
      { status: 500 }
    );
  }
} 