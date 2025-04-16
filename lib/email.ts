import { resendClient } from './resend';
import { sendConsumerConfirmationEmail, sendAgentNotificationEmail } from './sendEmail';

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
    await sendConsumerConfirmationEmail(data.email, data);
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
    await sendAgentNotificationEmail(data);
    console.log('Lead notification email sent successfully');
    return { success: true };
  } catch (error) {
    console.error('Error sending lead notification email:', error);
    return { success: false, error };
  }
} 