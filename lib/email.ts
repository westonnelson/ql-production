import { Resend } from 'resend';
import { sendConsumerConfirmationEmail, sendAgentNotificationEmail } from './sendEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

interface LeadData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  product_type: 'life' | 'disability' | 'supplemental';
  coverage_amount?: number;
  term_length?: number;
  tobacco_use?: boolean;
  occupation?: string;
  employment_status?: string;
  income_range?: string;
  pre_existing_conditions?: string;
  desired_coverage_type?: string;
  utm_source?: string;
  ab_test_variant?: string;
}

function getProductTitle(productType: string): string {
  switch (productType) {
    case 'life':
      return 'Life Insurance';
    case 'disability':
      return 'Disability Insurance';
    case 'supplemental':
      return 'Supplemental Health Insurance';
    case 'auto':
      return 'Auto Insurance';
    case 'homeowners':
      return 'Homeowners Insurance';
    default:
      return 'Insurance';
  }
}

function getProductSpecificFields(data: LeadData): string {
  switch (data.product_type) {
    case 'life':
      return `
        ${data.coverage_amount ? `<p><strong>Coverage Amount:</strong> $${data.coverage_amount.toLocaleString()}</p>` : ''}
        ${data.term_length ? `<p><strong>Term Length:</strong> ${data.term_length} years</p>` : ''}
        ${data.tobacco_use !== undefined ? `<p><strong>Tobacco Use:</strong> ${data.tobacco_use ? 'Yes' : 'No'}</p>` : ''}
      `;
    case 'disability':
      return `
        ${data.occupation ? `<p><strong>Occupation:</strong> ${data.occupation}</p>` : ''}
        ${data.employment_status ? `<p><strong>Employment Status:</strong> ${data.employment_status}</p>` : ''}
        ${data.income_range ? `<p><strong>Income Range:</strong> ${data.income_range}</p>` : ''}
      `;
    case 'supplemental':
      return `
        ${data.pre_existing_conditions ? `<p><strong>Pre-existing Conditions:</strong> ${data.pre_existing_conditions}</p>` : ''}
        ${data.desired_coverage_type ? `<p><strong>Desired Coverage Type:</strong> ${data.desired_coverage_type}</p>` : ''}
      `;
    default:
      return '';
  }
}

export async function sendConfirmationEmail(data: LeadData) {
  try {
    console.log('Sending confirmation email');
    await sendConsumerConfirmationEmail({
      to: data.email,
      firstName: data.first_name,
      insuranceType: data.product_type
    });
    console.log('Confirmation email sent successfully');
    return { success: true };
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return { success: false, error };
  }
}

export async function sendLeadNotificationEmail(data: LeadData) {
  try {
    console.log('Sending lead notification email');
    await sendAgentNotificationEmail({
      to: process.env.NEW_LEAD_EMAIL || 'leads@quotelinker.com',
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email,
      phone: data.phone,
      insuranceType: data.product_type,
      estimatedAmount: data.coverage_amount?.toString()
    });
    console.log('Lead notification email sent successfully');
    return { success: true };
  } catch (error) {
    console.error('Error sending lead notification email:', error);
    return { success: false, error };
  }
}

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export async function sendEmail({ to, subject, text, html }: EmailOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'QuoteLinker <support@quotelinker.com>',
      to,
      subject,
      text,
      html: html || text,
    });

    if (error) {
      console.error('Failed to send email:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Email service error:', error);
    throw error;
  }
} 