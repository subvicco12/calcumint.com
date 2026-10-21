import {afterAll,beforeAll,expect,it} from 'vitest';
import path from 'node:path';
import {createServer,request} from 'node:http';
async function unusedPort(){const listener=createServer();await new Promise<void>(r=>listener.listen(0,'127.0.0.1',r));const {port}=listener.address() as {port:number};await new Promise<void>((r,j)=>listener.close(e=>e?j(e):r()));return port;}
async function requestWithHost(url:string,headers:Record<string,string>){return new Promise<number|undefined>((resolve,reject)=>{const req=request(url,{headers},res=>{res.resume();res.on('end',()=>resolve(res.statusCode));});req.on('error',reject);req.end();});}
let server: {httpServer:{address:()=>{port:number}};close:()=>Promise<void>;draftPreviewAccessToken?:string};
let base:string;
beforeAll(async()=>{
 const modulePath=path.resolve('scripts/draft-preview.mjs');
 const {startDraftPreview}=await import(/* @vite-ignore */ modulePath);
 server=await startDraftPreview(await unusedPort());base=`http://127.0.0.1:${server.httpServer.address().port}`;
},30000);
afterAll(async()=>{await server?.close();});
it('requires explicit private reviewer authorization before serving calculator UI or source',async()=>{
 for(const route of ['/tests/draft-preview/','/src/components/draft-calculator-preview.tsx','/@vite/client']){
  const response=await fetch(base+route);expect(response.status).toBe(401);
  expect(await response.text()).not.toContain('DraftCalculatorPreview');
 }
});
const authorization=()=>`Basic ${Buffer.from(`reviewer:${server.draftPreviewAccessToken}`).toString('base64')}`;
it('allows the per-run credential and keeps responses private',async()=>{
 const response=await fetch(base+'/tests/draft-preview/',{headers:{Authorization:authorization()}});
 expect(response.status).toBe(200);expect(response.headers.get('cache-control')).toBe('no-store');
 expect(response.headers.get('referrer-policy')).toBe('no-referrer');expect(response.headers.get('x-frame-options')).toBe('DENY');
 expect(await response.text()).toContain('main.tsx');
});
it.each(['Basic garbage','Bearer wrong','Basic '+Buffer.from('reviewer:wrong').toString('base64')])('rejects invalid credentials without disclosing them',async Authorization=>{
 const response=await fetch(base+'/tests/draft-preview/',{headers:{Authorization}});expect(response.status).toBe(401);
 expect(response.headers.get('www-authenticate')).toContain('Basic realm=');expect(await response.text()).not.toContain(Authorization);
});
it('rejects foreign origins, non-loopback hosts and write methods even with a valid credential',async()=>{
 const headers={Authorization:authorization()};
 expect((await fetch(base+'/tests/draft-preview/',{headers:{...headers,Origin:'https://untrusted.invalid'}})).status).toBe(403);
 expect(await requestWithHost(base+'/tests/draft-preview/',{...headers,Host:'untrusted.invalid'})).toBe(403);
 expect((await fetch(base+'/tests/draft-preview/',{method:'POST',headers})).status).toBe(405);
 expect((await fetch(base+'/tests/draft-preview/',{headers:{...headers,Origin:base}})).status).toBe(200);
});
it('does not authorize a new server with a previous server credential',async()=>{
 const modulePath=path.resolve('scripts/draft-preview.mjs');const {startDraftPreview}=await import(/* @vite-ignore */ modulePath);
 const other=await startDraftPreview(await unusedPort());
 try{const address=other.httpServer.address();const response=await fetch(`http://127.0.0.1:${address.port}/tests/draft-preview/`,{headers:{Authorization:authorization()}});expect(response.status).toBe(401);}
 finally{await other.close();}
});
it('keeps environment files, repository metadata and external filesystem paths denied after authorization',async()=>{
 for(const route of ['/.env','/.env.local','/.git/config','/@fs/etc/passwd']){
  const response=await fetch(base+route,{headers:{Authorization:authorization()}});expect([403,404]).toContain(response.status);
 }
});
it('CLI creates an owner-only per-run password without printing it and removes it on shutdown',async()=>{
 // Close the shared fixture before a second Vite optimizer uses the same project cache.
 await server.close();
 const {spawn}=await import('node:child_process');const {readFile,stat}=await import('node:fs/promises');
 const child=spawn(process.execPath,['scripts/draft-preview.mjs'],{stdio:['ignore','pipe','pipe']});
 let stdout='',closed=false;child.stdout.on('data',data=>{stdout+=data;});child.stderr.on('data',()=>{});
 const exit=new Promise<void>(resolve=>child.once('close',()=>{closed=true;resolve();}));
 try{
  const end=Date.now()+15000;let credentialPath:string|undefined;
  while(Date.now()<end&&!closed){credentialPath=stdout.match(/owner-only file: (.+)/)?.[1];if(credentialPath)break;await new Promise(r=>setTimeout(r,25));}
  expect(Boolean(credentialPath)).toBe(true);const file=credentialPath!;const password=await readFile(file,'utf8');
  expect(password.length).toBeGreaterThanOrEqual(43);expect(stdout.includes(password)).toBe(false);
  expect((await stat(file)).mode&0o777).toBe(0o600);expect((await stat(path.dirname(file))).mode&0o777).toBe(0o700);
  expect((await fetch('http://127.0.0.1:4179/tests/draft-preview/')).status).toBe(401);
  child.kill('SIGTERM');await exit;
  await expect(stat(file)).rejects.toHaveProperty('code','ENOENT');await expect(stat(path.dirname(file))).rejects.toHaveProperty('code','ENOENT');
 }finally{if(!closed){child.kill('SIGTERM');await exit;}}
},20000);
