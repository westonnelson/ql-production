import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

async function checkDatabase() {
  try {
    const { data, error } = await supabase.from('health_check').select('count').single();
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}

async function checkEmail() {
  try {
    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error('Resend API key not configured');
      return false;
    }
    
    // Simple check to verify Resend is working
    const response = await fetch('https://api.resend.com/emails', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      }
    });
    
    return response.ok;
  } catch (error) {
    console.error('Email service health check failed:', error);
    return false;
  }
}

async function checkSalesforce() {
  try {
    // Check if Salesforce credentials are configured
    if (!process.env.SALESFORCE_USERNAME || !process.env.SALESFORCE_PASSWORD) {
      console.error('Salesforce credentials not configured');
      return false;
    }
    
    // Simple check to verify Salesforce connection
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/salesforce-health-check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
      }
    });
    
    return response.ok;
  } catch (error) {
    console.error('Salesforce health check failed:', error);
    return false;
  }
}

export async function GET() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing Supabase credentials');
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    // Test the connection by making a simple query
    const { data, error } = await supabase.from('health_check').select('*').limit(1);
    
    if (error) {
      throw error;
    }

    return NextResponse.json({ status: 'healthy', timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      { status: 'unhealthy', error: 'Database connection failed' },
      { status: 500 }
    );
  }
} 