import { NextResponse } from 'next/server';
import jsforce from 'jsforce';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface LeadData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  zipCode: string;
  productType: string;
}

async function createSalesforceLead(data: LeadData) {
  const conn = new jsforce.Connection({
    loginUrl: process.env.SF_INSTANCE_URL,
  });

  try {
    await conn.login(process.env.SF_USERNAME!, process.env.SF_PASSWORD! + process.env.SF_SECURITY_TOKEN);

    const lead = {
      FirstName: data.firstName,
      LastName: data.lastName,
      Email: data.email,
      Phone: data.phone,
      PostalCode: data.zipCode,
      Product_Type__c: data.productType,
      LeadSource: 'Website',
      Status: 'New',
    };

    const result = await conn.sobject('Lead').create(lead);
    return result;
  } catch (error) {
    console.error('Salesforce Error:', error);
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
        <p><strong>Product Type:</strong> ${data.productType}</p>
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
        <p>Thank you for your interest in ${data.productType} through QuoteLinker. A licensed insurance agent will contact you shortly to discuss your needs and provide personalized quotes.</p>
        <p>Best regards,<br>The QuoteLinker Team</p>
      `,
    });
  } catch (error) {
    console.error('Email Error:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const data: LeadData = await request.json();

    // Validate required fields
    if (!data.firstName || !data.lastName || !data.email || !data.phone || !data.zipCode || !data.productType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create lead in Salesforce
    await createSalesforceLead(data);

    // Send email notifications
    await sendEmailNotifications(data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 