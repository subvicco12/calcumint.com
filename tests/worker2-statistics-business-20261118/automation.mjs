// Adapted from the repository’s completion-automation fixture. All authority overrides are disposable.
import assert from 'node:assert/strict';import http from 'node:http';import path from 'node:path';import {readFile,mkdir,writeFile} from 'node:fs/promises';import {randomUUID,randomBytes,createHash} from 'node:crypto';import {pathToFileURL} from 'node:url';import {execFileSync} from 'node:child_process';import {build} from 'esbuild';import {createClient} from '@supabase/supabase-js';
import {startBusinessPredecessor,unhold} from '../../scripts/statistics-integration-20261117/business-sql-fixture.mjs';
import {newIdentities} from '../../scripts/statistics-integration-20261117/business-identities.mjs';
for(const key of ['DATABASE_URL','SUPABASE_DB_URL','PGHOST','PGDATABASE','PGPORT','PGUSER','PGPASSWORD'])assert(!process.env[key],'External database selector refused '+key);
const artifacts=process.env.FACTORY_AUTOMATION_ARTIFACTS;assert(artifacts&&path.isAbsolute(artifacts)&&!artifacts.startsWith(process.cwd()+'/'));await mkdir(artifacts,{recursive:true});
const sha=x=>createHash('sha256').update(x).digest('hex'),q=x=>"'"+String(x).replaceAll("'","''")+"'",checks=[],observations=[],sources={};
const pass=async text=>{checks.push(text);console.log('PASS '+text);await writeFile(artifacts+'/progress.json',JSON.stringify({checks},null,2));};
const ok=async promise=>{const value=await promise;assert.equal(value.error,null,JSON.stringify(value.error));return value.data;};
let db,server,receiver;
try {
 db=await startBusinessPredecessor();
 const file='docs/statistics-integration-20261117/business/held-successor.sql';
 const held=await readFile(file,'utf8');
 sources[file]=sha(held);
 await assert.rejects(db.sql(held),/UNAPPLIED_NEXT_ENGINEERING/);
 await db.sql(unhold(held));
 const bundle=path.join(artifacts,'actual-handlers.mjs');
 const entry=`export {POST as calculate} from './src/app/api/v1/calculator-factory/calculate/route';export {POST as embed} from './src/app/api/native-embed/[grant]/calculate/route';export {issueNativeGrant,readNativeGrant} from './src/lib/native-delivery/grant';export {persistNativeGrant} from './src/lib/native-delivery/metering';export {POST,GET} from './src/app/api/v1/calculator-factory/batch/route';export {processTechnologyFiveWebhooks} from './src/lib/native-delivery/technology-five-webhook-worker';export {claimTechnologyFiveWebhook,checkTechnologyFiveDispatch,finishTechnologyFiveWebhook} from './src/lib/native-delivery/technology-five-webhook-storage';export {requireNativeIssuer} from './src/lib/native-delivery/authorization';export {requireAutomationPublication} from './src/lib/native-delivery/factory-automation-publication';export {encryptWebhookSecret,decryptWebhookSecret,verifyWebhookSignature} from './src/lib/api/webhooks';export {validateTechnologyWebhookTarget} from './src/lib/native-delivery/technology-five-webhook-transport';export {factoryDeliveryCatalog} from './src/lib/native-delivery/factory-delivery-catalog';export {factoryContracts,runFactoryCalculation} from './src/lib/calculator-factory/registry';export {runFactoryAutomationBatch} from './src/lib/native-delivery/factory-automation-contract';`;
 // The lower registry fixture grants no real certification. Exact gate and all handlers remain source-identical.
 const selected=newIdentities.map(row=>row.slug);
 let lowerRegistry;
 await build({stdin:{contents:entry,resolveDir:process.cwd(),sourcefile:'automation-handler-entry.ts'},outfile:bundle,alias:{'@':path.join(process.cwd(),'src')},bundle:true,platform:'node',format:'esm',banner:{js:"import {createRequire} from 'node:module';const require=createRequire(import.meta.url);"},plugins:[{name:'explicit-lower-fixtures',setup(b){b.onResolve({filter:/^next\/server$/},()=>({path:path.join(process.cwd(),'node_modules/next/server.js'),external:true}));b.onResolve({filter:/^server-only$/},()=>({path:'sentinel',namespace:'fixture'}));b.onLoad({filter:/.*/,namespace:'fixture'},()=>({contents:'export {};',loader:'js'}));b.onLoad({filter:/\/src\/calculators\/registry\.ts$/},async args=>{
 const original=await readFile(args.path,'utf8');const lower=original.replace('export const calculatorRegistry=', 'const originalCalculatorRegistry=')+`\nconst selectedFixtureSlugs=new Set(${JSON.stringify(selected)});const fixtureDefinition=d=>d&&selectedFixtureSlugs.has(d.slug)?{...d,reviewStatus:'certified'}:d;export const calculatorRegistry={list:()=>originalCalculatorRegistry.list().map(fixtureDefinition),getBySlug:s=>fixtureDefinition(originalCalculatorRegistry.getBySlug(s)),getById:s=>fixtureDefinition(originalCalculatorRegistry.getById(s))};`;
 lowerRegistry={originalSHA256:sha(original),fixtureSHA256:sha(lower),scope:'Explicit synthetic lower registry reviewStatus only; no published/canonical approval'};return {contents:lower,loader:'ts',resolveDir:path.dirname(args.path)};
 });}}],metafile:true,logLevel:'silent'}).then(async result=>{for(const file of Object.keys(result.metafile.inputs)){if(!file.startsWith('<')&&!file.startsWith('fixture:'))try{sources[file]=sha(await readFile(file));}catch{}}});
 Object.assign(process.env,{NEXT_PUBLIC_SUPABASE_URL:db.url,NEXT_PUBLIC_SUPABASE_ANON_KEY:db.anonKey,SUPABASE_SERVICE_ROLE_KEY:db.serviceKey,NEXT_PUBLIC_SITE_URL:'http://127.0.0.1:3000'});
 const live=await import(pathToFileURL(bundle));
 const tuples=newIdentities.map(r=>`(${q(r.engineId)},${q(r.slug)},1)`).join(',');
 // Authentic publication composition consumes an explicitly synthetic lower manifest/function in this local database.
 await db.sql(`CREATE OR REPLACE FUNCTION public.list_published_calculator_manifest() RETURNS TABLE(calculator_key text,slug text,version integer) LANGUAGE sql SECURITY DEFINER SET search_path=pg_catalog AS $$ SELECT * FROM (VALUES${tuples}) t(engine,slug,version) $$;CREATE OR REPLACE FUNCTION public.technology_five_publication_snapshot_v1(p_engine text,p_slug text,p_version integer) RETURNS boolean LANGUAGE sql SECURITY DEFINER SET search_path=pg_catalog AS $$ SELECT EXISTS(SELECT 1 FROM (VALUES${tuples})t(engine,slug,version) WHERE t.engine=p_engine AND t.slug=p_slug AND t.version=p_version) $$;NOTIFY pgrst,'reload schema';`);
 await new Promise(r=>setTimeout(r,700));
 const signup=async()=>{const sdk=createClient(db.url,db.anonKey,{auth:{persistSession:false,autoRefreshToken:false}}),auth=await ok(sdk.auth.signUp({email:randomUUID()+'@example.invalid',password:'Fixture-'+randomUUID()}));await db.sql(`UPDATE public.profiles SET plan='business' WHERE id='${auth.user.id}'`);return {sdk,id:auth.user.id};};
 // Permit only the fixture tuples at the lower embed publication boundary.
 await db.sql(`CREATE OR REPLACE FUNCTION public.factory_native_embed_publication_snapshot_v1(p_engine text,p_slug text,p_version integer) RETURNS boolean LANGUAGE sql SECURITY DEFINER SET search_path=pg_catalog AS $$ SELECT EXISTS(SELECT 1 FROM (VALUES${tuples})t(engine,slug,version) WHERE t.engine=$1 AND t.slug=$2 AND t.version=$3) $$;`);
 const owner=await signup(),foreign=await signup();const org=await ok(owner.sdk.rpc('create_business_organization',{org_name:'Statistics automation fixture',org_slug:'automation-'+randomUUID()}));const foreignOrg=await ok(foreign.sdk.rpc('create_business_organization',{org_name:'Foreign fixture',org_slug:'foreign-'+randomUUID()}));
 const key=async(user=owner,organizationId=org,scopes=['calculations:batch'],rate=2)=>{const secret='cm_test_'+randomBytes(32).toString('hex'),row=await ok(user.sdk.from('business_api_keys').insert({organization_id:organizationId,name:'Isolated automation',key_prefix:secret.slice(0,18),key_hash:sha(secret),scopes,created_by:user.id,rate_limit_per_minute:rate,monthly_quota:1000}).select('id').single());return {secret,id:row.id};};
 const wrong=await key(owner,org,['calculations:run']),foreignKey=await key(foreign,foreignOrg,['calculations:batch']);
 const master='automation-local-master-secret-0000000000000',secret='automation-local-signing-secret-0000000000000';
 const endpoint=await ok(owner.sdk.from('business_webhook_endpoints').insert({organization_id:org,name:'Statistics receiver',endpoint_url:'https://receiver.example/automation',secret_ciphertext:live.encryptWebhookSecret(secret,master),event_types:['calculation.completed'],created_by:owner.id}).select('id').single());
 server=http.createServer(async(req,res)=>{try{const chunks=[];for await(const chunk of req)chunks.push(chunk);const request=new Request('http://127.0.0.1'+req.url,{method:req.method,headers:req.headers,...(req.method==='GET'?{}:{body:Buffer.concat(chunks)})});const response=await(req.method==='GET'?live.GET(request):live.POST(request));res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));}catch(error){res.writeHead(500);res.end(JSON.stringify({error:String(error)}));}});await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const request=async(body,k,id,method='POST')=>{const r=await fetch(`http://127.0.0.1:${server.address().port}/api/v1/calculator-factory/batch`,{method,headers:{Authorization:'Bearer '+k.secret,'Idempotency-Key':id,'Content-Type':'application/json'},...(method==='GET'?{}:{body:JSON.stringify(body)})});return {status:r.status,body:await r.json()};};
 const usage=async k=>Number(await db.sql(`SELECT coalesce(sum(units),0) FROM public.api_usage_events WHERE api_key_id='${k.id}'`));
 for(const identity of newIdentities){const descriptor=live.factoryContracts.find(r=>r.catalogId===identity.catalogId),input=Object.fromEntries(descriptor.fields.map(f=>[f.key,String(f.defaultValue)])),k=await key(),requestId=randomUUID(),body={catalogId:identity.catalogId,version:1,rows:[input,{...input,[descriptor.fields[0].key]:''}],webhookEndpointId:endpoint.id};
  assert.equal((await request(body,wrong,randomUUID())).status,403);const first=await request(body,k,requestId);assert.equal(first.status,200,JSON.stringify(first));const expected=live.runFactoryCalculation(identity.catalogId,1,input);assert.deepEqual(first.body.rows[0].result.packet,expected);assert.deepEqual(first.body.rows[0].result.packet.raw,input);assert.deepEqual(first.body.rows[0].result.output,expected.snapshot.output);assert.equal(first.body.rows[1].ok,false);assert.equal(await usage(k),1);
  const duplicate=await request(body,k,requestId);assert.equal(duplicate.status,200);assert.equal(duplicate.body.duplicate,true);assert.equal(duplicate.body.jobId,first.body.jobId);assert.deepEqual(duplicate.body.rows,first.body.rows);assert.equal(await usage(k),2);
  assert.equal((await request(null,k,requestId,'GET')).status,200);assert.equal(await usage(k),2);assert.equal((await request({...body,rows:[{...input,[descriptor.fields[0].key]:'3'}]},k,requestId)).status,409);assert.equal((await request(body,k,randomUUID())).status,429);assert.equal(await usage(k),2);assert.equal((await request(null,foreignKey,requestId,'GET')).status,404);
  observations.push({...identity,requestId,jobId:first.body.jobId,input,rows:first.body.rows,keyId:k.id,key:k});await pass(identity.catalogId+' real GoTrue/PostgREST/HTTP submit duplicate GET conflict quota preserve original raw packet/result');
 }
 const embedSecret=randomBytes(32).toString('hex');
 process.env.EMBED_SESSION_SECRET=embedSecret;
 for(const row of observations){
  const runKey=await key(owner,org,['calculations:run'],10);
  const execute=()=>live.calculate(new Request('http://127.0.0.1:3000/api/v1/calculator-factory/calculate',{
   method:'POST',headers:{Authorization:'Bearer '+runKey.secret},
   body:JSON.stringify({catalogId:row.catalogId,version:row.version,input:row.input}),
  }));
  const api=await execute();
  assert.equal(api.status,200);
  assert.deepEqual(await api.json(),row.rows[0].result.packet);
  assert.equal(await usage(runKey),1);
  const token=live.issueNativeGrant({grantId:randomUUID(),apiKeyId:runKey.id,organizationId:org,
   issuerId:owner.id,catalogId:row.catalogId,version:row.version,allowedOrigin:'https://local.example'},embedSecret);
  const claims=live.readNativeGrant(token,embedSecret);
  await live.persistNativeGrant(claims,token);
  const embedId=randomUUID();
  const embed=()=>live.embed(new Request('http://127.0.0.1:3000/api/native-embed/calculate',{
   method:'POST',headers:{origin:'http://127.0.0.1:3000','Idempotency-Key':embedId},body:JSON.stringify(row.input),
  }),{params:Promise.resolve({grant:token})});
  const native=await embed();
  assert.equal(native.status,200,await native.clone().text());
  assert.deepEqual((await native.json()).packet,row.rows[0].result.packet);
  assert.equal((await embed()).headers.get('Idempotent-Replayed'),'true');
  assert.equal(await usage(runKey),2);
  await ok(owner.sdk.from('business_api_keys').update({status:'revoked'}).eq('id',runKey.id));
  assert.equal((await execute()).status,401);
  assert.equal((await embed()).status,403);
  assert.equal(await usage(runKey),2);
  await pass(row.catalogId+' API and native embed exact packet, shared quota, idempotent debit and revoked-key denial');
 }
 const received=[];receiver=http.createServer(async(req,res)=>{let body='';for await(const c of req)body+=c;assert(live.verifyWebhookSignature(secret,Number(req.headers['x-calcumint-timestamp']),body,String(req.headers['x-calcumint-signature']).slice(3)));const event=JSON.parse(body),prior=received.filter(x=>x.eventId===event.id).length;received.push({eventId:event.id,body,headers:{eventId:req.headers['x-calcumint-event-id']},hmac:true});res.writeHead(prior===0?500:204);res.end();});await new Promise(r=>receiver.listen(0,'127.0.0.1',r));
 const send=async(url,body,headers,before)=>{await live.validateTechnologyWebhookTarget(url,async()=>[{address:'93.184.216.34',family:4}]);await before();const response=await fetch(`http://127.0.0.1:${receiver.address().port}/automation`,{method:'POST',headers,body});return response.status;};
 const deps={claim:live.claimTechnologyFiveWebhook,check:live.checkTechnologyFiveDispatch,finish:live.finishTechnologyFiveWebhook,assertAuthority:async item=>{await live.requireNativeIssuer(item.organizationId,item.issuerId);await live.requireAutomationPublication(item.catalogId,item.version);},decrypt:value=>live.decryptWebhookSecret(value,master)};
 assert.deepEqual(await live.processTechnologyFiveWebhooks(deps,send),{processed:7,delivered:0,failed:7,unavailable:0});await db.sql("UPDATE public.technology_five_webhook_outbox SET next_attempt_at=clock_timestamp() WHERE status='failed';");assert.deepEqual(await live.processTechnologyFiveWebhooks(deps,send),{processed:7,delivered:7,failed:0,unavailable:0});
 for(const o of observations){const deliveries=received.filter(x=>x.eventId===o.jobId);assert.equal(deliveries.length,2);assert.equal(deliveries[0].body,deliveries[1].body);const data=JSON.parse(deliveries[0].body).data;assert.deepEqual(data.input_rows,[o.input,{...o.input,[Object.keys(o.input)[0]]:''}]);assert.deepEqual(data.output_rows,o.rows);assert.equal(await usage(o.key),2);o.webhook={attempts:2,hmac:true,payloadSHA256:sha(deliveries[0].body),exactOriginalRaw:true};}
 await pass('Seven actual worker/PostgREST leases deliver identical HMAC payloads through500-to204 retry with no extra API debit');
 const revokedKey=await key(),sample=observations[0],queuedId=randomUUID();
 const queued=await request({catalogId:sample.catalogId,version:1,rows:[sample.input],webhookEndpointId:endpoint.id},revokedKey,queuedId);
 assert.equal(queued.status,200);
 await ok(owner.sdk.from('business_api_keys').update({status:'revoked'}).eq('id',revokedKey.id));
 assert.equal((await request(null,revokedKey,queuedId,'GET')).status,401);
 const receivedBefore=received.length;
 assert.deepEqual(await live.processTechnologyFiveWebhooks(deps,send),{processed:1,delivered:0,failed:0,unavailable:1});
 assert.equal(received.length,receivedBefore);
 assert.equal(await db.sql("SELECT count(*) FROM public.technology_five_webhook_outbox WHERE status='delivered' AND attempt_count=2"),'7');
 assert.equal(await db.sql("SELECT count(*) FROM public.technology_five_webhook_outbox WHERE status='cancelled'"),'1');
 await pass('Durable terminal states reconcile after retry and revoked-key cancellation');
 const audit=JSON.parse(await db.sql("SELECT jsonb_build_object('jobs',(SELECT count(*) FROM public.technology_five_jobs),'outbox',(SELECT jsonb_agg(jsonb_build_object('id',id,'event_id',event_id,'status',status,'attempt_count',attempt_count) ORDER BY event_id) FROM public.technology_five_webhook_outbox),'attempts',(SELECT jsonb_agg(to_jsonb(a)) FROM public.technology_five_webhook_attempts a),'usage',(SELECT coalesce(sum(units),0) FROM public.api_usage_events));"));
 for(const o of observations)delete o.key;
 await writeFile(artifacts+'/receipt.json',JSON.stringify({passed:true,sourceCommit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),producerSHA256:sha(await readFile(new URL(import.meta.url))),sources,lowerRegistry,checks,observations,audit,fixture:db.provenance,bundleSHA256:sha(await readFile(bundle)),scope:'Actual HTTP handler adapter (not Next production build), real isolated GoTrue/PostgREST/PG and actual worker; explicit synthetic lower publication and loopback receiver transport. No production equivalence, human approval or full completion.',productionWrites:false,sqlActivated:false,releaseHold:true},null,2));
}finally{if(receiver)await new Promise(r=>receiver.close(r));if(server)await new Promise(r=>server.close(r));if(db)await db.close();}
