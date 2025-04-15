const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://cpdoxhiudlstauzxfrnr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwZG94aGl1ZGxzdGF1enhmcm5yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDQxNzc4NiwiZXhwIjoyMDU5OTkzNzg2fQ._cSY0S1eVkpwN3inyUD_KDMuQzGqwnoYTn92zSOCjo4';

async function testSupabaseConnection() {
  console.log('Testing Supabase connection...');
  
  try {
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    });
    
    console.log('Supabase client initialized');
    
    // Test connection by querying the leads table
    console.log('Querying leads table...');
    const { data, error } = await supabase
      .from('leads')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Error querying leads table:', error);
      return;
    }
    
    console.log('Successfully queried leads table:', data);
    
    // Test inserting a lead
    console.log('Testing lead insertion...');
    const testLead = {
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
      phone: '1234567890',
      age: 35,
      gender: 'male',
      product_type: 'life',
      coverage_amount: 500000,
      term_length: 20,
      tobacco_use: false,
      utm_source: 'test_script',
      status: 'new'
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('leads')
      .insert([testLead])
      .select()
      .single();
    
    if (insertError) {
      console.error('Error inserting lead:', insertError);
      return;
    }
    
    console.log('Successfully inserted lead:', insertData);
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

testSupabaseConnection(); 