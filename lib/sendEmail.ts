import { resendClient } from './resend';

interface EmailData {
  userEmail: string;
  insuranceType: string;
  firstName: string;
  lastName: string;
  funnelName?: string;
  funnelStep?: string;
  utmParams?: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  };
}

/**
 * Sends two emails:
 * 1. A notification email to support@quotelinker.com
 * 2. A confirmation email to the consumer that submitted the quote request,
 *    dynamically referencing the submitted insurance type.
 */
export async function sendNotificationEmails(data: EmailData): Promise<void> {
  const { userEmail, insuranceType, firstName, lastName, funnelName, funnelStep, utmParams } = data;
  
  // Email to support (notification)
  await resendClient.emails.send({
    from: 'no-reply@quotelinker.com',
    to: ['support@quotelinker.com'],
    subject: `New ${insuranceType} Quote Request`,
    html: `
      <h2>New Quote Request Received</h2>
      <p>A new quote request for <strong>${insuranceType}</strong> insurance was received.</p>
      <h3>Consumer Information:</h3>
      <ul>
        <li><strong>Name:</strong> ${firstName} ${lastName}</li>
        <li><strong>Email:</strong> ${userEmail}</li>
        <li><strong>Insurance Type:</strong> ${insuranceType}</li>
        ${funnelName ? `<li><strong>Funnel:</strong> ${funnelName}</li>` : ''}
        ${funnelStep ? `<li><strong>Funnel Step:</strong> ${funnelStep}</li>` : ''}
      </ul>
      ${utmParams ? `
      <h3>UTM Parameters:</h3>
      <ul>
        ${utmParams.source ? `<li><strong>Source:</strong> ${utmParams.source}</li>` : ''}
        ${utmParams.medium ? `<li><strong>Medium:</strong> ${utmParams.medium}</li>` : ''}
        ${utmParams.campaign ? `<li><strong>Campaign:</strong> ${utmParams.campaign}</li>` : ''}
        ${utmParams.term ? `<li><strong>Term:</strong> ${utmParams.term}</li>` : ''}
        ${utmParams.content ? `<li><strong>Content:</strong> ${utmParams.content}</li>` : ''}
      </ul>
      ` : ''}
    `,
  });
  
  // Email to consumer (confirmation)
  await resendClient.emails.send({
    from: 'no-reply@quotelinker.com',
    to: [userEmail],
    subject: `Your ${insuranceType} Insurance Quote Request`,
    html: `
      <h2>Thank You for Your Quote Request</h2>
      <p>Dear ${firstName},</p>
      <p>Thank you for requesting a quote for <strong>${insuranceType}</strong> insurance. We have received your information and will be in touch shortly with your personalized quote.</p>
      <p>If you have any questions in the meantime, please don't hesitate to contact our support team.</p>
      <p>Best regards,<br>The QuoteLinker Team</p>
    `,
  });
} 