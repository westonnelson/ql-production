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
export async function sendNotificationEmails({
  userEmail,
  insuranceType,
  firstName,
  lastName,
  funnelName,
  funnelStep,
  utmParams,
}: EmailData) {
  try {
    // Send notification email to support team
    const supportEmail = await resendClient.emails.send({
      from: 'support@quotelinker.com',
      to: ['support@quotelinker.com'],
      subject: `New ${insuranceType} Quote Request`,
      html: `
        <h1>New Quote Request</h1>
        <p>A new quote request has been submitted for ${insuranceType} insurance.</p>
        <h2>Consumer Information:</h2>
        <ul>
          <li>Name: ${firstName} ${lastName}</li>
          <li>Email: ${userEmail}</li>
          <li>Insurance Type: ${insuranceType}</li>
          ${funnelName ? `<li>Funnel: ${funnelName}</li>` : ''}
          ${funnelStep ? `<li>Step: ${funnelStep}</li>` : ''}
          ${utmParams?.source ? `<li>UTM Source: ${utmParams.source}</li>` : ''}
          ${utmParams?.medium ? `<li>UTM Medium: ${utmParams.medium}</li>` : ''}
          ${utmParams?.campaign ? `<li>UTM Campaign: ${utmParams.campaign}</li>` : ''}
          ${utmParams?.term ? `<li>UTM Term: ${utmParams.term}</li>` : ''}
          ${utmParams?.content ? `<li>UTM Content: ${utmParams.content}</li>` : ''}
        </ul>
      `,
    });

    // Send confirmation email to consumer
    const consumerEmail = await resendClient.emails.send({
      from: 'support@quotelinker.com',
      to: [userEmail],
      subject: `Your ${insuranceType} Insurance Quote Request`,
      html: `
        <h1>Thank You for Your Quote Request</h1>
        <p>Dear ${firstName},</p>
        <p>We have received your request for a ${insuranceType} insurance quote. Our team will review your information and contact you shortly.</p>
        <p>If you have any questions in the meantime, please don't hesitate to contact us.</p>
        <p>Best regards,<br>The QuoteLinker Team</p>
      `,
    });

    return {
      success: true,
      supportEmailId: supportEmail.data?.id,
      consumerEmailId: consumerEmail.data?.id,
    };
  } catch (error) {
    console.error('Error sending notification emails:', error);
    throw error;
  }
} 