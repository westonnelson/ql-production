-- Create salesforce_integration_logs table
CREATE TABLE IF NOT EXISTS salesforce_integration_logs (
  id SERIAL PRIMARY KEY,
  lead_id VARCHAR(255),
  opportunity_id VARCHAR(255),
  form_type VARCHAR(50) NOT NULL,
  form_data JSONB NOT NULL,
  utm_params JSONB,
  status VARCHAR(20) NOT NULL,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_salesforce_integration_logs_form_type ON salesforce_integration_logs(form_type);
CREATE INDEX IF NOT EXISTS idx_salesforce_integration_logs_status ON salesforce_integration_logs(status);
CREATE INDEX IF NOT EXISTS idx_salesforce_integration_logs_created_at ON salesforce_integration_logs(created_at);

-- Add RLS policies
ALTER TABLE salesforce_integration_logs ENABLE ROW LEVEL SECURITY;

-- Allow service role to do anything
CREATE POLICY service_role_all ON salesforce_integration_logs
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Allow authenticated users to read
CREATE POLICY authenticated_read ON salesforce_integration_logs
  FOR SELECT
  USING (auth.role() = 'authenticated'); 