-- NUANCE product catalog. Run once in Supabase Dashboard → SQL Editor.
create table if not exists public.store_products (
  id text primary key check (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  product jsonb not null check (jsonb_typeof(product) = 'object'),
  is_available boolean not null default true,
  sort_order integer not null default 0 check (sort_order >= 0),
  updated_at timestamptz not null default now(),
  constraint store_products_id_matches_json check (product ->> 'id' = id)
);

alter table public.store_products enable row level security;

-- Keep catalog access server-only. Do not add anon/authenticated policies.
revoke all on table public.store_products from anon, authenticated;
grant all on table public.store_products to service_role;

-- NUANCE services catalog. Service rows are edited from the admin panel.
create table if not exists public.services (
  id text primary key check (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  category text not null check (category in ('permanent', 'lashes', 'brows', 'correction')),
  name text not null,
  subtitle text not null default '',
  duration text not null default '',
  price text not null default '',
  sort_order integer not null default 0 check (sort_order >= 0),
  is_published boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.services enable row level security;
revoke all on table public.services from anon, authenticated;
grant all on table public.services to service_role;

