import { resendClient, isResendConfigured } from './resend';

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
export async function sendConsumerConfirmationEmail(userEmail: string, data: EmailData): Promise<void> {
  if (!isResendConfigured()) {
    console.warn('Resend is not configured - skipping consumer confirmation email');
    return;
  }

  try {
    const productTitle = getProductTitle(data.product_type);
    const specificFields = getProductSpecificFields(data);
    
    await resendClient.emails.send({
      from: 'QuoteLinker <support@quotelinker.com>',
      to: userEmail,
      subject: `Your ${productTitle} Quote Request Received`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #00a0b0;">Thank You for Your Quote Request!</h1>
          <p>Dear ${data.first_name},</p>
          <p>We've received your request for a ${productTitle} insurance quote. Our team will review your information and contact you shortly.</p>
          <h2>Your Quote Details:</h2>
          <ul>
            <li>Insurance Type: ${productTitle}</li>
            ${specificFields}
          </ul>
          <p>If you have any questions, please don't hesitate to contact us at support@quotelinker.com.</p>
          <p>Best regards,<br>The QuoteLinker Team</p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Failed to send consumer confirmation email:', error);
    // Don't throw the error to prevent breaking the form submission flow
  }
}

/**
 * Sends a notification email to the agent when a new quote is submitted.
 * The agent notification is sent to newquote@quotelinker.com.
 */
export async function sendAgentNotificationEmail(data: EmailData): Promise<void> {
  if (!isResendConfigured()) {
    console.warn('Resend is not configured - skipping agent notification email');
    return;
  }

  try {
    const productTitle = getProductTitle(data.product_type);
    const specificFields = getProductSpecificFields(data);
    
    await resendClient.emails.send({
      from: 'QuoteLinker <support@quotelinker.com>',
      to: 'newquote@quotelinker.com',
      subject: `New ${productTitle} Quote Inquiry - ${data.first_name} ${data.last_name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #00a0b0;">New ${productTitle} Quote Request</h1>
          <h2>Customer Information:</h2>
          <ul>
            <li>Name: ${data.first_name} ${data.last_name}</li>
            <li>Email: ${data.email}</li>
            <li>Phone: ${data.phone}</li>
            <li>Age: ${data.age}</li>
            <li>Gender: ${data.gender}</li>
            ${specificFields}
            ${data.utm_source ? `<li>Source: ${data.utm_source}</li>` : ''}
          </ul>
          <p><a href="https://app.supabase.com/project/_/editor/table/leads" style="display: inline-block; background-color: #00a0b0; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">View in Supabase</a></p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Failed to send agent notification email:', error);
    // Don't throw the error to prevent breaking the form submission flow
  }
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

function getProductSpecificFields(data: EmailData): string {
  switch (data.product_type) {
    case 'life':
      return `
        ${data.coverage_amount ? `<li>Coverage Amount: $${data.coverage_amount.toLocaleString()}</li>` : ''}
        ${data.term_length ? `<li>Term Length: ${data.term_length} years</li>` : ''}
        ${data.tobacco_use !== undefined ? `<li>Tobacco Use: ${data.tobacco_use ? 'Yes' : 'No'}</li>` : ''}
      `;
    case 'disability':
      return `
        ${data.occupation ? `<li>Occupation: ${data.occupation}</li>` : ''}
        ${data.employment_status ? `<li>Employment Status: ${data.employment_status}</li>` : ''}
        ${data.income_range ? `<li>Income Range: ${data.income_range}</li>` : ''}
      `;
    case 'supplemental':
      return `
        ${data.pre_existing_conditions ? `<li>Pre-existing Conditions: ${data.pre_existing_conditions}</li>` : ''}
        ${data.desired_coverage_type ? `<li>Desired Coverage Type: ${data.desired_coverage_type}</li>` : ''}
      `;
    default:
      return '';
  }
} 