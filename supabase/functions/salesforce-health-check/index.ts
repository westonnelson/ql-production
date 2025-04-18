import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import jsforce from 'https://esm.sh/jsforce@1.11.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const salesforceUsername = Deno.env.get('SALESFORCE_USERNAME') || '';
    const salesforcePassword = Deno.env.get('SALESFORCE_PASSWORD') || '';
    const salesforceSecurityToken = Deno.env.get('SALESFORCE_SECURITY_TOKEN') || '';
    const salesforceLoginUrl = Deno.env.get('SALESFORCE_LOGIN_URL') || 'https://login.salesforce.com';

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Initialize Salesforce connection
    const sf = new jsforce.Connection({
      loginUrl: salesforceLoginUrl
    });

    // Check if Salesforce credentials are configured
    if (!salesforceUsername || !salesforcePassword) {
      return new Response(
        JSON.stringify({ 
          status: 'error', 
          message: 'Salesforce credentials not configured' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        }
      );
    }

    // Login to Salesforce
    await sf.login(
      salesforceUsername,
      salesforcePassword + salesforceSecurityToken
    );

    // Log the health check in Supabase
    await supabase.from('health_check').upsert({
      id: 1,
      count: 1,
      last_checked: new Date().toISOString()
    });

    return new Response(
      JSON.stringify({ 
        status: 'success', 
        message: 'Salesforce connection successful',
        instanceUrl: sf.instanceUrl
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    console.error('Salesforce health check failed:', error);
    
    return new Response(
      JSON.stringify({ 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Salesforce connection failed' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
}); 