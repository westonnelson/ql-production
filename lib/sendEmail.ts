import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailData {
  to: string;
  firstName: string;
  insuranceType: string;
}

interface AgentEmailData {
  to: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  insuranceType: string;
  estimatedAmount?: string;
}

export const sendConsumerConfirmationEmail = async (data: EmailData) => {
  try {
    const { to, firstName, insuranceType } = data;
    
    await resend.emails.send({
      from: 'QuoteLinker <noreply@quotelinker.com>',
      to,
      subject: `Thank you for your ${insuranceType} insurance quote request`,
      html: `
        <h1>Thank you for your quote request, ${firstName}!</h1>
        <p>We've received your request for ${insuranceType} insurance and one of our licensed agents will contact you shortly.</p>
        <p>In the meantime, if you have any questions, please don't hesitate to contact us.</p>
        <p>Best regards,<br>The QuoteLinker Team</p>
      `
    });

    return true;
  } catch (error) {
    console.error('Error sending consumer confirmation email:', error);
    return false;
  }
};

export const sendAgentNotificationEmail = async (data: AgentEmailData) => {
  try {
    const { firstName, lastName, email, phone, insuranceType, estimatedAmount } = data;
    
    await resend.emails.send({
      from: 'QuoteLinker <noreply@quotelinker.com>',
      to: process.env.NEW_LEAD_EMAIL || 'leads@quotelinker.com',
      subject: `New ${insuranceType} Insurance Lead: ${firstName} ${lastName}`,
      html: `
        <h1>New Lead Details</h1>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Insurance Type:</strong> ${insuranceType}</p>
        ${estimatedAmount ? `<p><strong>Estimated Amount:</strong> $${estimatedAmount}</p>` : ''}
        <p>Please follow up with this lead as soon as possible.</p>
      `
    });

    return true;
  } catch (error) {
    console.error('Error sending agent notification email:', error);
    return false;
  }
};

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
  switch (data.insuranceType) {
    case 'life':
      return `
        ${data.coverageAmount ? `<li>Coverage Amount: $${data.coverageAmount.toLocaleString()}</li>` : ''}
        ${data.termLength ? `<li>Term Length: ${data.termLength} years</li>` : ''}
        ${data.tobaccoUse !== undefined ? `<li>Tobacco Use: ${data.tobaccoUse ? 'Yes' : 'No'}</li>` : ''}
      `;
    case 'disability':
      return `
        ${data.occupation ? `<li>Occupation: ${data.occupation}</li>` : ''}
        ${data.employmentStatus ? `<li>Employment Status: ${data.employmentStatus}</li>` : ''}
        ${data.incomeRange ? `<li>Income Range: ${data.incomeRange}</li>` : ''}
      `;
    case 'supplemental':
      return `
        ${data.preExistingConditions ? `<li>Pre-existing Conditions: ${data.preExistingConditions}</li>` : ''}
        ${data.desiredCoverageType ? `<li>Desired Coverage Type: ${data.desiredCoverageType}</li>` : ''}
      `;
    default:
      return '';
  }
} 