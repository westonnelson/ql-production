import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

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
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'age', 'gender', 'coverageAmount', 'termLength', 'tobaccoUse']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` }, 
          { 
            status: 400,
            headers: corsHeaders
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
      age: body.age,
      gender: body.gender,
      coverage_amount: body.coverageAmount,
      term_length: body.termLength,
      tobacco_use: body.tobaccoUse,
      utm_source: body.utmSource,
      created_at: new Date().toISOString(),
      source: 'website',
      status: 'new'
    }

    // Insert into Supabase
    const { error: supabaseError } = await supabase
      .from('leads')
      .insert([leadData])

    if (supabaseError) {
      console.error('Supabase error:', supabaseError)
      return NextResponse.json(
        { error: 'Database error' }, 
        { 
          status: 500,
          headers: corsHeaders
        }
      )
    }

    // Send email notification
    const emailResponse = await fetch('/api/send-email', {
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
        data: body
      },
      { headers: corsHeaders }
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