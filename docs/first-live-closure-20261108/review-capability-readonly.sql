BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY;
SELECT clock_timestamp() AS observed_at, current_setting('transaction_read_only') AS read_only, role, count(*) AS active_role_count FROM public.platform_admins WHERE active GROUP BY role ORDER BY role;
ROLLBACK;