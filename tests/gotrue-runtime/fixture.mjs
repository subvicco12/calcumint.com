import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {randomBytes,randomUUID,createHmac} from 'node:crypto';
import http from 'node:http';
import {initializeSchema} from './schema.mjs';
export const images={postgres:'postgres:17.6-alpine@sha256:ef257d85f76e48da1c64832459b59fcaba1a4dac97bf5d7450c77753542eee94',postgrest:'postgrest/postgrest:v12.2.3@sha256:729bf65c733b73f5b52777f0e4b853f22ed73aa67a22d38269d289779b0a8401',gotrue:'supabase/gotrue:v2.197.0@sha256:1736a63078f5922b198c4cbe50f80ab9a2d3b54fe8b7b6cfb2e9dc5dbbc12c6b'};
const env={...process.env};for(const k of ['DOCKER_HOST','DOCKER_CONTEXT','DOCKER_TLS','DOCKER_TLS_VERIFY','DOCKER_CERT_PATH'])delete env[k];
const docker=(args,input='')=>new Promise((resolve,reject)=>{const p=spawn('docker',['--host=unix:///var/run/docker.sock',...args],{env,stdio:['pipe','pipe','pipe'],timeout:30000});let out='',err='';p.stdout.on('data',x=>out+=x);p.stderr.on('data',x=>err+=x);p.on('error',reject);p.on('close',code=>code===0?resolve(out.trim()):reject(Error(`Docker ${args[0]} failed: ${err||out}`)));p.stdin.on('error',reject);p.stdin.end(input);});
async function ready(check){const deadline=Date.now()+30000;for(;;){try{return await check()}catch(e){if(Date.now()>=deadline)throw e;await new Promise(r=>setTimeout(r,100));}}}
export async function startGoTrueFixture({initializeSchema: schemaInitializer=initializeSchema}={}){
 const name='calcumint-gotrue-'+randomUUID(),containers=[];let network=false,gateway;
 const secret=randomBytes(48).toString('hex');
 const jwt=(role)=>{const enc=x=>Buffer.from(JSON.stringify(x)).toString('base64url');const h=enc({alg:'HS256',typ:'JWT'}),p=enc({role,iss:'local-only',exp:Math.floor(Date.now()/1000)+3600});return `${h}.${p}.${createHmac('sha256',secret).update(`${h}.${p}`).digest('base64url')}`;};
 const sql=q=>docker(['exec','-i',name+'-db','psql','-h','127.0.0.1','-U','postgres','-X','-qAt','-v','ON_ERROR_STOP=1'],q);
 const close=async()=>{const errors=[];if(gateway)await new Promise(r=>gateway.close(r));for(const c of containers.reverse())try{await docker(['rm','-f',c])}catch(e){errors.push(e)}if(network)try{await docker(['network','rm',name])}catch(e){errors.push(e)}if(errors.length)throw new AggregateError(errors,'Fixture cleanup failed');};
 async function run(suffix,image,vars={},extra=[]){const n=name+suffix,args=['run','-d','--rm','--pull=never','--name',n,'--network',name,...extra];for(const [k,v] of Object.entries(vars))args.push('-e',`${k}=${v}`);await docker([...args,image]);containers.push(n);return n;}
 const address=async(c,port)=>`http://${await docker(['inspect','--format',`{{(index .NetworkSettings.Networks "${name}").IPAddress}}`,c])}:${port}`;
 try{
  for(const image of Object.values(images))await docker(['image','inspect',image]);
  await docker(['network','create','--internal',name]);network=true;
  await run('-db',images.postgres,{POSTGRES_HOST_AUTH_METHOD:'trust'},['--network-alias','db','--tmpfs','/var/lib/postgresql/data']);
  await ready(()=>sql('SELECT 1;'));
  await sql('CREATE ROLE anon;CREATE ROLE authenticated;CREATE ROLE service_role BYPASSRLS;CREATE ROLE supabase_auth_admin LOGIN;CREATE SCHEMA auth AUTHORIZATION supabase_auth_admin;GRANT USAGE ON SCHEMA public TO supabase_auth_admin;ALTER ROLE supabase_auth_admin SET search_path=auth,public;');
  gateway=http.createServer();await new Promise(r=>gateway.listen(0,'127.0.0.1',r));const url=`http://127.0.0.1:${gateway.address().port}`;
  const auth=await run('-auth',images.gotrue,{GOTRUE_API_HOST:'0.0.0.0',GOTRUE_API_PORT:'9999',API_EXTERNAL_URL:url+'/auth/v1',GOTRUE_SITE_URL:'http://localhost:3000',GOTRUE_DB_DRIVER:'postgres',GOTRUE_DB_DATABASE_URL:'postgres://supabase_auth_admin@db:5432/postgres?sslmode=disable',GOTRUE_JWT_SECRET:secret,GOTRUE_JWT_AUD:'authenticated',GOTRUE_JWT_DEFAULT_GROUP_NAME:'authenticated',GOTRUE_JWT_ADMIN_ROLES:'service_role',GOTRUE_EXTERNAL_EMAIL_ENABLED:'true',GOTRUE_MAILER_AUTOCONFIRM:'true',GOTRUE_SECURITY_REFRESH_TOKEN_ROTATION_ENABLED:'true',GOTRUE_SECURITY_REFRESH_TOKEN_REUSE_INTERVAL:'0'});
  const authUrl=await address(auth,9999);const health=await ready(async()=>{const r=await fetch(authUrl+'/health',{signal:AbortSignal.timeout(2000)});assert.equal(r.status,200);return r.json()});assert.equal(health.version,'v2.197.0');
  const schema=await schemaInitializer(sql);
  const rest=await run('-rest',images.postgrest,{PGRST_DB_URI:'postgres://postgres@db:5432/postgres',PGRST_DB_SCHEMAS:'public',PGRST_DB_ANON_ROLE:'anon',PGRST_JWT_SECRET:secret});const restUrl=await address(rest,3000);
  await ready(async()=>assert.equal((await fetch(restUrl+'/',{signal:AbortSignal.timeout(2000)})).status,200));
  const requests=[];
  gateway.on('request',async(req,res)=>{res.setHeader('Access-Control-Allow-Origin','*');res.setHeader('Access-Control-Allow-Headers','authorization,apikey,content-type,x-client-info,x-supabase-api-version,prefer,accept-profile,content-profile');res.setHeader('Access-Control-Allow-Methods','GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS');if(req.method==='OPTIONS'){res.writeHead(204);res.end();return}try{const u=new URL(req.url,url);const isAuth=u.pathname.startsWith('/auth/v1/'),isRest=u.pathname.startsWith('/rest/v1/');if(!isAuth&&!isRest){res.writeHead(404);res.end();return}const prefix=isAuth?'/auth/v1':'/rest/v1';const target=(isAuth?authUrl:restUrl)+u.pathname.slice(prefix.length)+u.search;const chunks=[];for await(const c of req)chunks.push(c);const headers={...req.headers};delete headers.host;delete headers.connection;const r=await fetch(target,{method:req.method,headers,body:['GET','HEAD'].includes(req.method)?undefined:Buffer.concat(chunks)});requests.push({method:req.method,path:u.pathname,status:r.status});const responseHeaders=Object.fromEntries(r.headers);delete responseHeaders['content-length'];delete responseHeaders['content-encoding'];res.writeHead(r.status,responseHeaders);res.end(Buffer.from(await r.arrayBuffer()));}catch{res.writeHead(502);res.end();}});
  assert.equal(await docker(['network','inspect','--format','{{.Internal}}',name]),'true');
  for(const c of containers){const v=JSON.parse(await docker(['inspect',c]))[0];assert(Object.values(v.NetworkSettings.Ports??{}).every(p=>p===null));}
  return {url,anonKey:jwt('anon'),serviceKey:jwt('service_role'),sql,requests,close,provenance:{images,sourceCommit:'4eee58f296d9698a1c2c0ae14d7a0b379c7622d3',autoconfirm:true,...schema}};
 }catch(error){await close();throw error;}
}
