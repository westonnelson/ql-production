-- Create health_check table
CREATE TABLE IF NOT EXISTS health_check (
  id SERIAL PRIMARY KEY,
  count INTEGER DEFAULT 1,
  last_checked TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial record
INSERT INTO health_check (count) VALUES (1);

-- Create function to update last_checked
CREATE OR REPLACE FUNCTION update_health_check_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_checked = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update timestamp
CREATE TRIGGER update_health_check_timestamp
  BEFORE UPDATE ON health_check
  FOR EACH ROW
  EXECUTE FUNCTION update_health_check_timestamp(); 