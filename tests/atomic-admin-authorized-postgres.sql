-- Authorized success paths in a disposable database; outer transaction rolls back.
\set ON_ERROR_STOP on
begin;
set role authenticated;
set request.jwt.claim.sub = '00000000-0000-0000-0000-000000000001';
do $owner$
declare
  v_calc uuid := '50000000-0000-0000-0000-000000000001';
  v_reviewer uuid := '00000000-0000-0000-0000-000000000006';
  v_count integer;
begin
  perform public.assign_calculator_reviewer(v_calc,v_reviewer);
  if (select reviewer_id from public.calculator_catalog_admin where id=v_calc) is distinct from v_reviewer then
    raise exception 'Owner reviewer assignment did not persist';
  end if;
  select count(*) into v_count from public.calculator_review_events
  where calculator_id=v_calc and event_type='reviewer-assigned'
    and actor_id=auth.uid() and metadata->>'reviewerId'=v_reviewer::text;
  if v_count <> 1 then raise exception 'Owner assignment audit missing or duplicated: %',v_count; end if;
  perform public.transition_calculator_with_audit(v_calc,'draft','review');
  if (select lifecycle from public.calculator_catalog_admin where id=v_calc) <> 'review' then
    raise exception 'Owner draft to review transition did not persist';
  end if;
  select count(*) into v_count from public.calculator_review_events
  where calculator_id=v_calc and event_type='lifecycle-transition'
    and from_state='draft' and to_state='review' and actor_id=auth.uid();
  if v_count <> 1 then raise exception 'Owner lifecycle audit missing or duplicated: %',v_count; end if;
end
$owner$;
set request.jwt.claim.sub = '00000000-0000-0000-0000-000000000006';
do $reviewer$
declare
  v_calc uuid := '50000000-0000-0000-0000-000000000001';
  v_count integer;
begin
  perform public.record_calculator_qa_decision(v_calc,'engine-tests','passed','reviewer verified');
  if not exists (
    select 1 from public.calculator_qa_checks where calculator_id=v_calc
      and check_type='engine-tests' and status='passed'
      and checked_by=auth.uid() and details='reviewer verified'
  ) then raise exception 'Reviewer QA decision did not persist'; end if;
  select count(*) into v_count from public.calculator_review_events
    where calculator_id=v_calc and event_type='qa-check'
      and actor_id=auth.uid() and notes='engine-tests: passed';
  if v_count <> 1 then raise exception 'Reviewer QA audit missing or duplicated: %',v_count; end if;
end
$reviewer$;
rollback;
