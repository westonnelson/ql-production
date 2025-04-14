import { NextResponse } from 'next/server'

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

    // Here you would typically save the lead to your database
    // For now, we'll just return a success response
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