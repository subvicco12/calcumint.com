/** Disposable fixture only. No external connection, publication substitution or active migration. */
import assert from 'node:assert/strict';
import {randomUUID,createHash} from 'node:crypto';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {build} from 'esbuild';
import {createClient} from '@supabase/supabase-js';
import {startBusinessPredecessor,unhold} from '../../scripts/milestone100-20261114/business-sql-fixture.mjs';
import {forwardSQL,reverseSQL,metadataQuery,signatures} from './business-sql-generate.mjs';

const out=process.env.CONSTRUCTION_ARTIFACTS??'/tmp/construction-qualification-20261116/business';
await mkdir(out,{recursive:true});
const directory='docs/construction-qualification-20261116';
const cases=JSON.parse(await readFile(directory+'/construction-cases.json','utf8'));
await build({entryPoints:['src/lib/native-delivery/factory-delivery-catalog.ts'],outfile:out+'/catalog.mjs',bundle:true,platform:'node',format:'esm'});
const {factoryDeliveryCatalog:tuples}=await import(pathToFileURL(out+'/catalog.mjs'));
assert.equal(tuples.length,79);
const sha=b=>createHash('sha256').update(b).digest('hex');
const normalize=x=>JSON.stringify({rows:[...x.rows].sort((a,b)=>a.signature.localeCompare(b.signature)),constraints:[...x.constraints].sort((a,b)=>a.name.localeCompare(b.name)),tables:[...x.tables].sort((a,b)=>a.table.localeCompare(b.table))});
const ok=async promise=>{const r=await promise;assert.equal(r.error,null,JSON.stringify(r.error));return r.data;};
const checks=[],observations=[];let db;
try{
 db=await startBusinessPredecessor();
 const old=await readFile('docs/milestone100-20261114/business-held-successor.sql','utf8');
 await assert.rejects(db.sql(old),/UNAPPLIED/);await db.sql(unhold(old));
 const pre=JSON.parse(await db.sql(metadataQuery));
 assert.equal(pre.rows.length,4);assert.equal(pre.constraints.length,4);assert.equal(pre.tables.length,4);
 const embed=pre.rows.find(r=>r.signature===signatures[0]).definition;
 assert.equal([...embed.matchAll(/\((\d+),'([^']+)','([^']+)'\)/g)].length,69);
 await writeFile(out+'/preimage.json',JSON.stringify(pre,null,2)+'\n');
 const forward=forwardSQL(pre,tuples);await writeFile(directory+'/held-business-successor.sql',forward);
 await assert.rejects(db.sql(forward),/UNAPPLIED_CONSTRUCTION/);
 await db.sql('GRANT EXECUTE ON FUNCTION public.factory_native_embed_publication_v1(integer,integer) TO authenticated;');
 await assert.rejects(db.sql(unhold(forward)),/Exact function preimage differs/);
 await db.sql('REVOKE EXECUTE ON FUNCTION public.factory_native_embed_publication_v1(integer,integer) FROM authenticated;');
 await db.sql('ALTER TABLE public.native_embed_grants DISABLE ROW LEVEL SECURITY;');
 await assert.rejects(db.sql(unhold(forward)),/Exact table owner ACL RLS preimage differs/);
 await db.sql('ALTER TABLE public.native_embed_grants ENABLE ROW LEVEL SECURITY;');
 assert.equal(normalize(JSON.parse(await db.sql(metadataQuery))),normalize(pre));
 await db.sql(unhold(forward));await assert.rejects(db.sql(unhold(forward)),/Exact function preimage differs/);
 const post=JSON.parse(await db.sql(metadataQuery));await writeFile(out+'/postimage.json',JSON.stringify(post,null,2)+'\n');
 const restore=Object.fromEntries(pre.constraints.map(c=>[c.name,`ALTER TABLE public.${c.table.replace(/^public\./,'')} ADD CONSTRAINT ${c.name} ${c.definition}`]));
 const reverse=reverseSQL(pre,post,tuples,restore);await writeFile(directory+'/held-business-reverse.sql',reverse);
 await assert.rejects(db.sql(reverse),/UNAPPLIED_CONSTRUCTION/);
 await db.sql(unhold(reverse).replace(/COMMIT;\n$/,'ROLLBACK;\n'));assert.equal(normalize(JSON.parse(await db.sql(metadataQuery))),normalize(post));
 await db.sql(unhold(reverse));assert.equal(normalize(JSON.parse(await db.sql(metadataQuery))),normalize(pre));
 await db.sql(unhold(forward));assert.equal(normalize(JSON.parse(await db.sql(metadataQuery))),normalize(post));
 checks.push('Exact69→79→69→79 definitions/owners/ACL/constraints/table RLS; unchanged hold, preimage drift and replay refusals');
 for(const row of post.rows){const prior=pre.rows.find(r=>r.signature===row.signature);assert.equal(row.owner,prior.owner);assert.equal(row.acl,prior.acl);}
 assert.deepEqual(post.tables,pre.tables);
 for(const c of cases){await assert.rejects(db.sql(`SELECT public.factory_native_embed_publication_v1(${c.id},1)`),/Exact publication unavailable/);await assert.rejects(db.sql(`SELECT public.technology_five_require_publication_v1(${c.id},1)`),/Exact publication unavailable/);}
 checks.push('Every construction tuple retains genuine default publication denial; no approval function replaced');
 const client=()=>createClient(db.url,db.anonKey,{auth:{persistSession:false,autoRefreshToken:false}});
 const owner=client(),foreign=client();
 const sign=async c=>ok(c.auth.signUp({email:randomUUID()+'@example.invalid',password:'Local-'+randomUUID()}));
 const user=(await sign(owner)).user,outsider=(await sign(foreign)).user;
 await db.sql(`UPDATE public.profiles SET plan='business' WHERE id IN('${user.id}','${outsider.id}')`);
 const org=await ok(owner.rpc('create_business_organization',{org_name:'Construction isolated acceptance',org_slug:'construction-'+randomUUID()}));
 const project=await ok(owner.from('business_projects').insert({organization_id:org,name:'Exact construction',created_by:user.id}).select('id').single());
 const service=createClient(db.url,db.serviceKey,{auth:{persistSession:false,autoRefreshToken:false}});
 // Replace only the Next cookie/client factories with genuine disposable clients.
 // Session validation, current profile/membership/capability and actor selection
 // execute the unchanged application functions against real GoTrue/PostgREST.
 globalThis.__calcumintConstructionFixture={client:owner,service};
 await build({stdin:{contents:"export {storeFactoryNineShare,loadFactoryNineTemplate} from './src/lib/business/factory-nine-sharing-server';",resolveDir:process.cwd(),sourcefile:'construction-server-seam.ts'},outfile:out+'/server-seam.mjs',bundle:true,platform:'node',format:'esm',plugins:[{name:'disposable-client-factories',setup(builder){
  builder.onResolve({filter:/^@\/lib\/supabase\/(server|admin)$/},args=>({path:args.path,namespace:'construction-fixture'}));
  builder.onLoad({filter:/.*/,namespace:'construction-fixture'},args=>({contents:args.path.endsWith('/server')?'export const createSupabaseServerClient=async()=>globalThis.__calcumintConstructionFixture.client;':'export const createSupabaseAdminClient=()=>globalThis.__calcumintConstructionFixture.service;',loader:'js'}));
 }}]});
 const app=await import(pathToFileURL(out+'/server-seam.mjs'));
 const submit=(actor,payload)=>service.rpc('share_factory_nine_snapshot',{actor_id:actor,request_payload:payload});
 await db.sql("NOTIFY pgrst,'reload schema'");
 const schemaDeadline=Date.now()+10000;
 for(;;){
  const probe=await submit(user.id,{}); // Invalid payload must never write a row.
  if(probe.error?.code!=='PGRST202'){assert(probe.error,'Readiness probe must refuse invalid payload');break;}
  assert(Date.now()<schemaDeadline,'Held sharing RPC absent from refreshed disposable schema');
  await new Promise(resolve=>setTimeout(resolve,100));
 }
 const refused=async(actor,payload)=>{assert((await submit(actor,payload)).error);assert.equal(await db.sql(`SELECT count(*) FROM public.technology_next_shared_snapshots WHERE request_id='${payload.requestId}'`),'0');};
 for(const c of cases){
  const payload={organizationId:org,projectId:project.id,clientWorkspaceId:null,requestId:randomUUID(),title:'Construction '+c.id,snapshot:c.snapshot};
  const replies=await Promise.all([submit(user.id,payload),submit(user.id,payload)]);
  assert(replies.every(r=>r.error===null),JSON.stringify(replies.map(r=>r.error)));assert.equal(replies[0].data,replies[1].data);
  const saved=replies[0].data;assert.equal(await ok(submit(user.id,payload)),saved);
  const stored=await ok(owner.from('technology_next_shared_snapshots').select('input_data,output_data').eq('id',saved).single());
  assert.deepEqual(stored,{input_data:c.snapshot.input,output_data:c.snapshot.output});
  assert.deepEqual(await ok(foreign.from('technology_next_shared_snapshots').select('id').eq('id',saved)),[]);
  assert((await owner.rpc('share_factory_nine_snapshot',{actor_id:user.id,request_payload:{...payload,requestId:randomUUID()}})).error);
  await refused(outsider.id,{...payload,requestId:randomUUID()});
  for(const plan of ['free','pro']){await db.sql(`UPDATE public.profiles SET plan='${plan}' WHERE id='${user.id}'`);await refused(user.id,{...payload,requestId:randomUUID()});}
  await db.sql(`UPDATE public.profiles SET plan='business' WHERE id='${user.id}'`);
  const mutations=[x=>{x.snapshot.output.extra=1;},x=>{delete x.snapshot.output.value;},x=>{x.snapshot.output.value='invalid';},x=>{x.snapshot.output.steps=[1];},x=>{x.snapshot.output={result:1};},x=>{x.snapshot.calculatorVersion=2;}];
  for(const mutate of mutations){const bad=structuredClone(payload);bad.requestId=randomUUID();mutate(bad);await refused(user.id,bad);}
  const conflict=structuredClone(payload);conflict.title+=' changed';assert((await submit(user.id,conflict)).error);
  assert.equal(await db.sql(`SELECT count(*) FROM public.technology_next_shared_snapshots WHERE request_id='${payload.requestId}'`),'1');
  const appPayload={...payload,requestId:randomUUID(),title:'Construction server seam '+c.id};
  await assert.rejects(app.storeFactoryNineShare(outsider.id,appPayload),/Account context changed/);
  assert.equal(await db.sql(`SELECT count(*) FROM public.technology_next_shared_snapshots WHERE request_id='${appPayload.requestId}'`),'0');
  const appSaved=await app.storeFactoryNineShare(user.id,appPayload);
  assert.equal(await app.storeFactoryNineShare(user.id,appPayload),appSaved);
  const template=await app.loadFactoryNineTemplate({expectedOwnerId:user.id,organizationId:org,projectId:project.id,recordId:appSaved});
  assert.deepEqual(template.snapshot,c.snapshot);
  const audit=JSON.parse(await db.sql(`SELECT jsonb_agg(metadata) FROM public.organization_audit_log WHERE organization_id='${org}' AND action='factory-nine.snapshot.shared' AND entity_id IN('${saved}','${appSaved}')`));
  assert.equal(audit.length,2);for(const row of audit){assert.equal(row.calculatorSlug,c.slug);assert.equal(row.calculatorVersion,1);assert.equal(row.projectId,project.id);}
  observations.push({catalogId:c.id,concurrentIdempotentWrite:true,exactReadback:true,foreignRlsReadDenied:true,foreignActorDenied:true,authenticatedDirectRpcDenied:true,freeProDowngradeDenied:true,malformedRefusals:mutations.length,requestCollisionDenied:true,realApplicationSessionActorSeam:true,applicationTemplateReadback:true,staleOwnerDeniedBeforePersistence:true,exactlyOneAuditPerDistinctRequest:true});
 }
 globalThis.__calcumintConstructionFixture.client=foreign;
 await db.sql(`INSERT INTO public.organization_members(organization_id,user_id,role) VALUES('${org}','${outsider.id}','viewer')`);
 const permissionPayload={organizationId:org,projectId:project.id,clientWorkspaceId:null,requestId:randomUUID(),title:'Membership recovery',snapshot:cases[0].snapshot};
 await assert.rejects(app.storeFactoryNineShare(outsider.id,permissionPayload),/permission/);
 await db.sql(`UPDATE public.organization_members SET role='member' WHERE organization_id='${org}' AND user_id='${outsider.id}'`);
 assert.match(await app.storeFactoryNineShare(outsider.id,permissionPayload),/^[a-f0-9-]{36}$/);
 await db.sql(`DELETE FROM public.organization_members WHERE organization_id='${org}' AND user_id='${outsider.id}'`);
 await assert.rejects(app.storeFactoryNineShare(outsider.id,{...permissionPayload,requestId:randomUUID()}),/permission/);
 checks.push('Actual server session-to-actor functions with real GoTrue clients: stale owner, viewer, member recovery, membership revocation and exact immutable template readback; cookie/browser transport unchanged and reused');
 await assert.rejects(db.sql(unhold(reverse)),/durable evidence prevents reverse/i);
 checks.push('All10 genuine GoTrue/PostgREST Business snapshots: concurrent retry, exact readback, cross-tenant RLS, plan/actor/direct-RPC/shape/version/collision refusals and durable reverse refusal');
 const receipt={passed:true,kind:'CONSTRUCTION_INDEPENDENT_HELD_BUSINESS79_ACCEPTANCE',predecessorTuples:69,successorTuples:79,tuples,checks,observations,forwardSHA256:sha(forward),reverseSHA256:sha(reverse),preimageSHA256:sha(await readFile(out+'/preimage.json')),postimageSHA256:sha(await readFile(out+'/postimage.json')),fixture:db.provenance,productionWrites:false,sqlActivated:false,publicationSubstitution:false,releaseHold:true};
 await writeFile(out+'/receipt.json',JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify({passed:true,checks:checks.length,constructionBusinessRows:observations.length,forwardSHA256:receipt.forwardSHA256}));
}finally{if(db)await db.close();}
