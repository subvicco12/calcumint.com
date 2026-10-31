// Read-only catalog descriptor. No row data, credentials or execution adapter.
import {createHash} from 'node:crypto';
export const BUSINESS_DESCRIPTOR_SQL=`WITH relations AS (
 SELECT c.oid,c.relname,c.relowner,c.relrowsecurity,c.relforcerowsecurity,c.relacl
 FROM pg_catalog.pg_class c JOIN pg_catalog.pg_namespace n ON n.oid=c.relnamespace
 WHERE n.nspname='public' AND c.relname IN ('organizations','organization_members','organization_invitations','organization_audit_log','business_projects','client_workspaces','shared_calculations')
), functions AS (
 SELECT p.oid,p.proname,p.proowner,p.prosecdef,p.proconfig,p.proacl FROM pg_catalog.pg_proc p JOIN pg_catalog.pg_namespace n ON n.oid=p.pronamespace
 WHERE n.nspname='public' AND p.proname IN ('accept_business_invitation','create_business_organization','is_org_member','has_org_role','org_role','membership_identity_fence_v1','organization_owner_fence_v1')
) SELECT jsonb_build_object(
 'scope','batch16-business-catalog-v1',
 'relations',(SELECT jsonb_agg(jsonb_build_object('name',relname,'owner',pg_get_userbyid(relowner),'rls',relrowsecurity,'forceRls',relforcerowsecurity,'acl',relacl::text) ORDER BY relname) FROM relations),
 'columns',(SELECT jsonb_agg(jsonb_build_object('table',r.relname,'name',a.attname,'type',format_type(a.atttypid,a.atttypmod),'notNull',a.attnotnull,'default',pg_get_expr(d.adbin,d.adrelid)) ORDER BY r.relname,a.attnum) FROM relations r JOIN pg_attribute a ON a.attrelid=r.oid LEFT JOIN pg_attrdef d ON d.adrelid=a.attrelid AND d.adnum=a.attnum WHERE a.attnum>0 AND NOT a.attisdropped),
 'constraints',(SELECT jsonb_agg(jsonb_build_object('table',r.relname,'name',c.conname,'validated',c.convalidated,'definition',pg_get_constraintdef(c.oid,false)) ORDER BY r.relname,c.conname) FROM relations r JOIN pg_constraint c ON c.conrelid=r.oid),
 'policies',(SELECT jsonb_agg(jsonb_build_object('table',r.relname,'name',p.polname,'command',p.polcmd,'using',pg_get_expr(p.polqual,p.polrelid),'check',pg_get_expr(p.polwithcheck,p.polrelid),'roles',(SELECT jsonb_agg(CASE WHEN roleid=0 THEN 'public' ELSE pg_get_userbyid(roleid) END ORDER BY roleid) FROM unnest(p.polroles) roleid)) ORDER BY r.relname,p.polname) FROM relations r JOIN pg_policy p ON p.polrelid=r.oid),
 'triggers',(SELECT jsonb_agg(jsonb_build_object('table',r.relname,'name',t.tgname,'definition',pg_get_triggerdef(t.oid,false)) ORDER BY r.relname,t.tgname) FROM relations r JOIN pg_trigger t ON t.tgrelid=r.oid WHERE NOT t.tgisinternal),
 'functions',(SELECT jsonb_agg(jsonb_build_object('signature',oid::regprocedure::text,'owner',pg_get_userbyid(proowner),'definer',prosecdef,'config',proconfig,'acl',proacl::text,'definition',pg_get_functiondef(oid)) ORDER BY oid::regprocedure::text) FROM functions),
 'effectiveTableGrants',(SELECT jsonb_agg(jsonb_build_object('table',r.relname,'role',v.role,'privilege',v.priv,'allowed',has_table_privilege(v.role,r.oid,v.priv)) ORDER BY r.relname,v.role,v.priv) FROM relations r CROSS JOIN (SELECT role,priv FROM unnest(ARRAY['anon','authenticated','service_role']) role CROSS JOIN unnest(ARRAY['SELECT','INSERT','UPDATE','DELETE','TRUNCATE','REFERENCES','TRIGGER']) priv) v),
 'roleMemberships',(SELECT coalesce(jsonb_agg(jsonb_build_object('role',r.rolname,'memberOf',p.rolname) ORDER BY r.rolname,p.rolname),'[]'::jsonb) FROM pg_auth_members m JOIN pg_roles r ON r.oid=m.member JOIN pg_roles p ON p.oid=m.roleid WHERE r.rolname IN ('anon','authenticated','service_role'))
);`;
export function canonical(value){if(Array.isArray(value))return value.map(canonical);if(value&&typeof value==='object')return Object.fromEntries(Object.keys(value).sort().map(k=>[k,canonical(value[k])]));return value;}
export const descriptorHash=value=>createHash('sha256').update(JSON.stringify(canonical(value))).digest('hex');
export function compareDescriptors(model,capture){return {scope:'business-catalog-only; not hosted equivalence',equal:descriptorHash(model)===descriptorHash(capture),modelSha256:descriptorHash(model),captureSha256:descriptorHash(capture),differentSections:[...new Set([...Object.keys(model),...Object.keys(capture)])].filter(k=>JSON.stringify(canonical(model[k]))!==JSON.stringify(canonical(capture[k]))).sort()};}
