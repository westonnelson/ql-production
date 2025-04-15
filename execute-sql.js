const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://cpdoxhiudlstauzxfrnr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwZG94aGl1ZGxzdGF1enhmcm5yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDQxNzc4NiwiZXhwIjoyMDU5OTkzNzg2fQ._cSY0S1eVkpwN3inyUD_KDMuQzGqwnoYTn92zSOCjo4';

async function executeSQL() {
  console.log('Executing SQL migration...');
  
  try {
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    });
    
    console.log('Supabase client initialized');
    
    // Execute SQL to add product_type column
    console.log('Adding product_type column...');
    const { data, error } = await supabase
      .rpc('exec_sql', {
        sql: `
          ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS product_type text;
          CREATE INDEX IF NOT EXISTS idx_leads_product_type ON public.leads(product_type);
          UPDATE public.leads SET product_type = 'life' WHERE product_type IS NULL;
        `
      });
    
    if (error) {
      console.error('Error executing SQL:', error);
      
      // Try alternative approach using direct table access
      console.log('\nTrying alternative approach...');
      const { data: testData, error: testError } = await supabase
        .from('leads')
        .insert([{
          first_name: 'Test',
          last_name: 'User',
          email: 'test@example.com',
          phone: '1234567890',
          age: 30,
          gender: 'male',
          product_type: 'life',
          coverage_amount: 250000,
          term_length: 20,
          tobacco_use: false,
          utm_source: 'test_script'
        }])
        .select();
      
      if (testError) {
        console.error('Error with alternative approach:', testError);
      } else {
        console.log('Successfully inserted test record:', testData);
      }
    } else {
      console.log('SQL executed successfully:', data);
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

executeSQL(); 