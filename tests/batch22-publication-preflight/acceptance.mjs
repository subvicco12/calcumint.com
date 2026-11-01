import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
import {createClient} from '@supabase/supabase-js';
import {startGoTrueFixture} from '../gotrue-runtime/fixture.mjs';
import {initializeCompatibility} from '../hosted-remediation-closure/compatibility/initializer.mjs';
import {initializeAdmin} from '../hosted-remediation-closure/admin/initializer.mjs';
import {artifactDirectory} from '../batch17-issuance/artifacts.mjs';
import {snapshot,prepareApply,verifySourceBindings,sha} from '../owner-p0/adoption/bundle.mjs';
const artifacts=await artifactDirectory(process.env.PREFLIGHT_ARTIFACTS),checks=[],gates=[],startedAt=new Date().toISOString();let db;
const pass=name=>{checks.push(name);console.log('PASS '+name);};
const literal=x=>"'"+String(x).replaceAll("'","''")+"'";
const preparation=await readFile(new URL('../../docs/full-product-batch21/lifecycle-preparation-17.json',import.meta.url),'utf8');
const candidates=JSON.parse(preparation).rows.slice(0,6);
assert.equal(candidates.length,6);
try {
 db=await startGoTrueFixture({initializeSchema:async sql=>({account:await initializeCompatibility(sql),admin:await initializeAdmin(sql)})});
 assert.match(await db.sql('SHOW server_version;'),/^17\.6/);
 const sdk=createClient(db.url,db.anonKey,{auth:{persistSession:false,autoRefreshToken:false}});
 const signup=await sdk.auth.signUp({email:randomUUID()+'@example.invalid',password:'Local-'+randomUUID()});assert.equal(signup.error,null);
 const service=createClient(db.url,db.serviceKey,{auth:{persistSession:false,autoRefreshToken:false}});
 const before=await snapshot(db.sql),bundle=await prepareApply(before);
 const predicate=before.data.functions.find(f=>f.id==='public.validate_calculator_publish_gate(uuid)');
 assert.equal(sha(predicate.definition),'18ed27d139a24b73176838618ac99469418053d85b4020d1a4a1481cd3e6334c');
 await assert.rejects(db.sql(bundle.sql),/UNAPPLIED_OWNER_P0_CORRECTION_BUNDLE/);
 await assert.rejects(db.sql(bundle.sql),/UNAPPLIED_OWNER_P0_CORRECTION_BUNDLE/);
 assert.equal((await snapshot(db.sql)).sha256,before.sha256);pass('Original correction bundle refuses initial application and retry with exact metadata unchanged');
 const drift=structuredClone(before);drift.data.functions.find(f=>f.id===predicate.id).definition+='\n-- drift';drift.raw=JSON.stringify(drift.data);drift.sha256=sha(drift.raw);
 await assert.rejects(prepareApply(drift));
 await assert.rejects(verifySourceBindings({sourceBindings:[{path:'tests/owner-p0/adoption/plan.json',sha256:'0'.repeat(64)}],supplementarySourceBindings:[]}));pass('Predicate hash drift and source-byte hash drift refuse composition');
 const missing=await service.rpc('validate_calculator_publish_gate',{p_calculator_id:randomUUID()});assert.equal(missing.error,null);assert.equal(missing.data[0].ok,false);assert.deepEqual(missing.data[0].failures,['Calculator not found']);pass('Genuine service-role PostgREST gate refuses a missing record');
 const ids=candidates.map(()=>randomUUID());
 const insert="SELECT set_config('request.jwt.claim.role','service_role',true);\n"+candidates.map((c,i)=>{const p=c.draftStartProposal;assert.equal(p.lifecycle,'draft');assert(c.qaPreparation.every(q=>q.status==='pending'&&q.reviewer===null&&q.decisionEvidence===null));assert.deepEqual(c.reviewedSourceBindings,[]);return `INSERT INTO public.calculator_catalog_admin(id,calculator_key,slug,title,category,risk_class,version,lifecycle,created_by) VALUES (${[ids[i],p.calculator_key,p.slug,p.title,p.category,p.risk_class].map(literal).join(',')},${p.version},'draft',${literal(signup.data.user.id)});\n`+c.qaPreparation.map(q=>`INSERT INTO public.calculator_qa_checks(calculator_id,check_type,status) VALUES (${literal(ids[i])},${literal(q.checkType)},'pending');`).join('\n');}).join('\n');
 await db.sql('BEGIN;\n'+insert+'\nROLLBACK;');assert.equal(await db.sql('SELECT count(*) FROM calculator_catalog_admin;'),'0');pass('Draft and pending-QA staging rollback leaves zero catalog rows');
 await db.sql('BEGIN;\n'+insert+'\nCOMMIT;');
 await assert.rejects(db.sql('BEGIN;\n'+insert+'\nCOMMIT;'),/duplicate key/);assert.equal(await db.sql('SELECT count(*) FROM calculator_catalog_admin;'),'6');pass('Retry after rollback stages six drafts; duplicate reapplication refuses atomically');
 for(const [i,c] of candidates.entries()) {
  const result=await service.rpc('validate_calculator_publish_gate',{p_calculator_id:ids[i]});assert.equal(result.error,null);const gate=result.data[0];assert.equal(gate.ok,false);assert(gate.failures.includes('At least one reviewed source evidence record is required'));for(const q of c.qaPreparation)assert(gate.failures.includes(q.checkType+' must pass'));gates.push({engineId:c.engineId,version:c.version,...gate});
  // Version is an orchestration precondition: the captured UUID-only predicate
  // cannot itself verify an expected version and must not be claimed to do so.
  const requireVersion=async expected=>{const found=await db.sql(`SELECT version FROM calculator_catalog_admin WHERE id=${literal(ids[i])};`);if(Number(found)!==expected)throw Error('EXPECTED_VERSION_MISMATCH');};
  await requireVersion(c.version);await assert.rejects(requireVersion(c.version+1),/EXPECTED_VERSION_MISMATCH/);
 }
 pass('All six authenticated gate calls refuse pending QA and absent sources; expected-version mismatch is detected before any transition');
 const final=JSON.parse(await db.sql("SELECT jsonb_build_object('drafts',(SELECT count(*) FROM calculator_catalog_admin WHERE lifecycle='draft' AND reviewer_id IS NULL AND source_count=0 AND published_at IS NULL),'otherLifecycle',(SELECT count(*) FROM calculator_catalog_admin WHERE lifecycle<>'draft'),'sources',(SELECT count(*) FROM calculator_source_evidence),'qa',(SELECT count(*) FROM calculator_qa_checks),'decisions',(SELECT count(*) FROM calculator_qa_checks WHERE status<>'pending' OR checked_by IS NOT NULL OR checked_at IS NOT NULL))::text;"));
 assert.deepEqual(final,{drafts:6,otherLifecycle:0,sources:0,qa:90,decisions:0});assert.equal((await snapshot(db.sql)).sha256,before.sha256);pass('Final invariant: six drafts, 90 pending checks, null reviewers, zero sources/decisions/publication and unchanged metadata');
 const receipt={kind:'NEGATIVE_ONLY_ISOLATED_PUBLICATION_PREFLIGHT',startedAt,completedAt:new Date().toISOString(),scope:'14 public tables reconstructed from captured descriptors with genuine pinned local PG17.6/GoTrue/PostgREST; not full production acceptance',preparationSha256:sha(preparation),predicateSha256:sha(predicate.definition),metadataSha256:before.sha256,checks,gates,final,provenance:db.provenance,correctionsApplied:false,publicationTransitionsExecuted:false,productionWrites:false,activationAuthorized:false,releaseHold:true,limitations:['UUID-only captured predicate has no expected-version argument; version mismatch checked by orchestration assertion','No positive gate, approval, waiver, source reviewer or corrected postimage acceptance was invented','Guarded correction adoption/reversal remains unactivated; rollback/retry evidence concerns draft staging only']};
 await writeFile(artifacts+'/receipt.json',JSON.stringify(receipt,null,2)+'\n');
}finally{if(db)await db.close();}
