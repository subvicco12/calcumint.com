-- Disposable workflow-managed services only. Never apply to production.
CREATE ROLE anon;
CREATE ROLE authenticated;
CREATE ROLE service_role BYPASSRLS;
CREATE ROLE supabase_auth_admin LOGIN;
CREATE SCHEMA auth AUTHORIZATION supabase_auth_admin;
GRANT USAGE ON SCHEMA public TO supabase_auth_admin;
ALTER ROLE supabase_auth_admin SET search_path=auth,public;
CREATE SCHEMA calcumint_disposable;
REVOKE ALL ON SCHEMA calcumint_disposable FROM PUBLIC;
CREATE TABLE calcumint_disposable.identity(run_id text NOT NULL,workflow_sha text NOT NULL,service_id text NOT NULL);
INSERT INTO calcumint_disposable.identity VALUES(:'run_id',:'workflow_sha',:'service_id');
REVOKE ALL ON calcumint_disposable.identity FROM PUBLIC;
