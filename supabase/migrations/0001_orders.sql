-- =============================================================
-- AISTA — initial schema
-- Run this once in Supabase → SQL Editor → New query → paste → Run
-- =============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- =============================================================
-- ENUM: order status lifecycle
-- =============================================================
do $$ begin
  create type order_status as enum (
    'pending',     -- created at /api/checkout, waiting for Stripe
    'paid',        -- Stripe webhook confirmed payment
    'generating',  -- Claude API call in progress
    'completed',   -- CV generated AND email sent
    'failed'       -- error somewhere in the pipeline
  );
exception
  when duplicate_object then null;
end $$;

-- =============================================================
-- TABLE: orders — every paid (or attempted) order
-- =============================================================
create table if not exists orders (
  id                  uuid primary key default gen_random_uuid(),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),

  -- Customer
  email               text not null,
  full_name           text not null,

  -- The form snapshot — single source of truth
  form_data           jsonb not null,

  -- Quick-filter columns extracted from form_data
  profession_id       text,
  track               text,           -- survival | professional
  region              text,           -- flanders | brussels | wallonia
  output_language     text,           -- nl | fr | en

  -- Stripe
  stripe_session_id   text unique,
  amount_eur          numeric(10,2) default 9.00,
  currency            text default 'eur',

  -- Lifecycle
  status              order_status not null default 'pending',
  paid_at             timestamptz,
  generated_at        timestamptz,
  emailed_at          timestamptz,
  error_message       text,

  -- Misc
  user_agent          text,
  ip_country          text,
  utm                 jsonb
);

create index if not exists orders_email_idx        on orders (email);
create index if not exists orders_status_idx       on orders (status);
create index if not exists orders_created_at_idx   on orders (created_at desc);
create index if not exists orders_stripe_idx       on orders (stripe_session_id);

-- Auto-update updated_at on every row change
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists orders_set_updated_at on orders;
create trigger orders_set_updated_at
  before update on orders
  for each row execute function set_updated_at();

-- =============================================================
-- TABLE: leads — partial fills, abandoned funnel
-- =============================================================
create table if not exists leads (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  last_seen_at    timestamptz not null default now(),
  email           text not null unique,
  partial_form    jsonb not null default '{}'::jsonb,
  source          text default 'form',
  converted_order_id uuid references orders(id) on delete set null
);

create index if not exists leads_last_seen_idx on leads (last_seen_at desc);

-- =============================================================
-- RLS — Row Level Security
-- We block anon access by default. Service role (server) bypasses RLS.
-- =============================================================
alter table orders enable row level security;
alter table leads  enable row level security;

-- No public policies — only server (service role) can read/write.
-- If later you add a customer dashboard with auth, add a policy here:
--   create policy "users can read own orders"
--     on orders for select
--     using (auth.email() = email);

-- =============================================================
-- VIEW: order_funnel — quick analytics
-- =============================================================
create or replace view order_funnel as
select
  date_trunc('day', created_at) as day,
  count(*) filter (where status in ('pending','paid','generating','completed','failed')) as total,
  count(*) filter (where status = 'paid')      as paid,
  count(*) filter (where status = 'completed') as completed,
  count(*) filter (where status = 'failed')    as failed,
  count(distinct profession_id) as professions,
  count(distinct region) as regions
from orders
group by 1
order by 1 desc;

-- =============================================================
-- DONE. Verify with:
--   select * from orders limit 5;
--   select * from order_funnel;
-- =============================================================
