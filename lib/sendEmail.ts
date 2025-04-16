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
}

/**
 * Sends a confirmation email to the consumer who requested a quote.
 */
export async function sendConsumerConfirmationEmail(userEmail: string, insuranceType: string): Promise<void> {
  try {
    await resendClient.emails.send({
      from: 'QuoteLinker <support@quotelinker.com>',
      to: userEmail,
      subject: `Your ${insuranceType} Quote Request Received`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #00a0b0;">Thank You for Your Quote Request</h1>
          <p>We've received your request for a ${insuranceType.toLowerCase()} quote. Our team will review your information and get back to you shortly.</p>
          
          <p>If you have any questions in the meantime, please don't hesitate to reach out to us at support@quotelinker.com.</p>
          
          <p>Best regards,<br>The QuoteLinker Team</p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Error sending consumer confirmation email:', error);
    throw error;
  }
}

/**
 * Sends a notification email to the agent when a new quote is submitted.
 * The agent notification is sent to newquote@quotelinker.com.
 */
export async function sendAgentNotificationEmail(insuranceType: string, data: EmailData): Promise<void> {
  try {
    const productFields = getProductSpecificFields(data);
    
    await resendClient.emails.send({
      from: 'QuoteLinker <support@quotelinker.com>',
      to: 'newquote@quotelinker.com',
      subject: `New ${insuranceType} Quote Inquiry: ${data.first_name} ${data.last_name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #00a0b0;">New ${insuranceType} Lead</h1>
          <h2>${data.first_name} ${data.last_name}</h2>
          
          <h3>Contact Information</h3>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          
          <h3>Personal Information</h3>
          <p><strong>Age:</strong> ${data.age}</p>
          <p><strong>Gender:</strong> ${data.gender}</p>
          
          <h3>Product Details</h3>
          ${productFields}
          
          ${data.utm_source ? `<h3>Source Information</h3><p><strong>UTM Source:</strong> ${data.utm_source}</p>` : ''}
          ${data.ab_test_variant ? `<p><strong>A/B Test Variant:</strong> ${data.ab_test_variant}</p>` : ''}
          
          <p><a href="https://app.supabase.com/project/_/editor/table/leads" style="display: inline-block; background-color: #00a0b0; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">View in Supabase</a></p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Error sending agent notification email:', error);
    throw error;
  }
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