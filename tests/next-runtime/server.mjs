import {spawn} from 'node:child_process';
import {mkdtemp,cp,symlink,rm,writeFile,readFile} from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import net from 'node:net';
export async function startNextRuntime({root,auth,db,artifacts}){
 const dir=await mkdtemp(path.join(os.tmpdir(),'calcumint-actual-next-'));
 for(const entry of ['src','data','public','package.json','package-lock.json','tsconfig.json','next-env.d.ts','next.config.ts','postcss.config.mjs']){try{await cp(path.join(root,entry),path.join(dir,entry),{recursive:true})}catch(e){if(e.code!=='ENOENT')throw e}}
 // Test-copy-only CSP deltas: exact loopback identity origin and Next dev webpack eval.
 const configPath=path.join(dir,'next.config.ts');const config=await readFile(configPath,'utf8');await writeFile(configPath,config.replace("connect-src 'self'","connect-src 'self' "+auth.url).replace("script-src 'self'", "script-src 'self' 'unsafe-eval'"));
 await symlink(path.join(root,'node_modules'),path.join(dir,'node_modules'),'dir');
 const port=await new Promise(r=>{const s=net.createServer();s.listen(0,'127.0.0.1',()=>{const p=s.address().port;s.close(()=>r(p))})});const url=`http://127.0.0.1:${port}`;
 const env={PATH:process.env.PATH,HOME:process.env.HOME,NODE_ENV:'development',NEXT_TELEMETRY_DISABLED:'1',NEXT_PUBLIC_SITE_URL:url,NEXT_PUBLIC_SUPABASE_URL:auth.url,NEXT_PUBLIC_SUPABASE_ANON_KEY:db.anonKey,SUPABASE_SERVICE_ROLE_KEY:db.serviceKey,EMBED_SESSION_SECRET:'local-only-embed-session-secret-000000000000',WEBHOOK_ENCRYPTION_KEY:'local-only-webhook-encryption-key-000000000',NEXT_PUBLIC_PADDLE_ENV:'sandbox'};
 const child=spawn(process.execPath,[path.join(root,'node_modules/next/dist/bin/next'),'dev','--webpack','--hostname','127.0.0.1','--port',String(port)],{cwd:dir,env,stdio:['ignore','pipe','pipe']});let logs='';child.stdout.on('data',c=>logs+=c);child.stderr.on('data',c=>logs+=c);
 try{const deadline=Date.now()+120000;while(Date.now()<deadline){if(child.exitCode!==null)throw Error(`Next exited ${child.exitCode}: ${logs}`);try{const r=await fetch(url+'/login');if(r.status===200)return {url,dir,logs:()=>logs,close:async()=>{child.kill('SIGTERM');await new Promise(r=>{child.once('exit',r);setTimeout(r,5000).unref()});await writeFile(path.join(artifacts,'next-server.log'),logs);await rm(dir,{recursive:true,force:true,maxRetries:5})}}}catch{}await new Promise(r=>setTimeout(r,250))}throw Error('Next startup timed out: '+logs)}catch(e){child.kill('SIGTERM');await writeFile(path.join(artifacts,'next-server.log'),logs);throw e}
}
