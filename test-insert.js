const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://cpdoxhiudlstauzxfrnr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwZG94aGl1ZGxzdGF1enhmcm5yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDQxNzc4NiwiZXhwIjoyMDU5OTkzNzg2fQ._cSY0S1eVkpwN3inyUD_KDMuQzGqwnoYTn92zSOCjo4';

async function testLeadInsertion() {
  console.log('Testing lead insertion with updated structure...');
  
  try {
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    });
    
    console.log('Supabase client initialized');
    
    // Test lead data
    const testLead = {
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
      phone: '1234567890',
      age: 35,
      gender: 'male',
      coverage_amount: 500000,
      term_length: 20,
      tobacco_use: 'no',
      utm_source: 'test_script'
    };
    
    console.log('Inserting test lead:', JSON.stringify(testLead, null, 2));
    
    const { data, error } = await supabase
      .from('leads')
      .insert([testLead])
      .select()
      .single();
    
    if (error) {
      console.error('Error inserting lead:', error);
      return;
    }
    
    console.log('Successfully inserted lead:', data);
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

testLeadInsertion(); 