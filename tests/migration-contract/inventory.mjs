// Local content inventory only. Candidate order and lexical references are NOT a
// SQL parser, authoritative dependency graph, deployment manifest, or executor.
import {createHash} from 'node:crypto';
import {readdir,readFile,writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {inspectMigrationNames} from '../billing/migration-inventory.mjs';
import {compareMigrationFingerprints} from '../billing/migration-fingerprints.mjs';
const digest=body=>createHash('sha256').update(body).digest('hex');
const identity=name=>{const m=/^(\d+)([a-z]?)_/.exec(name);if(!m)throw Error(`Unrecognized historical migration identity: ${name}`);return {number:Number(m[1]),suffix:m[2],prefix:m[1]+m[2]};};
export function canonicalMigrationNames(names){return [...names].sort((a,b)=>{const x=identity(a),y=identity(b);return x.number-y.number||x.suffix.localeCompare(y.suffix,'en')||(a<b?-1:a>b?1:0);});}
export function validateCandidateOrder(names,order){if(order.length!==names.length||new Set(order).size!==names.length||names.some(n=>!order.includes(n)))throw Error('Every exact migration filename must occur exactly once');if(JSON.stringify(order)!==JSON.stringify(canonicalMigrationNames(names)))throw Error('Unexpected candidate order: review exact names and suffixes');return true;}
export function detectDrift(before,after){const old=new Map(before.map(r=>[r.path,r.sha256])),next=new Map(after.map(r=>[r.path,r.sha256]));return [...new Set([...old.keys(),...next.keys()])].sort().flatMap(path=>!old.has(path)?[{path,status:'ADDED'}]:!next.has(path)?[{path,status:'MISSING'}]:old.get(path)!==next.get(path)?[{path,status:'CONTENT_CHANGED'}]:[]);}
const dependencyReview={
 '009':['001_b3_accounts.sql'], '010':['001_b3_accounts.sql'], '011':['001_b3_accounts.sql','002_b4_billing.sql'],
 '013':['001_b3_accounts.sql','002_b4_billing.sql','003_b5_business.sql','004_b6_builder.sql','005_b7_delivery.sql','006_b8_api_automation.sql','007_b9_ai.sql','008_b10_admin_factory.sql'],
 '018':['017_regulatory_rule_pack_evidence.sql'], '025':['023_structured_source_evidence.sql'],
 '029':['001_b3_accounts.sql'], '030':['002_b4_billing.sql','007_b9_ai.sql'],
 '031':['008_b10_admin_factory.sql','022_harden_reviewer_waiver_authority.sql','023_structured_source_evidence.sql'],
 '033_pro_workspace_rls_auth_initplan.sql':['010_b7_pro_workspace.sql'],
 '036':['030_billing_ai_rls_auth_initplan.sql'], '038':['001_b3_accounts.sql','002_b4_billing.sql']
};
const proposalDependencies={
 '20261020-v1-legacy-save-quota-repair.sql':['001_b3_accounts.sql','002_b4_billing.sql'],
 'ATOMIC-ACCOUNT-HISTORY.sql':['001_b3_accounts.sql','002_b4_billing.sql','010_b7_pro_workspace.sql','011_b8_free_save_quotas.sql','029_account_rls_auth_initplan.sql','033_pro_workspace_rls_auth_initplan.sql','038_client_account_billing_privileges.sql'],
 'ATOMIC-BILLING-TRANSACTION-PROPOSAL.md':['001_b3_accounts.sql','002_b4_billing.sql','034_billing_webhook_event_privileges.sql','038_client_account_billing_privileges.sql'],
 'ATOMIC-API-QUOTA.sql':['003_b5_business.sql','006_b8_api_automation.sql'],
 'ATOMIC-BATCH-JOB.sql':['003_b5_business.sql','006_b8_api_automation.sql'],
 'ATOMIC-EMBED-LEAD-CONSENT.sql':['003_b5_business.sql','004_b6_builder.sql','005_b7_delivery.sql','006_b8_api_automation.sql'],
 'API-RLS-HELPER-EXECUTE.sql':['003_b5_business.sql','006_b8_api_automation.sql','013_production_rpc_privilege_hardening_v2.sql'],
 'MEMBERSHIP-ADMIN-FENCING.sql':['003_b5_business.sql']
};
const flags={
 '008b':['SUFFIX_ORDER_REQUIRES_OWNER_MANIFEST'],
 '009':['REPOSITORY_PRESENT_PRIOR_PRODUCTION_COLUMN_AND_LEDGER_ABSENT'],
 '011':['HISTORICAL_SQL_SYNTAX_INVALID'],
 '013':['REVIEW_FUNCTION_EXECUTE_GRANTS_AND_DEFINER_OWNERS'],
 '029':['PRIOR_LEDGER_HASH_UNRESOLVED'],
 '038':['REVIEW_ONLY_UNAPPLIED_PROPOSAL','REVIEW_EFFECTIVE_INHERITED_DEFAULT_AND_COLUMN_ACLS']
};
export async function buildInventory(){
 const names=(await readdir('supabase/migrations')).filter(n=>n.endsWith('.sql'));
 const inspected=inspectMigrationNames(names),ordered=canonicalMigrationNames(names);validateCandidateOrder(names,ordered);
 const fingerprints=await compareMigrationFingerprints();
 const migrations=[];
 for(const [i,name]of ordered.entries()){
  const path=`supabase/migrations/${name}`,body=await readFile(path),text=body.toString('utf8'),{prefix}=identity(name);
  const duplicate=inspected.duplicatePrefixes.some(r=>r.prefix===prefix);
  migrations.push({path,name,prefix,sha256:digest(body),candidatePosition:i+1,deployedState:'UNKNOWN',repositoryKind:prefix==='038'?'REVIEW_ONLY_PROPOSAL':'HISTORICAL_MIGRATION',ownerFlags:[...(flags[prefix]??[]),...(duplicate?['DUPLICATE_PREFIX_REQUIRES_EXACT_FILENAME_MANIFEST']:[])],explicitReferences:text.split('\n').flatMap((line,index)=>/\bmigration\s+\d+/i.test(line)?[{line:index+1,text:line.trim()}]:[]),dependencyCandidates:dependencyReview[name]??dependencyReview[prefix]??[],dependencyAuthority:'MANUAL_BOUNDED_REVIEW_CANDIDATES_NOT_COMPLETE_GRAPH',qualifiedObjectReferences:[...new Set(text.match(/\b(?:public|auth)\.[a-z_][a-z_0-9]*/gi)??[])].sort(),qualifiedObjectReferenceAuthority:'LEXICAL_ONLY_NOT_PARSED_DEPENDENCIES',priorLedgerFingerprint:fingerprints.find(r=>r.path===path)??null});
 }
 const proposals=[];
 for(const name of (await readdir('docs/architecture/proposals')).sort()){
  const path=`docs/architecture/proposals/${name}`,body=await readFile(path),text=body.toString('utf8');
  const sqlBlocks=[...text.matchAll(/^```sql[^\n]*\n([\s\S]*?)^```/gm)].map((m,index)=>({block:index+1,sha256:digest(m[1]),startsAtLine:text.slice(0,m.index).split('\n').length+1}));
  if(!name.endsWith('.sql')&&!sqlBlocks.length)continue;
  proposals.push({path,name,sha256:digest(body),prefix:null,deployedState:'UNKNOWN',repositoryKind:'REVIEW_ONLY_PROPOSAL',ownerFlags:['UNAPPLIED_PROPOSAL_REQUIRES_SEPARATE_OWNER_ADOPTION',...(name==='20261020-v1-legacy-save-quota-repair.sql'?['VERSIONED_REVIEW_ARTIFACT_NOT_ASSIGNED_DEPLOYMENT_LEDGER_ID','MISSING_CONTRACT_ONLY_REFUSES_EXISTING_FUNCTION_OR_TRIGGERS','PRESERVES_LEGACY_NONATOMIC_QUOTA_BEHAVIOR']:[])],explicitReferences:text.split('\n').flatMap((line,index)=>/\bmigration\s+\d+/i.test(line)?[{line:index+1,text:line.trim()}]:[]),dependencyCandidates:proposalDependencies[name]??[],dependencyAuthority:'MANUAL_BOUNDED_REVIEW_CANDIDATES_NOT_COMPLETE_GRAPH',qualifiedObjectReferences:[...new Set(text.match(/\b(?:public|auth)\.[a-z_][a-z_0-9]*/gi)??[])].sort(),qualifiedObjectReferenceAuthority:'LEXICAL_ONLY_NOT_PARSED_DEPENDENCIES',sqlBlocks,hasLiteralAbortGuard:/RAISE EXCEPTION[\s\S]{0,200}(?:PROPOSAL|UNAPPLIED)/i.test(text),guardAuthority:'LEXICAL_INDICATOR_ONLY_NOT_EXECUTION_PROOF'});
 }
 return {schemaVersion:1,asOf:'2026-10-20',scope:'REPOSITORY_ONLY_NO_PRODUCTION_ACCESS',deployedState:'UNKNOWN',orderingRule:'Candidate: numeric prefix, empty suffix before alphabetic suffix, then exact filename ascending within duplicate prefix; preserve every historical filename. Not an authorized executor or timestamp mapping.',orderingAuthority:'OWNER_RECONCILIATION_REQUIRED',duplicatePrefixes:inspected.duplicatePrefixes,candidateSequence:ordered,missingNumericPrefixes:Array.from({length:38},(_,i)=>String(i+1).padStart(3,'0')).filter(p=>!migrations.some(r=>r.prefix===p)),inheritedEvidence:'docs/audits/ACCOUNT-MIGRATION-RECONCILIATION-2026-10-19.md (historical read-only findings; current deployed schema UNKNOWN)',migrations,proposals};
}
export function toCsv(inventory){const cell=v=>`"${String(v??'').replaceAll('"','""')}"`;const fields=['path','name','prefix','sha256','repositoryKind','deployedState','candidatePosition','ownerFlags','dependencyCandidates','dependencyAuthority','explicitReferences'];return [fields.map(cell).join(','),...[...inventory.migrations,...inventory.proposals].map(r=>fields.map(k=>cell(Array.isArray(r[k])?JSON.stringify(r[k]):r[k])).join(','))].join('\n')+'\n';}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const inventory=await buildInventory(),directory='docs/audits/migration-contract-2026-10-20';await writeFile(`${directory}/inventory.json`,JSON.stringify(inventory,null,2)+'\n');await writeFile(`${directory}/inventory.csv`,toCsv(inventory));console.log(`Inventoried ${inventory.migrations.length} exact migrations and ${inventory.proposals.length} SQL proposal documents; deployment UNKNOWN.`);}
