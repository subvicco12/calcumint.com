-- CalcuMint B4: Paddle billing, entitlements and Free account limits

create table if not exists public.billing_customers (
  user_id uuid primary key references auth.users(id) on delete cascade,
  paddle_customer_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null default 'paddle' check (provider = 'paddle'),
  provider_subscription_id text not null unique,
  provider_customer_id text,
  price_id text,
  plan text not null check (plan in ('pro','business')),
  billing_interval text check (billing_interval in ('monthly','yearly')),
  status text not null,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  scheduled_interval text check (scheduled_interval in ('monthly','yearly')),
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists subscriptions_user_status_idx on public.subscriptions(user_id, status);

create table if not exists public.billing_webhook_events (
  event_id text primary key,
  event_type text not null,
  occurred_at timestamptz,
  payload jsonb not null,
  processed_at timestamptz not null default now()
);

alter table public.billing_customers enable row level security;
alter table public.subscriptions enable row level security;
alter table public.billing_webhook_events enable row level security;

-- Read-only billing visibility for the signed-in owner. Writes are service-role only.
create policy "billing_customers_select_own" on public.billing_customers
  for select using (auth.uid() = user_id);
create policy "subscriptions_select_own" on public.subscriptions
  for select using (auth.uid() = user_id);

create or replace function public.enforce_free_favorite_limit()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  current_plan text;
  current_count integer;
begin
  select plan into current_plan from public.profiles where id = new.user_id;
  if coalesce(current_plan, 'free') = 'free' then
    select count(*) into current_count from public.favorites where user_id = new.user_id;
    if current_count >= 10 then
      raise exception 'Free plan favorite limit reached';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists enforce_free_favorite_limit on public.favorites;
create trigger enforce_free_favorite_limit
before insert on public.favorites
for each row execute procedure public.enforce_free_favorite_limit();

create or replace function public.enforce_free_history_limit()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  current_plan text;
  current_count integer;
begin
  select plan into current_plan from public.profiles where id = new.user_id;
  if coalesce(current_plan, 'free') = 'free' then
    select count(*) into current_count from public.calculation_history where user_id = new.user_id;
    if current_count >= 20 then
      raise exception 'Free plan calculation history limit reached';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists enforce_free_history_limit on public.calculation_history;
create trigger enforce_free_history_limit
before insert on public.calculation_history
for each row execute procedure public.enforce_free_history_limit();
