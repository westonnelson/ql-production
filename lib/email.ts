import { Resend } from 'resend';
import { sendConsumerConfirmationEmail, sendAgentNotificationEmail } from './sendEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailData {
  to: string;
  firstName: string;
  insuranceType: string;
}

interface LeadData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  zipCode: string;
  age: string;
  gender: string;
  insuranceType: string;
  estimatedAmount?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  bestTimeToCall?: string;
  preferredContactMethod?: 'phone' | 'sms';
  coverageAmount?: string | number;
  termLength?: string | number;
  tobaccoUse?: boolean;
  occupation?: string;
  employmentStatus?: string;
  incomeRange?: string;
  preExistingConditions?: string;
  desiredCoverageType?: string;
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
  switch (data.insuranceType) {
    case 'life':
      return `
        ${data.coverageAmount ? `<p><strong>Coverage Amount:</strong> $${Number(data.coverageAmount).toLocaleString()}</p>` : ''}
        ${data.termLength ? `<p><strong>Term Length:</strong> ${data.termLength} years</p>` : ''}
        ${data.tobaccoUse !== undefined ? `<p><strong>Tobacco Use:</strong> ${data.tobaccoUse ? 'Yes' : 'No'}</p>` : ''}
      `;
    case 'disability':
      return `
        ${data.occupation ? `<p><strong>Occupation:</strong> ${data.occupation}</p>` : ''}
        ${data.employmentStatus ? `<p><strong>Employment Status:</strong> ${data.employmentStatus}</p>` : ''}
        ${data.incomeRange ? `<p><strong>Income Range:</strong> ${data.incomeRange}</p>` : ''}
      `;
    case 'supplemental':
      return `
        ${data.preExistingConditions ? `<p><strong>Pre-existing Conditions:</strong> ${data.preExistingConditions}</p>` : ''}
        ${data.desiredCoverageType ? `<p><strong>Desired Coverage Type:</strong> ${data.desiredCoverageType}</p>` : ''}
      `;
    default:
      return '';
  }
}

export async function sendConfirmationEmail(data: EmailData) {
  try {
    console.log('Sending confirmation email');
    await sendConsumerConfirmationEmail({
      to: data.to,
      firstName: data.firstName,
      insuranceType: data.insuranceType
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
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      insuranceType: data.insuranceType,
      age: parseInt(data.age),
      gender: data.gender,
      estimatedAmount: data.estimatedAmount
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