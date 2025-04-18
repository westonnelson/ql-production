import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // Get form submissions for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: formSubmissions, error: submissionsError } = await supabase
      .from('form_analytics')
      .select('*')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .eq('event_type', 'submission');

    if (submissionsError) throw submissionsError;

    // Get total page views for the last 30 days
    const { data: pageViews, error: viewsError } = await supabase
      .from('page_views')
      .select('*')
      .gte('created_at', thirtyDaysAgo.toISOString());

    if (viewsError) throw viewsError;

    // Calculate metrics
    const totalSubmissions = formSubmissions.length;
    const totalViews = pageViews.length;
    const conversionRate = totalViews > 0 ? (totalSubmissions / totalViews) * 100 : 0;

    // Calculate average time on site (in seconds)
    const totalTimeOnSite = pageViews.reduce((acc, view) => acc + (view.time_spent || 0), 0);
    const averageTimeOnSite = totalViews > 0 ? Math.round(totalTimeOnSite / totalViews) : 0;

    // Calculate bounce rate (single page views)
    const singlePageViews = pageViews.filter(view => view.page_count === 1).length;
    const bounceRate = totalViews > 0 ? (singlePageViews / totalViews) * 100 : 0;

    return NextResponse.json({
      formSubmissions: totalSubmissions,
      conversionRate: Math.round(conversionRate * 100) / 100,
      averageTimeOnSite,
      bounceRate: Math.round(bounceRate * 100) / 100,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
} 