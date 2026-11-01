import assert from 'node:assert/strict';
import {randomUUID,createHash} from 'node:crypto';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createClient} from '@supabase/supabase-js';
import {startGoTrueFixture} from '../../gotrue-runtime/fixture.mjs';
import {artifactDirectory} from '../../batch17-issuance/artifacts.mjs';
import {initializeHostedInvitations} from './initializer.mjs';
const checks=[],pass=name=>{checks.push(name);console.log('PASS '+name);},hash=x=>createHash('sha256').update(x).digest('hex');
const ok=async p=>{const r=await p;assert.equal(r.error,null,JSON.stringify(r.error));return r.data;};
const denied=async p=>{const r=await p;assert(r.error,'Expected rejection');return r;};
assert(process.env.INVITATION_ARTIFACTS,'INVITATION_ARTIFACTS outside-Git directory required');
const artifacts=await artifactDirectory(process.env.INVITATION_ARTIFACTS);
let db;
try{
 db=await startGoTrueFixture({initializeSchema:initializeHostedInvitations});
 const signup=async()=>{const sdk=createClient(db.url,db.anonKey,{auth:{persistSession:false,autoRefreshToken:false}}),email=randomUUID()+'@example.invalid';const r=await ok(sdk.auth.signUp({email,password:randomUUID()+'-Local'}));return {sdk,email,id:r.user.id};};
 const owner=await signup(),a=await signup(),b=await signup(),c=await signup(),d=await signup(),e=await signup();
 await db.sql(`UPDATE profiles SET plan='business' WHERE id='${owner.id}';`);
 const org=await ok(owner.sdk.rpc('create_business_organization',{org_name:'Hosted invitation fixture',org_slug:randomUUID()}));
 const issue=async(user,role='member')=>{const token=hash(randomUUID());const row=(await ok(owner.sdk.from('organization_invitations').insert({organization_id:org,email:user.email,role,token_hash:token,invited_by:owner.id,expires_at:new Date(Date.now()+3600000).toISOString()}).select()))[0];return {token,id:row.id};};
 const accept=(u,i)=>u.sdk.rpc('accept_business_invitation',{invite_token_hash:i.token});
 const count=()=>db.sql(`SELECT count(*) FROM organization_members WHERE organization_id='${org}';`);
 const reset=()=>db.sql(`DELETE FROM organization_invitations WHERE organization_id='${org}';DELETE FROM organization_members WHERE organization_id='${org}' AND user_id<>'${owner.id}';DELETE FROM organization_audit_log WHERE organization_id='${org}';UPDATE organization_members SET role='owner' WHERE organization_id='${org}' AND user_id='${owner.id}';`);
 const add=users=>db.sql(`INSERT INTO organization_members(organization_id,user_id,role) VALUES ${users.map(u=>`('${org}','${u.id}','viewer')`).join(',')};`);
 async function race(table,requests){
  const key=761803;
  await db.sql(`CREATE FUNCTION public.invitation_test_barrier() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN PERFORM pg_advisory_xact_lock(${key});RETURN NEW;END $$;CREATE TRIGGER invitation_test_barrier BEFORE INSERT ON public.${table} FOR EACH ROW EXECUTE FUNCTION public.invitation_test_barrier();`);
  const holder=db.sql(`SELECT pg_advisory_lock(${key});SELECT pg_sleep(25);`).catch(()=>{});
  const until=async fn=>{for(let i=0;i<250;i++){if(await fn())return;await new Promise(r=>setTimeout(r,20));}throw Error('Barrier timeout');};
  try{await until(async()=>Number(await db.sql(`SELECT count(*) FROM pg_locks WHERE locktype='advisory' AND objid=${key} AND granted;`))===1);const pending=requests.map(f=>Promise.resolve(f()));await until(async()=>Number(await db.sql(`SELECT count(*) FROM pg_locks WHERE locktype='advisory' AND objid=${key} AND NOT granted;`))===2);await db.sql(`SELECT pg_cancel_backend(pid) FROM pg_locks WHERE locktype='advisory' AND objid=${key} AND granted;`);await holder;return await Promise.all(pending);}finally{await holder;await db.sql(`DROP TRIGGER invitation_test_barrier ON public.${table};DROP FUNCTION public.invitation_test_barrier();`);}
 }
 const duplicatePending=()=>owner.sdk.from('organization_invitations').insert({organization_id:org,email:a.email.toUpperCase(),role:'member',token_hash:hash(randomUUID()),invited_by:owner.id,expires_at:new Date(Date.now()+3600000).toISOString()});
 const pendingEmail=await issue(a);const duplicateEmail=await denied(duplicatePending());assert.equal(duplicateEmail.error.code,'23505');
 await db.sql(`UPDATE organization_invitations SET expires_at=now()-interval '1 day' WHERE id='${pendingEmail.id}';`);const expiredPending=await denied(duplicatePending());assert.equal(expiredPending.error.code,'23505');
 await db.sql(`UPDATE organization_invitations SET accepted_at=now() WHERE id='${pendingEmail.id}';`);await issue({email:a.email.toUpperCase()});
 assert.equal(await db.sql(`SELECT indexdef FROM pg_indexes WHERE schemaname='public' AND indexname='organization_pending_invite_email_idx';`),JSON.parse(await readFile(new URL('scoped-descriptor.json',import.meta.url),'utf8')).sections.indexes.rows.find(r=>r.id.endsWith(':organization_pending_invite_email_idx')).definition);
 pass('Captured pending-email index rejects case-insensitive same-organization duplicates even expired; accepted-row email can be reused');await reset();
 await add([a,b,c]);const i=await issue(d),j=await issue({email:'another@example.invalid'});
 // Issuance has no reservation quota in captured RLS; barrier proves concurrent direct writers.
 await db.sql(`DELETE FROM organization_invitations WHERE id IN ('${i.id}','${j.id}');`);
 const direct=u=>()=>owner.sdk.from('organization_invitations').insert({organization_id:org,email:u.email,role:'member',token_hash:hash(randomUUID()),invited_by:owner.id,expires_at:new Date(Date.now()+3600000).toISOString()});
 const issuance=await race('organization_invitations',[direct(d),direct({email:'spare@example.invalid'})]);assert(issuance.every(r=>!r.error));assert.equal(await count(),'4');assert.equal(await db.sql(`SELECT count(*) FROM organization_invitations WHERE organization_id='${org}';`),'2');pass('Captured issuance RLS: concurrent final-seat reservations both succeed (six occupied-or-pending)');
 await reset();await add([b,c,d]);const finalA=await issue(a),finalE=await issue(e);const finalResults=await race('organization_members',[()=>accept(a,finalA),()=>accept(e,finalE)]);assert(finalResults.every(r=>!r.error));assert.equal(await count(),'6');pass('Captured distinct final-seat redemptions deterministically overbook to six members');
 await reset();await add([b,c,d]);const ia=await issue(a),io=await issue(owner,'viewer');
 // Existing owner is already counted: race a new member with an existing owner still exercises both read-before-write paths.
 const redeems=await race('organization_members',[()=>accept(a,ia),()=>accept(owner,io)]);assert(redeems.every(r=>!r.error));assert.equal(await count(),'5');assert.equal(await db.sql(`SELECT role FROM organization_members WHERE organization_id='${org}' AND user_id='${owner.id}';`),'viewer');pass('Captured SECURITY DEFINER redemption changes existing owner role; owner policy disposition remains BLOCKED');
 await reset();const dup=await issue(a);const dupResults=await race('organization_members',[()=>accept(a,dup),()=>accept(a,dup)]);assert(dupResults.every(r=>!r.error));assert.equal(await db.sql(`SELECT count(*) FROM organization_audit_log WHERE organization_id='${org}' AND action='member.joined';`),'2');pass('Captured duplicate redemption succeeds twice and appends two audit records');
 await reset();const revoked=await issue(a);await ok(owner.sdk.from('organization_invitations').delete().eq('id',revoked.id));await denied(accept(a,revoked));assert.equal(await count(),'1');pass('Captured owner revocation prevents subsequent redemption');
 await add([a,b,c,d]);const existing=await issue(a,'admin');await denied(accept(a,existing));assert.equal(await db.sql(`SELECT role FROM organization_members WHERE organization_id='${org}' AND user_id='${a.id}';`),'viewer');pass('Captured existing member at full capacity is rejected before role update');
 await reset();const rollback=await issue(a);await db.sql("CREATE FUNCTION public.invitation_test_fail() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'test audit rollback';END $$;CREATE TRIGGER invitation_test_fail BEFORE INSERT ON organization_audit_log FOR EACH ROW EXECUTE FUNCTION invitation_test_fail();");await denied(accept(a,rollback));assert.equal(await count(),'1');assert.equal(await db.sql(`SELECT accepted_at IS NULL FROM organization_invitations WHERE id='${rollback.id}';`),'t');await db.sql('DROP TRIGGER invitation_test_fail ON organization_audit_log;DROP FUNCTION invitation_test_fail();');pass('Captured audit failure rolls back membership and accepted timestamp atomically');
 await add([a,b,c,d]);await db.sql(`INSERT INTO organization_invitations(organization_id,email,role,token_hash,invited_by,expires_at) VALUES ('${org}','privileged@example.invalid','member','privileged','${owner.id}',now()+interval '1 day');`);pass('Privileged SQL writer bypasses invitation quota; no global seat invariant claimed');
 const proposal=await readFile(new URL('../../batch17-issuance/review-only-issuance.sql',import.meta.url),'utf8');await assert.rejects(db.sql(proposal),/UNAPPLIED_BATCH17_ISSUANCE/);pass('Unchanged conditional issuance proposal guard rejects execution');
 await db.sql(proposal.replace(/DO \$proposal_guard\$[\s\S]*?\$proposal_guard\$;/,'-- disposable fixture only'));
 const reserve=()=>db.sql(`BEGIN;SET LOCAL ROLE authenticated;SELECT set_config('request.jwt.claim.sub','${owner.id}',true);SELECT reserve_business_invitation('${org}','conditional@example.invalid','member','${hash(randomUUID())}');COMMIT;`);
 await assert.rejects(reserve(),/five Business seats/);await reset();await reserve();assert.equal(await db.sql(`SELECT count(*) FROM organization_invitations WHERE organization_id='${org}';`),'1');pass('Conditional guarded issuance proposal rejects full quota and accepts available capacity on captured scoped schema');
 await add([a,b,c,d]);await ok(owner.sdk.from('organization_invitations').insert({organization_id:org,email:'proposal-bypass@example.invalid',role:'member',token_hash:hash(randomUUID()),invited_by:owner.id,expires_at:new Date(Date.now()+3600000).toISOString()}));pass('Conditional issuance proposal still permits authenticated direct-table quota bypass: adoption BLOCKED');
 await mkdir(artifacts,{recursive:true});await writeFile(artifacts+'/receipt.json',JSON.stringify({status:'CHARACTERIZED_HOSTED_SHAPED_INVITATIONS_POLICY_BLOCKED',checks,provenance:db.provenance,proposalSha256:hash(proposal),runtime:process.version,sources:await Promise.all(['initializer.mjs','acceptance.mjs'].map(async name=>({path:name,sha256:hash(await readFile(new URL(name,import.meta.url)))}))),productionWrites:false,activation:false},null,2)+'\n');
}finally{if(db)await db.close();}
