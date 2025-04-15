-- Add tracking fields to leads table
ALTER TABLE public.leads 
  ADD COLUMN IF NOT EXISTS ab_test_id text,
  ADD COLUMN IF NOT EXISTS ab_test_variant text,
  ADD COLUMN IF NOT EXISTS utm_source text,
  ADD COLUMN IF NOT EXISTS utm_medium text,
  ADD COLUMN IF NOT EXISTS utm_campaign text,
  ADD COLUMN IF NOT EXISTS utm_content text,
  ADD COLUMN IF NOT EXISTS utm_term text,
  ADD COLUMN IF NOT EXISTS funnel_name text,
  ADD COLUMN IF NOT EXISTS funnel_step text,
  ADD COLUMN IF NOT EXISTS funnel_variant text;

-- Create indexes for tracking fields
CREATE INDEX IF NOT EXISTS idx_leads_ab_test_id ON public.leads(ab_test_id);
CREATE INDEX IF NOT EXISTS idx_leads_ab_test_variant ON public.leads(ab_test_variant);
CREATE INDEX IF NOT EXISTS idx_leads_utm_source ON public.leads(utm_source);
CREATE INDEX IF NOT EXISTS idx_leads_funnel_name ON public.leads(funnel_name); 