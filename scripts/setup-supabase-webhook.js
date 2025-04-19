const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://quotelinker.com';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase configuration. Please check your .env.local file.');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});

async function setupWebhook() {
  try {
    console.log('Setting up Supabase webhook for leads table...');
    
    // Webhook configuration
    const webhookConfig = {
      name: 'leads-to-salesforce',
      table: 'leads',
      events: ['INSERT'],
      url: `${siteUrl}/api/webhooks/supabase-leads`,
      secret: process.env.SUPABASE_WEBHOOK_SECRET || 'your-webhook-secret',
      enabled: true
    };
    
    // Check if webhook already exists
    const { data: existingWebhooks, error: fetchError } = await supabase
      .from('webhooks')
      .select('*')
      .eq('name', webhookConfig.name);
    
    if (fetchError) {
      console.error('Error fetching existing webhooks:', fetchError);
      process.exit(1);
    }
    
    if (existingWebhooks && existingWebhooks.length > 0) {
      console.log('Webhook already exists, updating...');
      
      // Update existing webhook
      const { error: updateError } = await supabase
        .from('webhooks')
        .update(webhookConfig)
        .eq('name', webhookConfig.name);
      
      if (updateError) {
        console.error('Error updating webhook:', updateError);
        process.exit(1);
      }
      
      console.log('Webhook updated successfully!');
    } else {
      console.log('Creating new webhook...');
      
      // Create new webhook
      const { error: insertError } = await supabase
        .from('webhooks')
        .insert([webhookConfig]);
      
      if (insertError) {
        console.error('Error creating webhook:', insertError);
        process.exit(1);
      }
      
      console.log('Webhook created successfully!');
    }
    
    console.log('Supabase webhook setup complete!');
    console.log(`Webhook URL: ${webhookConfig.url}`);
    console.log('Make sure to add the SUPABASE_WEBHOOK_SECRET environment variable to your Vercel project.');
  } catch (error) {
    console.error('Error setting up webhook:', error);
    process.exit(1);
  }
}

setupWebhook(); 