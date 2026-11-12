import http from 'node:http';
import {createHash,randomBytes} from 'node:crypto';
import {registerCredentials,redactText} from './evidence.mjs';
import {spawn} from 'node:child_process';
import {mkdtemp,cp,symlink,rm,readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';import os from 'node:os';import net from 'node:net';
/** Disposable lower-reader fixtures; production gate, composition and CSP stay byte-identical. */
export async function startProductionRuntime({root,auth,db,artifacts,conditionalPublicationFixture=true}){
 const dir=await mkdtemp(path.join(os.tmpdir(),'completion-nine-production-'));
 for(const entry of ['src','data','public','package.json','package-lock.json','tsconfig.json','next-env.d.ts','next.config.ts','postcss.config.mjs'])try{await cp(path.join(root,entry),path.join(dir,entry),{recursive:true})}catch(e){if(e.code!=='ENOENT')throw e}
 for(const entry of ['node_modules','docs','tests','scripts'])await symlink(path.join(root,entry),path.join(dir,entry));
 // This is a synthetic repository reader, never a certification record change.
 const registryPath=path.join(dir,'src/calculators/registry.ts'),registry=await readFile(registryPath,'utf8');
 const fixtureIds=['launch-square-calculator','launch-cube-calculator','launch-square-root-calculator','conversion.length','conversion.energy','conversion.power','conversion.time','conversion.force','conversion.frequency'];
 const reader='const fixtureRead=(d:RegistryCalculator|undefined):RegistryCalculator|undefined=>d&&'+JSON.stringify(fixtureIds)+'.includes(d.id)?{...d,reviewStatus:"certified"}:d;\n';
 if(conditionalPublicationFixture){
 const fixtureRegistry=registry.replace('export const calculatorRegistry=',reader+'export const calculatorRegistry=').replace('=>definitions,getBySlug:', '=>definitions.map(d=>fixtureRead(d)!),getBySlug:').replace('=>bySlug.get(slug)', '=>fixtureRead(bySlug.get(slug))').replace('=>byId.get(id)', '=>fixtureRead(byId.get(id))');
 if(fixtureRegistry===registry)throw Error('Known lower registry fixture insertion did not apply');await writeFile(registryPath,fixtureRegistry);
 }
 const files=(await import('node:child_process')).execFileSync('rg',['--files','src','data'],{cwd:root,encoding:'utf8'}).trim().split('\n');
 const builtSources={};for(const entry of [...files,'next.config.ts']){const original=await readFile(path.join(root,entry)),copy=await readFile(path.join(dir,entry));if((!conditionalPublicationFixture||entry!=='src/calculators/registry.ts')&&!original.equals(copy))throw Error('Unexpected copied source difference: '+entry);builtSources[entry]={originalSHA256:createHash('sha256').update(original).digest('hex'),builtSHA256:createHash('sha256').update(copy).digest('hex'),explicitLowerPublicationFixture:conditionalPublicationFixture&&entry==='src/calculators/registry.ts'};}
 await writeFile(path.join(artifacts,'build-source-sha256.json'),JSON.stringify(builtSources,null,2)+'\n');
 const actualPort=await new Promise(resolve=>{const s=net.createServer();s.listen(0,'127.0.0.1',()=>{const p=s.address().port;s.close(()=>resolve(p))})});
 if(new URL(auth.url).hostname!=='127.0.0.1')throw Error('Local-only fixture URL required');
 const appOrigin=`http://127.0.0.1:${actualPort}`;
 // Lower HTTP transport fixture: same-origin local identity keeps the unchanged
 // production CSP enforceable during genuine browser account/save requests.
 const proxy=http.createServer(async(req,res)=>{try{const identity=/^\/(auth|rest)\/v1(?:\/|$)/.test(req.url);const target=(identity?auth.url:appOrigin)+req.url;const chunks=[];for await(const chunk of req)chunks.push(chunk);const headers={...req.headers,'x-forwarded-host':req.headers.host,'x-forwarded-proto':'http'};for(const key of ['host','connection','transfer-encoding','content-length','keep-alive','upgrade'])delete headers[key];const response=await fetch(target,{method:req.method,headers,body:['GET','HEAD'].includes(req.method)?undefined:Buffer.concat(chunks),redirect:'manual'});const outgoing=Object.fromEntries(response.headers);delete outgoing['content-length'];delete outgoing['content-encoding'];const cookies=response.headers.getSetCookie();if(cookies.length)outgoing['set-cookie']=cookies;res.writeHead(response.status,outgoing);res.end(Buffer.from(await response.arrayBuffer()))}catch{res.writeHead(502);res.end('Local fixture transport unavailable')}});await new Promise(resolve=>proxy.listen(0,'127.0.0.1',resolve));const url=`http://127.0.0.1:${proxy.address().port}`;
 await writeFile(path.join(artifacts,'production-transport.json'),JSON.stringify({siteOrigin:url,nextOrigin:appOrigin,identityOrigin:auth.url,identityPaths:['/auth/v1/*','/rest/v1/*'],cspBypass:false,sourceConfigUnmodified:(await readFile(path.join(dir,'next.config.ts'),'utf8'))===(await readFile(path.join(root,'next.config.ts'),'utf8')),scope:'Loopback-only HTTP transport; genuine auth/database and unchanged production application/CSP'},null,2)+'\n');
 const embedSecret=randomBytes(48).toString('base64url'),webhookSecret=randomBytes(32).toString('base64url');registerCredentials(embedSecret,webhookSecret,db.anonKey,db.serviceKey);
 const env={PATH:process.env.PATH,HOME:process.env.HOME,NODE_ENV:'production',NEXT_TELEMETRY_DISABLED:'1',NEXT_PUBLIC_SITE_URL:url,NEXT_PUBLIC_SUPABASE_URL:url,NEXT_PUBLIC_SUPABASE_ANON_KEY:db.anonKey,SUPABASE_SERVICE_ROLE_KEY:db.serviceKey,EMBED_SESSION_SECRET:embedSecret,WEBHOOK_ENCRYPTION_KEY:webhookSecret,NEXT_PUBLIC_PADDLE_ENV:'sandbox'};
 let logs='',child;
 const run=args=>{const p=spawn(process.execPath,[path.join(root,'node_modules/next/dist/bin/next'),...args],{cwd:dir,env,stdio:['ignore','pipe','pipe']});p.stdout.on('data',c=>logs+=c);p.stderr.on('data',c=>logs+=c);return p};
 try{
 const build=run(['build','--webpack']);await new Promise((resolve,reject)=>{build.once('error',reject);build.once('exit',code=>code===0?resolve():reject(Error('Production fixture build failed: '+redactText(logs))))});
 await writeFile(path.join(artifacts,'build.log'),redactText(logs));
 child=run(['start','--hostname','127.0.0.1','--port',String(actualPort)]);
 const deadline=Date.now()+120000;while(Date.now()<deadline){if(child.exitCode!==null)throw Error(redactText(logs));try{if((await fetch(url+'/login')).status===200)return{dir,url,builtSources,conditionalPublicationFixture,logs:()=>logs,flush:()=>writeFile(path.join(artifacts,'production-next.log'),redactText(logs)),close:async()=>{child.kill('SIGTERM');await new Promise(r=>child.once('exit',r));proxy.closeAllConnections();await new Promise(resolve=>proxy.close(resolve));await writeFile(path.join(artifacts,'production-next.log'),redactText(logs));await rm(dir,{recursive:true,force:true})}}}catch{}await new Promise(r=>setTimeout(r,100))}throw Error('Production startup timeout');
 }catch(e){child?.kill('SIGTERM');proxy.closeAllConnections();await new Promise(resolve=>proxy.close(resolve));await writeFile(path.join(artifacts,'production-next.log'),redactText(logs));throw e}
}
