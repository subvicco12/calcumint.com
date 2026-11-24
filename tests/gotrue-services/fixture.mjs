/** Disposable service endpoints only. This module never manages containers. */
import assert from 'node:assert/strict';
import {lstat,readFile} from 'node:fs/promises';
import {spawn} from 'node:child_process';
import {createHmac} from 'node:crypto';
import http from 'node:http';
import {fileURLToPath} from 'node:url';
import {initializeSchema} from '../gotrue-runtime/schema.mjs';
export const images=Object.freeze({postgres:'postgres:17.6-alpine@sha256:ef257d85f76e48da1c64832459b59fcaba1a4dac97bf5d7450c77753542eee94',postgrest:'postgrest/postgrest:v12.2.3@sha256:729bf65c733b73f5b52777f0e4b853f22ed73aa67a22d38269d289779b0a8401',gotrue:'supabase/gotrue:v2.197.0@sha256:1736a63078f5922b198c4cbe50f80ab9a2d3b54fe8b7b6cfb2e9dc5dbbc12c6b'});
export function validateConfig(c,context){
 assert.deepEqual(Object.keys(c).sort(),['kind','repository','runId','attempt','workflowSha','postgres','authUrl','restUrl','jwtSecret','serviceIds'].sort());
 assert.equal(c.kind,'CALCUMINT_DISPOSABLE_SERVICES_V1');assert.equal(c.repository,'subvicco12/calcumint.com');
 assert.match(c.runId,/^[1-9][0-9]*$/);assert.equal(c.runId,context.runId);assert.equal(c.attempt,1);assert.match(c.workflowSha,/^[0-9a-f]{40}$/);assert.equal(c.workflowSha,context.workflowSha);
 assert.deepEqual(Object.keys(c.postgres).sort(),['database','host','port']);assert.equal(c.postgres.host,'127.0.0.1');assert.equal(c.postgres.database,'postgres');assert(Number.isInteger(c.postgres.port)&&c.postgres.port>0&&c.postgres.port<65536);
 for(const u of [c.authUrl,c.restUrl]){const x=new URL(u);assert.equal(x.protocol,'http:');assert.equal(x.hostname,'127.0.0.1');assert(x.port);assert.equal(x.pathname,'/');assert(!x.username&&!x.password&&!x.search&&!x.hash);}
 assert(c.jwtSecret.startsWith('calcumint-disposable-only-not-production-')&&c.jwtSecret.length>=64);
 assert.deepEqual(Object.keys(c.serviceIds).sort(),['gotrue','postgres','postgrest']);for(const id of Object.values(c.serviceIds))assert.match(id,/^[0-9a-f]{64}$/);
 return c;
}
async function ready(check){const end=Date.now()+30000;for(;;){try{return await check()}catch(e){if(Date.now()>=end)throw e;await new Promise(r=>setTimeout(r,100));}}}
export async function startServiceFixture({initializeSchema:schemaInitializer=initializeSchema,jwtExpirySeconds}={}){
 // Service JWT expiry is configured before startup; do not silently retarget it.
 assert.equal(jwtExpirySeconds,undefined,'Externally provisioned expiry override requires separately bound service configuration');
 assert.equal(process.env.GITHUB_ACTIONS,'true');assert.equal(process.env.CALCUMINT_REQUIRE_SOCKET_FREE,'true');
 for(const key of ['DATABASE_URL','SUPABASE_DB_URL','PGHOST','PGDATABASE','PGPORT','PGUSER','PGPASSWORD','PGSERVICE','PGSERVICEFILE'])assert(!process.env[key],'External database selector refused');
 const configPath=process.env.CALCUMINT_SERVICE_CONFIG;assert(configPath,'Missing disposable service config');
 const st=await lstat(configPath);assert(st.isFile()&&!st.isSymbolicLink()&&(st.mode&0o077)===0,'Private regular service config required');
 const config=validateConfig(JSON.parse(await readFile(configPath,'utf8')),{runId:process.env.GITHUB_RUN_ID,workflowSha:process.env.GITHUB_WORKFLOW_SHA});
 const sql=(q)=>new Promise((resolve,reject)=>{const p=spawn('python3',['-I',fileURLToPath(new URL('./sql-client.py',import.meta.url)),configPath,'postgres'],{env:{PATH:process.env.PATH,GITHUB_RUN_ID:config.runId,GITHUB_WORKFLOW_SHA:config.workflowSha},stdio:['pipe','pipe','pipe'],timeout:30000});let out='';p.stdout.on('data',b=>out+=b);p.stderr.resume();p.on('error',reject);p.on('close',code=>code===0?resolve(out.trim()):reject(Error('Disposable SQL client refused')));p.stdin.end(q);});
 assert.equal(await sql('SHOW server_version_num;'),'170006','Pinned PostgreSQL version differs');
 const identity=JSON.parse(await sql('SELECT row_to_json(x) FROM calcumint_disposable.identity x;'));
 assert.equal(identity.run_id,config.runId);assert.equal(identity.workflow_sha,config.workflowSha);assert.equal(identity.service_id,config.serviceIds.postgres);
 const health=await ready(async()=>{const r=await fetch(config.authUrl+'/health',{signal:AbortSignal.timeout(2000)});assert.equal(r.status,200);return r.json()});assert.equal(health.version,'v2.197.0');
 const schema=await schemaInitializer(sql);
 await ready(async()=>assert.equal((await fetch(config.restUrl+'/',{signal:AbortSignal.timeout(2000)})).status,200));
 // Refresh only the disposable PostgREST cache after the unchanged schema initializer.
 await sql("NOTIFY pgrst, 'reload schema';");
 const requests=[];const gateway=http.createServer(async(req,res)=>{
  res.setHeader('Access-Control-Allow-Origin','*');res.setHeader('Access-Control-Allow-Headers','authorization,apikey,content-type,x-client-info,x-supabase-api-version,prefer,accept-profile,content-profile');res.setHeader('Access-Control-Allow-Methods','GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS');
  if(req.method==='OPTIONS'){res.writeHead(204);res.end();return;}
  try{const u=new URL(req.url,'http://127.0.0.1');const auth=u.pathname.startsWith('/auth/v1/'),rest=u.pathname.startsWith('/rest/v1/');if(!auth&&!rest){res.writeHead(404);res.end();return;}
   const prefix=auth?'/auth/v1':'/rest/v1';const chunks=[];for await(const b of req)chunks.push(b);const headers={...req.headers};delete headers.host;delete headers.connection;
   const r=await fetch((auth?config.authUrl:config.restUrl)+u.pathname.slice(prefix.length)+u.search,{method:req.method,headers,body:['GET','HEAD'].includes(req.method)?undefined:Buffer.concat(chunks)});requests.push({method:req.method,path:u.pathname,status:r.status});const h=Object.fromEntries(r.headers);delete h['content-length'];delete h['content-encoding'];res.writeHead(r.status,h);res.end(Buffer.from(await r.arrayBuffer()));
  }catch{res.writeHead(502);res.end();}
 });
 await new Promise(r=>gateway.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+gateway.address().port;
 const jwt=role=>{const enc=x=>Buffer.from(JSON.stringify(x)).toString('base64url');const h=enc({alg:'HS256',typ:'JWT'}),p=enc({role,iss:'local-only',exp:Math.floor(Date.now()/1000)+3600});return `${h}.${p}.${createHmac('sha256',config.jwtSecret).update(`${h}.${p}`).digest('base64url')}`;};
 return {url,anonKey:jwt('anon'),serviceKey:jwt('service_role'),sql,requests,close:()=>new Promise(r=>gateway.close(r)),provenance:{images,serviceIds:config.serviceIds,runId:config.runId,workflowSha:config.workflowSha,socketFree:true,autoconfirm:true,...schema}};
}
