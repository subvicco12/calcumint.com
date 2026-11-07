import assert from 'node:assert/strict';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {startGoTrueFixture} from '../gotrue-runtime/fixture.mjs';
import {waitForNativeSchema} from './schema-readiness.mjs';
import {initializeFullSchema} from '../gotrue-full-schema/schema.mjs';
const artifacts=process.env.NATIVE440_READINESS_ARTIFACTS||'/tmp/native440-schema-readiness';await mkdir(artifacts,{recursive:true});let db;
try{
 db=await startGoTrueFixture({initializeSchema:initializeFullSchema});
 const headers={apikey:db.serviceKey,Authorization:'Bearer '+db.serviceKey};
 const get=async route=>{const r=await fetch(db.url+'/rest/v1/'+route,{headers});return{status:r.status,body:await r.json()}};
 const cold=await get('native_embed_grants?select=id&limit=0');assert.equal(cold.status,404);await new Promise(r=>setTimeout(r,500));
 const adopt=async(file,hold)=>db.sql((await readFile(file,'utf8')).replace(`DO $hold$ BEGIN RAISE EXCEPTION '${hold}'; END $hold$;`,'-- isolated fixture only'));
 await adopt('docs/native440/quota-readiness-wrapper.sql','UNAPPLIED_NATIVE_QUOTA_READINESS');
 await adopt('docs/native440-remediation/embed-metering.sql','UNAPPLIED_NATIVE_EMBED_METERING');
 const sqlExists=await db.sql("SELECT to_regclass('public.native_embed_grants') IS NOT NULL;");assert.equal(sqlExists,'t');
 const before=await get('native_embed_grants?select=id&limit=0');const beforeOpenapi=await get('');
 const nil='00000000-0000-0000-0000-000000000000',issuedAt=Date.now();const insertResponse=await fetch(db.url+'/rest/v1/native_embed_grants',{method:'POST',headers:{...headers,'Content-Type':'application/json'},body:JSON.stringify({id:nil,organization_id:nil,issuer_id:nil,api_key_id:nil,token_hash:'0'.repeat(64),allowed_origin:'http://127.0.0.1:1',catalog_id:440,engine_id:'conversion.frequency',technical_version:1,issued_at:new Date(issuedAt).toISOString(),expires_at:new Date(issuedAt+3600000).toISOString()})});const rejectedInsert={status:insertResponse.status,body:await insertResponse.json()};assert.equal(rejectedInsert.status,404);assert.equal(beforeOpenapi.body.definitions?.native_embed_grants,undefined);
 await db.sql("NOTIFY pgrst,'reload schema';");
 let after;for(let i=0;i<100;i++){after=await get('native_embed_grants?select=id&limit=0');if(after.status===200)break;await new Promise(r=>setTimeout(r,50))}assert.equal(after.status,200);
 const rpc=await get('rpc/consume_native_embed_v1?p_grant_id=00000000-0000-0000-0000-000000000000&p_request_id=00000000-0000-0000-0000-000000000000&p_request_hash='+('0'.repeat(64))+'&p_result_hash='+('0'.repeat(64)));
 const readiness=await waitForNativeSchema({url:db.url,serviceKey:db.serviceKey});const openapi=await get('');assert(openapi.body.definitions.native_embed_grants);assert.equal(await db.sql('SELECT count(*) FROM public.native_embed_grants;'),'0');assert.equal(await db.sql('SELECT count(*) FROM public.native_embed_usage;'),'0');
 await writeFile(artifacts+'/proof.json',JSON.stringify({sqlExists,cold,before,rejectedInsert,beforeOpenapiTable:beforeOpenapi.body.definitions?.native_embed_grants??null,readiness,after,rpc,openapiRPC:openapi.body.paths?.['/rpc/consume_native_embed_v1'],scope:'Unchanged pinned Docker PostgREST with local-only schema adoption; GET readiness requests plus one negative INSERT returns404{} while table exists and cached definition absent, with zero persisted rows; no application build'},null,2)+'\n');console.log(JSON.stringify({sqlExists,cold,before,rejectedInsert,beforeOpenapiTable:beforeOpenapi.body.definitions?.native_embed_grants??null,readiness,after,rpc,openapiRPC:openapi.body.paths?.['/rpc/consume_native_embed_v1']}));
}finally{await db?.close()}
