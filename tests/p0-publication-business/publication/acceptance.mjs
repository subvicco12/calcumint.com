import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {randomUUID,createHash} from 'node:crypto';
import {createClient} from '@supabase/supabase-js';
import {startGoTrueFixture} from '../../gotrue-runtime/fixture.mjs';
import {artifactDirectory} from '../../batch17-issuance/artifacts.mjs';
import {session,blocked} from './sessions.mjs';
import {initializeAdmin} from '../../hosted-remediation-closure/admin/initializer.mjs';
const output=await artifactDirectory(process.env.PUBLICATION_P0_ARTIFACTS);
const read=p=>readFile(new URL(p,import.meta.url),'utf8'),sha=x=>createHash('sha256').update(x).digest('hex');
const checks=[],pass=(id,detail)=>{checks.push({id,detail});console.log('PASS '+id);};let db;
const ok=async p=>{const r=await p;assert.equal(r.error,null,JSON.stringify(r.error));return r.data;};
try{
 db=await startGoTrueFixture({initializeSchema:initializeAdmin});assert.match(await db.sql('SHOW server_version;'),/^17\.6/);
 const signup=async()=>{const sdk=createClient(db.url,db.anonKey,{auth:{persistSession:false,autoRefreshToken:false}});const data=await ok(sdk.auth.signUp({email:randomUUID()+'@example.invalid',password:'Fixture-'+randomUUID()}));return {sdk,id:data.user.id};};
 const owner=await signup(),reviewer=await signup(),identityTarget=await signup();await db.sql(`INSERT INTO platform_admins(user_id,role) VALUES('${owner.id}','owner'),('${reviewer.id}','reviewer');`);
 const req=['engine-tests','formula-review','sources','methodology','reverse-solve','visualization-reconciliation','schedule-reconciliation','scenario-reconciliation','sensitivity-validation','entitlement-validation','ux-responsive','performance','security','seo-content','accessibility','rule-pack-validation','ymyl-review'];
 const row=(lifecycle='draft')=>({id:randomUUID(),calculator_key:'synthetic-'+randomUUID(),slug:'synthetic-'+randomUUID(),title:'Synthetic fixture only',category:'Fixture',created_by:owner.id,lifecycle});
 const inserted=row('published');await ok(owner.sdk.from('calculator_catalog_admin').insert(inserted));assert.equal(await db.sql(`SELECT lifecycle FROM calculator_catalog_admin WHERE id='${inserted.id}';`),'published');pass('baseline-insert-bypass','Actual owner JWT INSERT persists published without evidence');await db.sql(`DELETE FROM calculator_catalog_admin WHERE id='${inserted.id}';`);
 const correction=await read('../../hosted-schema-remediation/publication/review-only-correction.sql'), final=await read('../../hosted-remediation-closure/publication/review-only-deferred-gate.sql');
 await db.sql(correction.replace("DO $unapplied$ BEGIN RAISE EXCEPTION 'UNAPPLIED_HOSTED_DATE_REPAIR: review only'; END $unapplied$;",'-- disposable fixture'));await db.sql(final.replace("DO $unapplied$ BEGIN RAISE EXCEPTION 'UNAPPLIED_PUBLICATION_CLOSURE: review only'; END $unapplied$;",'-- disposable fixture'));
 await writeFile(output+'/prior-final-row-definition.sql',await db.sql("SELECT pg_get_functiondef('public.enforce_calculator_publish_gate_final_row()'::regprocedure);")+'\n');
 const rule={jurisdiction:{country:'GB'},ruleVersion:'synthetic',effectiveFrom:'2024-02-29',lastVerifiedAt:'2026-11-01',officialSources:[{label:'Synthetic',url:'https://example.invalid/source'}]};
 const metadata={rulePackRequired:true,ruleMetadata:[rule]},a=row(),b=row();
 await ok(owner.sdk.from('calculator_catalog_admin').insert([a,b]));
 const auth=`SET request.jwt.claims='${JSON.stringify({role:'service_role'})}';`;
 await db.sql(`${auth} INSERT INTO calculator_source_evidence(calculator_id,label,url,reviewed_by) VALUES('${a.id}','Synthetic source','https://example.invalid/source','${owner.id}'); INSERT INTO calculator_qa_checks(calculator_id,check_type,status) SELECT '${a.id}',x,'passed' FROM unnest(ARRAY[${req.map(x=>"'"+x+"'").join(',')}]) x; UPDATE calculator_catalog_admin SET metadata='${JSON.stringify(metadata)}',risk_class='financial',reviewer_id='${reviewer.id}' WHERE id='${a.id}';UPDATE calculator_catalog_admin SET lifecycle='review' WHERE id='${a.id}';UPDATE calculator_catalog_admin SET lifecycle='certified' WHERE id='${a.id}';UPDATE calculator_catalog_admin SET lifecycle='published' WHERE id='${a.id}';`);
 const state=()=>db.sql(`SELECT jsonb_build_object('catalog',(SELECT jsonb_agg(to_jsonb(c) ORDER BY id) FROM calculator_catalog_admin c),'qa',(SELECT jsonb_agg(to_jsonb(q) ORDER BY id) FROM calculator_qa_checks q),'sources',(SELECT jsonb_agg(to_jsonb(s) ORDER BY id) FROM calculator_source_evidence s),'admins',(SELECT jsonb_agg(to_jsonb(p) ORDER BY user_id) FROM platform_admins p),'alerts',(SELECT jsonb_agg(to_jsonb(x) ORDER BY id) FROM admin_alerts x))::text;`);
 const reject=async(id,q,pattern)=>{const before=await state();await assert.rejects(db.sql(auth+q),pattern);assert.equal(await state(),before);pass(id,'Rejected transaction leaves complete persisted state unchanged');};
 await reject('final-row-rule-metadata',`UPDATE calculator_catalog_admin SET metadata='{"rulePackRequired":true,"ruleMetadata":[]}',risk_class='tax' WHERE id='${a.id}';`,/Final row/);
 await reject('source-delete',`DELETE FROM calculator_source_evidence WHERE calculator_id='${a.id}';`,/Publishing gate|Final row|source evidence/);
 await reject('qa-failure-alert-rollback',`UPDATE calculator_qa_checks SET status='failed' WHERE calculator_id='${a.id}' AND check_type='engine-tests';`,/evidence cannot become invalid/);
 await reject('reviewer-demotion',`UPDATE platform_admins SET role='editor' WHERE user_id='${reviewer.id}';`,/Reassign or decertify/);
 await db.sql(`${auth} DELETE FROM platform_admins WHERE user_id='${reviewer.id}';`);assert.equal(await db.sql(`${auth} SELECT ok FROM validate_calculator_publish_gate('${a.id}');`),'f');pass('baseline-reviewer-delete-bypass','Deleting reviewer membership invalidates persisted published parent');await db.sql(`INSERT INTO platform_admins(user_id,role) VALUES('${reviewer.id}','reviewer');`);
 await db.sql(`${auth} UPDATE platform_admins SET user_id='${identityTarget.id}' WHERE user_id='${reviewer.id}';`);assert.equal(await db.sql(`${auth} SELECT ok FROM validate_calculator_publish_gate('${a.id}');`),'f');pass('baseline-reviewer-identity-bypass','Privileged identity rewrite removes OLD membership authority and leaves published parent invalid');await db.sql(`UPDATE platform_admins SET user_id='${reviewer.id}' WHERE user_id='${identityTarget.id}';`);
 await db.sql(`${auth} UPDATE calculator_qa_checks SET calculator_id='${b.id}' WHERE calculator_id='${a.id}' AND check_type='engine-tests';`);
 assert.equal(await db.sql(`${auth} SELECT ok FROM validate_calculator_publish_gate('${a.id}');`),'f');pass('baseline-qa-move-bypass','Old published parent is invalid after committed QA reassignment');
 await db.sql(`${auth} UPDATE calculator_qa_checks SET calculator_id='${a.id}' WHERE calculator_id='${b.id}';`);
 const container=(await db.sql("SELECT pg_read_file('/etc/hostname');")).trim();
 const first=session(container,'p0_promotion'),second=session(container,'p0_authority');
 try{
 await first.ready();await second.ready();
 await db.sql(`${auth} UPDATE calculator_catalog_admin SET lifecycle='review' WHERE id='${a.id}';`);
 await first.query(`${auth} BEGIN;UPDATE calculator_catalog_admin SET lifecycle='certified' WHERE id='${a.id}';`);
 await second.query(`${auth} BEGIN;DELETE FROM platform_admins WHERE user_id='${reviewer.id}';COMMIT;`);
 await first.query('COMMIT;');assert.equal(await db.sql(`${auth} SELECT ok FROM validate_calculator_publish_gate('${a.id}');`),'f');pass('baseline-reviewer-promotion-race','Deterministic two-session certification before reviewer deletion commits invalid final state');
 }finally{first.close();second.close();}
 await db.sql(`INSERT INTO platform_admins(user_id,role) VALUES('${reviewer.id}','reviewer');${auth} UPDATE calculator_catalog_admin SET lifecycle='published' WHERE id='${a.id}';`);
 const proposal=await read('review-only-successor.sql');await assert.rejects(db.sql(proposal),/UNAPPLIED_P0_PUBLICATION/);
 const local=proposal.replace("DO $unapplied$ BEGIN RAISE EXCEPTION 'UNAPPLIED_P0_PUBLICATION: review only'; END $unapplied$;",'-- disposable acceptance only');
 const priorDefinition=await db.sql("SELECT pg_get_functiondef('public.enforce_calculator_publish_gate_final_row()'::regprocedure);");
 await db.sql(priorDefinition.replace('Final row publishing gate failed','HOSTILE final-row drift'));await assert.rejects(db.sql(local),/Prior final-row source mismatch/);await db.sql(priorDefinition);
 await db.sql('ALTER TABLE calculator_catalog_admin DISABLE TRIGGER calculator_publish_gate_final_row;');await assert.rejects(db.sql(local),/Prior final-row trigger mismatch/);await db.sql('ALTER TABLE calculator_catalog_admin ENABLE TRIGGER calculator_publish_gate_final_row;');pass('successor-source-drift','Altered prior function or disabled prior trigger prevents successor installation');
 await db.sql(local);await assert.rejects(db.sql(local),/Successor already exists/);
 for(const lifecycle of ['review','certified','published','archived']){const x=row(lifecycle);const before=await state();const r=await owner.sdk.from('calculator_catalog_admin').insert(x);assert(r.error);assert.match(r.error.message,/Initial lifecycle must be draft/);assert.equal(await state(),before);}pass('successor-insert-lifecycle','Actual owner JWT rejects every non-draft INSERT without persisted side effects');
 await reject('successor-reviewer-identity',`UPDATE platform_admins SET user_id='${identityTarget.id}' WHERE user_id='${reviewer.id}';`,/Reassign or decertify/);
 await reject('successor-reviewer-delete',`DELETE FROM platform_admins WHERE user_id='${reviewer.id}';`,/Reassign or decertify/);
 await reject('successor-qa-move',`UPDATE calculator_qa_checks SET calculator_id='${b.id}' WHERE calculator_id='${a.id}' AND check_type='engine-tests';`,/Old parent publishing gate failed/);
 await reject('deferred-commit',`BEGIN;SET CONSTRAINTS ALL DEFERRED; UPDATE calculator_catalog_admin SET metadata='{"rulePackRequired":true,"ruleMetadata":[]}' WHERE id='${a.id}';COMMIT;`,/Final row/);
 const before=await state();await db.sql(`${auth} BEGIN; UPDATE calculator_qa_checks SET details='rollback marker' WHERE calculator_id='${a.id}';ROLLBACK;`);assert.equal(await state(),before);pass('explicit-rollback','Valid transient dependency writes roll back exactly');
 const outcomes=await Promise.allSettled([db.sql(`${auth} UPDATE calculator_qa_checks SET calculator_id='${b.id}' WHERE calculator_id='${a.id}' AND check_type='engine-tests';`),db.sql(`${auth} UPDATE calculator_qa_checks SET status='failed' WHERE calculator_id='${a.id}' AND check_type='formula-review';`)]);assert(outcomes.every(x=>x.status==='rejected'));assert.equal(await state(),before);pass('concurrent-adverse-writes','Two simultaneous invalid dependency transactions both reject; complete persisted state unchanged');
 await db.sql(`${auth} BEGIN;SET CONSTRAINTS ALL DEFERRED;UPDATE calculator_qa_checks SET details='synthetic accepted' WHERE calculator_id='${a.id}';COMMIT;`);assert.equal(await db.sql(`${auth} SELECT ok FROM validate_calculator_publish_gate('${a.id}');`),'t');pass('valid-deferred-update','Valid dependency edit commits and final published predicate is true');
 await reject('snapshot-isolation-failclosed',`BEGIN ISOLATION LEVEL REPEATABLE READ;UPDATE calculator_catalog_admin SET review_notes='unsupported isolation' WHERE id='${a.id}';COMMIT;`,/READ COMMITTED/);
 for(const mutation of ['delete','deactivate','role','identity']){
  await db.sql(`${auth} UPDATE calculator_catalog_admin SET lifecycle='review' WHERE id='${a.id}';`);
  const promote=session(container,'p0_promote_'+mutation),authority=session(container,'p0_authority_'+mutation);
  const change=mutation==='delete'?`DELETE FROM platform_admins WHERE user_id='${reviewer.id}'`:`UPDATE platform_admins SET ${mutation==='identity'?"user_id='"+identityTarget.id+"'":mutation==='role'?"role='editor'":'active=false'} WHERE user_id='${reviewer.id}'`;
  try{
   await promote.ready();await authority.ready();
   await promote.query(`${auth} BEGIN;UPDATE calculator_catalog_admin SET lifecycle='certified' WHERE id='${a.id}';`);
   const pending=authority.query(`${auth} BEGIN;${change};COMMIT;`);const denied=assert.rejects(pending,/Reassign or decertify/);
   await blocked(db,'p0_authority_'+mutation);await promote.query('COMMIT;');await denied;
   assert.equal(await db.sql(`SELECT active AND role='reviewer' FROM platform_admins WHERE user_id='${reviewer.id}';`),'t');
   assert.equal(await db.sql(`${auth} SELECT ok FROM validate_calculator_publish_gate('${a.id}');`),'t');
   pass('promotion-first-'+mutation,'FOR SHARE lock blocks authority mutation until certification commit; authority mutation rejects');
  }finally{promote.close();authority.close();}
  await db.sql(`${auth} UPDATE calculator_catalog_admin SET lifecycle='review' WHERE id='${a.id}';`);
  const remove=session(container,'p0_remove_'+mutation),waiter=session(container,'p0_waiter_'+mutation);
  try{
   await remove.ready();await waiter.ready();await remove.query(`${auth} BEGIN;${change};`);
   const pending=waiter.query(`${auth} BEGIN;UPDATE calculator_catalog_admin SET lifecycle='certified' WHERE id='${a.id}';COMMIT;`);const denied=assert.rejects(pending,/Locked reviewer publishing gate failed/);
   await blocked(db,'p0_waiter_'+mutation);await remove.query('COMMIT;');await denied;
   assert.equal(await db.sql(`SELECT lifecycle FROM calculator_catalog_admin WHERE id='${a.id}';`),'review');assert.equal(await db.sql(`SELECT EXISTS(SELECT FROM platform_admins WHERE user_id='${reviewer.id}' AND active AND role='reviewer');`),'f');pass('authority-first-'+mutation,'Authority mutation holds row lock; certification waits then revalidates and rolls back');
  }finally{remove.close();waiter.close();}
  if(mutation==='delete')await db.sql(`INSERT INTO platform_admins(user_id,role) VALUES('${reviewer.id}','reviewer');`);else if(mutation==='identity')await db.sql(`UPDATE platform_admins SET user_id='${reviewer.id}' WHERE user_id='${identityTarget.id}';`);else await db.sql(`UPDATE platform_admins SET active=true,role='reviewer' WHERE user_id='${reviewer.id}';`);
 }
 await db.sql(`${auth} UPDATE calculator_catalog_admin SET lifecycle='certified' WHERE id='${a.id}';UPDATE calculator_catalog_admin SET lifecycle='published' WHERE id='${a.id}';`);
 assert.equal(await db.sql(`${auth} SELECT ok FROM validate_calculator_publish_gate('${a.id}');`),'t');

 // Isolate the newly added parent fence to reproduce the remaining check-only
 // race while the prior OLD-parent validator and reviewer locks are installed.
 await db.sql('ALTER TABLE calculator_qa_checks DISABLE TRIGGER p0_publication_qa_parent_lock;');
 await db.sql(`${auth} UPDATE calculator_catalog_admin SET lifecycle='review' WHERE id='${a.id}';`);
 const oldPromotion=session(container,'p0_old_qa_promotion'),oldQa=session(container,'p0_old_qa_mutation');
 try{
  await oldPromotion.ready();await oldQa.ready();
  await oldPromotion.query(`${auth} BEGIN;UPDATE calculator_catalog_admin SET lifecycle='certified' WHERE id='${a.id}';`);
  await oldQa.query(`${auth} BEGIN;UPDATE calculator_qa_checks SET calculator_id='${b.id}' WHERE calculator_id='${a.id}' AND check_type='engine-tests';COMMIT;`);
  await oldPromotion.query('COMMIT;');
  assert.equal(await db.sql(`${auth} SELECT ok FROM validate_calculator_publish_gate('${a.id}');`),'f');
  pass('check-only-qa-promotion-race','Without parent fence, OLD-parent final check sees review while promotion sees old passed QA; both commit invalid certification');
 }finally{oldPromotion.close();oldQa.close();}
 await db.sql('ALTER TABLE calculator_qa_checks ENABLE TRIGGER p0_publication_qa_parent_lock;');
 await db.sql(`${auth} UPDATE calculator_catalog_admin SET lifecycle='review' WHERE id='${a.id}';UPDATE calculator_qa_checks SET calculator_id='${a.id}' WHERE calculator_id='${b.id}' AND check_type='engine-tests';`);
 for(const dependency of ['qa','source']){
  const change=dependency==='qa'?`UPDATE calculator_qa_checks SET calculator_id='${b.id}' WHERE calculator_id='${a.id}' AND check_type='engine-tests'`:`DELETE FROM calculator_source_evidence WHERE calculator_id='${a.id}'`;
  const p=session(container,'p0_parent_promotion_'+dependency),m=session(container,'p0_parent_mutation_'+dependency);
  try{
   await p.ready();await m.ready();await p.query(`${auth} BEGIN;UPDATE calculator_catalog_admin SET lifecycle='certified' WHERE id='${a.id}';`);
   const pending=m.query(`${auth} BEGIN;${change};COMMIT;`),denied=assert.rejects(pending,/Old parent|Publishing gate|source evidence|Final row/);
   await blocked(db,'p0_parent_mutation_'+dependency);await p.query('COMMIT;');await denied;
   assert.equal(await db.sql(`${auth} SELECT ok FROM validate_calculator_publish_gate('${a.id}');`),'t');
   pass('promotion-first-'+dependency,'Observed dependency wait; after promotion commits, invalidating dependency transaction rejects and published evidence remains valid');
  }finally{p.close();m.close();}
  await db.sql(`${auth} UPDATE calculator_catalog_admin SET lifecycle='review' WHERE id='${a.id}';`);
  const edit=session(container,'p0_dependency_first_'+dependency),wait=session(container,'p0_parent_waiter_'+dependency);
  try{
   await edit.ready();await wait.ready();await edit.query(`${auth} BEGIN;${change};`);
   const pending=wait.query(`${auth} BEGIN;UPDATE calculator_catalog_admin SET lifecycle='certified' WHERE id='${a.id}';COMMIT;`),denied=assert.rejects(pending,/Publishing gate/);
   await blocked(db,'p0_parent_waiter_'+dependency);await edit.query('COMMIT;');await denied;
   assert.equal(await db.sql(`SELECT lifecycle FROM calculator_catalog_admin WHERE id='${a.id}';`),'review');
   pass('dependency-first-'+dependency,'Observed promotion wait; after draft/review dependency mutation commits, promotion revalidates missing evidence and rolls back');
  }finally{edit.close();wait.close();}
  if(dependency==='qa')await db.sql(`${auth} UPDATE calculator_qa_checks SET calculator_id='${a.id}' WHERE calculator_id='${b.id}' AND check_type='engine-tests';`);
  else await db.sql(`${auth} INSERT INTO calculator_source_evidence(calculator_id,label,url,reviewed_by) VALUES('${a.id}','Synthetic source','https://example.invalid/source','${owner.id}');`);
 }
 await db.sql(`${auth} UPDATE calculator_catalog_admin SET lifecycle='certified' WHERE id='${a.id}';UPDATE calculator_catalog_admin SET lifecycle='published' WHERE id='${a.id}';`);
 await reject('qa-snapshot-isolation-failclosed',`BEGIN ISOLATION LEVEL REPEATABLE READ;UPDATE calculator_qa_checks SET details='unsupported snapshot' WHERE calculator_id='${a.id}';COMMIT;`,/READ COMMITTED/);

 // A transaction snapshot can retain obsolete QA without changing the parent
 // tuple. Reject non-RC certification for standard risk as well as YMYL.
 await db.sql(`${auth} UPDATE calculator_catalog_admin SET lifecycle='review' WHERE id='${a.id}';UPDATE calculator_catalog_admin SET risk_class='standard' WHERE id='${a.id}';`);
 const allRiskDefinition=await db.sql("SELECT pg_get_functiondef('public.p0_publication_reviewer_lock()'::regprocedure);");
 const ymylOnly=allRiskDefinition.replace("IF v_calc.lifecycle IN ('certified','published') THEN", "IF v_calc.lifecycle IN ('certified','published') AND v_calc.risk_class IN ('financial','health','tax') THEN");assert.notEqual(ymylOnly,allRiskDefinition);
 await db.sql(ymylOnly);
 const staleStandard=session(container,'p0_standard_snapshot');
 try{
  await staleStandard.ready();await staleStandard.query(`${auth} BEGIN ISOLATION LEVEL REPEATABLE READ;SELECT id FROM calculator_catalog_admin WHERE id='${a.id}';`);
  await db.sql(`${auth} UPDATE calculator_qa_checks SET calculator_id='${b.id}' WHERE calculator_id='${a.id}' AND check_type='engine-tests';`);
  await staleStandard.query(`UPDATE calculator_catalog_admin SET lifecycle='certified' WHERE id='${a.id}';COMMIT;`);
  assert.equal(await db.sql(`${auth} SELECT ok FROM validate_calculator_publish_gate('${a.id}');`),'f');
  pass('standard-snapshot-gap','YMYL-only isolation guard permits standard-risk certification from obsolete QA snapshot');
 }finally{staleStandard.close();}
 await db.sql(allRiskDefinition);
 await db.sql(`${auth} UPDATE calculator_catalog_admin SET lifecycle='review' WHERE id='${a.id}';UPDATE calculator_qa_checks SET calculator_id='${a.id}' WHERE calculator_id='${b.id}' AND check_type='engine-tests';`);
 await reject('standard-snapshot-failclosed',`BEGIN ISOLATION LEVEL REPEATABLE READ;UPDATE calculator_catalog_admin SET lifecycle='certified' WHERE id='${a.id}';COMMIT;`,/READ COMMITTED/);
 await db.sql(`${auth} UPDATE calculator_catalog_admin SET lifecycle='certified' WHERE id='${a.id}';UPDATE calculator_catalog_admin SET lifecycle='published' WHERE id='${a.id}';`);
 assert.equal(await db.sql(`${auth} SELECT ok FROM validate_calculator_publish_gate('${a.id}');`),'t');pass('standard-read-committed-positive','Standard-risk final validation succeeds with current evidence under supported isolation');

 await reject('source-reparent',`UPDATE calculator_source_evidence SET calculator_id='${b.id}' WHERE calculator_id='${a.id}';`,/source evidence|Publishing gate|Final row/);
 const extraSource=randomUUID();
 await db.sql(`${auth} BEGIN;SET CONSTRAINTS ALL DEFERRED;INSERT INTO calculator_source_evidence(id,calculator_id,label,url,reviewed_by) VALUES('${extraSource}','${a.id}','Additional synthetic source','https://example.invalid/additional','${owner.id}');UPDATE calculator_source_evidence SET label='Updated synthetic source' WHERE id='${extraSource}';COMMIT;`);
 assert.equal(await db.sql(`SELECT source_count FROM calculator_catalog_admin WHERE id='${a.id}';`),'2');assert.equal(await db.sql(`${auth} SELECT ok FROM validate_calculator_publish_gate('${a.id}');`),'t');
 await db.sql(`${auth} DELETE FROM calculator_source_evidence WHERE id='${extraSource}';`);assert.equal(await db.sql(`SELECT source_count FROM calculator_catalog_admin WHERE id='${a.id}';`),'1');
 pass('source-insert-update-positive','Captured source INSERT/label UPDATE/deletion-of-extra-source maintain derived count and valid final state');
 await reject('qa-required-delete',`DELETE FROM calculator_qa_checks WHERE calculator_id='${a.id}' AND check_type='engine-tests';`,/evidence cannot become invalid|Old parent|Publishing gate|Final row/);
 await db.sql(`${auth} DELETE FROM calculator_qa_checks WHERE calculator_id='${a.id}' AND check_type='ymyl-review';INSERT INTO calculator_qa_checks(calculator_id,check_type,status) VALUES('${a.id}','ymyl-review','passed');`);
 assert.equal(await db.sql(`${auth} SELECT ok FROM validate_calculator_publish_gate('${a.id}');`),'t');pass('qa-optional-insert-delete-positive','For standard risk, optional synthetic QA can be removed/reinserted while every required check remains valid');
 await writeFile(output+'/receipt.json',JSON.stringify({scope:'Synthetic disposable PG17.6 plus real GoTrue JWT and captured six admin tables/all triggers; no canonical certification or hosted change',checks,sourceHashes:{dateProposal:sha(correction),finalRowProposal:sha(final),successor:sha(proposal)},provenance:db.provenance,productionChanges:false,approval:false},null,2)+'\n');
}finally{if(db)await db.close();}
