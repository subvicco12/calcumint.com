\set ON_ERROR_STOP on

create schema auth;
create role authenticated noinherit;
create function auth.uid() returns uuid language sql stable as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
$$;

create table auth.users (id uuid primary key);
create table public.profiles (
  id uuid primary key references auth.users(id),
  plan text not null
);

\ir ../supabase/migrations/010_b7_pro_workspace.sql
\ir ../supabase/migrations/033_pro_workspace_rls_auth_initplan.sql

grant usage on schema public to authenticated;
grant select on public.profiles to authenticated;
grant select, insert, update, delete on public.calculation_projects, public.saved_scenarios to authenticated;

insert into auth.users(id) values
 ('00000000-0000-0000-0000-000000000001'),
 ('00000000-0000-0000-0000-000000000002'),
 ('00000000-0000-0000-0000-000000000003');
insert into public.profiles(id,plan) values
 ('00000000-0000-0000-0000-000000000001','free'),
 ('00000000-0000-0000-0000-000000000002','pro'),
 ('00000000-0000-0000-0000-000000000003','business');

set role authenticated;

set request.jwt.claim.sub = '00000000-0000-0000-0000-000000000001';
do $$ begin
  begin
    insert into public.calculation_projects(user_id,name) values ('00000000-0000-0000-0000-000000000001','free denied');
    raise exception 'free project insert unexpectedly succeeded';
  exception when insufficient_privilege then null;
  end;
end $$;

set request.jwt.claim.sub = '00000000-0000-0000-0000-000000000002';
insert into public.calculation_projects(id,user_id,name) values
 ('10000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000002','pro project');
insert into public.saved_scenarios(id,user_id,project_id,calculator_slug,calculator_version,name) values
 ('20000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000002','test',1,'pro scenario');
insert into public.saved_scenarios(id,user_id,project_id,calculator_slug,calculator_version,name) values
 ('21000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000002',null,'test',1,'unattached scenario');

set request.jwt.claim.sub = '00000000-0000-0000-0000-000000000003';
insert into public.calculation_projects(id,user_id,name) values
 ('10000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000003','business project');

do $$ begin
  if exists(select 1 from public.calculation_projects where id='10000000-0000-0000-0000-000000000002') then
    raise exception 'foreign project visible';
  end if;
  if exists(select 1 from public.saved_scenarios where id='20000000-0000-0000-0000-000000000002') then
    raise exception 'foreign scenario visible';
  end if;
end $$;

do $$ begin
  begin
    insert into public.saved_scenarios(user_id,project_id,calculator_slug,calculator_version,name)
    values ('00000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000002','test',1,'foreign project denied');
    raise exception 'foreign-project scenario insert unexpectedly succeeded';
  exception when insufficient_privilege then null;
  end;
end $$;

reset role;
set request.jwt.claim.sub = '00000000-0000-0000-0000-000000000002';
set role authenticated;

do $$ begin
  begin
    update public.calculation_projects set user_id='00000000-0000-0000-0000-000000000003'
    where id='10000000-0000-0000-0000-000000000002';
    raise exception 'project ownership transfer unexpectedly succeeded';
  exception when insufficient_privilege then null;
  end;
end $$;

do $$ begin
  begin
    update public.saved_scenarios set project_id='10000000-0000-0000-0000-000000000003'
    where id='20000000-0000-0000-0000-000000000002';
    raise exception 'scenario foreign-project attachment unexpectedly succeeded';
  exception when insufficient_privilege then null;
  end;
end $$;

delete from public.saved_scenarios where id='21000000-0000-0000-0000-000000000002';
do $$ begin
  if exists(select 1 from public.saved_scenarios where id='21000000-0000-0000-0000-000000000002') then
    raise exception 'own scenario delete failed';
  end if;
end $$;


-- Expanded ownership, plan-gate, and foreign-row matrix.
-- Pro user can read and update their own project while remaining Pro.
set request.jwt.claim.sub = '00000000-0000-0000-0000-000000000002';
update public.calculation_projects set name='pro project updated'
where id='10000000-0000-0000-0000-000000000002';
select 1 / case when exists(
  select 1 from public.calculation_projects
  where id='10000000-0000-0000-0000-000000000002'
    and user_id='00000000-0000-0000-0000-000000000002'
    and name='pro project updated'
) then 1 else 0 end as own_project_update_verified;

-- A Pro user cannot insert a row owned by another user.
do $$ begin
  begin
    insert into public.calculation_projects(user_id,name)
    values ('00000000-0000-0000-0000-000000000003','foreign owner denied');
    raise exception 'foreign-owner project insert unexpectedly succeeded';
  exception when insufficient_privilege then null;
  end;
end $$;

-- A Pro user cannot read or delete another user's project.
do $$ begin
  if exists(select 1 from public.calculation_projects where id='10000000-0000-0000-0000-000000000003') then
    raise exception 'foreign project visible to Pro user';
  end if;
end $$;
delete from public.calculation_projects where id='10000000-0000-0000-0000-000000000003';
reset role;
select 1 / case when exists(
  select 1 from public.calculation_projects where id='10000000-0000-0000-0000-000000000003'
) then 1 else 0 end as foreign_project_delete_denied;
set role authenticated;

-- Downgrading to Free removes project/scenario insert and update eligibility but preserves own SELECT/DELETE.
reset role;
update public.profiles set plan='free' where id='00000000-0000-0000-0000-000000000002';
set request.jwt.claim.sub = '00000000-0000-0000-0000-000000000002';
set role authenticated;
do $$ begin
  begin
    update public.calculation_projects set name='free update denied'
    where id='10000000-0000-0000-0000-000000000002';
    raise exception 'Free-plan project update unexpectedly succeeded';
  exception when insufficient_privilege then null;
  end;
end $$;
do $$ begin
  begin
    insert into public.saved_scenarios(user_id,project_id,calculator_slug,calculator_version,name)
    values ('00000000-0000-0000-0000-000000000002',null,'test',1,'free scenario denied');
    raise exception 'Free-plan scenario insert unexpectedly succeeded';
  exception when insufficient_privilege then null;
  end;
end $$;
do $$ begin
  begin
    update public.saved_scenarios set name='free scenario update denied'
    where id='20000000-0000-0000-0000-000000000002';
    raise exception 'Free-plan scenario update unexpectedly succeeded';
  exception when insufficient_privilege then null;
  end;
end $$;
select 1 / case when exists(
  select 1 from public.calculation_projects where id='10000000-0000-0000-0000-000000000002'
) then 1 else 0 end as free_plan_own_project_read_verified;
delete from public.saved_scenarios where id='20000000-0000-0000-0000-000000000002';
reset role;
select 1 / case when not exists(
  select 1 from public.saved_scenarios where id='20000000-0000-0000-0000-000000000002'
) then 1 else 0 end as free_plan_own_scenario_delete_verified;
set role authenticated;

\echo 'Pro workspace RLS behavioral checks passed'
