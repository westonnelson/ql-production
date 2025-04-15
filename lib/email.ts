import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('Missing RESEND_API_KEY environment variable');
}

const resend = new Resend(process.env.RESEND_API_KEY);

interface LeadData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  productType: 'life' | 'disability' | 'supplemental';
  coverageAmount?: number;
  termLength?: number;
  tobaccoUse?: boolean;
  occupation?: string;
  employmentStatus?: string;
  incomeRange?: string;
  preExistingConditions?: string;
  desiredCoverageType?: string;
  utmSource?: string;
  abTestVariant?: string;
}

function getProductTitle(productType: string): string {
  switch (productType) {
    case 'life':
      return 'Life Insurance';
    case 'disability':
      return 'Disability Insurance';
    case 'supplemental':
      return 'Supplemental Health Insurance';
    default:
      return 'Insurance';
  }
}

function getProductSpecificFields(data: LeadData): string {
  switch (data.productType) {
    case 'life':
      return `
        <p><strong>Coverage Amount:</strong> $${data.coverageAmount?.toLocaleString()}</p>
        <p><strong>Term Length:</strong> ${data.termLength} years</p>
        <p><strong>Tobacco Use:</strong> ${data.tobaccoUse ? 'Yes' : 'No'}</p>
      `;
    case 'disability':
      return `
        <p><strong>Occupation:</strong> ${data.occupation}</p>
        <p><strong>Employment Status:</strong> ${data.employmentStatus}</p>
        <p><strong>Income Range:</strong> ${data.incomeRange}</p>
      `;
    case 'supplemental':
      return `
        <p><strong>Pre-existing Conditions:</strong> ${data.preExistingConditions}</p>
        <p><strong>Desired Coverage Type:</strong> ${data.desiredCoverageType}</p>
      `;
    default:
      return '';
  }
}

export async function sendConfirmationEmail(data: LeadData) {
  try {
    console.log('Sending confirmation email to:', data.email);
    
    const productTitle = getProductTitle(data.productType);
    
    const { data: emailData, error } = await resend.emails.send({
      from: 'QuoteLinker <support@quotelinker.com>',
      to: data.email,
      subject: 'Thanks for your quote request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #00a0b0;">Thank You, ${data.firstName}!</h1>
          <p>We've received your ${productTitle.toLowerCase()} quote request.</p>
          <p>One of our licensed agents will contact you shortly to discuss your options and provide you with personalized quotes.</p>
          <p>If you have any questions in the meantime, please don't hesitate to reach out to us at support@quotelinker.com.</p>
          <p>Best regards,<br>The QuoteLinker Team</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend API error:', error);
      return { success: false, error };
    }

    console.log('Confirmation email sent successfully');
    return { success: true, data: emailData };
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return { success: false, error };
  }
}

export async function sendLeadNotificationEmail(data: LeadData) {
  try {
    console.log('Sending lead notification email');
    
    const productTitle = getProductTitle(data.productType);
    const productFields = getProductSpecificFields(data);
    
    // Send to both support and the submitting email
    const recipients = ['support@quotelinker.com', data.email];
    
    const { data: emailData, error } = await resend.emails.send({
      from: 'QuoteLinker <support@quotelinker.com>',
      to: recipients,
      subject: `New ${productTitle} Lead: ${data.firstName} ${data.lastName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #00a0b0;">New ${productTitle} Lead</h1>
          <h2>${data.firstName} ${data.lastName}</h2>
          
          <h3>Contact Information</h3>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          
          <h3>Personal Information</h3>
          <p><strong>Age:</strong> ${data.age}</p>
          <p><strong>Gender:</strong> ${data.gender}</p>
          
          <h3>Product Details</h3>
          ${productFields}
          
          ${data.utmSource ? `<h3>Source Information</h3><p><strong>UTM Source:</strong> ${data.utmSource}</p>` : ''}
          ${data.abTestVariant ? `<p><strong>A/B Test Variant:</strong> ${data.abTestVariant}</p>` : ''}
          
          <p><a href="https://app.supabase.com/project/_/editor/table/leads" style="display: inline-block; background-color: #00a0b0; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">View in Supabase</a></p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend API error:', error);
      return { success: false, error };
    }

    console.log('Lead notification email sent successfully');
    return { success: true, data: emailData };
  } catch (error) {
    console.error('Error sending lead notification email:', error);
    return { success: false, error };
  }
} 