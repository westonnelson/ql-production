require('dotenv').config({ path: '.env.local' });
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Check for required environment variables
const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey: string = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables must be set');
  process.exit(1);
}

// Extract project reference from Supabase URL
const projectRef = supabaseUrl.match(/https:\/\/(.*?)\.supabase\.co/)?.[1];
if (!projectRef) {
  console.error('Error: Could not extract project reference from Supabase URL');
  process.exit(1);
}

interface AxiosError {
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
    statusText?: string;
  };
}

async function executeRawSQL(sql: string): Promise<void> {
  try {
    const response = await axios.post(
      `https://api.supabase.com/v1/projects/${projectRef}/sql`,
      { query: sql },
      {
        headers: {
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.status !== 200 && response.status !== 201) {
      throw new Error(`Failed to execute SQL: ${response.statusText}`);
    }
  } catch (error: unknown) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      throw new Error(`Failed to execute SQL: ${axiosError.response.data?.error || axiosError.response.data?.message || axiosError.response.statusText}`);
    }
    throw error;
  }
}

async function runMigration(): Promise<void> {
  try {
    // Read the SQL migration file
    const sqlPath: string = path.join(__dirname, '../supabase/migrations/20240418_create_salesforce_integration_logs.sql');
    const sql: string = fs.readFileSync(sqlPath, 'utf8');

    // Split SQL into individual statements
    const statements: string[] = sql.split(';').filter((stmt: string) => stmt.trim());

    // Execute each statement
    for (const statement of statements) {
      if (statement.trim()) {
        await executeRawSQL(statement);
        console.log('Executed statement successfully');
      }
    }

    console.log('Successfully executed Salesforce logs migration');
  } catch (error) {
    console.error('Error executing migration:', error);
    process.exit(1);
  }
}

// Run the migration
runMigration(); 