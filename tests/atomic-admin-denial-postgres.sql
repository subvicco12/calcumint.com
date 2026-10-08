-- Disposable PostgreSQL CI only. Verify denied callers cannot mutate admin data.
\set ON_ERROR_STOP on
begin;
-- The anon role must not be able to execute any transactional admin RPC.
reset role;
set role anon;
do $denials$
declare
  v_signature text;
  v_oid oid;
begin
  foreach v_signature in array array[
    'public.record_calculator_qa_decision(uuid,text,text,text)',
    'public.assign_calculator_reviewer(uuid,uuid)',
    'public.transition_calculator_with_audit(uuid,text,text)',
    'public.create_catalog_calculator_with_audit(text,text,text,text,text,jsonb)'
  ] loop
    v_oid := to_regprocedure(v_signature);
    if v_oid is null then raise exception 'Missing admin RPC %', v_signature; end if;
    if has_function_privilege('anon', v_oid, 'EXECUTE') then
      raise exception 'Anon must not execute %', v_signature;
    end if;
  end loop;
end
$denials$;
reset role;
-- An authenticated user with no platform_admin row must be rejected by all RPCs.
set role authenticated;
set request.jwt.claim.sub = 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee';
do $unauthorized$
declare
  v_calc uuid := '50000000-0000-0000-0000-000000000001';
  v_reviewer uuid := '00000000-0000-0000-0000-000000000006';
  v_call integer;
  v_error text;
begin
  for v_call in 1..4 loop
    v_error := null;
    begin
      case v_call
        when 1 then perform public.record_calculator_qa_decision(v_calc,'engine-tests','passed','unauthorized');
        when 2 then perform public.assign_calculator_reviewer(v_calc,v_reviewer);
        when 3 then perform public.transition_calculator_with_audit(v_calc,'draft','review');
        when 4 then perform public.create_catalog_calculator_with_audit('unauthorized-ci','unauthorized-ci','Unauthorized','Testing','standard','{}'::jsonb);
      end case;
    exception when others then
      v_error := sqlerrm;
    end;
    if v_error is null then raise exception 'Unauthorized RPC % unexpectedly succeeded', v_call; end if;
    if v_error not in ('Reviewer permission required','Admin permission required','Platform admin required','Platform admin permission required') then
      raise exception 'Unexpected unauthorized RPC % failure: %', v_call, v_error;
    end if;
  end loop;
end
$unauthorized$;
rollback;
