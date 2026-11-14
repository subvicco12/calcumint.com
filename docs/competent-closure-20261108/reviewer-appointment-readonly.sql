BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY;
WITH wanted(master_id,engine_id,slug,version) AS (VALUES (440,'conversion.frequency','frequency-converter',1),(432,'conversion.time','time-converter',1))
SELECT clock_timestamp() AS observed_at,current_setting('transaction_read_only') AS read_only,current_user AS observed_actor,(SELECT rolbypassrls FROM pg_roles WHERE rolname=current_user) AS actor_bypass_rls,w.master_id,w.engine_id,w.slug,w.version,
count(c.id)::integer AS exact_candidate_count,
count(c.reviewer_id)::integer AS assigned_candidate_count,
count(c.id) FILTER (WHERE c.reviewer_id IS NOT NULL AND a.user_id IS NULL)::integer AS assigned_without_platform_role_count,
count(c.id) FILTER (WHERE a.active AND a.role IN ('owner','admin','reviewer'))::integer AS active_review_capable_assignment_count,
coalesce(jsonb_agg(jsonb_build_object('role',a.role,'active',a.active)) FILTER (WHERE c.reviewer_id IS NOT NULL),'[]'::jsonb) AS assigned_role_states
FROM wanted w LEFT JOIN public.calculator_catalog_admin c ON c.calculator_key=w.engine_id AND c.slug=w.slug AND c.version=w.version
LEFT JOIN public.platform_admins a ON a.user_id=c.reviewer_id
GROUP BY w.master_id,w.engine_id,w.slug,w.version ORDER BY w.master_id;
ROLLBACK;
