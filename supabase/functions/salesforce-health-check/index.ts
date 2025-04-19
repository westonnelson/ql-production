import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import jsforce from 'https://esm.sh/jsforce@1.11.1';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

serve({
  port: 54321,
  handler: async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders });
    }

    try {
      // Get environment variables
      const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
      const salesforceLoginUrl = Deno.env.get('SALESFORCE_LOGIN_URL') || 'https://login.salesforce.com';

      // Initialize Supabase client
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      // Initialize Salesforce connection
      const conn = new jsforce.Connection({
        loginUrl: salesforceLoginUrl
      });

      // Get Salesforce credentials
      const username = Deno.env.get('SALESFORCE_USERNAME');
      const password = Deno.env.get('SALESFORCE_PASSWORD');
      const securityToken = Deno.env.get('SALESFORCE_SECURITY_TOKEN');

      if (!username || !password || !securityToken) {
        return new Response(
          JSON.stringify({ error: 'Missing Salesforce credentials' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Authenticate with Salesforce
      await conn.login(
        username,
        password + securityToken
      );

      // Check if we can query the API
      const result = await conn.query('SELECT Id FROM User LIMIT 1');

      // Log the health check in Supabase
      await supabase.from('health_check').upsert({
        id: 1,
        count: 1,
        last_checked: new Date().toISOString()
      });

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Salesforce connection successful',
          userCount: result.totalSize
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error('Salesforce health check error:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Salesforce connection failed', 
          details: error instanceof Error ? error.message : 'Unknown error' 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  }
}); 