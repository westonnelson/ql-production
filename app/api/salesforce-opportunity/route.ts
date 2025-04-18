import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      insuranceType,
      utmSource,
      utmMedium,
      utmCampaign,
    } = body;

    // Create opportunity in Salesforce
    const response = await fetch(`${process.env.SALESFORCE_INSTANCE_URL}/services/data/v57.0/sobjects/Opportunity`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SALESFORCE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Name: `${firstName} ${lastName} - ${insuranceType} Quote`,
        StageName: 'New',
        CloseDate: new Date().toISOString().split('T')[0],
        Type: 'New Business',
        Description: `Quote request for ${insuranceType} insurance\nUTM Source: ${utmSource}\nUTM Medium: ${utmMedium}\nUTM Campaign: ${utmCampaign}`,
        LeadSource: 'Website',
        Contact_Email__c: email,
        Contact_Phone__c: phone,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create Salesforce opportunity');
    }

    const opportunity = await response.json();

    // Store the Salesforce opportunity ID in Supabase
    const { error: supabaseError } = await supabase
      .from('quotes')
      .insert({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        insurance_type: insuranceType,
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
        salesforce_opportunity_id: opportunity.id,
        status: 'new',
      });

    if (supabaseError) {
      throw supabaseError;
    }

    return NextResponse.json({ success: true, opportunityId: opportunity.id });
  } catch (error) {
    console.error('Error creating Salesforce opportunity:', error);
    return NextResponse.json(
      { error: 'Failed to create opportunity' },
      { status: 500 }
    );
  }
} 