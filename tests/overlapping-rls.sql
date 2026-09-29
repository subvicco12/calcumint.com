\set ON_ERROR_STOP on

create schema auth;
create role authenticated noinherit;
create role service_role noinherit;
create function auth.uid() returns uuid language sql stable as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
$$;
create table auth.users (
  id uuid primary key,
  email text,
  raw_user_meta_data jsonb not null default '{}'::jsonb
);

\ir ../supabase/migrations/001_b3_accounts.sql
\ir ../supabase/migrations/002_b4_billing.sql
\ir ../supabase/migrations/003_b5_business.sql
\ir ../supabase/migrations/004_b6_builder.sql
\ir ../supabase/migrations/005_b7_delivery.sql
\ir ../supabase/migrations/006_b8_api_automation.sql
\ir ../supabase/migrations/007_b9_ai.sql
\ir ../supabase/migrations/008_b10_admin_factory.sql
\ir ../supabase/migrations/030_billing_ai_rls_auth_initplan.sql
\ir ../supabase/migrations/032_business_builder_rls_auth_initplan.sql
\ir ../supabase/migrations/035_split_overlapping_write_policies.sql

grant usage on schema public to authenticated;
grant select on public.organization_members, public.platform_admins to authenticated;
grant select on public.ai_usage_events, public.calculator_qa_checks, public.embed_configs, public.share_links to authenticated;
grant insert, update, delete on public.calculator_qa_checks, public.embed_configs, public.share_links to authenticated;

insert into auth.users(id,email) values
 ('00000000-0000-0000-0000-000000000001','owner@example.test'),
 ('00000000-0000-0000-0000-000000000002','admin@example.test'),
 ('00000000-0000-0000-0000-000000000003','manager@example.test'),
 ('00000000-0000-0000-0000-000000000004','member@example.test'),
 ('00000000-0000-0000-0000-000000000005','foreign@example.test'),
 ('00000000-0000-0000-0000-000000000006','reviewer@example.test'),
 ('00000000-0000-0000-0000-000000000007','editor@example.test'),
 ('00000000-0000-0000-0000-000000000008','viewer@example.test');
update public.profiles set plan='business' where id in (select id from auth.users);

insert into public.organizations(id,name,slug,owner_user_id) values
 ('10000000-0000-0000-0000-000000000001','Test Org','test-org','00000000-0000-0000-0000-000000000001'),
 ('10000000-0000-0000-0000-000000000002','Foreign Org','foreign-org','00000000-0000-0000-0000-000000000005');
insert into public.organization_members(organization_id,user_id,role) values
 ('10000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001','owner'),
 ('10000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000002','admin'),
 ('10000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000003','manager'),
 ('10000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000004','member'),
 ('10000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000008','viewer'),
 ('10000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000005','owner');

insert into public.custom_calculators(id,organization_id,name,slug,created_by) values
 ('20000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','Test Calc','test-calc','00000000-0000-0000-0000-000000000001');

insert into public.embed_configs(id,organization_id,calculator_id,public_key,name,created_by) values
 ('30000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','abcdefghijklmnopqrstuvwx','Owner Embed','00000000-0000-0000-0000-000000000001');
insert into public.share_links(id,organization_id,calculator_id,token_hash,label,created_by) values
 ('40000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','token-1','Owner Link','00000000-0000-0000-0000-000000000001');

insert into public.ai_usage_events(user_id,organization_id,feature) values
 ('00000000-0000-0000-0000-000000000004','10000000-0000-0000-0000-000000000001','finder'),
 ('00000000-0000-0000-0000-000000000005','10000000-0000-0000-0000-000000000002','finder'),
 ('00000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000002','finder'),
 ('00000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000001','finder'),
 ('00000000-0000-0000-0000-000000000008','10000000-0000-0000-0000-000000000001','finder');

insert into public.platform_admins(user_id,role,active) values
 ('00000000-0000-0000-0000-000000000001','owner',true),
 ('00000000-0000-0000-0000-000000000002','admin',true),
 ('00000000-0000-0000-0000-000000000006','reviewer',true),
 ('00000000-0000-0000-0000-000000000007','editor',true);
insert into public.calculator_catalog_admin(id,calculator_key,slug,title,category,created_by) values
 ('50000000-0000-0000-0000-000000000001','matrix-test','matrix-test','Matrix Test','math','00000000-0000-0000-0000-000000000001');
insert into public.calculator_qa_checks(id,calculator_id,check_type) values
 ('60000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000001','engine-tests');

set role authenticated;

-- AI: permissive OR semantics. Owner/admin get org aggregate access; every user keeps self-read even outside admin scope.
set request.jwt.claim.sub='00000000-0000-0000-0000-000000000001';
do $$ begin
 if (select count(*) from public.ai_usage_events where organization_id='10000000-0000-0000-0000-000000000001') <> 3 then raise exception 'owner org AI aggregate read failed'; end if;
 if exists(select 1 from public.ai_usage_events where organization_id='10000000-0000-0000-0000-000000000002') then raise exception 'owner saw foreign-org AI event'; end if;
end $$;
set request.jwt.claim.sub='00000000-0000-0000-0000-000000000002';
do $$ begin
 if (select count(*) from public.ai_usage_events) <> 4 then raise exception 'admin must see Test Org aggregate plus own foreign-org event'; end if;
 if not exists(select 1 from public.ai_usage_events where user_id='00000000-0000-0000-0000-000000000002' and organization_id='10000000-0000-0000-0000-000000000002') then raise exception 'admin lost self-read outside admin org'; end if;
end $$;
set request.jwt.claim.sub='00000000-0000-0000-0000-000000000003';
do $$ begin
 if (select count(*) from public.ai_usage_events) <> 1 then raise exception 'manager must see only own AI event'; end if;
end $$;
set request.jwt.claim.sub='00000000-0000-0000-0000-000000000004';
do $$ begin
 if (select count(*) from public.ai_usage_events) <> 1 then raise exception 'member must see only own AI event'; end if;
end $$;
set request.jwt.claim.sub='00000000-0000-0000-0000-000000000008';
do $$ begin
 if (select count(*) from public.ai_usage_events) <> 1 then raise exception 'viewer must see only own AI event'; end if;
end $$;
set request.jwt.claim.sub='00000000-0000-0000-0000-000000000005';
do $$ begin
 if (select count(*) from public.ai_usage_events) <> 2 then raise exception 'foreign owner must see both Foreign Org events'; end if;
 if exists(select 1 from public.ai_usage_events where organization_id='10000000-0000-0000-0000-000000000001') then raise exception 'foreign owner saw Test Org AI event'; end if;
end $$;

-- Delivery: all org members read; manager can write only rows they create; member/foreign cannot write.
set request.jwt.claim.sub='00000000-0000-0000-0000-000000000004';
do $$ begin
 if not exists(select 1 from public.embed_configs where id='30000000-0000-0000-0000-000000000001') then raise exception 'member embed read failed'; end if;
 if not exists(select 1 from public.share_links where id='40000000-0000-0000-0000-000000000001') then raise exception 'member share read failed'; end if;
 begin
  insert into public.share_links(organization_id,calculator_id,token_hash,created_by) values
   ('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','member-denied','00000000-0000-0000-0000-000000000004');
  raise exception 'member share write unexpectedly succeeded';
 exception when insufficient_privilege then null; end;
end $$;

set request.jwt.claim.sub='00000000-0000-0000-0000-000000000003';
insert into public.share_links(organization_id,calculator_id,token_hash,created_by) values
 ('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','manager-ok','00000000-0000-0000-0000-000000000003');
do $$ begin
 begin
  insert into public.embed_configs(organization_id,calculator_id,public_key,name,created_by) values
   ('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','zyxwvutsrqponmlkjihgfedc','Bad Creator','00000000-0000-0000-0000-000000000001');
  raise exception 'manager forged embed creator';
 exception when insufficient_privilege then null; end;
end $$;

set request.jwt.claim.sub='00000000-0000-0000-0000-000000000005';
do $$ begin
 if exists(select 1 from public.embed_configs) then raise exception 'foreign embed visible'; end if;
 if exists(select 1 from public.share_links) then raise exception 'foreign share visible'; end if;
end $$;

-- QA: editor gets platform-admin read but not reviewer write; reviewer writes; ordinary member denied.
set request.jwt.claim.sub='00000000-0000-0000-0000-000000000007';
do $$ begin
 if not exists(select 1 from public.calculator_qa_checks where id='60000000-0000-0000-0000-000000000001') then raise exception 'editor QA read failed'; end if;
 begin
  update public.calculator_qa_checks set details='editor denied' where id='60000000-0000-0000-0000-000000000001';
  if found then raise exception 'editor QA write unexpectedly succeeded'; end if;
 end;
end $$;

set request.jwt.claim.sub='00000000-0000-0000-0000-000000000006';
update public.calculator_qa_checks set details='reviewer allowed' where id='60000000-0000-0000-0000-000000000001';
select 1 / case when exists(
 select 1 from public.calculator_qa_checks
 where id='60000000-0000-0000-0000-000000000001' and details='reviewer allowed'
) then 1 else 0 end as reviewer_qa_write_verified;

set request.jwt.claim.sub='00000000-0000-0000-0000-000000000004';
do $$ begin
 if exists(select 1 from public.calculator_qa_checks) then raise exception 'ordinary user QA visible'; end if;
end $$;

\echo 'Overlapping RLS behavioral checks passed'
