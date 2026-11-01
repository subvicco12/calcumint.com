import assert from 'node:assert/strict';
import {randomUUID,createHash} from 'node:crypto';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createClient} from '@supabase/supabase-js';
import {startGoTrueFixture} from '../../gotrue-runtime/fixture.mjs';
import {artifactDirectory} from '../../batch17-issuance/artifacts.mjs';
import {initializeHostedInvitations} from '../../hosted-schema-remediation/invitations/initializer.mjs';
const hash=x=>createHash('sha256').update(x).digest('hex'),checks=[];
const pass=x=>{checks.push(x);console.log('PASS '+x);};
const ok=async p=>{let r=await p;assert.equal(r.error,null,JSON.stringify(r.error));return r.data;};
const denied=async p=>{let r=await p;assert(r.error,'Expected rejection');return r.error;};
const candidate=await readFile(new URL('review-only-membership.sql',import.meta.url),'utf8');
const artifacts=await artifactDirectory(process.env.MEMBERSHIP_ARTIFACTS);
let db;
try{
 db=await startGoTrueFixture({initializeSchema:initializeHostedInvitations});
 const signup=async()=>{let sdk=createClient(db.url,db.anonKey,{auth:{persistSession:false,autoRefreshToken:false}}),email=randomUUID()+'@example.invalid';let r=await ok(sdk.auth.signUp({email,password:randomUUID()+'-Local'}));return {sdk,email,id:r.user.id};};
 const owner=await signup(),a=await signup(),b=await signup(),c=await signup(),d=await signup(),e=await signup();
 await db.sql(`UPDATE profiles SET plan='business' WHERE id='${owner.id}'`);
 const org=await ok(owner.sdk.rpc('create_business_organization',{org_name:'Owner P0 fixture',org_slug:randomUUID()}));
 const service=createClient(db.url,db.serviceKey,{auth:{persistSession:false,autoRefreshToken:false}});
 const issue=async u=>{let token=hash(randomUUID());let id=await ok(owner.sdk.rpc('reserve_business_invitation',{p_organization_id:org,p_email:u.email,p_role:'member',p_token_hash:token}));return {id,token};};
 const accept=(u,i)=>u.sdk.rpc('accept_business_invitation',{invite_token_hash:i.token});
 const row=u=>({organization_id:org,email:u.email,role:'member',token_hash:hash(randomUUID()),invited_by:owner.id,expires_at:new Date(Date.now()+3600000).toISOString()});
 const add=users=>db.sql(`INSERT INTO organization_members(organization_id,user_id,role) VALUES ${users.map(u=>`('${org}','${u.id}','viewer')`).join(',')}`);
 const reset=()=>db.sql(`DELETE FROM organization_invitations WHERE organization_id='${org}';DELETE FROM organization_members WHERE organization_id='${org}' AND user_id<>'${owner.id}';DELETE FROM organization_audit_log WHERE organization_id='${org}';`);
 const count=()=>db.sql(`SELECT count(*) FROM organization_members WHERE organization_id='${org}'`);
 const audit=()=>db.sql(`SELECT count(*) FROM organization_audit_log WHERE organization_id='${org}' AND action='member.joined'`);
 const until=async fn=>{for(let i=0;i<250;i++){if(await fn())return;await new Promise(r=>setTimeout(r,20));}throw Error('Race barrier timeout');};
 async function race(requests){
  const held=db.sql(`BEGIN;SELECT id FROM organizations WHERE id='${org}' FOR UPDATE;SELECT pg_sleep(20);COMMIT;`).catch(()=>{});
  try{
   await until(async()=>Number(await db.sql("SELECT count(*) FROM pg_stat_activity WHERE query LIKE '%pg_sleep(20)%' AND wait_event='PgSleep'"))===1);
   const pending=requests.map(f=>Promise.resolve(f()));
   await until(async()=>Number(await db.sql("SELECT count(*) FROM pg_stat_activity WHERE wait_event_type='Lock' AND pid<>pg_backend_pid()"))>=2);
   await db.sql("SELECT pg_cancel_backend(pid) FROM pg_stat_activity WHERE query LIKE '%pg_sleep(20)%' AND wait_event='PgSleep'");await held;
   return await Promise.all(pending);
  } finally {await held;}
 }
 const legacyOwner=(await ok(owner.sdk.from('organization_invitations').insert({...row(owner),role:'viewer'}).select()))[0];
 await assert.rejects(db.sql(candidate),/UNAPPLIED_OWNER_P0_MEMBERSHIP/);
 await db.sql(candidate.replace(/DO \$proposal_guard\$[\s\S]*?\$proposal_guard\$;/,'-- disposable fixture guard removed'));
 await db.sql("NOTIFY pgrst, 'reload schema'");
 await until(async()=>{const session=(await owner.sdk.auth.getSession()).data.session;const res=await fetch(db.url+'/rest/v1/',{headers:{apikey:db.anonKey,Authorization:'Bearer '+session.access_token}});return Boolean((await res.json()).paths?.['/rpc/reserve_business_invitation']);});
 const bootstrapOwner=await signup();await db.sql(`UPDATE profiles SET plan='business' WHERE id='${bootstrapOwner.id}'`);
 await ok(bootstrapOwner.sdk.rpc('create_business_organization',{org_name:'Guarded bootstrap still usable',org_slug:randomUUID()}));
 await denied(accept(owner,{token:legacyOwner.token_hash}));assert.equal(await audit(),'0');assert.equal(await db.sql(`SELECT accepted_at IS NULL FROM organization_invitations WHERE id='${legacyOwner.id}'`),'t');
 pass('Pre-candidate existing owner invitation redemption rejects without consumption or audit');
 await reset();
 pass('Guard rejects execution; source guards accepted; GoTrue signup and organization bootstrap preserved');
 await denied(a.sdk.rpc('reserve_business_invitation',{p_organization_id:org,p_email:b.email,p_role:'member',p_token_hash:hash(randomUUID())}));
 pass('Issuance retains caller Business entitlement and organization authority');
 await add([b,c,d]);
 const reserved=await race([()=>owner.sdk.from('organization_invitations').insert(row(a)),()=>owner.sdk.rpc('reserve_business_invitation',{p_organization_id:org,p_email:e.email,p_role:'member',p_token_hash:hash(randomUUID())})]);
 assert.equal(reserved.filter(r=>!r.error).length,1);assert.equal(await db.sql(`SELECT public.owner_p0_occupied('${org}')`),'5');pass('Deterministic direct-table versus RPC final-seat issuance: exactly one reservation');
 await reset();
 const beforeDowngrade=await db.sql(`SELECT jsonb_build_object('members',(SELECT jsonb_agg(to_jsonb(m)) FROM organization_members m WHERE organization_id='${org}'),'invitations',(SELECT jsonb_agg(to_jsonb(i)) FROM organization_invitations i WHERE organization_id='${org}'),'audit',(SELECT jsonb_agg(to_jsonb(a)) FROM organization_audit_log a WHERE organization_id='${org}'))`);
 await db.sql(`UPDATE profiles SET plan='free' WHERE id='${owner.id}'`);
 await denied(owner.sdk.from('organization_invitations').insert(row(a)));
 await denied(owner.sdk.rpc('reserve_business_invitation',{p_organization_id:org,p_email:a.email,p_role:'member',p_token_hash:hash(randomUUID())}));
 assert.equal(await db.sql(`SELECT jsonb_build_object('members',(SELECT jsonb_agg(to_jsonb(m)) FROM organization_members m WHERE organization_id='${org}'),'invitations',(SELECT jsonb_agg(to_jsonb(i)) FROM organization_invitations i WHERE organization_id='${org}'),'audit',(SELECT jsonb_agg(to_jsonb(a)) FROM organization_audit_log a WHERE organization_id='${org}'))`),beforeDowngrade);
 await db.sql(`UPDATE profiles SET plan='business' WHERE id='${owner.id}'`);
 await ok(owner.sdk.from('organization_invitations').insert(row(a)));
 pass('Downgraded owner direct POST and issuance RPC reject without effects; Business owner direct POST succeeds');
 await reset();
 for(const patch of [{token_hash:'invalid-token'},{role:'owner'},{email:'invalid-email'}]){
  const error=await denied(owner.sdk.from('organization_invitations').insert({...row(a),...patch}));assert.match(error.message,/Invalid invitation details/);
 }
 const canonical=(await ok(owner.sdk.from('organization_invitations').insert({...row(a),email:'  '+a.email.toUpperCase()+'  '}).select()))[0];assert.equal(canonical.email,a.email);
 await denied(owner.sdk.from('organization_invitations').insert(row(a)));
 pass('Direct POST shares RPC token, role and canonical-email validation; duplicate lower-email reservation rejects');
 await reset();const ia=await issue(a);const duplicate=await race([()=>accept(a,ia),()=>accept(a,ia)]);assert.equal(duplicate.filter(r=>!r.error).length,1);assert.equal(await audit(),'1');assert.equal(await count(),'2');pass('Concurrent duplicate token: one success, one rejection, one member.joined audit');
 const beforeDuplicate=await db.sql(`SELECT (SELECT count(*) FROM organization_invitations WHERE organization_id='${org}')||':'||(SELECT count(*) FROM organization_audit_log WHERE organization_id='${org}')||':'||(SELECT count(*) FROM organization_members WHERE organization_id='${org}')`);
 await denied(owner.sdk.from('organization_invitations').insert(row(owner)));
 await denied(owner.sdk.from('organization_invitations').insert(row(a)));
 assert.equal(await db.sql(`SELECT (SELECT count(*) FROM organization_invitations WHERE organization_id='${org}')||':'||(SELECT count(*) FROM organization_audit_log WHERE organization_id='${org}')||':'||(SELECT count(*) FROM organization_members WHERE organization_id='${org}')`),beforeDuplicate);
 pass('Direct POST rejects existing owner and member invitations without added reservations, membership or audit');
 await denied(accept(a,ia));await denied(owner.sdk.rpc('reserve_business_invitation',{p_organization_id:org,p_email:a.email,p_role:'admin',p_token_hash:hash(randomUUID())}));
 await denied(owner.sdk.from('organization_members').update({role:'viewer'}).eq('organization_id',org).eq('user_id',owner.id));
 await denied(owner.sdk.from('organization_members').update({user_id:b.id}).eq('organization_id',org).eq('user_id',a.id));
 assert.equal(await db.sql(`SELECT role FROM organization_members WHERE organization_id='${org}' AND user_id='${owner.id}'`),'owner');pass('Active membership replay, owner demotion and user identity rewrite rejected');
 await db.sql(`UPDATE organization_members SET role='admin' WHERE organization_id='${org}' AND user_id='${a.id}'`);
 await ok(a.sdk.from('organizations').update({name:'Admin rename remains authorized'}).eq('id',org));
 await denied(a.sdk.from('organizations').update({owner_user_id:a.id}).eq('id',org));
 await denied(service.from('organizations').update({owner_user_id:a.id}).eq('id',org));
 await denied(service.from('organizations').update({id:randomUUID()}).eq('id',org));
 assert.equal(await db.sql(`SELECT owner_user_id FROM organizations WHERE id='${org}'`),owner.id);
 assert.equal(await db.sql(`SELECT name FROM organizations WHERE id='${org}'`),'Admin rename remains authorized');
 assert.equal(await db.sql(`SELECT role FROM organization_members WHERE organization_id='${org}' AND user_id='${owner.id}'`),'owner');
 pass('Admin and service organization owner/identity rewrites reject; authorized admin name update remains usable');
 const tableState=()=>db.sql(`SELECT jsonb_build_object('organizations',(SELECT jsonb_agg(to_jsonb(o) ORDER BY id) FROM organizations o),'members',(SELECT jsonb_agg(to_jsonb(m) ORDER BY organization_id,user_id) FROM organization_members m),'invitations',(SELECT jsonb_agg(to_jsonb(i) ORDER BY id) FROM organization_invitations i),'audit',(SELECT jsonb_agg(to_jsonb(a) ORDER BY id) FROM organization_audit_log a))`);
 const preTruncate=await tableState();
 for(const role of ['anon','authenticated','service_role']){
  for(const table of ['organizations','organization_members','organization_invitations','organization_audit_log']){
   // Include FK-dependent tables so FK validation cannot mask the statement fence.
   const target=table==='organizations'?'organizations,organization_members,organization_invitations,organization_audit_log':table;
   await assert.rejects(db.sql(`BEGIN;SET LOCAL ROLE ${role};TRUNCATE TABLE ${target};COMMIT;`),/Membership and audit TRUNCATE outside approved contract/);
   assert.equal(await tableState(),preTruncate);
  }
 }
 pass('Anon/authenticated/service SQL TRUNCATE of organizations, memberships, invitations and audit rejects with complete state unchanged');

 await reset();await add([b,c,d]);const last=await issue(a);await ok(accept(a,last));assert.equal(await count(),'5');assert.equal(await db.sql(`SELECT public.owner_p0_occupied('${org}')`),'5');pass('Last-seat redemption consumes reservation before membership insertion');
 await reset();await add([b,c,d]);const memberRace=await race([()=>owner.sdk.from('organization_members').insert({organization_id:org,user_id:a.id,role:'member'}),()=>owner.sdk.from('organization_invitations').insert(row(e))]);assert.equal(memberRace.filter(r=>!r.error).length,1);assert.equal(await db.sql(`SELECT public.owner_p0_occupied('${org}')`),'5');pass('Direct member insert versus reservation final-seat race serialized');
 await reset();const revoke=await issue(a);const revoked=await race([()=>accept(a,revoke),()=>owner.sdk.rpc('revoke_business_invitation',{p_invitation_id:revoke.id})]);assert.equal(revoked.filter(r=>!r.error).length,1);await denied(accept(a,revoke));assert(['0','1'].includes(await audit()));pass('Redemption versus revocation has one winner; later redemption rejects');
 await reset();const expired=await issue(a);await db.sql(`UPDATE organization_invitations SET expires_at=clock_timestamp() WHERE id='${expired.id}'`);await denied(accept(a,expired));assert.equal(await audit(),'0');pass('Expiry equality rejects');
 await reset();const rollback=await issue(a);await db.sql("CREATE FUNCTION public.owner_p0_fail_audit() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'test audit rollback';END $$;CREATE TRIGGER owner_p0_fail_audit BEFORE INSERT ON organization_audit_log FOR EACH ROW EXECUTE FUNCTION public.owner_p0_fail_audit()");await denied(accept(a,rollback));assert.equal(await count(),'1');assert.equal(await db.sql(`SELECT accepted_at IS NULL FROM organization_invitations WHERE id='${rollback.id}'`),'t');await db.sql('DROP TRIGGER owner_p0_fail_audit ON organization_audit_log;DROP FUNCTION owner_p0_fail_audit()');pass('Audit failure rolls back consumption and insertion');
 await denied(service.from('organization_invitations').insert(row(a)));await denied(service.from('organization_members').insert({organization_id:org,user_id:a.id,role:'member'}));pass('Service-role direct invitation and membership writes rejected');
 await db.sql(`ALTER TABLE organization_members DISABLE TRIGGER owner_p0_capacity_check;INSERT INTO organization_members(organization_id,user_id,role) VALUES ${[a,b,c,d,e].map(u=>`('${org}','${u.id}','member')`).join(',')};ALTER TABLE organization_members ENABLE TRIGGER owner_p0_capacity_check`);assert.equal(await count(),'6');pass('Unapproved superuser trigger bypass characterized; global invariant remains BLOCKED');
 const rollbackSql=await readFile(new URL('review-only-rollback.sql',import.meta.url),'utf8');
 await assert.rejects(db.sql(rollbackSql),/UNAPPLIED_OWNER_P0_ROLLBACK/);
 await db.sql(rollbackSql.replace(/DO \$proposal_guard\$[\s\S]*?\$proposal_guard\$;/,'-- disposable rollback guard removed'));
 assert.equal(await db.sql("SELECT encode(sha256(convert_to(pg_get_functiondef('public.accept_business_invitation(text)'::regprocedure),'UTF8')),'hex')"),'821394b78bacc681a73e19db068cbca9e08c7563adef322116c1fe7129a810c2');
 assert.equal(await db.sql("SELECT count(*) FROM pg_trigger WHERE tgname LIKE 'owner_p0_%'"),'0');
 assert.equal(await count(),'6');
 await assert.rejects(db.sql(candidate.replace(/DO \$proposal_guard\$[\s\S]*?\$proposal_guard\$;/,'-- disposable fixture guard removed')),/EXISTING_CAPACITY_REQUIRES_SEPARATE_REMEDIATION/);
 pass('Hash-guarded rollback restores captured acceptance and retains data; reinstallation rejects existing overcapacity');
 await mkdir(artifacts,{recursive:true});await writeFile(artifacts+'/receipt.json',JSON.stringify({status:'LOCAL_VERIFIED_GLOBAL_BLOCKED',checks,provenance:db.provenance,candidateSha256:hash(candidate),productionWrites:false,activation:false,limits:['auth provider email mutations and aliases not globally fenced','superuser can disable triggers','expiry observed after final lock, not at commit','deadlock victim may reject competing row-first table update/delete']},null,2)+'\n');
} finally {if(db)await db.close();}
