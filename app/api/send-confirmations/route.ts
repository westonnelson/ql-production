import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'

if (!process.env.RESEND_API_KEY) {
  throw new Error('Missing RESEND_API_KEY environment variable')
}

const resend = new Resend(process.env.RESEND_API_KEY)

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// Validation schema for form data
const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  age: z.number().int().min(18).max(100),
  gender: z.enum(['male', 'female', 'other']),
  coverageAmount: z.number().int().optional(),
  termLength: z.number().int().optional(),
  tobaccoUse: z.boolean().optional(),
  utmSource: z.string().optional(),
})

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate the request body
    const validatedData = formSchema.parse(body)

    // Determine if we're in test mode (using Resend's test domain)
    const isTestMode = process.env.NODE_ENV !== 'production'
    const fromEmail = isTestMode ? 'onboarding@resend.dev' : 'support@quotelinker.com'
    const toCustomerEmail = isTestMode ? 'delivered@resend.dev' : validatedData.email
    const toSupportEmail = isTestMode ? 'delivered@resend.dev' : 'support@quotelinker.com'

    // Send confirmation email to customer
    const { data: customerEmailData, error: customerEmailError } = await resend.emails.send({
      from: `QuoteLinker <${fromEmail}>`,
      to: [toCustomerEmail],
      subject: "We've received your quote request!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #00a0b0;">Hi ${validatedData.firstName},</h1>
          <p>Thanks for requesting a quote through QuoteLinker. We'll follow up shortly.</p>
          <p>—QuoteLinker</p>
        </div>
      `,
    })

    if (customerEmailError) {
      console.error('Error sending customer confirmation email:', customerEmailError)
      return NextResponse.json(
        { error: 'Failed to send confirmation email', details: customerEmailError },
        { status: 500, headers: corsHeaders }
      )
    }

    // Send notification email to support
    const { data: supportEmailData, error: supportEmailError } = await resend.emails.send({
      from: `QuoteLinker <${fromEmail}>`,
      to: [toSupportEmail],
      subject: `New Quote Request: ${validatedData.firstName} ${validatedData.lastName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #00a0b0;">New Quote Request</h1>
          <h2>${validatedData.firstName} ${validatedData.lastName}</h2>
          <p><strong>Email:</strong> ${validatedData.email}</p>
          <p><strong>Phone:</strong> ${validatedData.phone}</p>
          <p><strong>Age:</strong> ${validatedData.age}</p>
          <p><strong>Gender:</strong> ${validatedData.gender}</p>
          ${validatedData.coverageAmount ? `<p><strong>Coverage Amount:</strong> $${validatedData.coverageAmount.toLocaleString()}</p>` : ''}
          ${validatedData.termLength ? `<p><strong>Term Length:</strong> ${validatedData.termLength} years</p>` : ''}
          ${validatedData.tobaccoUse !== undefined ? `<p><strong>Tobacco Use:</strong> ${validatedData.tobaccoUse ? 'Yes' : 'No'}</p>` : ''}
          ${validatedData.utmSource ? `<p><strong>UTM Source:</strong> ${validatedData.utmSource}</p>` : ''}
        </div>
      `,
    })

    if (supportEmailError) {
      console.error('Error sending support notification email:', supportEmailError)
      // We still return success if customer email was sent but support notification failed
      return NextResponse.json(
        { 
          success: true, 
          warning: 'Customer notification sent but support notification failed',
          data: { customerEmail: customerEmailData }
        }, 
        { headers: corsHeaders }
      )
    }

    return NextResponse.json(
      { 
        success: true, 
        data: {
          customerEmail: customerEmailData,
          supportEmail: supportEmailData
        }
      }, 
      { headers: corsHeaders }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400, headers: corsHeaders }
      )
    }
    
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    )
  }
} 