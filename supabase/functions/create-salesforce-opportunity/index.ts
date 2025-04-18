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

    // Get the request body
    const { formData, formType, utmParams } = await req.json();

    if (!formData || !formType) {
      return new Response(
        JSON.stringify({ 
          status: 'error', 
          message: 'Missing required form data' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      );
    }

    // Create or update Lead in Salesforce
    let leadId;
    try {
      // Check if lead already exists by email
      const leadQuery = await sf.query(`SELECT Id FROM Lead WHERE Email = '${formData.email}' LIMIT 1`);
      
      if (leadQuery.records.length > 0) {
        // Update existing lead
        leadId = leadQuery.records[0].Id;
        await sf.sobject('Lead').update({
          Id: leadId,
          FirstName: formData.firstName || '',
          LastName: formData.lastName || '',
          Email: formData.email,
          Phone: formData.phone || '',
          Company: formData.company || '',
          Description: `Form Type: ${formType}\nUTM Source: ${utmParams?.source || 'N/A'}\nUTM Medium: ${utmParams?.medium || 'N/A'}\nUTM Campaign: ${utmParams?.campaign || 'N/A'}`,
          LeadSource: 'Website',
          Status: 'New'
        });
      } else {
        // Create new lead
        const leadResult = await sf.sobject('Lead').create({
          FirstName: formData.firstName || '',
          LastName: formData.lastName || '',
          Email: formData.email,
          Phone: formData.phone || '',
          Company: formData.company || '',
          Description: `Form Type: ${formType}\nUTM Source: ${utmParams?.source || 'N/A'}\nUTM Medium: ${utmParams?.medium || 'N/A'}\nUTM Campaign: ${utmParams?.campaign || 'N/A'}`,
          LeadSource: 'Website',
          Status: 'New'
        });
        
        if (!leadResult.success) {
          throw new Error(`Failed to create lead: ${leadResult.errors[0].message}`);
        }
        
        leadId = leadResult.id;
      }
    } catch (error) {
      console.error('Error creating/updating lead:', error);
      throw error;
    }

    // Create Opportunity in Salesforce
    let opportunityId;
    try {
      // Map form data to opportunity fields based on form type
      const opportunityData = {
        Name: `${formType} Quote - ${formData.firstName} ${formData.lastName}`,
        LeadId: leadId,
        StageName: 'Prospecting',
        CloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
        Amount: 0,
        Description: `Form Type: ${formType}\nUTM Source: ${utmParams?.source || 'N/A'}\nUTM Medium: ${utmParams?.medium || 'N/A'}\nUTM Campaign: ${utmParams?.campaign || 'N/A'}`
      };

      // Add form-specific fields
      if (formType === 'auto') {
        opportunityData.Description += `\nVehicle Year: ${formData.vehicleYear || 'N/A'}\nVehicle Make: ${formData.vehicleMake || 'N/A'}\nVehicle Model: ${formData.vehicleModel || 'N/A'}`;
      } else if (formType === 'home') {
        opportunityData.Description += `\nProperty Address: ${formData.propertyAddress || 'N/A'}\nProperty Type: ${formData.propertyType || 'N/A'}`;
      } else if (formType === 'life') {
        opportunityData.Description += `\nCoverage Amount: ${formData.coverageAmount || 'N/A'}\nHealth Status: ${formData.healthStatus || 'N/A'}`;
      }

      const opportunityResult = await sf.sobject('Opportunity').create(opportunityData);
      
      if (!opportunityResult.success) {
        throw new Error(`Failed to create opportunity: ${opportunityResult.errors[0].message}`);
      }
      
      opportunityId = opportunityResult.id;
    } catch (error) {
      console.error('Error creating opportunity:', error);
      throw error;
    }

    // Log the successful creation in Supabase
    await supabase.from('salesforce_integration_logs').insert({
      lead_id: leadId,
      opportunity_id: opportunityId,
      form_type: formType,
      form_data: formData,
      utm_params: utmParams,
      status: 'success',
      created_at: new Date().toISOString()
    });

    return new Response(
      JSON.stringify({ 
        status: 'success', 
        message: 'Salesforce opportunity created successfully',
        leadId,
        opportunityId
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    console.error('Error creating Salesforce opportunity:', error);
    
    // Log the error in Supabase
    try {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') || '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
      );
      
      await supabase.from('salesforce_integration_logs').insert({
        form_type: req.json?.formType || 'unknown',
        form_data: req.json?.formData || {},
        utm_params: req.json?.utmParams || {},
        status: 'error',
        error_message: error instanceof Error ? error.message : 'Unknown error',
        created_at: new Date().toISOString()
      });
    } catch (logError) {
      console.error('Error logging to Supabase:', logError);
    }
    
    return new Response(
      JSON.stringify({ 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Failed to create Salesforce opportunity' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
}); 