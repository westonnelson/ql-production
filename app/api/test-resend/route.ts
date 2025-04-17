import { NextResponse } from 'next/server'
import { Resend } from 'resend'

// Initialize Resend with a placeholder key if not available
const resendApiKey = process.env.RESEND_API_KEY || 'placeholder_key'
const resend = new Resend(resendApiKey)

// Function to check if Resend is properly configured
function isResendConfigured(): boolean {
  return !!process.env.RESEND_API_KEY
}

export async function GET() {
  try {
    // Check if Resend is configured
    if (!isResendConfigured()) {
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 503 }
      )
    }

    try {
      const { data, error } = await resend.emails.send({
        from: 'QuoteLinker <onboarding@resend.dev>',
        to: ['delivered@resend.dev'],
        subject: 'Test Email',
        html: '<p>This is a test email from QuoteLinker</p>'
      })

      if (error) {
        console.error('Resend error:', error)
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 }
        )
      }

      return NextResponse.json({ success: true, data })
    } catch (error) {
      console.error('Error sending test email:', error)
      return NextResponse.json(
        { 
          success: false, 
          error: error instanceof Error ? error.message : 'Failed to send test email'
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error processing test email request:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error'
      },
      { status: 500 }
    )
  }
} 