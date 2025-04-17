import { NextResponse } from 'next/server'
import { Resend } from 'resend'

// Initialize Resend with a placeholder key if not available
const resendApiKey = process.env.RESEND_API_KEY || 'placeholder_key';
const resend = new Resend(resendApiKey);

// Function to check if Resend is properly configured
function isResendConfigured(): boolean {
  return !!process.env.RESEND_API_KEY;
}

// Add CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

export async function POST(request: Request) {
  try {
    // Check if Resend is configured
    if (!isResendConfigured()) {
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 503, headers: corsHeaders }
      );
    }

    const body = await request.json()
    const { type, data } = body

    if (type === 'confirmation') {
      const { firstName, email, coverageAmount, termLength } = data
      
      try {
        const { data: emailData, error } = await resend.emails.send({
          from: 'QuoteLinker <support@quotelinker.com>',
          to: email,
          subject: 'Your Life Insurance Quote Request',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #00a0b0;">Thank You, ${firstName}!</h1>
              <p>We've received your life insurance quote request for $${coverageAmount.toLocaleString()} with a ${termLength}-year term.</p>
              <p>One of our licensed agents will contact you shortly to discuss your options and provide you with personalized quotes.</p>
              <p>If you have any questions in the meantime, please don't hesitate to reach out to us at support@quotelinker.com.</p>
              <p>Best regards,<br>The QuoteLinker Team</p>
            </div>
          `,
        })

        if (error) {
          console.error('Error sending confirmation email:', error);
          return NextResponse.json(
            { success: false, error: error.message },
            { status: 500, headers: corsHeaders }
          );
        }

        return NextResponse.json({ success: true, data: emailData }, { headers: corsHeaders })
      } catch (error) {
        console.error('Error sending confirmation email:', error);
        return NextResponse.json(
          { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
          { status: 500, headers: corsHeaders }
        );
      }
    } else if (type === 'lead') {
      const { firstName, lastName, email, phone, age, gender, coverageAmount, termLength, tobaccoUse, utmSource } = data
      
      try {
        const { data: emailData, error } = await resend.emails.send({
          from: 'QuoteLinker <support@quotelinker.com>',
          to: 'newquote@quotelinker.com',
          subject: `New Life Insurance Lead: ${firstName} ${lastName}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #00a0b0;">New Life Insurance Lead</h1>
              <h2>${firstName} ${lastName}</h2>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone}</p>
              <p><strong>Age:</strong> ${age}</p>
              <p><strong>Gender:</strong> ${gender}</p>
              <p><strong>Coverage Amount:</strong> $${coverageAmount.toLocaleString()}</p>
              <p><strong>Term Length:</strong> ${termLength} years</p>
              <p><strong>Tobacco Use:</strong> ${tobaccoUse}</p>
              ${utmSource ? `<p><strong>UTM Source:</strong> ${utmSource}</p>` : ''}
              <p><a href="https://app.supabase.com/project/_/editor/table/leads" style="display: inline-block; background-color: #00a0b0; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">View in Supabase</a></p>
            </div>
          `,
        })

        if (error) {
          console.error('Error sending lead notification email:', error);
          return NextResponse.json(
            { success: false, error: error.message },
            { status: 500, headers: corsHeaders }
          );
        }

        return NextResponse.json({ success: true, data: emailData }, { headers: corsHeaders })
      } catch (error) {
        console.error('Error sending lead notification email:', error);
        return NextResponse.json(
          { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
          { status: 500, headers: corsHeaders }
        );
      }
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid email type' },
        { status: 400, headers: corsHeaders }
      );
    }
  } catch (error) {
    console.error('Error processing email request:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error'
      },
      { status: 500, headers: corsHeaders }
    );
  }
} 