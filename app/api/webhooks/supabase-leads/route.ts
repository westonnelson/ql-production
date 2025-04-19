import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import jsforce from 'jsforce';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Initialize Salesforce connection
const sf = new jsforce.Connection({
  loginUrl: process.env.SF_LOGIN_URL || 'https://login.salesforce.com'
});

// Maximum number of retries for Salesforce API calls
const MAX_RETRIES = 3;
// Delay between retries in milliseconds
const RETRY_DELAY = 1000;

// Function to authenticate with Salesforce
async function authenticateSalesforce() {
  try {
    await sf.login(
      process.env.SF_USERNAME!,
      process.env.SF_PASSWORD! + process.env.SF_SECURITY_TOKEN!
    );
    console.log('Successfully authenticated with Salesforce');
    return true;
  } catch (error) {
    console.error('Failed to authenticate with Salesforce:', error);
    return false;
  }
}

// Function to create a Salesforce Opportunity with retry logic
async function createSalesforceOpportunity(leadData: any, retryCount = 0): Promise<any> {
  try {
    // Ensure we're authenticated
    if (!sf.accessToken) {
      const authSuccess = await authenticateSalesforce();
      if (!authSuccess) {
        throw new Error('Failed to authenticate with Salesforce');
      }
    }

    // Map lead data to Salesforce Opportunity fields
    const opportunityData = {
      Name: `New Lead - ${leadData.first_name} ${leadData.last_name}`,
      StageName: 'Prospecting',
      CloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      Type: 'New Business',
      Description: `Lead from QuoteLinker\nProduct Type: ${leadData.product_type || 'Unknown'}\nUTM Source: ${leadData.utm_source || 'N/A'}\nUTM Medium: ${leadData.utm_medium || 'N/A'}\nUTM Campaign: ${leadData.utm_campaign || 'N/A'}`,
      LeadSource: 'Website',
      Contact_Email__c: leadData.email,
      Contact_Phone__c: leadData.phone,
      Contact_ZipCode__c: leadData.zip_code,
      Product_Type__c: leadData.product_type
    };

    // Create the Opportunity in Salesforce
    const result = await sf.sobject('Opportunity').create(opportunityData);
    
    if (!result.success) {
      throw new Error(`Failed to create opportunity: ${result.errors[0].message}`);
    }
    
    console.log('Successfully created Salesforce Opportunity:', result.id);
    return result;
  } catch (error) {
    console.error(`Error creating Salesforce Opportunity (attempt ${retryCount + 1}/${MAX_RETRIES}):`, error);
    
    // Retry logic
    if (retryCount < MAX_RETRIES - 1) {
      console.log(`Retrying in ${RETRY_DELAY}ms...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return createSalesforceOpportunity(leadData, retryCount + 1);
    }
    
    throw error;
  }
}

// Function to log the integration activity in Supabase
async function logIntegrationActivity(leadId: string, opportunityId: string, status: 'success' | 'error', errorMessage?: string) {
  try {
    await supabase.from('salesforce_integration_logs').insert({
      lead_id: leadId,
      opportunity_id: opportunityId,
      status,
      error_message: errorMessage,
      created_at: new Date().toISOString()
    });
    console.log('Successfully logged integration activity');
  } catch (error) {
    console.error('Failed to log integration activity:', error);
  }
}

export async function POST(request: Request) {
  try {
    // Verify the request is from Supabase
    const supabaseSignature = request.headers.get('x-supabase-signature');
    if (!supabaseSignature) {
      return NextResponse.json(
        { error: 'Missing Supabase signature' },
        { status: 401 }
      );
    }
    
    // Parse the webhook payload
    const payload = await request.json();
    console.log('Received Supabase webhook payload:', JSON.stringify(payload, null, 2));
    
    // Check if this is a new lead insertion
    if (payload.type !== 'INSERT' || payload.table !== 'leads') {
      return NextResponse.json(
        { message: 'Not a new lead insertion, ignoring' },
        { status: 200 }
      );
    }
    
    // Extract the lead data
    const leadData = payload.record;
    console.log('Processing new lead:', leadData);
    
    // Create Salesforce Opportunity
    const opportunityResult = await createSalesforceOpportunity(leadData);
    
    // Log the successful integration
    await logIntegrationActivity(leadData.id, opportunityResult.id, 'success');
    
    return NextResponse.json({
      success: true,
      message: 'Successfully created Salesforce Opportunity',
      leadId: leadData.id,
      opportunityId: opportunityResult.id
    });
  } catch (error) {
    console.error('Error processing Supabase webhook:', error);
    
    // Log the error
    try {
      await logIntegrationActivity(
        'unknown',
        'unknown',
        'error',
        error instanceof Error ? error.message : 'Unknown error'
      );
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to process webhook', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 