// Disposable repository-shaped contracts. Never connects to a supplied database URL.
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {randomBytes,randomUUID,createHmac,createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {bootstrapSchema,member} from '../api-schema/bootstrap.mjs';
const postgres='postgres:17.6-alpine@sha256:ef257d85f76e48da1c64832459b59fcaba1a4dac97bf5d7450c77753542eee94';
const postgrest='postgrest/postgrest:v12.2.3@sha256:729bf65c733b73f5b52777f0e4b853f22ed73aa67a22d38269d289779b0a8401';
const env={...process.env};for(const key of ['DOCKER_HOST','DOCKER_CONTEXT','DOCKER_TLS','DOCKER_TLS_VERIFY','DOCKER_CERT_PATH'])delete env[key];
const docker=(args,input='')=>new Promise((resolve,reject)=>{
 const child=spawn('docker',['--host=unix:///var/run/docker.sock',...args],{env,stdio:['pipe','pipe','pipe'],timeout:30000});let output='',error='';
 child.stdout.on('data',chunk=>output+=chunk);child.stderr.on('data',chunk=>error+=chunk);child.on('error',reject);child.on('close',code=>code===0?resolve(output.trim()):reject(Error(error||output)));child.stdin.on('error',reject);child.stdin.end(input);
});
export async function startRuntimeDatabase({accountHistory=false}={}){
 const name=`calcumint-next-runtime-${randomUUID()}`,network=name+'-network',restName=name+'-rest';
 const a='00000000-0000-4000-8000-000000000001',b='00000000-0000-4000-8000-000000000002',configId='00000000-0000-4000-8000-000000000003';
 const jwtSecret=randomBytes(48).toString('hex');
 const jwt=(role,sub)=>{const header=Buffer.from('{"alg":"HS256","typ":"JWT"}').toString('base64url'),payload=Buffer.from(JSON.stringify({role,...(sub?{sub}:{}),aud:role,exp:Math.floor(Date.now()/1000)+7200})).toString('base64url');return `${header}.${payload}.${createHmac('sha256',jwtSecret).update(`${header}.${payload}`).digest('base64url')}`;};
 let net=false,pg=false,rest=false;
 const sql=q=>docker(['exec','-i',name,'psql','-h','127.0.0.1','-U','postgres','-X','-qAt','-v','ON_ERROR_STOP=1'],q);
 const close=async()=>{if(rest)await docker(['rm','-f',restName]);if(pg)await docker(['rm','-f',name]);if(net)await docker(['network','rm',network]);};
 try{
  await docker(['image','inspect',postgres]);await docker(['image','inspect',postgrest]);
  await docker(['network','create','--internal',network]);net=true;
  await docker(['run','-d','--rm','--pull=never','--name',name,'--network',network,'--network-alias','db','--tmpfs','/var/lib/postgresql/data','-e','POSTGRES_HOST_AUTH_METHOD=trust',postgres]);pg=true;
  for(let n=0;;n++){try{await sql('SELECT 1;');break;}catch(error){if(n>=60)throw error;await new Promise(resolve=>setTimeout(resolve,250));}}
  await bootstrapSchema(sql,{a,b});
  for(const migration of ['002_b4_billing','007_b9_ai','008_b10_admin_factory','008b_b10_alert_automation','009_country_preferences','010_b7_pro_workspace','013_production_rpc_privilege_hardening_v2','014_production_entitlement_rpc_sync','035_split_overlapping_write_policies'])await sql(await readFile(`supabase/migrations/${migration}.sql`,'utf8'));
  const proposals=[['API-RLS-HELPER-EXECUTE.sql','PROPOSAL ONLY: isolated helper acceptance and owner authorization required'],['MEMBERSHIP-ADMIN-FENCING.sql','PROPOSAL ONLY: isolated membership acceptance and owner authorization required'],['ATOMIC-API-QUOTA.sql','PROPOSAL ONLY: isolated quota acceptance and owner authorization required'],['ATOMIC-BATCH-JOB.sql','PROPOSAL ONLY: isolated batch acceptance and owner authorization required'],['ATOMIC-EMBED-LEAD-CONSENT.sql','PROPOSAL ONLY: isolated acceptance and owner authorization required']];
  for(const [file,message]of proposals){const source=await readFile(`docs/architecture/proposals/${file}`,'utf8'),guard=`DO $$ BEGIN RAISE EXCEPTION '${message}'; END $$;`;assert.equal(source.split(guard).length,2);await assert.rejects(sql(source),/PROPOSAL ONLY/);await sql(source.replace(guard,'-- Guard removed only in disposable fixture'));}
  let accountHistoryProposal;
  if(accountHistory){
   const file='ATOMIC-ACCOUNT-HISTORY.sql',source=await readFile(`docs/architecture/proposals/${file}`,'utf8');
   const guard="DO $proposal_guard$ BEGIN\n RAISE EXCEPTION 'UNAPPLIED_ATOMIC_ACCOUNT_HISTORY_PROPOSAL';\nEND $proposal_guard$;";
   assert.equal(source.split(guard).length,2,'Account history fixture must remove exactly the proposal guard');
   await assert.rejects(sql(source),/UNAPPLIED_ATOMIC_ACCOUNT_HISTORY_PROPOSAL/);
   await sql(source.replace(guard,'-- Proposal guard removed only inside disposable native fixture'));
   await sql('GRANT INSERT,UPDATE,DELETE ON public.calculation_projects,public.saved_scenarios TO authenticated;');
   accountHistoryProposal={file,sha256:createHash('sha256').update(source).digest('hex'),originalGuardRejected:true,scope:'Disposable native fixture only; only proposal guard removed; production remains unapplied'};
  }
  // Explicit local platform ACL model; these do not attest deployed Supabase grants.
  await sql(`GRANT SELECT,INSERT,UPDATE,DELETE ON public.organizations,public.organization_members,public.organization_invitations,public.client_workspaces,public.business_projects,public.shared_calculations,public.business_api_keys,public.business_webhook_endpoints TO authenticated;
  GRANT SELECT ON public.organization_audit_log,public.api_usage_events,public.webhook_deliveries,public.embed_events TO authenticated;
  GRANT SELECT ON public.user_preferences,public.favorites,public.calculation_history,public.calculation_projects,public.saved_scenarios,public.subscriptions TO authenticated;
  GRANT INSERT,UPDATE ON public.user_preferences TO authenticated;
  GRANT USAGE,SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
  GRANT SELECT ON public.profiles,public.organizations,public.organization_members,public.custom_calculators,public.custom_calculator_versions,public.embed_configs,public.embed_leads,public.lead_consents,public.business_api_keys TO service_role;
  GRANT SELECT ON public.organization_invitations,public.api_usage_events,public.embed_events,public.business_projects,public.client_workspaces,public.custom_calculator_runs TO service_role;
  GRANT UPDATE ON public.organization_members,public.business_api_keys,public.custom_calculators TO service_role;
  GRANT UPDATE(plan) ON public.profiles TO service_role;
  GRANT INSERT ON public.custom_calculator_runs TO service_role;
  GRANT INSERT ON public.embed_events TO service_role;GRANT USAGE,SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;
  UPDATE public.profiles SET plan='business' WHERE id IN ('${a}','${b}','${member}');
  INSERT INTO public.custom_calculator_versions(calculator_id,version,definition,created_by) VALUES('${a}',1,'{"name":"Runtime estimate","fields":[{"key":"x","label":"Quantity","type":"number","defaultValue":2,"required":true}],"outputs":[{"key":"answer","label":"Answer","formula":"x*2","format":"number"}]}'::jsonb,'${a}');
  INSERT INTO public.embed_configs(id,organization_id,calculator_id,public_key,name,lead_capture_enabled,consent_text,privacy_url,created_by) VALUES('${configId}','${a}','${a}','runtime_public_embed_key_123456','Runtime consent',true,'I agree to this local estimate.','https://example.invalid/privacy','${a}');`);
  assert.equal(await sql(`SET ROLE authenticated;SET request.jwt.claim.sub='${b}';SELECT count(*) FROM public.business_projects WHERE organization_id='${a}';`),'0');
  await assert.rejects(sql(`SET ROLE authenticated;SET request.jwt.claim.sub='${a}';UPDATE public.profiles SET plan='free';`),/permission denied/);
  await docker(['run','-d','--rm','--pull=never','--name',restName,'--network',network,'-e','PGRST_DB_URI=postgres://postgres@db:5432/postgres','-e','PGRST_DB_SCHEMAS=public','-e','PGRST_DB_ANON_ROLE=anon','-e',`PGRST_JWT_SECRET=${jwtSecret}`,postgrest]);rest=true;
  const ip=await docker(['inspect','--format',`{{(index .NetworkSettings.Networks "${network}").IPAddress}}`,restName]),restUrl=`http://${ip}:3000`;
  for(let n=0;;n++){try{const reply=await fetch(restUrl+'/');if(reply.ok)break;throw Error('PostgREST unavailable');}catch(error){if(n>=60)throw error;await new Promise(resolve=>setTimeout(resolve,250));}}
  for(const container of [name,restName]){const value=JSON.parse(await docker(['inspect',container]))[0];assert.equal(value.HostConfig.NetworkMode,network);assert(Object.values(value.NetworkSettings.Ports??{}).every(port=>port===null));}
  assert.equal(await docker(['network','inspect','--format','{{.Internal}}',network]),'true');
  const user=(id,email)=>({id,email,password:'Synthetic-local-only-'+randomBytes(12).toString('hex')});
  return {restUrl,jwtSecret,anonKey:jwt('anon'),serviceKey:jwt('service_role'),users:{owner:user(a,'owner@example.invalid'),outsider:user(b,'outsider@example.invalid'),member:user(member,'member@example.invalid')},orgId:a,calculatorId:a,embedKey:'runtime_public_embed_key_123456',configId,sql,close,provenance:{postgres,postgrest,source:'repository migrations plus guarded proposals in disposable fixture; platform auth/ACL model; production equivalence UNKNOWN',proposals:proposals.map(([file])=>file),...(accountHistoryProposal?{accountHistoryProposal}:{})}};
 }catch(error){await close();throw error;}
}
