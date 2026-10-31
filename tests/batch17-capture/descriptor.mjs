import {createHash} from 'node:crypto';
export const PUBLIC_TABLES=["admin_alerts", "ai_usage_events", "api_usage_events", "batch_calculation_jobs", "batch_request_receipts", "billing_account_fences", "billing_atomic_completions", "billing_customers", "billing_webhook_events", "business_api_keys", "business_projects", "business_webhook_endpoints", "calculation_history", "calculation_projects", "calculator_bulk_jobs", "calculator_catalog_admin", "calculator_qa_checks", "calculator_review_events", "calculator_source_evidence", "client_workspaces", "custom_calculator_runs", "custom_calculator_versions", "custom_calculators", "embed_configs", "embed_events", "embed_lead_receipts", "embed_leads", "favorites", "lead_consents", "organization_audit_log", "organization_invitations", "organization_members", "organizations", "platform_admins", "profiles", "saved_scenarios", "share_links", "shared_calculations", "subscriptions", "user_preferences", "webhook_deliveries"];
export const AUTH_TABLES=["audit_log_entries", "custom_oauth_providers", "flow_state", "identities", "instances", "mfa_amr_claims", "mfa_challenges", "mfa_factors", "mfa_recovery_code_sets", "mfa_recovery_codes", "oauth_authorizations", "oauth_client_states", "oauth_clients", "oauth_consents", "one_time_tokens", "refresh_tokens", "saml_providers", "saml_relay_states", "schema_migrations", "scim_tokens", "scim_users", "sessions", "sso_domains", "sso_providers", "users", "webauthn_challenges", "webauthn_credentials"];
export const MIGRATION_FILES=["001_b3_accounts.sql", "002_b4_billing.sql", "003_b5_business.sql", "004_b6_builder.sql", "005_b7_delivery.sql", "006_b8_api_automation.sql", "007_b9_ai.sql", "008_b10_admin_factory.sql", "008b_b10_alert_automation.sql", "009_country_preferences.sql", "010_b7_pro_workspace.sql", "011_b8_free_save_quotas.sql", "012_production_fk_indexes.sql", "013_production_rpc_privilege_hardening_v2.sql", "014_production_entitlement_rpc_sync.sql", "016_final_certification_evidence_gate.sql", "017_regulatory_rule_pack_evidence.sql", "018_harden_rule_pack_required_metadata.sql", "019_authoritative_lifecycle_enforcement.sql", "020_post_certification_revalidation.sql", "021_require_rule_pack_provenance.sql", "022_harden_reviewer_waiver_authority.sql", "023_structured_source_evidence.sql", "024_reviewer_assignment_authority.sql", "025_derived_source_count_authority.sql", "026_publication_manifest_authority.sql", "027_publication_trigger_privilege_hardening.sql", "028_source_evidence_reviewer_index.sql", "029_account_rls_auth_initplan.sql", "030_billing_ai_rls_auth_initplan.sql", "031_admin_identity_rls_auth_initplan.sql", "032_atomic_reviewer_qa_audit.sql", "032_business_builder_rls_auth_initplan.sql", "033_atomic_reviewer_assignment_audit.sql", "033_pro_workspace_rls_auth_initplan.sql", "034_atomic_lifecycle_transition_audit.sql", "034_billing_webhook_event_privileges.sql", "035_atomic_catalog_creation.sql", "035_split_overlapping_write_policies.sql", "036_consolidate_ai_usage_read_policy.sql", "037_builder_publish_business_entitlement.sql", "038_client_account_billing_privileges.sql"];
export const SECTIONS=['unsupportedObjects','types','sequences','effectiveSchemaGrants','effectiveSequenceGrants','schemas','relations','columns','constraints','indexes','triggers','policies','functions','effectiveTableGrants','effectiveColumnGrants','effectiveFunctionGrants','roleMemberships','roles','defaultPrivileges','authMigrationLedger','migrationLedger','effectLedger'];
const text=x=>typeof x==='string'&&x.length>0;
const string=x=>typeof x==='string';
const bool=x=>typeof x==='boolean';
const nullable=x=>x===null||string(x);
const strings=x=>Array.isArray(x)&&x.every(text)&&new Set(x).size===x.length;
const integer=x=>Number.isSafeInteger(x)&&x>=0;
const fields={
 unsupportedObjects:{id:text,class:text},
 types:{id:text,owner:text,acl:nullable,definition:text},
 sequences:{id:text,owner:text,acl:nullable,definition:text},
 effectiveSchemaGrants:{id:text,schema:text,role:text,privilege:text,allowed:bool},
 effectiveSequenceGrants:{id:text,sequence:text,role:text,privilege:text,allowed:bool},
 schemas:{id:text,owner:text,acl:nullable},
 relations:{id:text,schema:text,name:text,owner:text,rls:bool,forceRls:bool,acl:nullable,kind:text},
 columns:{id:text,relation:text,name:text,position:integer,type:text,notNull:bool,default:nullable,identity:string,generated:string,acl:nullable},
 constraints:{id:text,relation:text,name:text,validated:bool,definition:text},
 indexes:{id:text,relation:text,definition:text,valid:bool,ready:bool,live:bool,unique:bool,primary:bool},
 triggers:{id:text,relation:text,name:text,definition:text,enabled:x=>['O','D','R','A'].includes(x),internal:bool},
 policies:{id:text,relation:text,name:text,command:text,permissive:bool,using:nullable,check:nullable,roles:strings},
 functions:{id:text,owner:text,definer:bool,config:x=>x===null||strings(x),acl:nullable,definition:text},
 effectiveTableGrants:{id:text,relation:text,role:text,privilege:text,allowed:bool},
 effectiveColumnGrants:{id:text,column:text,role:text,privilege:text,allowed:bool},
 effectiveFunctionGrants:{id:text,signature:text,role:text,allowed:bool},
 roleMemberships:{id:text,role:text,memberOf:text,grantor:text,admin:bool,inherit:bool,set:bool},
 roles:{id:text,superuser:bool,inherit:bool,createRole:bool,createDb:bool,login:bool,replication:bool,bypassRls:bool,config:x=>x===null||strings(x)},
 defaultPrivileges:{id:text,owner:text,schema:nullable,type:text,acl:text},
 authMigrationLedger:{id:text},
 migrationLedger:{id:text,source:text,evidence:text,disposition:text},
 effectLedger:{id:text,source:text,evidence:text,disposition:text},
};
function require(ok){if(!ok)throw Error('Incomplete, incompatible or malformed full capture; no equality established');}
function object(x,f){require(x&&typeof x==='object'&&!Array.isArray(x));require(JSON.stringify(Object.keys(x).sort())===JSON.stringify(Object.keys(f).sort()));for(const [k,valid]of Object.entries(f))require(valid(x[k]));}
export function validate(d,{allowUnavailableLedgers=false}={}){
 object(d,{format:x=>x==='calcumint-full-catalog-v1',scope:x=>x&&typeof x==='object',server:x=>x&&typeof x==='object',sections:x=>x&&typeof x==='object'});
 object(d.scope,{schemas:x=>JSON.stringify(x)===JSON.stringify(['auth','public']),publicTables:x=>JSON.stringify(x)===JSON.stringify(PUBLIC_TABLES),authTables:x=>JSON.stringify(x)===JSON.stringify(AUTH_TABLES),migrationFiles:x=>JSON.stringify(x)===JSON.stringify(MIGRATION_FILES),roles:x=>JSON.stringify(x)===JSON.stringify(['anon','authenticated','service_role'])});
 object(d.server,{major:x=>x===17});
 require(JSON.stringify(Object.keys(d.sections).sort())===JSON.stringify([...SECTIONS].sort()));
 for(const s of SECTIONS){const section=d.sections[s];object(section,{status:x=>x==='COMPLETE'||(allowUnavailableLedgers&&['migrationLedger','effectLedger'].includes(s)&&['UNKNOWN','MISSING'].includes(x)),count:integer,rows:Array.isArray});require(section.count===section.rows.length);if(section.status!=='COMPLETE')require(section.count===0);for(const row of section.rows)object(row,fields[s]);require(new Set(section.rows.map(r=>r.id)).size===section.rows.length);}
 const rows=s=>d.sections[s].rows;require(rows('unsupportedObjects').length===0);
 require(JSON.stringify(rows('schemas').map(r=>r.id).sort())===JSON.stringify(d.scope.schemas));for(const role of d.scope.roles)require(rows('roles').some(r=>r.id===role));for(const s of ['authMigrationLedger','migrationLedger','effectLedger'])if(d.sections[s].status==='COMPLETE')require(rows(s).length>0);
 for(const s of ['migrationLedger','effectLedger'])if(d.sections[s].status==='COMPLETE')require(JSON.stringify(rows(s).map(r=>r.id).sort())===JSON.stringify([...MIGRATION_FILES].sort()));
 const tables=rows('relations');require(JSON.stringify(tables.filter(r=>r.schema==='public').map(r=>r.name).sort())===JSON.stringify(PUBLIC_TABLES));
 require(JSON.stringify(tables.filter(r=>r.schema==='auth').map(r=>r.name).sort())===JSON.stringify(AUTH_TABLES));
 require(tables.every(r=>d.scope.schemas.includes(r.schema)&&r.id===`${r.schema}.${r.name}`));
 for(const s of ['columns','constraints','indexes','triggers','policies','effectiveTableGrants'])require(rows(s).every(r=>tables.some(t=>t.id===r.relation)));
 for(const t of tables){require(rows('columns').some(c=>c.relation===t.id));const grants=rows('effectiveTableGrants').filter(g=>g.relation===t.id);require(grants.length===21);for(const role of d.scope.roles)for(const privilege of ['SELECT','INSERT','UPDATE','DELETE','TRUNCATE','REFERENCES','TRIGGER'])require(grants.filter(g=>g.role===role&&g.privilege===privilege).length===1);}
 for(const [section,parent,field,privileges]of [['effectiveSchemaGrants','schemas','schema',['USAGE','CREATE']],['effectiveSequenceGrants','sequences','sequence',['USAGE','SELECT','UPDATE']]]){require(rows(section).every(g=>rows(parent).some(p=>p.id===g[field])));for(const p of rows(parent)){const grants=rows(section).filter(g=>g[field]===p.id);require(grants.length===privileges.length*3);for(const role of d.scope.roles)for(const privilege of privileges)require(grants.filter(g=>g.role===role&&g.privilege===privilege).length===1);}}
 for(const c of rows('columns')){const grants=rows('effectiveColumnGrants').filter(g=>g.column===c.id);require(grants.length===12);for(const role of d.scope.roles)for(const privilege of ['SELECT','INSERT','UPDATE','REFERENCES'])require(grants.filter(g=>g.role===role&&g.privilege===privilege).length===1);}require(rows('effectiveColumnGrants').every(g=>rows('columns').some(c=>c.id===g.column)));
 for(const f of rows('functions')){const grants=rows('effectiveFunctionGrants').filter(g=>g.signature===f.id);require(grants.length===3);for(const role of d.scope.roles)require(grants.filter(g=>g.role===role).length===1);}
 require(rows('effectiveFunctionGrants').every(g=>rows('functions').some(f=>f.id===g.signature)));
 return d;
}
export function canonical(x){if(Array.isArray(x))return x.map(canonical).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)));if(x&&typeof x==='object')return Object.fromEntries(Object.keys(x).sort().map(k=>[k,canonical(x[k])]));return x;}
const hash=x=>createHash('sha256').update(JSON.stringify(canonical(x))).digest('hex');
export function compare(a,b){validate(a);validate(b);const differentSections=SECTIONS.filter(s=>hash(a.sections[s])!==hash(b.sections[s]));return {equal:differentSections.length===0,differentSections,modelSha256:hash(a),captureSha256:hash(b),scope:'Declared public/auth PostgreSQL17 catalog and externally observed ledgers only',captureProvenanceVerified:false,adoptionAuthorized:false,productionEquivalence:'UNKNOWN'};}

export function reconcile(a,b){validate(a,{allowUnavailableLedgers:true});validate(b,{allowUnavailableLedgers:true});const blockedSections=SECTIONS.filter(s=>a.sections[s].status!=='COMPLETE'||b.sections[s].status!=='COMPLETE').sort();const differentSections=SECTIONS.filter(s=>!blockedSections.includes(s)&&hash(a.sections[s])!==hash(b.sections[s]));return {equal:blockedSections.length===0&&differentSections.length===0,catalogMatches:differentSections.filter(s=>!['migrationLedger','effectLedger'].includes(s)).length===0,blockedSections,differentSections,captureProvenanceVerified:false,adoptionAuthorized:false,productionEquivalence:'UNKNOWN'};}
