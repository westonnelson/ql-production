import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const { error } = await supabase
      .from('form_analytics')
      .insert({
        ...data,
        event_type: 'submission',
        timestamp: new Date().toISOString(),
      });

    if (error) {
      console.error('Error tracking form submission:', error);
      return NextResponse.json({ error: 'Failed to track form submission' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in form submission tracking:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 