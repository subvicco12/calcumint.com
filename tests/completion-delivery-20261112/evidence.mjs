import {sanitizeText,sanitizeEvidence} from '../five-native-auth-20261109/evidence-sanitizer.mjs';
// Execution credentials remain in memory. Persist only redacted evidence or hashes.
const credentials=new Set();
export function registerCredentials(...values){for(const value of values.flat())if(typeof value==='string'&&value.length>=8)credentials.add(value);}
export function redactText(value){let text=String(value);for(const credential of credentials)text=text.split(credential).join('[REDACTED_CREDENTIAL]');return sanitizeText(text.replace(/((?:\/api\/native-embed\/|\/embed\/native\/))[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g,'$1[REDACTED_SIGNED_GRANT]'));}
export const evidenceJSON=value=>redactText(sanitizeEvidence(JSON.stringify(value)));
export async function captureFixtureDiagnostics(db,directory){
 const [{execFile},{promisify},{writeFile},{default:path}]=await Promise.all([import('node:child_process'),import('node:util'),import('node:fs/promises'),import('node:path')]);
 const run=promisify(execFile),hostname=(await db.sql("SELECT trim(pg_read_file('/etc/hostname'));" )).trim();
 const inspected=await run('docker',['--host=unix:///var/run/docker.sock','inspect','--format','{{.Name}}',hostname]);
 const database=inspected.stdout.trim().replace(/^\//,'');if(!/^calcumint-gotrue-[a-f0-9-]+-db$/.test(database))throw Error('Diagnostic scope must be this disposable fixture');
 const diagnostics={capturedAt:new Date().toISOString(),activity:JSON.parse(await db.sql("SELECT coalesce(jsonb_agg(jsonb_build_object('state',state,'waitType',wait_event_type,'wait',wait_event,'started',query_start,'query',left(query,1000))),'[]'::jsonb) FROM pg_stat_activity WHERE datname=current_database() AND pid<>pg_backend_pid();"))};
 for(const [kind,name]of [['postgres',database],['postgrest',database.replace(/-db$/,'-rest')]]){const logs=await run('docker',['--host=unix:///var/run/docker.sock','logs','--tail','80',name]);await writeFile(path.join(directory,`fixture-${kind}.log`),redactText(logs.stdout+'\n'+logs.stderr));}
 await writeFile(path.join(directory,'fixture-readiness-diagnostics.json'),evidenceJSON(diagnostics));return diagnostics;
}
/** Small read-only probes for the actual role-visible contract, under the original10s bound.
 * Usage/attempt tables intentionally have no service SELECT and are not readiness inputs.
 */
export async function waitForDeliveryReadiness({db,owner,org,apiKey,timeoutMs=10000}){
 const started=Date.now(),deadline=started+timeoutMs,observations=[];
 const specs=[
  {name:'native-grant-columns',path:'/native_embed_grants?select=id,organization_id,issuer_id,api_key_id,token_hash,allowed_origin,catalog_id,engine_id,technical_version,issued_at,expires_at,revoked_at&limit=0',token:db.serviceKey,method:'GET',accept:value=>Array.isArray(value)&&value.length===0},
  {name:'sharing-read-capability',path:'/rpc/factory_nine_sharing_capability',token:owner.session.access_token,method:'POST',body:{target_org:org},accept:value=>value==='factory-nine-sharing-private-1'},
  {name:'existing-job-read-missing',path:'/rpc/read_technology_five_job_v1',token:db.serviceKey,method:'POST',body:{p_api_key_id:apiKey.id,p_key_hash:apiKey.key_hash,p_organization_id:org,p_request_id:'00000000-0000-4000-8000-000000000001'},accept:value=>value?.status==='missing'}
 ];
 for(;;){let ready=true;for(const spec of specs){const remaining=deadline-Date.now();if(remaining<=0)throw Error('Delivery read-only schema visibility deadline: '+JSON.stringify(observations));const began=Date.now(),response=await fetch(db.url+'/rest/v1'+spec.path,{method:spec.method,headers:{apikey:db.anonKey,Authorization:'Bearer '+spec.token,'Content-Type':'application/json'},...(spec.body?{body:JSON.stringify(spec.body)}:{}),signal:AbortSignal.timeout(remaining)}),headersMs=Date.now()-began,value=await response.json();observations.push({probe:spec.name,status:response.status,code:value?.code,headersMs,totalMs:Date.now()-began,elapsedMs:Date.now()-started});if(response.ok&&spec.accept(value))continue;assertTransient(value,response.status);ready=false;}
  if(ready)return{elapsedMs:Date.now()-started,timeoutMs,observations,scope:'Only real role-visible grant columns and read-only sharing/job RPCs. Native consume interface is exercised later by genuine calculation; usage/attempt SELECT remains revoked.'};if(Date.now()>=deadline)throw Error('Delivery read-only schema visibility deadline: '+JSON.stringify(observations));await new Promise(resolve=>setTimeout(resolve,Math.min(50,deadline-Date.now())));
 }
}
function assertTransient(value,status){if(![503,404].includes(status)||!['PGRST202','PGRST205','PGRST002'].includes(value?.code))throw Error('Nontransient delivery read-only probe failure: '+JSON.stringify({status,value}));}
