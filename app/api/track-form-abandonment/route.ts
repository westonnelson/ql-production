import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const {
      formId,
      insuranceType,
      timeSpent,
      step,
      totalSteps,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content,
    } = await request.json();

    const { error } = await supabase.from('form_analytics').insert({
      form_id: formId,
      insurance_type: insuranceType,
      time_spent: timeSpent,
      step,
      total_steps: totalSteps,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content,
      event_type: 'abandonment',
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking form abandonment:', error);
    return NextResponse.json(
      { error: 'Failed to track form abandonment' },
      { status: 500 }
    );
  }
} 