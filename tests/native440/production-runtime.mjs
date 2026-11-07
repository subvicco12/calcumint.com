import {createHash} from 'node:crypto';
import {spawn} from 'node:child_process';
import {mkdtemp,cp,symlink,rm,readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';import os from 'node:os';import net from 'node:net';
/** Disposable lower-reader fixtures; production gate, composition and CSP stay byte-identical. */
export async function startProductionRuntime({root,auth,db,artifacts}){
 const dir=await mkdtemp(path.join(os.tmpdir(),'native440-production-'));
 for(const entry of ['src','data','public','package.json','package-lock.json','tsconfig.json','next-env.d.ts','next.config.ts','postcss.config.mjs'])try{await cp(path.join(root,entry),path.join(dir,entry),{recursive:true})}catch(e){if(e.code!=='ENOENT')throw e}
 for(const entry of ['node_modules','docs','tests','scripts'])await symlink(path.join(root,entry),path.join(dir,entry));
 // This is a synthetic repository reader, never a certification record change.
 const registryPath=path.join(dir,'src/calculators/registry.ts'),registry=await readFile(registryPath,'utf8');
 const reader='const fixtureRead=(d:RegistryCalculator|undefined):RegistryCalculator|undefined=>d?.id==="conversion.frequency"?{...d,reviewStatus:"certified"}:d;\n';
 await writeFile(registryPath,registry.replace('export const calculatorRegistry=',reader+'export const calculatorRegistry=').replace('=>definitions,getBySlug:', '=>definitions.map(d=>fixtureRead(d)!),getBySlug:').replace('=>bySlug.get(slug)', '=>fixtureRead(bySlug.get(slug))').replace('=>byId.get(id)', '=>fixtureRead(byId.get(id))'));
 const builtSources={};for(const entry of ['src/lib/native-delivery/publication.ts','src/lib/native-delivery/metering.ts','src/lib/native-delivery/embed-request.ts','src/app/api/native-embed/[grant]/calculate/route.ts','src/components/native-frequency-embed.tsx','next.config.ts'])builtSources[entry]=createHash('sha256').update(await readFile(path.join(dir,entry))).digest('hex');await writeFile(path.join(artifacts,'build-source-sha256.json'),JSON.stringify(builtSources,null,2)+'\n');
 const actualPort=await new Promise(resolve=>{const s=net.createServer();s.listen(0,'127.0.0.1',()=>{const p=s.address().port;s.close(()=>resolve(p))})});
 const url=`http://127.0.0.1:${actualPort}`;
 if(new URL(auth.url).hostname!=='127.0.0.1')throw Error('Local-only fixture URL required');
 const env={PATH:process.env.PATH,HOME:process.env.HOME,NODE_ENV:'production',NEXT_TELEMETRY_DISABLED:'1',NEXT_PUBLIC_SITE_URL:url,NEXT_PUBLIC_SUPABASE_URL:auth.url,NEXT_PUBLIC_SUPABASE_ANON_KEY:db.anonKey,SUPABASE_SERVICE_ROLE_KEY:db.serviceKey,EMBED_SESSION_SECRET:'local-only-embed-session-secret-000000000000',WEBHOOK_ENCRYPTION_KEY:'local-only-webhook-encryption-key-000000000',NEXT_PUBLIC_PADDLE_ENV:'sandbox'};
 let logs='',child;
 const run=args=>{const p=spawn(process.execPath,[path.join(root,'node_modules/next/dist/bin/next'),...args],{cwd:dir,env,stdio:['ignore','pipe','pipe']});p.stdout.on('data',c=>logs+=c);p.stderr.on('data',c=>logs+=c);return p};
 try{
 const build=run(['build','--webpack']);await new Promise((resolve,reject)=>{build.once('error',reject);build.once('exit',code=>code===0?resolve():reject(Error('Production fixture build failed: '+logs)))});
 child=run(['start','--hostname','127.0.0.1','--port',String(actualPort)]);
 const deadline=Date.now()+120000;while(Date.now()<deadline){if(child.exitCode!==null)throw Error(logs);try{if((await fetch(url+'/login')).status===200)return{dir,url,logs:()=>logs,close:async()=>{child.kill('SIGTERM');await new Promise(r=>child.once('exit',r));await writeFile(path.join(artifacts,'production-next.log'),logs);await rm(dir,{recursive:true,force:true})}}}catch{}await new Promise(r=>setTimeout(r,100))}throw Error('Production startup timeout');
 }catch(e){child?.kill('SIGTERM');await writeFile(path.join(artifacts,'production-next.log'),logs);throw e}
}
