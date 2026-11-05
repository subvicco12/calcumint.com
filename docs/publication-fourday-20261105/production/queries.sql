-- schema
BEGIN TRANSACTION READ ONLY; SELECT table_name,column_name,data_type FROM information_schema.columns WHERE table_schema='public' AND (table_name ~* 'calcul|certif|review|source|publication|canonical|qa') ORDER BY table_name,ordinal_position; COMMIT;

-- source_counts
BEGIN TRANSACTION READ ONLY;
SELECT now() AS observed_at, lifecycle, count(*) FROM public.calculator_catalog_admin GROUP BY lifecycle ORDER BY lifecycle;
SELECT c.id,c.calculator_key,c.slug,c.version,c.lifecycle,c.risk_class,c.source_count,c.reviewer_id IS NOT NULL AS reviewer_assigned,c.publish_at,c.published_at,c.last_reviewed_at,c.next_review_due_at,c.metadata->'certification' AS certification,c.metadata->'canonical' AS canonical FROM public.calculator_catalog_admin c ORDER BY c.slug;
SELECT event_type,from_state,to_state,count(*) AS count FROM public.calculator_review_events GROUP BY event_type,from_state,to_state ORDER BY event_type,from_state,to_state;
SELECT check_type,status,count(*) AS count FROM public.calculator_qa_checks GROUP BY check_type,status ORDER BY check_type,status;
SELECT source_kind,count(*) AS count,count(*) FILTER(WHERE reviewed_at IS NOT NULL) AS reviewed_count FROM public.calculator_source_evidence GROUP BY source_kind ORDER BY source_kind;
COMMIT;

-- catalog
BEGIN TRANSACTION READ ONLY;
SELECT jsonb_build_object(
'observed_at',now(),
'lifecycle_counts',(SELECT jsonb_agg(t) FROM (SELECT lifecycle,count(*) AS count FROM public.calculator_catalog_admin GROUP BY lifecycle ORDER BY lifecycle)t),
'catalog',(SELECT jsonb_agg(t) FROM (SELECT id,calculator_key,slug,version,lifecycle,risk_class,source_count,reviewer_id IS NOT NULL AS reviewer_assigned,publish_at,published_at,last_reviewed_at,next_review_due_at,metadata->'certification' AS certification,metadata->'canonical' AS canonical FROM public.calculator_catalog_admin ORDER BY slug)t),
'review_event_counts',(SELECT jsonb_agg(t) FROM (SELECT event_type,from_state,to_state,count(*) AS count FROM public.calculator_review_events GROUP BY event_type,from_state,to_state ORDER BY event_type,from_state,to_state)t),
'qa_counts',(SELECT jsonb_agg(t) FROM (SELECT check_type,status,count(*) AS count FROM public.calculator_qa_checks GROUP BY check_type,status ORDER BY check_type,status)t),
'metadata_keys',(SELECT jsonb_agg(t) FROM (SELECT DISTINCT jsonb_object_keys(metadata) AS key FROM public.calculator_catalog_admin ORDER BY key)t)
) AS evidence; COMMIT;

-- functions
BEGIN TRANSACTION READ ONLY; SELECT p.proname,pg_get_functiondef(p.oid) AS definition FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='public' AND (p.proname ~ 'calculator.*(publish|certif|lifecycle|revalid)|published_calculator_manifest') ORDER BY p.proname; COMMIT;

-- details
BEGIN TRANSACTION READ ONLY; SELECT jsonb_build_object(
'sources',(SELECT jsonb_agg(t) FROM (SELECT c.slug,s.id,s.label,s.url,s.source_kind,s.reviewed_at,s.reviewed_by IS NOT NULL AS reviewer_recorded FROM public.calculator_source_evidence s JOIN public.calculator_catalog_admin c ON c.id=s.calculator_id ORDER BY c.slug,s.id)t),
'qa',(SELECT jsonb_agg(t) FROM (SELECT c.slug,q.check_type,q.status,q.checked_at,q.checked_by IS NOT NULL AS checker_recorded FROM public.calculator_qa_checks q JOIN public.calculator_catalog_admin c ON c.id=q.calculator_id ORDER BY c.slug,q.check_type)t),
'review_events',(SELECT jsonb_agg(t) FROM (SELECT c.slug,e.id,e.event_type,e.from_state,e.to_state,e.created_at,e.actor_id IS NOT NULL AS actor_recorded FROM public.calculator_review_events e JOIN public.calculator_catalog_admin c ON c.id=e.calculator_id ORDER BY e.created_at)t),
'mapping',(SELECT jsonb_agg(t) FROM (SELECT slug,calculator_key,metadata->'repositorySource' AS repository_source,metadata->'rulePackRequired' AS rule_pack_required FROM public.calculator_catalog_admin ORDER BY slug)t)
) AS evidence; COMMIT;
