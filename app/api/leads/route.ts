import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'zipCode', 'coverageAmount', 'healthStatus', 'smoker', 'age', 'gender']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Insert into Supabase
    const { error: supabaseError } = await supabase
      .from('leads')
      .insert([{
        ...body,
        created_at: new Date().toISOString(),
        source: 'website',
        status: 'new'
      }])

    if (supabaseError) {
      console.error('Supabase error:', supabaseError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // Send email notification
    const emailResponse = await fetch('https://quotelinker.com/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'lead',
        data: body,
      }),
    })

    if (!emailResponse.ok) {
      console.error('Email notification failed')
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Lead submitted successfully',
      data: body
    })
  } catch (error) {
    console.error('Error processing lead:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 