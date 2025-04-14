import { NextResponse } from 'next/server'
import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
  throw new Error('Missing RESEND_API_KEY environment variable')
}

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, data } = body

    if (type === 'confirmation') {
      const { firstName, email, coverageAmount, termLength } = data
      
      const { data: emailData, error } = await resend.emails.send({
        from: 'QuoteLinker <quotes@quotelinker.com>',
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
        return NextResponse.json({ success: false, error }, { status: 500 })
      }

      return NextResponse.json({ success: true, data: emailData })
    } else if (type === 'lead') {
      const { firstName, lastName, email, phone, age, gender, coverageAmount, termLength, tobaccoUse, utmSource } = data
      
      const { data: emailData, error } = await resend.emails.send({
        from: 'QuoteLinker <leads@quotelinker.com>',
        to: 'support@quotelinker.com',
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
        return NextResponse.json({ success: false, error }, { status: 500 })
      }

      return NextResponse.json({ success: true, data: emailData })
    } else {
      return NextResponse.json({ success: false, error: 'Invalid email type' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
} 