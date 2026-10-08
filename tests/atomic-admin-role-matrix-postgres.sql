-- Isolated PostgreSQL CI only: role-specific admin RPC denials.
\set ON_ERROR_STOP on
begin;
set role authenticated;
set request.jwt.claim.sub = '00000000-0000-0000-0000-000000000007';
do $editor$
declare
  v_error text;
  v_calc uuid := '50000000-0000-0000-0000-000000000001';
begin
  v_error := null;
  begin
    perform public.record_calculator_qa_decision(v_calc,'engine-tests','passed','editor');
  exception when others then v_error := sqlerrm; end;
  if v_error is distinct from 'Reviewer permission required' then
    raise exception 'Editor QA denial mismatch: %', v_error;
  end if;
  v_error := null;
  begin
    perform public.assign_calculator_reviewer(v_calc,'00000000-0000-0000-0000-000000000006');
  exception when others then v_error := sqlerrm; end;
  if v_error is distinct from 'Admin permission required' then
    raise exception 'Editor assignment denial mismatch: %', v_error;
  end if;
  v_error := null;
  begin
    perform public.create_catalog_calculator_with_audit('editor-denied','editor-denied','Editor','Testing','standard','{}'::jsonb);
  exception when others then v_error := sqlerrm; end;
  if v_error is distinct from 'Platform admin permission required' then
    raise exception 'Editor catalog creation denial mismatch: %', v_error;
  end if;
  v_error := null;
  begin
    perform public.transition_calculator_with_audit(v_calc,'draft','certified');
  exception when others then v_error := sqlerrm; end;
  if v_error is distinct from 'Invalid lifecycle transition' then
    raise exception 'Editor invalid transition denial mismatch: %', v_error;
  end if;
end
$editor$;
set request.jwt.claim.sub = '00000000-0000-0000-0000-000000000006';
do $reviewer$
declare
  v_error text;
  v_calc uuid := '50000000-0000-0000-0000-000000000001';
begin
  v_error := null;
  begin
    perform public.assign_calculator_reviewer(v_calc,'00000000-0000-0000-0000-000000000006');
  exception when others then v_error := sqlerrm; end;
  if v_error is distinct from 'Admin permission required' then
    raise exception 'Reviewer assignment denial mismatch: %', v_error;
  end if;
  v_error := null;
  begin
    perform public.record_calculator_qa_decision(v_calc,'engine-tests','waived','reviewer');
  exception when others then v_error := sqlerrm; end;
  if v_error is distinct from 'Owner or admin permission required to waive QA evidence' then
    raise exception 'Reviewer waiver denial mismatch: %', v_error;
  end if;
  v_error := null;
  begin
    perform public.transition_calculator_with_audit(v_calc,'certified','published');
  exception when others then v_error := sqlerrm; end;
  if v_error is distinct from 'Reviewer cannot publish calculators' then
    raise exception 'Reviewer publication denial mismatch: %', v_error;
  end if;
end
$reviewer$;
rollback;
