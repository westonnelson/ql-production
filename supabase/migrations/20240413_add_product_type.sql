-- Add product_type column
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS product_type text;

-- Create index for product_type
CREATE INDEX IF NOT EXISTS idx_leads_product_type ON public.leads(product_type);

-- Update existing records to have a default product type
UPDATE public.leads SET product_type = 'life' WHERE product_type IS NULL; 