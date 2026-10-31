import assert from 'node:assert/strict';
import {randomUUID,createHash} from 'node:crypto';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {createClient,AuthApiError} from '@supabase/supabase-js';
import {startGoTrueFixture} from '../gotrue-runtime/fixture.mjs';
import {createBoundedFetch} from './bounded-fetch.mjs';

// Issued user tokens are only decoded and replayed unchanged. The fixture's
// bootstrap anon/service keys are separate from the user JWTs under test.
const started=Date.now(),deadline=started+120000,ttl=15;
const artifacts=process.env.EXPIRY_ARTIFACTS;
assert(artifacts,'Set EXPIRY_ARTIFACTS to an evidence directory');
await mkdir(artifacts,{recursive:true});
const checks=[],observations=[];let db,waitMs=0;
const pass=name=>{checks.push(name);console.log('PASS '+name)};
const claims=token=>JSON.parse(Buffer.from(token.split('.')[1],'base64url'));
const hash=token=>createHash('sha256').update(token).digest('hex');
const remaining=()=>{assert(Date.now()<deadline,'120-second campaign deadline exceeded');return deadline-Date.now()};
const boundedFetch=createBoundedFetch({deadline});
const client=()=>createClient(db.url,db.anonKey,{global:{fetch:boundedFetch},auth:{autoRefreshToken:false,persistSession:false,detectSessionInUrl:false}});
const ok=r=>{assert.equal(r.error,null);return r.data};
async function probe(token,id,label){
 const response=await boundedFetch(`${db.url}/rest/v1/profiles?select=id&id=eq.${id}`,{headers:{apikey:db.anonKey,authorization:'Bearer '+token},signal:AbortSignal.timeout(Math.min(5000,remaining()))});
 const body=await response.json();observations.push({label,at:new Date().toISOString(),tokenSha256:hash(token),status:response.status,body});return {status:response.status,body};
}
async function waitPast(exp){
 const target=(exp+2)*1000;
 while(Date.now()<target){const ms=Math.min(1000,target-Date.now(),remaining());const before=Date.now();await new Promise(r=>setTimeout(r,ms));waitMs+=Date.now()-before;}
}
try {
 db=await startGoTrueFixture({jwtExpirySeconds:ttl});
 const sdk=client(),email=`expiry-${randomUUID()}@example.invalid`,password='Local-only-'+randomUUID();
 const signup=ok(await sdk.auth.signUp({email,password}));
 const original=signup.session,originalClaims=claims(original.access_token),id=signup.user.id;
 assert.equal(originalClaims.exp-originalClaims.iat,ttl);assert.equal(original.expires_at,originalClaims.exp);
 assert.equal(originalClaims.sub,id);assert.equal(originalClaims.role,'authenticated');
 // Persist the real token privately, then replay exactly those bytes after expiry.
 // This file is deliberately excluded from the shareable receipt.
 await writeFile(path.join(artifacts,'private-issued-session.json'),JSON.stringify(original),{mode:0o600});
 const persisted=JSON.parse(await readFile(path.join(artifacts,'private-issued-session.json'),'utf8'));
 assert.equal(persisted.access_token,original.access_token);
 const before=await probe(persisted.access_token,id,'before-expiry');assert.equal(before.status,200);assert.deepEqual(before.body,[{id}]);
 const logoutSdk=client(),logoutSignup=ok(await logoutSdk.auth.signUp({email:`logout-${randomUUID()}@example.invalid`,password}));
 const logoutSession=logoutSignup.session,logoutClaims=claims(logoutSession.access_token);
 assert.equal(logoutClaims.exp-logoutClaims.iat,ttl);
 assert.equal(await db.sql(`SELECT count(*) FROM auth.sessions WHERE id='${logoutClaims.session_id}';`),'1');
 ok(await logoutSdk.auth.signOut({scope:'global'}));
 assert.equal(await db.sql(`SELECT count(*) FROM auth.sessions WHERE id='${logoutClaims.session_id}';`),'0');
 assert(Date.now()<logoutClaims.exp*1000,'Logout boundary must be observed before expiry');
 assert.equal((await probe(logoutSession.access_token,logoutSignup.user.id,'immediate-post-logout')).status,200);
 const revoked=await client().auth.refreshSession({refresh_token:logoutSession.refresh_token});
 assert(revoked.error instanceof AuthApiError);assert.equal(revoked.error.status,400);
 observations.push({label:'logout-refresh-denied',name:revoked.error.name,status:revoked.error.status,code:revoked.error.code,message:revoked.error.message});
 pass('Global logout denies refresh while unchanged genuine access JWT still works before exp');
 console.log(`Waiting naturally until issued exp ${Math.max(originalClaims.exp,logoutClaims.exp)}; deadline ${new Date(deadline).toISOString()}`);
 await waitPast(Math.max(originalClaims.exp,logoutClaims.exp));
 for(const [token,userId,label] of [[persisted.access_token,id,'expired-persisted-access'],[logoutSession.access_token,logoutSignup.user.id,'expired-logged-out-access']]){
  let result;const rejectionDeadline=(claims(token).exp+35)*1000;
  do {
   assert(Date.now()<=rejectionDeadline,'PostgREST must reject within source-defined 30s skew plus 5s observation allowance');
   result=await probe(token,userId,label);
   if(result.status===200){const before=Date.now();await new Promise(r=>setTimeout(r,Math.min(1000,remaining())));waitMs+=Date.now()-before;}
  } while(result.status===200);
  assert(Date.now()<=rejectionDeadline,'Expiry rejection exceeded bounded observation allowance');
  assert.equal(result.status,401);assert.equal(result.body.code,'PGRST301');assert.match(result.body.message,/expired/i);
 }
 assert.equal(hash(persisted.access_token),hash(original.access_token));
 pass('Natural wall-clock expiry rejects the exact persisted access JWT and logged-out JWT in PostgREST');
 const recovered=ok(await sdk.auth.refreshSession({refresh_token:persisted.refresh_token})).session;
 assert.notEqual(recovered.refresh_token,persisted.refresh_token);assert.notEqual(recovered.access_token,persisted.access_token);
 const recoveredClaims=claims(recovered.access_token);assert.equal(recoveredClaims.sub,id);assert(recoveredClaims.exp>originalClaims.exp);assert.equal(recoveredClaims.exp-recoveredClaims.iat,ttl);
 const recoveredProbe=await probe(recovered.access_token,id,'refresh-recovered-access');assert.equal(recoveredProbe.status,200);assert.deepEqual(recoveredProbe.body,[{id}]);
 pass('Real GoTrue refresh after access expiry rotates refresh token and restores own-profile access');
 remaining();
 const sources=[];for(const source of ['tests/batch17-expiry/acceptance.mjs','tests/batch17-expiry/bounded-fetch.mjs','tests/gotrue-runtime/fixture.mjs','tests/gotrue-runtime/schema.mjs'])sources.push({path:source,sha256:createHash('sha256').update(await readFile(new URL('../../'+source,import.meta.url))).digest('hex')});
 await writeFile(path.join(artifacts,'receipt.json'),JSON.stringify({status:'PASS',task:'AUTH-EXPIRY-BOUNDARY',startedAt:new Date(started).toISOString(),finishedAt:new Date().toISOString(),elapsedMs:Date.now()-started,naturalExpiryWaitMs:waitMs,deadlineSeconds:120,postgrestAllowedSkewSeconds:30,rejectionObservationAllowanceSeconds:5,jwtExpirySeconds:ttl,runtime:process.version,checks,originalClaims,logoutClaims,recoveredClaims,observations,sources,provenance:db.provenance,requests:db.requests,scope:'Local genuine GoTrue/PostgREST SDK campaign using selective unchanged application migrations. No hosted equivalence, production policy change, immediate JWT revocation, forged user tokens or clock manipulation.'},null,2));
} catch(error){await writeFile(path.join(artifacts,'failure.json'),JSON.stringify({message:error.message,stack:error.stack,checks,observations},null,2));throw error;} finally {if(db)await db.close();}
