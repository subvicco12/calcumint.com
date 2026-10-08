-- Run ONLY against an isolated PostgreSQL test database after migrations 032-035.
-- Read-only catalog checks: verifies deployed RPC signatures, invoker security,
-- role execution privileges, and table RLS. Does not create test users or modify data.
do $$
declare
  v_signature text;
  v_oid oid;
  v_table text;
begin
  foreach v_signature in array array[
    'public.record_calculator_qa_decision(uuid,text,text,text)',
    'public.assign_calculator_reviewer(uuid,uuid)',
    'public.transition_calculator_with_audit(uuid,text,text)',
    'public.create_catalog_calculator_with_audit(text,text,text,text,text,jsonb)'
  ] loop
    v_oid := to_regprocedure(v_signature);
    if v_oid is null then
      raise exception 'Missing transactional admin RPC: %', v_signature;
    end if;
    if (select prosecdef from pg_proc where oid = v_oid) then
      raise exception 'RPC must remain SECURITY INVOKER: %', v_signature;
    end if;
    if has_function_privilege('anon', v_oid, 'EXECUTE') then
      raise exception 'Anonymous role must not execute: %', v_signature;
    end if;
    if not has_function_privilege('authenticated', v_oid, 'EXECUTE') then
      raise exception 'Authenticated role missing RPC execution: %', v_signature;
    end if;
  end loop;
  foreach v_table in array array[
    'platform_admins','calculator_catalog_admin','calculator_qa_checks','calculator_review_events'
  ] loop
    if not exists (
      select 1 from pg_class c
      join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'public' and c.relname = v_table
        and c.relkind in ('r','p') and c.relrowsecurity
    ) then
      raise exception 'RLS must be enabled on public.%', v_table;
    end if;
  end loop;
end
$$;
