import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
export const migrations=['001_b3_accounts','002_b4_billing','009_country_preferences','010_b7_pro_workspace','029_account_rls_auth_initplan'];
export async function initializeSchema(sql){
 // auth tables AND helpers are owned by upstream GoTrue migrations, never modeled here.
 assert.equal(await sql("SELECT count(*) FROM auth.schema_migrations;"),'75');
 const helper=await sql("SELECT pg_get_functiondef('auth.uid()'::regprocedure);");
 assert.match(helper,/request.jwt.claims/);
 assert.equal(await sql("SELECT pg_get_userbyid(proowner) FROM pg_proc WHERE oid='auth.uid()'::regprocedure;"),'supabase_auth_admin');
 const hashes={};
 for(const name of migrations){const source=await readFile(new URL(`../../supabase/migrations/${name}.sql`,import.meta.url),'utf8');hashes[name]=createHash('sha256').update(source).digest('hex');await sql(source);}
 // Explicit isolated platform ACL contract, not an assertion about a hosted project.
 await sql(`GRANT USAGE ON SCHEMA public,auth TO anon,authenticated,service_role;
 GRANT SELECT ON public.profiles,public.user_preferences,public.favorites,public.calculation_history,public.subscriptions,public.calculation_projects,public.saved_scenarios TO authenticated;
 GRANT INSERT,DELETE ON public.calculation_history,public.favorites TO authenticated;
 GRANT INSERT,UPDATE ON public.user_preferences TO authenticated;
 GRANT USAGE,SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;`);
 return {migrations:hashes,authUidOwner:'supabase_auth_admin',authMigrationCount:75,scope:'Selective unchanged repository migrations; explicit isolated platform ACLs; no proposals; production equivalence UNKNOWN'};
}
