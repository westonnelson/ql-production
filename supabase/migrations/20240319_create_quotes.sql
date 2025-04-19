-- Create quotes table
CREATE TABLE IF NOT EXISTS quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  insurance_type TEXT NOT NULL CHECK (
    insurance_type IN (
      'auto',
      'home',
      'life',
      'health',
      'disability',
      'supplemental_health',
      'short_term_disability',
      'long_term_disability'
    )
  ),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN (
      'pending',
      'submitted',
      'assigned',
      'completed',
      'cancelled'
    )
  ),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  occupation TEXT,
  annual_income DECIMAL,
  coverage_amount DECIMAL,
  coverage_term INTEGER,
  agent_id UUID,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index on insurance_type
CREATE INDEX IF NOT EXISTS quotes_insurance_type_idx ON quotes(insurance_type);

-- Create index on status
CREATE INDEX IF NOT EXISTS quotes_status_idx ON quotes(status);

-- Create index on agent_id
CREATE INDEX IF NOT EXISTS quotes_agent_id_idx ON quotes(agent_id);

-- Create index on created_at
CREATE INDEX IF NOT EXISTS quotes_created_at_idx ON quotes(created_at);

-- Enable Row Level Security
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users" ON quotes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON quotes
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users" ON quotes
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_quotes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_quotes_updated_at_trigger
  BEFORE UPDATE ON quotes
  FOR EACH ROW
  EXECUTE FUNCTION update_quotes_updated_at(); 