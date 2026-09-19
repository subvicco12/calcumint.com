-- CalcuMint B6: no-code custom calculator builder

create table if not exists public.custom_calculators (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 120),
  slug text not null check (slug ~ '^[a-z0-9][a-z0-9-]{1,62}$'),
  description text not null default '',
  status text not null default 'draft' check (status in ('draft','published','archived')),
  visibility text not null default 'private' check (visibility in ('private','workspace','share-link')),
  current_version integer not null default 1 check (current_version > 0),
  published_version integer,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, slug)
);

create table if not exists public.custom_calculator_versions (
  id uuid primary key default gen_random_uuid(),
  calculator_id uuid not null references public.custom_calculators(id) on delete cascade,
  version integer not null check (version > 0),
  definition jsonb not null,
  change_note text,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  unique (calculator_id, version)
);

create table if not exists public.custom_calculator_runs (
  id uuid primary key default gen_random_uuid(),
  calculator_id uuid not null references public.custom_calculators(id) on delete cascade,
  calculator_version integer not null check (calculator_version > 0),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  input_data jsonb not null,
  output_data jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists custom_calculators_org_idx on public.custom_calculators(organization_id, updated_at desc);
create index if not exists custom_versions_calculator_idx on public.custom_calculator_versions(calculator_id, version desc);
create index if not exists custom_runs_org_idx on public.custom_calculator_runs(organization_id, created_at desc);

alter table public.custom_calculators enable row level security;
alter table public.custom_calculator_versions enable row level security;
alter table public.custom_calculator_runs enable row level security;

create policy "custom_calculators_read_members" on public.custom_calculators
for select using (public.is_org_member(organization_id));
create policy "custom_calculators_insert_builders" on public.custom_calculators
for insert with check (public.has_org_role(organization_id, array['owner','admin','manager']) and created_by = auth.uid());
create policy "custom_calculators_update_builders" on public.custom_calculators
for update using (public.has_org_role(organization_id, array['owner','admin','manager']))
with check (public.has_org_role(organization_id, array['owner','admin','manager']));
create policy "custom_calculators_delete_admin" on public.custom_calculators
for delete using (public.has_org_role(organization_id, array['owner','admin']));

create policy "custom_versions_read_members" on public.custom_calculator_versions
for select using (
  exists (select 1 from public.custom_calculators c where c.id = calculator_id and public.is_org_member(c.organization_id))
);
create policy "custom_versions_insert_builders" on public.custom_calculator_versions
for insert with check (
  created_by = auth.uid() and exists (
    select 1 from public.custom_calculators c
    where c.id = calculator_id and public.has_org_role(c.organization_id, array['owner','admin','manager'])
  )
);

create policy "custom_runs_read_members" on public.custom_calculator_runs
for select using (public.is_org_member(organization_id));
create policy "custom_runs_insert_members" on public.custom_calculator_runs
for insert with check (public.is_org_member(organization_id));

create or replace function public.create_custom_calculator(
  p_organization_id uuid,
  p_name text,
  p_slug text,
  p_description text,
  p_definition jsonb
) returns uuid
language plpgsql
security definer set search_path = public
as $$
declare v_id uuid;
declare v_visibility text;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if not exists(select 1 from public.profiles p where p.id=auth.uid() and p.plan='business') then raise exception 'Business plan required'; end if;
  if not public.has_org_role(p_organization_id, array['owner','admin','manager']) then raise exception 'Builder permission required'; end if;
  v_visibility := coalesce(p_definition->>'visibility', 'private');
  if v_visibility not in ('private','workspace','share-link') then raise exception 'Invalid visibility'; end if;

  insert into public.custom_calculators (organization_id, name, slug, description, visibility, created_by)
  values (p_organization_id, p_name, p_slug, coalesce(p_description, ''), v_visibility, auth.uid())
  returning id into v_id;

  insert into public.custom_calculator_versions (calculator_id, version, definition, change_note, created_by)
  values (v_id, 1, p_definition, 'Initial version', auth.uid());

  insert into public.organization_audit_log (organization_id, actor_user_id, action, entity_type, entity_id, metadata)
  values (p_organization_id, auth.uid(), 'custom_calculator.created', 'custom_calculator', v_id::text, jsonb_build_object('name', p_name));
  return v_id;
end;
$$;

create or replace function public.publish_custom_calculator(p_calculator_id uuid, p_version integer)
returns void
language plpgsql
security definer set search_path = public
as $$
declare v_org uuid;
begin
  select organization_id into v_org from public.custom_calculators where id = p_calculator_id;
  if v_org is null then raise exception 'Calculator not found'; end if;
  if not exists(select 1 from public.profiles p where p.id=auth.uid() and p.plan='business') then raise exception 'Business plan required'; end if;
  if not public.has_org_role(v_org, array['owner','admin','manager']) then raise exception 'Builder permission required'; end if;
  if not exists (select 1 from public.custom_calculator_versions where calculator_id = p_calculator_id and version = p_version) then raise exception 'Version not found'; end if;

  update public.custom_calculators set status = 'published', published_version = p_version, updated_at = now() where id = p_calculator_id;
  insert into public.organization_audit_log (organization_id, actor_user_id, action, entity_type, entity_id, metadata)
  values (v_org, auth.uid(), 'custom_calculator.published', 'custom_calculator', p_calculator_id::text, jsonb_build_object('version', p_version));
end;
$$;

revoke all on function public.create_custom_calculator(uuid,text,text,text,jsonb) from public;
grant execute on function public.create_custom_calculator(uuid,text,text,text,jsonb) to authenticated;
revoke all on function public.publish_custom_calculator(uuid,integer) from public;
grant execute on function public.publish_custom_calculator(uuid,integer) to authenticated;
