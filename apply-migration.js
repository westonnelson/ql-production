// Script to apply migrations to Supabase
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase configuration. Please check your .env file.');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});

async function applyMigration() {
  try {
    // Read the migration file
    const migrationPath = path.join(__dirname, 'supabase', 'migrations', '20240415_add_lead_tracking_fields.sql');
    const migrationSql = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('Applying migration...');
    
    // Execute the SQL
    const { error } = await supabase.rpc('exec_sql', { sql: migrationSql });
    
    if (error) {
      console.error('Error applying migration:', error);
      process.exit(1);
    }
    
    console.log('Migration applied successfully!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

applyMigration(); 