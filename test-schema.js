const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://cpdoxhiudlstauzxfrnr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwZG94aGl1ZGxzdGF1enhmcm5yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDQxNzc4NiwiZXhwIjoyMDU5OTkzNzg2fQ._cSY0S1eVkpwN3inyUD_KDMuQzGqwnoYTn92zSOCjo4';

async function inspectTableStructure() {
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
    
    // Get table structure using raw SQL
    const { data, error } = await supabase
      .rpc('get_table_info', { table_name: 'leads' });
    
    if (error) {
      console.error('Error getting table structure:', error);
      
      // Try alternative approach using direct SQL
      console.log('\nTrying alternative approach...');
      const { data: columns, error: sqlError } = await supabase
        .from('leads')
        .select()
        .limit(1);
      
      if (sqlError) {
        console.error('Error with alternative approach:', sqlError);
        return;
      }
      
      if (columns && columns.length > 0) {
        console.log('Table columns from sample record:', Object.keys(columns[0]));
      } else {
        console.log('No records found in the table');
      }
      
      return;
    }
    
    console.log('Table structure:', data);
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

inspectTableStructure(); 