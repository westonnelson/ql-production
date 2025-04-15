import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('Missing RESEND_API_KEY environment variable');
}

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

function getProductTitle(productType: LeadData['product_type']): string {
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
    
    const productTitle = getProductTitle(data.product_type);
    const productFields = getProductSpecificFields(data);
    
    const { data: emailData, error } = await resend.emails.send({
      from: 'QuoteLinker <support@quotelinker.com>',
      to: data.email,
      subject: `Your ${productTitle} Quote Request`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #00a0b0;">Thank You for Your Quote Request</h1>
          <p>Hi ${data.first_name},</p>
          
          <p>We've received your request for a ${productTitle.toLowerCase()} quote. Our team will review your information and get back to you shortly.</p>
          
          <h3>Your Information</h3>
          <p><strong>Name:</strong> ${data.first_name} ${data.last_name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          
          <h3>Quote Details</h3>
          ${productFields}
          
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
    
    const productTitle = getProductTitle(data.product_type);
    const productFields = getProductSpecificFields(data);
    
    // Send to both support and the submitting email
    const recipients = ['support@quotelinker.com', data.email];
    
    const { data: emailData, error } = await resend.emails.send({
      from: 'QuoteLinker <support@quotelinker.com>',
      to: recipients,
      subject: `New ${productTitle} Lead: ${data.first_name} ${data.last_name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #00a0b0;">New ${productTitle} Lead</h1>
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