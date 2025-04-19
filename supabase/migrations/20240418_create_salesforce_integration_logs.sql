-- Create the salesforce_integration_logs table
CREATE TABLE IF NOT EXISTS salesforce_integration_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    event_type TEXT NOT NULL,
    status TEXT NOT NULL,
    request_data JSONB,
    response_data JSONB,
    error_message TEXT,
    quote_id UUID REFERENCES quotes(id),
    lead_id UUID REFERENCES leads(id),
    metadata JSONB
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_salesforce_logs_event_type ON salesforce_integration_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_salesforce_logs_status ON salesforce_integration_logs(status);
CREATE INDEX IF NOT EXISTS idx_salesforce_logs_quote_id ON salesforce_integration_logs(quote_id);
CREATE INDEX IF NOT EXISTS idx_salesforce_logs_lead_id ON salesforce_integration_logs(lead_id);
CREATE INDEX IF NOT EXISTS idx_salesforce_logs_created_at ON salesforce_integration_logs(created_at);

-- Add RLS policies
ALTER TABLE salesforce_integration_logs ENABLE ROW LEVEL SECURITY;

-- Allow service role to do everything
CREATE POLICY "Service role has full access" ON salesforce_integration_logs
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Allow authenticated users to read logs
CREATE POLICY "Authenticated users can read logs" ON salesforce_integration_logs
    FOR SELECT
    TO authenticated
    USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_salesforce_logs_updated_at
    BEFORE UPDATE ON salesforce_integration_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 