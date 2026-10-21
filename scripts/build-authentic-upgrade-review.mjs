// Builds guarded review SQL only. No database adapter, URL, credentials or execution path.
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {ACCOUNT_SCHEMA_PREFLIGHT_SQL} from '../tests/billing/account-schema-preflight.mjs';
const root=new URL('../',import.meta.url);
const files=[
 'supabase/migrations/009_country_preferences.sql',
 'docs/architecture/proposals/20261021-v1-authentic-account-security.sql',
 'supabase/migrations/032_atomic_reviewer_qa_audit.sql',
 'supabase/migrations/033_atomic_reviewer_assignment_audit.sql',
 'supabase/migrations/034_atomic_lifecycle_transition_audit.sql',
 'supabase/migrations/035_atomic_catalog_creation.sql',
 'docs/architecture/proposals/ATOMIC-BILLING-TRANSACTION-PROPOSAL.md',
 'docs/architecture/proposals/ATOMIC-ACCOUNT-HISTORY.sql',
 'docs/architecture/proposals/ATOMIC-API-QUOTA.sql',
 'docs/architecture/proposals/ATOMIC-BATCH-JOB.sql',
 'docs/architecture/proposals/ATOMIC-EMBED-LEAD-CONSENT.sql',
 'docs/architecture/proposals/20261021-v1-atomic-object-privileges.sql'
];
export function buildAuthenticUpgradeReview(){
 const sources=[];
 const bodies=files.map(path=>{
  const raw=readFileSync(new URL(path,root),'utf8');sources.push({path,sha256:createHash('sha256').update(raw).digest('hex')});
  let body=path.endsWith('.md')?raw.match(/```sql\n([\s\S]*?)\n```/)[1]:raw;
  body=body.replace(/DO (\$[a-z_]*\$) BEGIN\s*RAISE EXCEPTION[\s\S]*?END \1;/i,'-- constituent review guard replaced by bundle guard');
  body=body.replace(/^BEGIN;\s*$/m,'').replace(/^COMMIT;\s*$/m,'');return `-- SOURCE ${path}\n${body}`;
 });
 const expected=JSON.parse(readFileSync(new URL('../tests/billing/account-schema-contract.json',import.meta.url),'utf8'));
 const objectAcl=readFileSync(new URL('docs/architecture/proposals/20261021-v1-atomic-object-privileges.sql',root),'utf8');
 const absentFunctions=[...objectAcl.matchAll(/REVOKE ALL ON FUNCTION (public\.[^;]+?) FROM/g)].map(m=>m[1]);
 const absentChecks=absentFunctions.map(sig=>` IF to_regprocedure('${sig}') IS NOT NULL THEN RAISE EXCEPTION 'Expected missing function already exists: ${sig}'; END IF;`).join('\n');
 const sql=`-- UNAPPLIED VERSIONED REVIEW BUNDLE; review ID is NOT a deployment ledger ID.
BEGIN;
SET LOCAL lock_timeout='3s';
SET LOCAL statement_timeout='30s';
DO $proposal_guard$ BEGIN RAISE EXCEPTION 'UNAPPLIED_AUTHENTIC_UPGRADE_V1'; END $proposal_guard$;
-- Exact production delta only: legacy011 EXISTS, no missing-only repair or historical029 replay.
DO $$ BEGIN
${absentChecks}
 IF to_regclass('public.billing_account_fences') IS NOT NULL OR to_regclass('public.billing_atomic_completions') IS NOT NULL OR to_regclass('public.batch_request_receipts') IS NOT NULL OR to_regclass('public.embed_lead_receipts') IS NOT NULL THEN RAISE EXCEPTION 'Expected missing receipt/fence tables already exist'; END IF;
 IF to_regprocedure('public.enforce_calcumint_save_quotas()') IS NULL THEN RAISE EXCEPTION '011 existing-contract baseline missing'; END IF;
 IF NOT EXISTS(SELECT FROM pg_trigger WHERE tgrelid='public.favorites'::regclass AND tgname='favorites_free_quota') OR NOT EXISTS(SELECT FROM pg_trigger WHERE tgrelid='public.calculation_history'::regclass AND tgname='calculation_history_free_quota') THEN RAISE EXCEPTION '011 baseline triggers missing'; END IF;
END $$;
${bodies.join('\n')}
-- Authoritative account postcondition: equivalence decisions cannot bypass schema comparison.
DO $contract$ DECLARE actual jsonb; BEGIN
 SELECT p.contract INTO actual FROM (${ACCOUNT_SCHEMA_PREFLIGHT_SQL}) p;
 IF actual IS DISTINCT FROM '${JSON.stringify(expected).replaceAll("'","''")}'::jsonb THEN RAISE EXCEPTION 'Strict account contract mismatch after upgrade'; END IF;
END $contract$;
COMMIT;
`;
 return {sql,manifest:{reviewVersion:'20261021.v1',deploymentVersion:null,productionExecutionAuthorized:false,requires:['owner dispositions for historical differences and external writers','trusted postgres ownership','reviewed write pause, timeouts, backup and restore plan','exact metadata freshness and schema/ledger preconditions'],excludes:['011 missing-only repair','historical029 replay','global default ACL changes','production execution'],sources,sha256:createHash('sha256').update(sql).digest('hex')}};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 if(process.argv.length!==3)throw Error('Usage: node scripts/build-authentic-upgrade-review.mjs <local-output.sql>');
 const {sql,manifest}=buildAuthenticUpgradeReview();writeFileSync(process.argv[2],sql);writeFileSync(process.argv[2]+'.manifest.json',JSON.stringify(manifest,null,2)+'\n');
}
