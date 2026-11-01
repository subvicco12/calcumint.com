import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {randomUUID,createHash} from 'node:crypto';
import {createClient} from '@supabase/supabase-js';
import {startGoTrueFixture} from '../../gotrue-runtime/fixture.mjs';
import {artifactDirectory} from '../../batch17-issuance/artifacts.mjs';
import {initializeAdmin} from './initializer.mjs';
const artifacts=await artifactDirectory(process.env.ADMIN_CLOSURE_ARTIFACTS),checks=[],start=new Date(),sources=JSON.parse(await readFile(new URL('manifest.json',import.meta.url),'utf8')).sources;
const hash=x=>createHash('sha256').update(x).digest('hex'),pass=x=>{checks.push(x);console.log('PASS '+x);};let db;
const ok=async p=>{const r=await p;assert.equal(r.error,null,JSON.stringify(r.error));return r.data;};
const denied=async p=>{const r=await p;assert(r.error,'Expected denial');return r.error;};
try {
 db=await startGoTrueFixture({initializeSchema:initializeAdmin});
 const signup=async()=>{const sdk=createClient(db.url,db.anonKey,{auth:{persistSession:false,autoRefreshToken:false}});const r=await ok(sdk.auth.signUp({email:randomUUID()+'@example.invalid',password:'Local-'+randomUUID()}));return {sdk,id:r.user.id};};
 const owner=await signup(),reviewer=await signup(),editor=await signup(),outsider=await signup();
 for(const [a,role]of [[owner,'owner'],[reviewer,'reviewer'],[editor,'editor']])await db.sql(`INSERT INTO public.platform_admins(user_id,role,active) VALUES('${a.id}','${role}',true);`);
 const signatures=['record_calculator_qa_decision(uuid,text,text,text)','is_active_review_capable_admin(uuid)','assign_calculator_reviewer(uuid,uuid)','transition_calculator_with_audit(uuid,text,text)','create_catalog_calculator_with_audit(text,text,text,text,text,jsonb)'];
 for(const sig of signatures)assert.equal(await db.sql(`SELECT to_regprocedure('public.${sig}') IS NULL;`),'t');pass('All five current captured missing signatures reproduced');
 let sql='BEGIN;\nDO $blocked$ BEGIN RAISE EXCEPTION \'UNAPPLIED_ADMIN_COMPATIBILITY\'; END $blocked$;\n';
 for(const [file,sha]of Object.entries(sources)){const raw=await readFile(new URL('../../../supabase/migrations/'+file,import.meta.url),'utf8');assert.equal(hash(raw),sha);sql+=raw+'\n';}sql+='COMMIT;';
 await assert.rejects(db.sql(sql),/UNAPPLIED_ADMIN_COMPATIBILITY/);for(const sig of signatures)assert.equal(await db.sql(`SELECT to_regprocedure('public.${sig}') IS NULL;`),'t');pass('In-memory source-bound compatibility transaction cannot activate with guard intact');
 await db.sql(sql.replace("DO $blocked$ BEGIN RAISE EXCEPTION 'UNAPPLIED_ADMIN_COMPATIBILITY'; END $blocked$;",'-- disposable fixture only'));
 for(const sig of signatures)assert.equal(await db.sql(`SELECT prosecdef FROM pg_proc WHERE oid='public.${sig}'::regprocedure;`),sig.startsWith('is_active')?'t':'f');
 await db.sql("NOTIFY pgrst, 'reload schema';");
 const deadline=Date.now()+5000;for(;;){const r=await outsider.sdk.rpc('is_active_review_capable_admin',{p_user_id:reviewer.id});if(!r.error)break;if(Date.now()>deadline)throw Error('Read-only schema cache readiness timeout');await new Promise(r=>setTimeout(r,50));}
 pass('Existing immutable migration bytes install only locally with invoker/definer identities preserved');
 const args=()=>({p_calculator_key:'synthetic-'+randomUUID(),p_slug:'synthetic-'+randomUUID(),p_title:'Synthetic fixture only',p_category:'Fixture',p_risk_class:'standard',p_metadata:{}});
 await denied(outsider.sdk.rpc('create_catalog_calculator_with_audit',args()));await denied(editor.sdk.rpc('create_catalog_calculator_with_audit',args()));pass('Unaffiliated and editor creation denied by actual authenticated RPC');
 const id=await ok(owner.sdk.rpc('create_catalog_calculator_with_audit',args()));assert.equal(await db.sql(`SELECT lifecycle FROM calculator_catalog_admin WHERE id='${id}';`),'draft');assert.equal(await db.sql(`SELECT count(*) FROM calculator_qa_checks WHERE calculator_id='${id}' AND status='pending';`),'15');assert.equal(await db.sql(`SELECT count(*) FROM calculator_review_events WHERE calculator_id='${id}';`),'1');pass('Creation atomically creates only synthetic draft, 15 pending checks and one audit');
 const qa=(who,status,details='Synthetic fixture')=>who.sdk.rpc('record_calculator_qa_decision',{p_calculator_id:id,p_check_type:'engine-tests',p_status:status,p_details:details});
 await ok(qa(reviewer,'passed'));await denied(qa(reviewer,'waived'));await denied(qa(outsider,'passed'));pass('Reviewer decision succeeds while unauthorized and waiver decisions remain denied');
 await ok(owner.sdk.rpc('assign_calculator_reviewer',{p_calculator_id:id,p_reviewer_id:reviewer.id}));await denied(reviewer.sdk.rpc('assign_calculator_reviewer',{p_calculator_id:id,p_reviewer_id:owner.id}));await denied(owner.sdk.rpc('assign_calculator_reviewer',{p_calculator_id:id,p_reviewer_id:outsider.id}));pass('Assignment helper validates target behind captured platform-admin self RLS');
 const transition=(from,to)=>owner.sdk.rpc('transition_calculator_with_audit',{p_calculator_id:id,p_expected_lifecycle:from,p_target_lifecycle:to});
 await ok(transition('draft','review'));const before=await db.sql(`SELECT count(*) FROM calculator_review_events WHERE calculator_id='${id}';`);await denied(transition('review','certified'));assert.equal(await db.sql(`SELECT lifecycle FROM calculator_catalog_admin WHERE id='${id}';`),'review');assert.equal(await db.sql(`SELECT count(*) FROM calculator_review_events WHERE calculator_id='${id}';`),before);pass('Incomplete certification is denied with no lifecycle or audit side effect');
 const race=await Promise.all([transition('review','draft'),transition('review','draft')]);assert.equal(race.filter(r=>!r.error).length,1);assert.equal(race.filter(r=>r.error).length,1);assert.equal(Number(await db.sql(`SELECT count(*) FROM calculator_review_events WHERE calculator_id='${id}';`)),Number(before)+1);pass('Concurrent expected-state transition has one winner and one persisted audit');
 const state=async()=>db.sql(`SELECT json_build_object('catalog',(SELECT count(*) FROM calculator_catalog_admin),'qa',(SELECT jsonb_agg(to_jsonb(q) ORDER BY id) FROM calculator_qa_checks q),'reviewer',(SELECT reviewer_id FROM calculator_catalog_admin WHERE id='${id}'),'lifecycle',(SELECT lifecycle FROM calculator_catalog_admin WHERE id='${id}'),'audit',(SELECT count(*) FROM calculator_review_events))::text;`);
 await db.sql("CREATE FUNCTION public.closure_audit_fail() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic late audit failure'; END $$;CREATE TRIGGER closure_audit_fail BEFORE INSERT ON calculator_review_events FOR EACH ROW EXECUTE FUNCTION public.closure_audit_fail();");
 const snapshot=await state();for(const request of [()=>owner.sdk.rpc('create_catalog_calculator_with_audit',args()),()=>qa(reviewer,'failed'),()=>owner.sdk.rpc('assign_calculator_reviewer',{p_calculator_id:id,p_reviewer_id:owner.id}),()=>transition('draft','review')]){const err=await denied(request());assert.match(err.message,/synthetic late audit failure/);assert.equal(await state(),snapshot);}
 pass('Each of four RPCs rolls back catalog, QA, assignment and audit after late audit failure');
 await db.sql('DROP TRIGGER closure_audit_fail ON calculator_review_events; DROP FUNCTION public.closure_audit_fail();');
 await writeFile(artifacts+'/receipt.json',JSON.stringify({scope:'Conditional missing-migration compatibility; genuine isolated auth/RLS; only synthetic drafts/review, no successful certification/publication',startUTC:start.toISOString(),endUTC:new Date().toISOString(),checks,sources,provenance:db.provenance,productionWrites:false,adoptionAuthorized:false},null,2)+'\n');
}finally{if(db)await db.close();}
