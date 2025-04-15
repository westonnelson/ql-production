const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://cpdoxhiudlstauzxfrnr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwZG94aGl1ZGxzdGF1enhmcm5yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDQxNzc4NiwiZXhwIjoyMDU5OTkzNzg2fQ._cSY0S1eVkpwN3inyUD_KDMuQzGqwnoYTn92zSOCjo4';

async function inspectLeadsTable() {
  console.log('Inspecting leads table structure...');
  
  try {
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    });
    
    console.log('Supabase client initialized');
    
    // Get a sample record to see the structure
    console.log('Getting a sample record...');
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error querying leads table:', error);
      return;
    }
    
    if (data && data.length > 0) {
      console.log('Sample record structure:');
      console.log(JSON.stringify(data[0], null, 2));
      
      // Log all column names
      console.log('\nColumn names:');
      Object.keys(data[0]).forEach(column => {
        console.log(`- ${column}`);
      });
    } else {
      console.log('No records found in the leads table');
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

inspectLeadsTable(); 