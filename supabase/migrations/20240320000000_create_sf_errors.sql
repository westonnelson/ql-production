-- Create sf_errors table
CREATE TABLE IF NOT EXISTS sf_errors (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  error_message TEXT NOT NULL,
  error_stack TEXT,
  request_data JSONB,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE sf_errors ENABLE ROW LEVEL SECURITY;

-- Only allow service role to insert
CREATE POLICY "Service role can insert errors" ON sf_errors
  FOR INSERT TO service_role
  WITH CHECK (true);

-- Only allow service role to select
CREATE POLICY "Service role can view errors" ON sf_errors
  FOR SELECT TO service_role
  USING (true); 