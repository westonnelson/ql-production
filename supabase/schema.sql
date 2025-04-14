-- Create the leads table
create table public.leads (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  first_name text,
  last_name text,
  email text,
  phone text,
  age int4,
  gender text,
  product_type text,
  -- Life insurance fields
  coverage_amount int4,
  term_length int4,
  tobacco_use boolean,
  -- Disability insurance fields
  occupation text,
  employment_status text,
  income_range text,
  -- Supplemental health fields
  pre_existing_conditions text,
  desired_coverage_type text,
  -- Tracking and analytics
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  funnel_name text,
  funnel_step text,
  funnel_variant text,
  ab_test_id text,
  ab_test_variant text,
  -- Lead status
  status text default 'new',
  assigned_agent uuid references auth.users,
  last_contact timestamptz,
  notes text,
  tags text[]
);

-- Create index for common queries
create index idx_leads_product_type on public.leads(product_type);
create index idx_leads_created_at on public.leads(created_at);
create index idx_leads_status on public.leads(status);
create index idx_leads_funnel on public.leads(funnel_name, funnel_step);
create index idx_leads_ab_test on public.leads(ab_test_id, ab_test_variant);

-- Create a view for lead analytics
create view lead_analytics as
select
  date_trunc('day', created_at) as date,
  product_type,
  funnel_name,
  funnel_variant,
  ab_test_id,
  ab_test_variant,
  count(*) as lead_count,
  count(case when status = 'converted' then 1 end) as conversion_count
from public.leads
group by 1, 2, 3, 4, 5, 6;

-- Enable Row Level Security
alter table public.leads enable row level security;

-- Create policy to allow inserts for all users (including unauthenticated)
create policy "Enable insert for all users" on public.leads for insert with check (true);

-- Create policy to allow select for authenticated users only
create policy "Enable select for authenticated users" on public.leads for select using (auth.role() = 'authenticated');

-- Create policy to allow updates for assigned agents
create policy "Enable update for assigned agents" on public.leads 
  for update using (auth.uid() = assigned_agent);

-- Create a function to automatically update last_contact
create or replace function update_last_contact()
returns trigger as $$
begin
  new.last_contact = now();
  return new;
end;
$$ language plpgsql;

create trigger update_lead_last_contact
  before update on public.leads
  for each row
  when (old.status is distinct from new.status)
  execute function update_last_contact(); 