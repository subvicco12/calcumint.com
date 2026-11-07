/** Deterministic known-writer source inventory; never discovers or attests external keyholders. */
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../../',import.meta.url));
const rows=[
 ['catalog-create','src/app/admin/actions.ts','rpc("create_catalog_calculator_with_audit"','authenticated platform admin; authoritative RPC and RLS','single RPC, hosted absent'],
 ['catalog-bulk','src/app/admin/actions.ts','rpc("prepare_catalog_inventory_drafts"','authenticated owner/admin','single RPC, hosted absent'],
 ['source-insert','src/app/admin/actions.ts','from("calculator_source_evidence").insert','authenticated owner/admin/reviewer','direct INSERT with trigger dependencies'],
 ['qa-decision','src/app/admin/actions.ts','rpc("record_calculator_qa_decision"','authenticated owner/admin/reviewer; waiver owner/admin','single RPC, hosted absent'],
 ['reviewer-assignment','src/app/admin/actions.ts','rpc("assign_calculator_reviewer"','authenticated owner/admin','single RPC, hosted absent'],
 ['lifecycle-transition','src/app/admin/actions.ts','rpc("transition_calculator_with_audit"','authenticated active platform admin with target role checks','single RPC, hosted absent'],
 ['publication-schedule','src/app/admin/schedule-actions.ts','update({ publish_at:','authenticated owner/admin','schedule UPDATE and audit INSERT are separate requests; outside new batch'],
 ['scheduled-service-publisher','src/app/api/internal/admin/publish/route.ts','update({ lifecycle: "published"','ADMIN_WORKER_SECRET plus SUPABASE_SERVICE_ROLE_KEY','direct privileged UPDATE; outside owner/admin batch RPC; scheduler identity unknown'],
 ['review-alert-refresh','src/app/admin/schedule-actions.ts','rpc("refresh_admin_review_alerts"','authenticated owner/admin/reviewer','writes admin_alerts through existing function'],
 ['alert-resolve','src/app/admin/schedule-actions.ts','from("admin_alerts").update','authenticated owner/admin/reviewer','direct target-table UPDATE'],
 ['platform-owner-bootstrap','scripts/bootstrap-platform-owner.mjs','from("platform_admins").insert','manual service-role CLI; actual credential holder not supplied','privileged authority-table path, not permission to run']
];
export async function inventory(){
 const writers=[];
 for(const [id,path,needle,authorization,transactionBoundary]of rows){const source=await readFile(root+path,'utf8'),offset=source.indexOf(needle);if(offset<0)throw Error('Writer source changed: '+id);writers.push({id,path,line:source.slice(0,offset).split('\n').length,sourceSHA256:createHash('sha256').update(source).digest('hex'),authorization,transactionBoundary,freezeOwner:null,pauseDrainResumeEvidence:null,freezeEstablished:false});}
 return {kind:'KNOWN_REPOSITORY_WRITER_PATHS_NOT_EXTERNAL_ROSTER',writers,externalWriterIdentityEstablished:false,ddlFreezeEstablished:false,releaseHold:true,productionWrites:false,unknowns:['Deployed application SHA and enabled scheduler/worker versions','Service-key holders, manual SQL users and external jobs','Provider/event-trigger and independent DDL/default-ACL writers','Control-plane pause/drain/resume and recovery signoffs'],limits:['Literal source references are not complete dynamic/privileged writer discovery.','Database role/session names do not identify human or service credential custodians.','Zero locks or prepared transactions never establishes a freeze.']};
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 if(process.argv.length!==3||!['--check','--write'].includes(process.argv[2]))throw Error('Only offline --check or --write supported; no connection arguments');
 const result=await inventory(),json=JSON.stringify(result,null,2)+'\n',path=root+'docs/adoption1535/writer-inventory.json';
 if(process.argv[2]==='--write')await writeFile(path,json);else if(await readFile(path,'utf8')!==json)throw Error('Writer inventory bytes/source drift');
 console.log(JSON.stringify({knownPaths:result.writers.length,externalWriterIdentityEstablished:false,ddlFreezeEstablished:false,productionWrites:false}));
}
