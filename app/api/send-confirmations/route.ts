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
    const {
      firstName,
      lastName,
      email,
      phone,
      insuranceType,
      leadId,
      // Insurance-specific fields
      coverageAmount,
      termLength,
      tobaccoUse,
      occupation,
      employmentStatus,
      incomeRange,
      vehicleYear,
      vehicleMake,
      vehicleModel,
      healthStatus,
      preExistingConditions,
    } = body

    // Send confirmation email to customer
    const customerEmailResponse = await resend.emails.send({
      from: 'quotes@yourdomain.com',
      to: email,
      subject: `Thank you for your ${insuranceType} insurance quote request`,
      html: `
        <h1>Thank you for your quote request!</h1>
        <p>Dear ${firstName},</p>
        <p>We've received your request for a ${insuranceType} insurance quote. Our team will review your information and contact you shortly.</p>
        <h2>Your Quote Details:</h2>
        <ul>
          <li>Insurance Type: ${insuranceType}</li>
          ${coverageAmount ? `<li>Coverage Amount: $${coverageAmount.toLocaleString()}</li>` : ''}
          ${termLength ? `<li>Term Length: ${termLength} years</li>` : ''}
          ${tobaccoUse !== undefined ? `<li>Tobacco Use: ${tobaccoUse ? 'Yes' : 'No'}</li>` : ''}
          ${occupation ? `<li>Occupation: ${occupation}</li>` : ''}
          ${employmentStatus ? `<li>Employment Status: ${employmentStatus}</li>` : ''}
          ${incomeRange ? `<li>Income Range: ${incomeRange}</li>` : ''}
          ${vehicleYear ? `<li>Vehicle Year: ${vehicleYear}</li>` : ''}
          ${vehicleMake ? `<li>Vehicle Make: ${vehicleMake}</li>` : ''}
          ${vehicleModel ? `<li>Vehicle Model: ${vehicleModel}</li>` : ''}
          ${healthStatus ? `<li>Health Status: ${healthStatus}</li>` : ''}
          ${preExistingConditions !== undefined ? `<li>Pre-existing Conditions: ${preExistingConditions ? 'Yes' : 'No'}</li>` : ''}
        </ul>
        <p>If you have any questions, please don't hesitate to contact us.</p>
        <p>Best regards,<br>Your Insurance Team</p>
      `,
    })

    // Send notification email to sales team
    const salesEmailResponse = await resend.emails.send({
      from: 'quotes@yourdomain.com',
      to: 'sales@yourdomain.com',
      subject: `New ${insuranceType} Insurance Quote Request - ${firstName} ${lastName}`,
      html: `
        <h1>New Quote Request</h1>
        <p>A new quote request has been submitted:</p>
        <h2>Customer Information:</h2>
        <ul>
          <li>Name: ${firstName} ${lastName}</li>
          <li>Email: ${email}</li>
          <li>Phone: ${phone}</li>
          <li>Insurance Type: ${insuranceType}</li>
          <li>Lead ID: ${leadId}</li>
          ${coverageAmount ? `<li>Coverage Amount: $${coverageAmount.toLocaleString()}</li>` : ''}
          ${termLength ? `<li>Term Length: ${termLength} years</li>` : ''}
          ${tobaccoUse !== undefined ? `<li>Tobacco Use: ${tobaccoUse ? 'Yes' : 'No'}</li>` : ''}
          ${occupation ? `<li>Occupation: ${occupation}</li>` : ''}
          ${employmentStatus ? `<li>Employment Status: ${employmentStatus}</li>` : ''}
          ${incomeRange ? `<li>Income Range: ${incomeRange}</li>` : ''}
          ${vehicleYear ? `<li>Vehicle Year: ${vehicleYear}</li>` : ''}
          ${vehicleMake ? `<li>Vehicle Make: ${vehicleMake}</li>` : ''}
          ${vehicleModel ? `<li>Vehicle Model: ${vehicleModel}</li>` : ''}
          ${healthStatus ? `<li>Health Status: ${healthStatus}</li>` : ''}
          ${preExistingConditions !== undefined ? `<li>Pre-existing Conditions: ${preExistingConditions ? 'Yes' : 'No'}</li>` : ''}
        </ul>
        <p>Please follow up with the customer as soon as possible.</p>
      `,
    })

    if (!customerEmailResponse.id || !salesEmailResponse.id) {
      throw new Error('Failed to send one or more emails')
    }

    return NextResponse.json(
      { success: true, message: 'Confirmation emails sent successfully' },
      { headers: corsHeaders }
    )
  } catch (error) {
    console.error('Error sending confirmation emails:', error)
    return NextResponse.json(
      {
        error: 'Failed to send confirmation emails',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500, headers: corsHeaders }
    )
  }
} 