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
      phone,
      insuranceType,
      utmSource,
      utmMedium,
      utmCampaign,
      salesforceOpportunityId,
    } = body;

    // Send notification email to agent
    await resend.emails.send({
      from: 'QuoteLinker <noreply@quotelinker.com>',
      to: 'weston@insurancewithkyle.com',
      subject: `New Quote Request: ${insuranceType}`,
      html: `
        <h2>New Quote Request</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Insurance Type:</strong> ${insuranceType}</p>
        <p><strong>UTM Source:</strong> ${utmSource || 'N/A'}</p>
        <p><strong>UTM Medium:</strong> ${utmMedium || 'N/A'}</p>
        <p><strong>UTM Campaign:</strong> ${utmCampaign || 'N/A'}</p>
        <p><a href="${process.env.SALESFORCE_INSTANCE_URL}/lightning/r/Opportunity/${salesforceOpportunityId}/view">View in Salesforce</a></p>
      `
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending agent notification:', error);
    return NextResponse.json(
      { error: 'Failed to send agent notification' },
      { status: 500 }
    );
  }
} 