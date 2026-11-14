import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
import {createClient} from '@supabase/supabase-js';
import {startGoTrueFixture} from '../../gotrue-runtime/fixture.mjs';
import {initializeCompatibility} from '../../hosted-remediation-closure/compatibility/initializer.mjs';
import {initializeAdmin} from '../../hosted-remediation-closure/admin/initializer.mjs';
import {artifactDirectory} from '../../batch17-issuance/artifacts.mjs';
import {snapshot,prepareApply,prepareRollback,sha} from './bundle.mjs';
import {session,blocked} from '../../p0-publication-business/publication/sessions.mjs';
const artifacts=await artifactDirectory(process.env.ADOPTION_ARTIFACTS),checks=[],start=new Date();let db;
const pass=name=>{checks.push(name);console.log('PASS '+name);};
const open=sql=>sql.replace(/DO \$hold\$ BEGIN RAISE EXCEPTION 'UNAPPLIED_OWNER_P0_[^']+: no activation authority'; END \$hold\$;/,'-- removed only in disposable test copy');
try {
 db=await startGoTrueFixture({initializeSchema:async sql=>({account:await initializeCompatibility(sql),admin:await initializeAdmin(sql)})});
 const sdk=createClient(db.url,db.anonKey,{auth:{persistSession:false,autoRefreshToken:false}});
 const signup=await sdk.auth.signUp({email:randomUUID()+'@example.invalid',password:'Local-'+randomUUID()});assert.equal(signup.error,null);const user=signup.data.user.id;
 const recipient=createClient(db.url,db.anonKey,{auth:{persistSession:false,autoRefreshToken:false}}),recipientEmail=randomUUID()+'@example.invalid';const joined=await recipient.auth.signUp({email:recipientEmail,password:'Local-'+randomUUID()});assert.equal(joined.error,null);
 await db.sql(`UPDATE profiles SET plan='business' WHERE id='${user}';`);
 const rows=()=>db.sql("SELECT jsonb_build_object('profiles',(SELECT jsonb_agg(to_jsonb(p) ORDER BY id) FROM profiles p),'prefs',(SELECT jsonb_agg(to_jsonb(p)-'country_code' ORDER BY user_id) FROM user_preferences p))::text;");
 const dataBefore=await rows(),before=await snapshot(db.sql),bundle=await prepareApply(before);
 await assert.rejects(db.sql(bundle.sql),/UNAPPLIED_OWNER_P0_CORRECTION_BUNDLE/);assert.equal((await snapshot(db.sql)).sha256,before.sha256);
 await db.sql('\\set ON_ERROR_STOP off\n'+bundle.sql);assert.equal((await snapshot(db.sql)).sha256,before.sha256);pass('Composed guard prevents every constituent migration even when SQL client continues after errors');
 const local=open(bundle.sql);assert.notEqual(local,bundle.sql);
 await assert.rejects(db.sql('BEGIN ISOLATION LEVEL REPEATABLE READ;\n'+local),/requires READ COMMITTED/);assert.equal((await snapshot(db.sql)).sha256,before.sha256);pass('Unsupported snapshot isolation refuses before any correction');
 await db.sql('ALTER TABLE public.profiles ADD COLUMN isolated_schema_drift integer;');await assert.rejects(db.sql(local),/EXACT_METADATA_PRECONDITION_MISMATCH/);await db.sql('ALTER TABLE public.profiles DROP COLUMN isolated_schema_drift;');assert.equal((await snapshot(db.sql)).sha256,before.sha256);pass('Full declared public/provider metadata fingerprint rejects incompatible target shape');
 await assert.rejects(db.sql(local.replace(/COMMIT;\s*$/,'SELECT 1/0;\nCOMMIT;')),/division by zero/);assert.equal((await snapshot(db.sql)).sha256,before.sha256);assert.equal(await rows(),dataBefore);pass('Late failure rolls back all column, RPC, trigger and ACL changes atomically');
 await db.sql(local);const after=await snapshot(db.sql);assert.notEqual(after.sha256,before.sha256);assert.deepEqual(after.data.provider,before.data.provider);assert.equal(await rows(),dataBefore);
 assert(after.data.columns.some(c=>c.table==='public.user_preferences'&&c.name==='country_code'));for(const name of ['record_calculator_qa_decision','assign_calculator_reviewer','transition_calculator_with_audit','create_catalog_calculator_with_audit'])assert(after.data.functions.some(f=>f.id.startsWith('public.'+name+'(')));
 for(const name of ['calculator_publish_gate_final_row','p0_publication_insert_guard','p0_publication_qa_parent_lock','p0_publication_reviewer_lock'])assert(after.data.triggers.some(t=>t.id===name));pass('Combined009032–035 narrowed038 and exact-date/final-row/P0 corrections compile on hosted-shaped fixture with provider unchanged');
 await assert.rejects(db.sql(local),/EXACT_METADATA_PRECONDITION_MISMATCH/);assert.equal((await snapshot(db.sql)).sha256,after.sha256);pass('Reapplication to changed postimage refuses instead of overwriting or pretending idempotent adoption');
 // Integrate the separately guarded membership correction with the account,
 // admin and publication bundle, then reverse it before the base rollback.
 const supplemental=[];
 for(const source of bundle.plan.supplementarySourceBindings){const raw=await readFile(new URL('../../../'+source.path,import.meta.url),'utf8');assert.equal(sha(raw),source.sha256);supplemental.push(raw);}
 const unguard=raw=>raw.replace(/DO \$proposal_guard\$ BEGIN RAISE EXCEPTION '[^']+'; END \$proposal_guard\$;/,'-- removed in disposable integration only');
 await assert.rejects(db.sql(supplemental[0]),/UNAPPLIED_OWNER_P0_MEMBERSHIP/);await db.sql(unguard(supplemental[0]));await db.sql("NOTIFY pgrst, 'reload schema';");
 const {data:{session:ownerSession}}=await sdk.auth.getSession();const deadline=Date.now()+5000;
 for(;;){const response=await fetch(db.url+'/rest/v1/',{headers:{apikey:db.anonKey,Authorization:'Bearer '+ownerSession.access_token,Accept:'application/openapi+json'},signal:AbortSignal.timeout(5000)});assert.equal(response.status,200);if((await response.json()).paths?.['/rpc/reserve_business_invitation'])break;if(Date.now()>deadline)throw Error('Membership cache readiness deadline');await new Promise(r=>setTimeout(r,50));}
 const businessRows=()=>db.sql("SELECT jsonb_build_object('orgs',(SELECT jsonb_agg(to_jsonb(o) ORDER BY id) FROM organizations o),'members',(SELECT jsonb_agg(to_jsonb(m) ORDER BY organization_id,user_id) FROM organization_members m),'invites',(SELECT jsonb_agg(to_jsonb(i) ORDER BY id) FROM organization_invitations i),'audit',(SELECT jsonb_agg(to_jsonb(a) ORDER BY id) FROM organization_audit_log a))::text;");
 // OpenAPI visibility is not proof that the authenticated RPC dispatch cache is ready.
 // A null organization must reject before locks or writes in the exact guarded SQL.
 const beforeReadinessProbe=await businessRows();
 for(;;){
  const remaining=deadline-Date.now();assert(remaining>0,'Membership RPC cache readiness deadline');
  const probe=await sdk.rpc('reserve_business_invitation',{p_organization_id:null,p_email:recipientEmail,p_role:'viewer',p_token_hash:'0'.repeat(64)}).abortSignal(AbortSignal.timeout(remaining));
  if(probe.error?.code!=='PGRST202'){assert.equal(probe.error?.code,'P0001','Readiness must reach the governed validation refusal');assert.equal(probe.error.message,'Invalid invitation details');break;}
  assert(Date.now()<deadline,'Membership RPC cache readiness deadline');await new Promise(r=>setTimeout(r,Math.min(50,deadline-Date.now())));
 }
 assert.equal(await businessRows(),beforeReadinessProbe,'Readiness probes cannot mutate business data');
 const org=await sdk.rpc('create_business_organization',{org_name:'Combined isolated fixture',org_slug:randomUUID()});assert.equal(org.error,null);
 const token=sha(randomUUID()),reservation=await sdk.rpc('reserve_business_invitation',{p_organization_id:org.data,p_email:recipientEmail,p_role:'viewer',p_token_hash:token});assert.equal(reservation.error,null);
 const accepted=await recipient.rpc('accept_business_invitation',{invite_token_hash:token});assert.equal(accepted.error,null);assert.equal(accepted.data,org.data);
 assert.equal(await db.sql(`SELECT count(*) FROM organization_members WHERE organization_id='${org.data}';`),'2');assert.equal(await db.sql(`SELECT count(*) FROM organization_audit_log WHERE organization_id='${org.data}' AND action='member.joined';`),'1');pass('New membership protocol and narrowed caller privileges coexist with all reviewed admin/publication corrections under genuine auth');
 const retainedBusiness=await businessRows();await assert.rejects(db.sql(supplemental[1]),/UNAPPLIED_OWNER_P0_ROLLBACK/);await db.sql(unguard(supplemental[1]));assert.equal((await snapshot(db.sql)).sha256,after.sha256);assert.equal(await businessRows(),retainedBusiness);pass('Membership reversal restores exact pre-membership metadata while retaining completed membership and audit rows');
 const rollback=prepareRollback(before,after);await assert.rejects(db.sql(rollback.sql),/UNAPPLIED_OWNER_P0_ROLLBACK/);assert.equal((await snapshot(db.sql)).sha256,after.sha256);
 const reverse=open(rollback.sql);await db.sql(`UPDATE user_preferences SET country_code='GB' WHERE user_id='${user}';`);await assert.rejects(db.sql(reverse),/ROLLBACK_REFUSES_COUNTRY_DATA_LOSS/);assert.equal(await db.sql(`SELECT country_code FROM user_preferences WHERE user_id='${user}';`),'GB');assert.equal((await snapshot(db.sql)).sha256,after.sha256);pass('Rollback stays guarded and refuses to discard country data introduced after adoption');
 // Synthetic fixture only: restore NULL to exercise the no-user-data rollback case.
 await db.sql(`UPDATE user_preferences SET country_code=NULL WHERE user_id='${user}';`);
 const container=(await db.sql("SELECT pg_read_file('/etc/hostname');")).trim(),writer=session(container,'owner_country_writer');
 try{
  await writer.ready();await writer.query(`BEGIN;UPDATE user_preferences SET country_code='CA' WHERE user_id='${user}';`);
  const pending=db.sql("SET application_name='owner_rollback_waiter';\n"+reverse),denied=assert.rejects(pending,/ROLLBACK_REFUSES_COUNTRY_DATA_LOSS/);
  await blocked(db,'owner_rollback_waiter');await writer.query('COMMIT;');await denied;
  assert.equal(await db.sql(`SELECT country_code FROM user_preferences WHERE user_id='${user}';`),'CA');assert.equal((await snapshot(db.sql)).sha256,after.sha256);
  pass('Country writer first: rollback waits for exclusive table lock then refuses the newly committed data');
 }finally{writer.close();}
 await db.sql(`UPDATE user_preferences SET country_code=NULL WHERE user_id='${user}';`);
 const barrier=session(container,'owner_rollback_barrier'),lateWriter=session(container,'owner_country_after');
 try{
  await barrier.ready();await lateWriter.ready();await barrier.query('BEGIN;SELECT pg_advisory_xact_lock(77814001);');
  const instrumented=reverse.replace('LOCK TABLE public.user_preferences IN ACCESS EXCLUSIVE MODE;','LOCK TABLE public.user_preferences IN ACCESS EXCLUSIVE MODE;SELECT pg_advisory_xact_lock(77814001);');
  const rolling=db.sql("SET application_name='owner_rollback_first';\n"+instrumented);await blocked(db,'owner_rollback_first');
  const pending=lateWriter.query(`BEGIN;SET LOCAL ROLE authenticated;SELECT set_config('request.jwt.claim.sub','${user}',true);UPDATE user_preferences SET country_code='AU' WHERE user_id='${user}';COMMIT;`),denied=assert.rejects(pending,/country_code|column/);
  await blocked(db,'owner_country_after');await barrier.query('COMMIT;');await rolling;await denied;
  pass('Rollback first: later authenticated country writer cannot commit into the disappearing column');
 }finally{barrier.close();lateWriter.close();}
 const restored=await snapshot(db.sql);assert.equal(restored.sha256,before.sha256);assert.equal(await rows(),dataBefore);assert.equal(await businessRows(),retainedBusiness);pass('Rollback restores exact semantic metadata preimage and all preexisting account/business rows without CASCADE');
 await db.sql(local);const reapplied=await snapshot(db.sql);
 // PostgreSQL does not reuse a dropped attribute number. Preserve that exact
 // distinction for future preconditions while checking all visible semantics.
 const normalized=structuredClone(reapplied.data),originalCountry=after.data.columns.find(c=>c.table==='public.user_preferences'&&c.name==='country_code'),newCountry=normalized.columns.find(c=>c.table==='public.user_preferences'&&c.name==='country_code');
 assert(newCountry.position>originalCountry.position);newCountry.position=originalCountry.position;assert.deepEqual(normalized,after.data);assert.notEqual(reapplied.sha256,after.sha256);assert.equal(await rows(),dataBefore);
 pass('Rollback/reinstall preserves every visible semantic with explicit new physical attribute ordinal and fresh postimage binding');
 await writeFile(artifacts+'/apply.sql',bundle.sql);await writeFile(artifacts+'/rollback.sql',rollback.sql);
 await writeFile(artifacts+'/receipt.json',JSON.stringify({scope:'Fourteen public target tables plus genuine local auth/provider metadata; isolated snapshot only, not production target/data acceptance',startUTC:start.toISOString(),endUTC:new Date().toISOString(),checks,plan:bundle.plan,before:before.sha256,after:after.sha256,restored:restored.sha256,reapplied:reapplied.sha256,attributeOrdinalChange:{first:originalCountry.position,reinstalled:reapplied.data.columns.find(c=>c.table==='public.user_preferences'&&c.name==='country_code').position},applySha256:sha(bundle.sql),rollbackSha256:sha(rollback.sql),provenance:db.provenance,productionWrites:false,activationAuthorized:false,rollbackWarning:rollback.warning},null,2)+'\n');
}finally{if(db)await db.close();}
