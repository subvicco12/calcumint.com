-- Rollback-only PostgreSQL positive lifecycle regression.
\set ON_ERROR_STOP on
begin;
reset role;
set request.jwt.claim.role = 'service_role';
update public.calculator_catalog_admin set lifecycle='review' where calculator_key='matrix-test';
-- Publication fixture is intentionally built through the certified path.
-- This regression is a placeholder only until the full published fixture is available.
rollback;
