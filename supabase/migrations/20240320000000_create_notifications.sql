-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient_type TEXT NOT NULL CHECK (recipient_type IN ('consumer', 'agent')),
  recipient_email TEXT NOT NULL,
  notification_type TEXT NOT NULL CHECK (
    notification_type IN (
      'quote_confirmation',
      'agent_assigned',
      'new_lead',
      'subscription_confirmation',
      'payment_confirmation',
      'payment_failure'
    )
  ),
  quote_id UUID REFERENCES quotes(id),
  subscription_id TEXT,
  payment_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('sent', 'failed', 'pending')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index on recipient_email for faster lookups
CREATE INDEX IF NOT EXISTS notifications_recipient_email_idx ON notifications(recipient_email);

-- Create index on notification_type for filtering
CREATE INDEX IF NOT EXISTS notifications_type_idx ON notifications(notification_type);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS notifications_status_idx ON notifications(status);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_notifications_updated_at
  BEFORE UPDATE ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 