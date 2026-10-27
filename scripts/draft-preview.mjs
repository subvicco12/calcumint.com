import {createServer} from 'vite';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import os from 'node:os';
import {randomBytes,timingSafeEqual} from 'node:crypto';
import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import {rmSync} from 'node:fs';
import {protectPreviewDirectory} from './private-preview-credentials.mjs';

/** Loopback developer tool, not production authentication or an account writer. */
export async function startDraftPreview(port = 4179, {fixture} = {}) {
  if(fixture!==undefined&&!['reference-six','catalog','cidr'].includes(fixture))throw new Error('Unknown private preview fixture');
  const root = fileURLToPath(new URL('../', import.meta.url));
  const accessToken = randomBytes(32).toString('base64url');
  const expected = Buffer.from(`Basic ${Buffer.from(`reviewer:${accessToken}`).toString('base64')}`);
  const server = await createServer({configFile:false,envFile:false,root,
    appType:'spa',publicDir:false,
    resolve:{alias:[...(fixture!==undefined?[{find:'@/lib/supabase/browser',replacement:path.join(root,'tests/release-candidate/synthetic-client.ts')},{find:'next/link',replacement:path.join(root,'tests/release-candidate/link.tsx')}]:[]),{find:'@',replacement:path.join(root,'src')}]},
    cacheDir:path.join(os.tmpdir(),`calcumint-${fixture??'draft'}-vite-${process.pid}-${randomBytes(12).toString('hex')}`),
    optimizeDeps:{noDiscovery:true,include:['react','react-dom/client','react/jsx-runtime','react/jsx-dev-runtime','decimal.js','zod']},
    ...(fixture!==undefined?{define:{'process.env.NEXT_PUBLIC_SUPABASE_URL':JSON.stringify('https://synthetic.invalid'),'process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY':JSON.stringify('synthetic-reference-fixture')}}:{}),
    esbuild:{jsx:'automatic'},server:{headers:{'Cache-Control':'no-store','Referrer-Policy':'no-referrer','X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY'},hmr:false,host:'127.0.0.1',port,strictPort:true,cors:false,
      watch:{ignored:['**/.windows-tools/**','**/docs/windows-sprint/evidence/**']},
      fs:{strict:true,allow:[root],deny:['**/.env','**/.env.*','**/.git/**','**/.aws/**','**/.codex/**','**/.windows-tools/**']}},
    plugins:[{name:'private-draft-entry',configureServer(s){s.middlewares.use((req,res,next)=>{
      const address=s.httpServer?.address();
      const host=typeof address==='object'&&address?`127.0.0.1:${address.port}`:null;
      res.setHeader('Cache-Control','no-store');
      res.setHeader('Referrer-Policy','no-referrer');
      res.setHeader('X-Content-Type-Options','nosniff');
      res.setHeader('X-Frame-Options','DENY');
      if(!host||req.headers.host!==host||(req.headers.origin&&req.headers.origin!==`http://${host}`)){
        res.statusCode=403;res.end('Private reviewer origin required.');return;
      }
      const received=Buffer.from(req.headers.authorization||'');
      if(received.length!==expected.length||!timingSafeEqual(received,expected)){
        res.statusCode=401;res.setHeader('WWW-Authenticate','Basic realm="CalcuMint private DRAFT review", charset="UTF-8"');
        res.end('Private reviewer authorization required.');return;
      }
      if(req.method!=='GET'&&req.method!=='HEAD'){res.statusCode=405;res.setHeader('Allow','GET, HEAD');res.end('Read-only preview.');return;}
      if(req.url==='/'||req.url==='/?'){res.statusCode=302;res.setHeader('Location',fixture==='cidr'?'/tests/cidr-review/':fixture==='reference-six'?'/tests/release-candidate/':fixture==='catalog'?'/tests/catalog-preview/':'/tests/draft-preview/');res.end();return;}next();
    });}}]});
  await server.listen(); return Object.assign(server,{draftPreviewAccessToken:accessToken});
}
if(process.argv[1]===fileURLToPath(import.meta.url)) {
  const fixture=process.argv.includes('--catalog')?'catalog':undefined;
  const portArgument=process.argv.find(value=>value.startsWith('--port='));
  const port=portArgument?Number(portArgument.slice(7)):4179;
  if(!Number.isInteger(port)||port<1||port>65535)throw new Error('Preview port must be an integer from1to65535');
  const server=await startDraftPreview(port,{fixture});
  const directory=await mkdtemp(path.join(os.tmpdir(),'calcumint-private-preview-'));
  const credentialPath=path.join(directory,'reviewer-password');
  try {await protectPreviewDirectory(directory);await writeFile(credentialPath,server.draftPreviewAccessToken,{mode:0o600,flag:'wx'});}
  catch(error){await server.close();await rm(directory,{recursive:true,force:true});throw error;}
  console.log('Private synthetic reviewer preview: http://127.0.0.1:'+port+(fixture==='catalog'?'/tests/catalog-preview/':'/tests/draft-preview/'));
  console.log(`Browser username: reviewer. Per-run password is in owner-only file: ${credentialPath}`);
  console.log('Read it only in your private local terminal; do not publish it or expose this port.');
  // Vite also handles SIGTERM and may exit after close; erase credentials first.
  for(const signal of ['SIGINT','SIGTERM'])process.prependOnceListener(signal,async()=>{rmSync(directory,{recursive:true,force:true});await server.close();process.exit(0);});
  // Windows TerminateProcess cannot deliver SIGTERM handlers. An IPC parent can
  // request graceful cleanup without reading or transmitting the credential.
  process.on('message',message=>{if(message==='shutdown')process.emit('SIGTERM');});
}
