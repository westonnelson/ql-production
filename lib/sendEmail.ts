import { resendClient } from './resend';

interface EmailData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  product_type: string;
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
  funnel_name?: string;
  funnel_step?: string;
  funnel_variant?: string;
  ab_test_id?: string;
}

/**
 * Sends a confirmation email to the consumer who requested a quote.
 */
export async function sendConsumerConfirmationEmail(userEmail: string, insuranceType: string): Promise<void> {
  await resendClient.emails.send({
    from: 'support@quotelinker.com',
    to: userEmail,
    subject: `Your ${insuranceType} Quote Request Received`,
    html: `<p>Thank you for requesting an insurance quote for ${insuranceType}. Our team will be in touch shortly!</p>`,
  });
}

/**
 * Sends a notification email to the agent when a new quote is submitted.
 * The agent notification is sent to newquote@quotelinker.com.
 */
export async function sendAgentNotificationEmail(insuranceType: string, submissionData: any): Promise<void> {
  await resendClient.emails.send({
    from: 'support@quotelinker.com',
    to: 'newquote@quotelinker.com',
    subject: `New ${insuranceType} Quote Inquiry`,
    html: `<p>A new ${insuranceType} quote inquiry was submitted. Details are as follows:</p>
           <pre>${JSON.stringify(submissionData, null, 2)}</pre>`,
  });
}

function getProductSpecificFields(data: EmailData): string {
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