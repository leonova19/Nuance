-- Run this once in Supabase SQL Editor to enable checkout order storage.
create table if not exists public.store_orders (
  merchant_reference text primary key check (merchant_reference ~ '^NU-[A-Za-z0-9-]+$'),
  customer jsonb not null check (jsonb_typeof(customer) = 'object'),
  delivery jsonb not null check (jsonb_typeof(delivery) = 'object'),
  line_items jsonb not null check (jsonb_typeof(line_items) = 'array'),
  grand_total numeric(10, 2) not null check (grand_total >= 0),
  currency text not null default 'EUR' check (currency = 'EUR'),
  payment_status text not null default 'PENDING' check (payment_status in ('PENDING', 'PAID', 'FAILED', 'CANCELLED')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.store_orders enable row level security;
revoke all on table public.store_orders from anon, authenticated;
grant all on table public.store_orders to service_role;
