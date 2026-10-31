import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {randomUUID,createHash} from 'node:crypto';
import {createClient} from '@supabase/supabase-js';
import {startGoTrueFixture,images} from '../gotrue-runtime/fixture.mjs';
import {initializeFullSchema} from '../gotrue-full-schema/schema.mjs';
const start=new Date(), checks=[], root=new URL('../../',import.meta.url), hash=x=>createHash('sha256').update(x).digest('hex');
const proposalPath='tests/batch17-issuance/review-only-issuance.sql';
const raw=await readFile(new URL(proposalPath,root),'utf8');
const pass=name=>{checks.push(name);console.log('PASS '+name);};
const ok=async q=>{const r=await q;assert.equal(r.error,null,JSON.stringify(r.error));return r.data;};
const denied=async(q,p)=>{const r=await q;assert(r.error,'expected denial');if(p)assert.match(r.error.message,p);return r;};
let db;
try {
 db=await startGoTrueFixture({initializeSchema:initializeFullSchema});
 const signup=async()=>{const sdk=createClient(db.url,db.anonKey,{auth:{persistSession:false,autoRefreshToken:false}}),email=randomUUID()+'@example.invalid';const d=await ok(sdk.auth.signUp({email,password:'Local-'+randomUUID()}));return {sdk,email,id:d.user.id};};
 const owner=await signup(),foreign=await signup(),low=await signup(),recipient=await signup();
 await db.sql(`UPDATE public.profiles SET plan='business' WHERE id IN ('${owner.id}','${foreign.id}');`);
 const org=await ok(owner.sdk.rpc('create_business_organization',{org_name:'Issuance',org_slug:randomUUID()}));
 const other=await ok(foreign.sdk.rpc('create_business_organization',{org_name:'Foreign',org_slug:randomUUID()}));
 await assert.rejects(db.sql(raw),/UNAPPLIED_BATCH17_ISSUANCE/);
 assert.equal(await db.sql("SELECT count(*) FROM pg_proc WHERE proname='reserve_business_invitation';"),'0');
 pass('Unchanged proposal guard rejects execution with no function installed');
 const b16=await readFile(new URL('tests/batch16-auth/review-only-business-integrity.sql',root),'utf8');
 await assert.rejects(db.sql(b16),/UNAPPLIED_BATCH16_BUSINESS_INTEGRITY/);
 await db.sql(b16.replace(/DO \$proposal_guard\$[\s\S]*?\$proposal_guard\$;/,'-- disposable only'));
 await db.sql((process.env.ISSUANCE_MUTATION==='quota-six'?raw.replace('IF occupied>=5','IF occupied>=6'):raw).replace(/DO \$proposal_guard\$[\s\S]*?\$proposal_guard\$;/,'-- disposable only'));
 await db.sql("NOTIFY pgrst, 'reload schema';");
 const issue=(who=owner,patch={})=>who.sdk.rpc('reserve_business_invitation',{p_organization_id:org,p_email:randomUUID()+'@example.invalid',p_role:'member',p_token_hash:hash(randomUUID()),...patch});
 // Schema cache notification is asynchronous; readiness retry is read-only.
 for(let i=0;i<100;i++){const r=await issue(foreign);if(r.error&&!/schema cache/.test(r.error.message))break;await new Promise(r=>setTimeout(r,50));}
 await denied(issue(foreign),/permission/);
 await denied(issue(owner,{p_organization_id:other}),/permission/);
 await db.sql(`INSERT INTO public.organization_members(organization_id,user_id,role) VALUES ('${org}','${low.id}','manager');UPDATE public.profiles SET plan='business' WHERE id='${low.id}';`);
 for(const role of ['manager','member','viewer']){await db.sql(`UPDATE public.organization_members SET role='${role}' WHERE organization_id='${org}' AND user_id='${low.id}';`);await denied(issue(low),/permission/);}
 await db.sql(`UPDATE public.organization_members SET role='admin' WHERE organization_id='${org}' AND user_id='${low.id}';UPDATE public.profiles SET plan='free' WHERE id='${low.id}';`);
 await denied(issue(low),/Business plan/);
 await denied(issue(owner,{p_role:'owner'}),/Invalid invitation/);
 await denied(issue(owner,{p_role:'invalid'}),/Invalid invitation/);
 await denied(issue(owner,{p_email:'invalid'}),/Invalid invitation/);
 await denied(issue(owner,{p_token_hash:'not-a-sha256'}),/Invalid invitation/);
 await denied(issue(owner,{p_role:null}),/Invalid invitation/);
 const anon=createClient(db.url,db.anonKey,{auth:{persistSession:false}});
 await denied(anon.rpc('reserve_business_invitation',{p_organization_id:org,p_email:'anon@example.invalid',p_role:'member',p_token_hash:hash(randomUUID())}),/permission denied/);
 pass('Foreign owner, cross-tenant target, manager, Free admin and invalid invitation denied');
 const beforeIssue=Number(await db.sql('SELECT extract(epoch FROM clock_timestamp())*1000;'));
 const id=await ok(issue(owner,{p_email:'  Mixed@Example.invalid  ',p_role:'viewer'}));
 const row=(await ok(owner.sdk.from('organization_invitations').select('*').eq('id',id)))[0];
 assert.equal(row.email,'mixed@example.invalid');assert.equal(row.role,'viewer');assert.equal(row.invited_by,owner.id);const afterIssue=Number(await db.sql('SELECT extract(epoch FROM clock_timestamp())*1000;'));assert(new Date(row.expires_at).getTime()>=beforeIssue+604800000-1);assert(new Date(row.expires_at).getTime()<=afterIssue+604800000+1);assert.equal(row.accepted_at,null);
 pass('Stored fields preserve normalized email, caller actor, role and exact 604800-second lifetime bounded by database clock');
 await db.sql(`DELETE FROM public.organization_invitations WHERE organization_id='${org}';`);
 // Two members + two live pending reservations leave exactly one seat.
 const recipientToken=hash(randomUUID());
 await ok(issue(owner,{p_email:recipient.email,p_token_hash:recipientToken}));await ok(issue());
 const race=async args=>{
  // Hold the organization row, start genuine API calls, prove both wait on DB locks, then release.
  const holder=db.sql(`BEGIN;SELECT id FROM public.organizations WHERE id='${org}' FOR UPDATE;SELECT pg_sleep(20);COMMIT;`).catch(()=>{});
  const until=async fn=>{for(let i=0;i<200;i++){if(await fn())return;await new Promise(r=>setTimeout(r,25));}throw Error('race barrier timeout');};
  await until(async()=>Number(await db.sql(`SELECT count(*) FROM pg_stat_activity WHERE query LIKE '%pg_sleep(20)%' AND wait_event='PgSleep';`))===1);
  const requests=args.map(p=>issue(owner,p).then(r=>r));
  await until(async()=>Number(await db.sql("SELECT count(*) FROM pg_stat_activity WHERE wait_event_type='Lock' AND query LIKE '%reserve_business_invitation%';"))>=2);
  await db.sql("SELECT pg_cancel_backend(pid) FROM pg_stat_activity WHERE query LIKE '%pg_sleep(20)%' AND wait_event='PgSleep';");await holder;
  return Promise.all(requests);
 };
 const distinct=await race([{},{}]);assert.equal(distinct.filter(r=>!r.error).length,1);assert.equal(distinct.filter(r=>r.error&&/five Business seats/.test(r.error.message)).length,1);
 assert.equal(await db.sql(`SELECT count(*) FROM public.organization_invitations WHERE organization_id='${org}' AND accepted_at IS NULL AND expires_at>clock_timestamp();`),'3');
 await denied(issue(),/five Business seats/);
 pass('Concurrent distinct genuine JWT requests reserve final seat once; members plus live pending enforce five-seat quota');
 await ok(recipient.sdk.rpc('accept_business_invitation',{invite_token_hash:recipientToken}));
 await denied(issue(),/five Business seats/);
 assert.equal(await db.sql(`SELECT count(*) FROM public.organization_members WHERE organization_id='${org}';`),'3');
 pass('Participating Batch16 redemption converts pending to member without freeing an occupied seat');
 await db.sql(`DELETE FROM public.organization_members WHERE organization_id='${org}' AND user_id='${recipient.id}';`);
 await db.sql(`DELETE FROM public.organization_invitations WHERE organization_id='${org}';`);
 const same={p_token_hash:hash(randomUUID()),p_email:'same@example.invalid'};
 const duplicated=await race([same,same]);assert.equal(duplicated.filter(r=>!r.error).length,1);assert.equal(duplicated.filter(r=>r.error).length,1);
 assert.equal(await db.sql(`SELECT count(*) FROM public.organization_invitations WHERE organization_id='${org}';`),'1');
 pass('Concurrent same request succeeds once and retains existing duplicate rejection rather than inventing idempotency');
 await db.sql(`UPDATE public.organization_invitations SET expires_at=clock_timestamp()-interval '1 second' WHERE organization_id='${org}';`);
 await ok(issue());await ok(issue());await ok(issue());await denied(issue(),/five Business seats/);
 pass('Expired unaccepted invitation consumes no reservation; live pending rows consume seats');
 await db.sql(`DELETE FROM public.organization_invitations WHERE organization_id='${org}';UPDATE public.profiles SET plan='business' WHERE id='${low.id}';`);
 await ok(issue(low));
 pass('Business admin caller succeeds independently of owner entitlement');
 await db.sql(`UPDATE public.organization_invitations SET accepted_at=clock_timestamp() WHERE organization_id='${org}';`);
 await ok(issue());await ok(issue());await ok(issue());await denied(issue(),/five Business seats/);
 pass('Accepted invitations do not count as pending reservations');
 // RLS direct insertion remains a bypass: it is characterized, never represented as participating.
 await ok(owner.sdk.from('organization_invitations').insert({organization_id:org,email:'direct@example.invalid',role:'member',token_hash:hash(randomUUID()),invited_by:owner.id,expires_at:new Date(Date.now()+86400000).toISOString()}));
 pass('CHARACTERIZED BLOCKER: existing authenticated direct insert bypasses reservation quota');
 const end=new Date();const sources=[];for(const p of [proposalPath,'tests/batch17-issuance/acceptance.mjs','tests/batch16-auth/review-only-business-integrity.sql','src/app/business/actions.ts','supabase/migrations/003_b5_business.sql','supabase/migrations/014_production_entitlement_rpc_sync.sql','supabase/migrations/032_business_builder_rls_auth_initplan.sql'])sources.push({path:p,sha256:hash(await readFile(new URL(p,root)))});
 const receipt={status:'REVIEW_ONLY_PREPARED_GENUINE_LOCAL_TESTED_ADOPTION_BLOCKED',startedAt:start.toISOString(),endedAt:end.toISOString(),elapsedSeconds:(end-start)/1000,checks,images,node:process.version,sources,baseHead:'36a90997d0c64f06ce6a7a86caa68ca177119eb5',productionEquivalence:'UNKNOWN',activation:false,modelProvenance:db.provenance,requestSummary:db.requests.reduce((counts,r)=>{const key=r.method+' '+r.path+' '+r.status;counts[key]=(counts[key]||0)+1;return counts;},{})};
 await mkdir(new URL('docs/full-product-batch17/',root),{recursive:true});await writeFile(new URL('docs/full-product-batch17/issuance-receipt.json',root),JSON.stringify(receipt,null,2)+'\n');
} finally {if(db)await db.close();}
