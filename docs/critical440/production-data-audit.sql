BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY;
SET LOCAL search_path=pg_catalog;
SET LOCAL statement_timeout='20s';
WITH critical AS MATERIALIZED(SELECT * FROM public.calculator_catalog_admin WHERE lifecycle IN ('certified','published')),
 required AS (
 SELECT c.id,q.check_type FROM critical c CROSS JOIN LATERAL unnest(ARRAY['engine-tests','formula-review','sources','methodology','reverse-solve','visualization-reconciliation','schedule-reconciliation','scenario-reconciliation','sensitivity-validation','entitlement-validation','ux-responsive','performance','security','seo-content','accessibility']::text[] || CASE WHEN lower(trim(coalesce(c.metadata->>'rulePackRequired','')))='true' THEN ARRAY['rule-pack-validation']::text[] ELSE ARRAY[]::text[] END || CASE WHEN c.risk_class IN ('financial','health','tax') THEN ARRAY['ymyl-review']::text[] ELSE ARRAY[]::text[] END) q(check_type)
), missing AS (
 SELECT r.check_type,q.status,count(*) AS records FROM required r LEFT JOIN public.calculator_qa_checks q ON q.calculator_id=r.id AND q.check_type=r.check_type WHERE q.status IS NULL OR q.status NOT IN ('passed','waived') GROUP BY r.check_type,q.status
)
SELECT jsonb_build_object(
 'observedAt',clock_timestamp(),'readOnly',current_setting('transaction_read_only'),
 'catalogByStateRiskVersion',(SELECT jsonb_agg(to_jsonb(s) ORDER BY s.lifecycle,s.risk_class,s.version) FROM(SELECT lifecycle,risk_class,version,count(*) AS records FROM public.calculator_catalog_admin GROUP BY lifecycle,risk_class,version) s),
 'catalogRowDigest',(SELECT encode(sha256(convert_to(coalesce(jsonb_agg(to_jsonb(c) ORDER BY c.id),'[]'::jsonb)::text,'UTF8')),'hex') FROM public.calculator_catalog_admin c),
 'criticalMissingOrUnreadyChecks',(SELECT jsonb_agg(to_jsonb(m) ORDER BY m.check_type,m.status) FROM missing m),
 'criticalNoSource',(SELECT count(*) FROM critical c WHERE NOT EXISTS(SELECT 1 FROM public.calculator_source_evidence s WHERE s.calculator_id=c.id)),
 'criticalDerivedSourceCountMismatch',(SELECT count(*) FROM critical c WHERE c.source_count<>(SELECT count(*) FROM public.calculator_source_evidence s WHERE s.calculator_id=c.id)),
 'criticalInvalidSpecialistAssignment',(SELECT count(*) FROM critical c WHERE c.risk_class IN ('financial','health','tax') AND NOT EXISTS(SELECT 1 FROM public.platform_admins a WHERE a.user_id=c.reviewer_id AND a.active AND a.role IN ('owner','admin','reviewer'))),
 'sourceMissingReviewAttribution',(SELECT count(*) FROM public.calculator_source_evidence WHERE reviewed_by IS NULL OR reviewed_at IS NULL),
 'decidedQaMissingAttribution',(SELECT count(*) FROM public.calculator_qa_checks WHERE status IN ('passed','waived') AND (checked_by IS NULL OR checked_at IS NULL)),
 'activePlatformRoles',(SELECT jsonb_agg(to_jsonb(s) ORDER BY s.role) FROM(SELECT role,count(*) AS records FROM public.platform_admins WHERE active GROUP BY role) s),
 'qaByStatus',(SELECT jsonb_object_agg(status,n) FROM(SELECT status,count(*) n FROM public.calculator_qa_checks GROUP BY status) s),
 'jobStates',(SELECT jsonb_agg(to_jsonb(s) ORDER BY s.job_type,s.status) FROM(SELECT job_type,status,count(*) AS records,min(created_at) AS oldest_created,max(created_at) AS newest_created FROM public.calculator_bulk_jobs GROUP BY job_type,status) s),
 'engineBindingMissing',(SELECT count(*) FROM critical WHERE metadata->'engineBinding' IS NULL),
 'engineBindingMismatch',(SELECT count(*) FROM critical WHERE metadata->'engineBinding' IS NOT NULL AND (jsonb_typeof(metadata->'engineBinding') IS DISTINCT FROM 'object' OR metadata#>>'{engineBinding,engineId}' IS DISTINCT FROM calculator_key OR metadata#>>'{engineBinding,slug}' IS DISTINCT FROM slug OR metadata#>>'{engineBinding,version}' IS DISTINCT FROM version::text))
) AS evidence;
COMMIT;
