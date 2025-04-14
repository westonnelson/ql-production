import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

// Add CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

export async function POST(request: Request) {
  try {
    // Add CORS headers to all responses
    const headers = { ...corsHeaders }
    
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'age', 'gender', 'coverageAmount', 'termLength', 'tobaccoUse']
    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null || body[field] === '') {
        return NextResponse.json(
          { error: `Missing required field: ${field}` }, 
          { 
            status: 400,
            headers
          }
        )
      }
    }

    // Transform the data to match database schema
    const leadData = {
      first_name: body.firstName,
      last_name: body.lastName,
      email: body.email,
      phone: body.phone,
      age: Number(body.age),
      gender: body.gender,
      coverage_amount: Number(body.coverageAmount),
      term_length: Number(body.termLength),
      tobacco_use: body.tobaccoUse,
      utm_source: body.utmSource || null,
      created_at: new Date().toISOString()
    }

    // Insert into Supabase
    const { error: supabaseError } = await supabase
      .from('leads')
      .insert([leadData])

    if (supabaseError) {
      console.error('Supabase error:', supabaseError)
      return NextResponse.json(
        { error: supabaseError.message || 'Database error' }, 
        { 
          status: 500,
          headers
        }
      )
    }

    // Send email notification
    const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/send-email`, {
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

    return NextResponse.json(
      { 
        success: true, 
        message: 'Lead submitted successfully',
        data: leadData
      },
      { headers }
    )
  } catch (error) {
    console.error('Error processing lead:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { 
        status: 500,
        headers: corsHeaders
      }
    )
  }
} 