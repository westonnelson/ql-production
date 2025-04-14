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
  coverage_amount int4,
  term_length int4,
  tobacco_use text,
  utm_source text
);

-- Enable Row Level Security
alter table public.leads enable row level security;

-- Create policy to allow inserts for all users
create policy "Allow insert for all" on public.leads
for insert using (true);

-- Create policy to allow select for authenticated users only
create policy "Allow select for authenticated users" on public.leads
for select using (auth.role() = 'authenticated'); 