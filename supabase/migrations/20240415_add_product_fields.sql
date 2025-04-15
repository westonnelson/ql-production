-- Add fields for life insurance leads
ALTER TABLE public.leads 
  ADD COLUMN IF NOT EXISTS coverage_amount integer,
  ADD COLUMN IF NOT EXISTS term_length integer,
  ADD COLUMN IF NOT EXISTS tobacco_use boolean;

-- Add fields for disability insurance leads
ALTER TABLE public.leads 
  ADD COLUMN IF NOT EXISTS occupation text,
  ADD COLUMN IF NOT EXISTS employment_status text,
  ADD COLUMN IF NOT EXISTS income_range text;

-- Add fields for supplemental health insurance leads
ALTER TABLE public.leads 
  ADD COLUMN IF NOT EXISTS pre_existing_conditions text,
  ADD COLUMN IF NOT EXISTS desired_coverage_type text;

-- Create indexes for commonly queried fields
CREATE INDEX IF NOT EXISTS idx_leads_coverage_amount ON public.leads(coverage_amount);
CREATE INDEX IF NOT EXISTS idx_leads_term_length ON public.leads(term_length);
CREATE INDEX IF NOT EXISTS idx_leads_occupation ON public.leads(occupation);
CREATE INDEX IF NOT EXISTS idx_leads_employment_status ON public.leads(employment_status); 