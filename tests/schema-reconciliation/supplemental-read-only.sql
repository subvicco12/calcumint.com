-- Each statement group was independently executed through authenticated Supabase.
-- Full main capture: unchanged tests/batch17-capture/export.sql.
BEGIN READ ONLY;
SELECT e.extname,n.nspname AS schema,e.extversion
FROM pg_extension e JOIN pg_namespace n ON n.oid=e.extnamespace ORDER BY 1;
COMMIT;

BEGIN READ ONLY;
SELECT p.oid::regprocedure::text AS signature,e.extname
FROM pg_proc p JOIN pg_depend d ON d.classid='pg_proc'::regclass
 AND d.objid=p.oid AND d.deptype='e'
JOIN pg_extension e ON e.oid=d.refobjid
JOIN pg_namespace n ON n.oid=p.pronamespace
WHERE n.nspname='extensions' ORDER BY 1;
COMMIT;

BEGIN READ ONLY;
SELECT version,name,cardinality(statements) AS statement_count,
 md5(array_to_json(statements)::text) AS statements_md5
FROM supabase_migrations.schema_migrations ORDER BY version;
COMMIT;

BEGIN READ ONLY;
SELECT '2026-11-01' ~ '^\\d{4}-\\d{2}-\\d{2}$'
 AS captured_double_backslash_pattern_accepts_iso,
 '2026-11-01' ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
 AS explicit_ascii_pattern_accepts_iso,
 current_setting('standard_conforming_strings') AS standard_conforming_strings;
COMMIT;
