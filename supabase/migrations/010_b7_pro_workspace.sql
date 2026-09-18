-- CalcuMint B7: Pro personal calculation workspace.
-- Apply only after reviewing the target Supabase environment.

create table if not exists public.calculation_projects (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 name text not null check (char_length(btrim(name)) between 1 and 120),
 description text,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create table if not exists public.saved_scenarios (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 project_id uuid references public.calculation_projects(id) on delete cascade,
 calculator_slug text not null,
 calculator_version integer not null check (calculator_version>0),
 name text not null check (char_length(btrim(name)) between 1 and 120),
 input_data jsonb not null default '{}'::jsonb,
 output_data jsonb not null default '{}'::jsonb,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index if not exists calculation_projects_user_updated_idx on public.calculation_projects(user_id,updated_at desc);
create index if not exists saved_scenarios_user_updated_idx on public.saved_scenarios(user_id,updated_at desc);
create index if not exists saved_scenarios_project_idx on public.saved_scenarios(project_id,updated_at desc);

alter table public.calculation_projects enable row level security;
alter table public.saved_scenarios enable row level security;
create policy "projects_select_own" on public.calculation_projects for select using(auth.uid()=user_id);
create policy "projects_insert_own" on public.calculation_projects for insert with check(auth.uid()=user_id and exists(select 1 from public.profiles p where p.id=auth.uid() and p.plan in ('pro','business')));
create policy "projects_update_own" on public.calculation_projects for update using(auth.uid()=user_id) with check(auth.uid()=user_id and exists(select 1 from public.profiles p where p.id=auth.uid() and p.plan in ('pro','business')));
create policy "projects_delete_own" on public.calculation_projects for delete using(auth.uid()=user_id);
create policy "scenarios_select_own" on public.saved_scenarios for select using(auth.uid()=user_id);
create policy "scenarios_insert_own" on public.saved_scenarios for insert with check(auth.uid()=user_id and exists(select 1 from public.profiles profile where profile.id=auth.uid() and profile.plan in ('pro','business')) and (project_id is null or exists(select 1 from public.calculation_projects p where p.id=project_id and p.user_id=auth.uid())));
create policy "scenarios_update_own" on public.saved_scenarios for update using(auth.uid()=user_id) with check(auth.uid()=user_id and exists(select 1 from public.profiles profile where profile.id=auth.uid() and profile.plan in ('pro','business')) and (project_id is null or exists(select 1 from public.calculation_projects p where p.id=project_id and p.user_id=auth.uid())));
create policy "scenarios_delete_own" on public.saved_scenarios for delete using(auth.uid()=user_id);
