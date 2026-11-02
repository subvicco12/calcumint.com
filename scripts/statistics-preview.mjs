import {createServer} from 'vite';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import os from 'node:os';
import {randomBytes,timingSafeEqual} from 'node:crypto';
import {mkdtemp,writeFile,readFile,rm} from 'node:fs/promises';
import {protectPreviewDirectory} from './private-preview-credentials.mjs';
import {createServer as createPortProbe} from 'node:net';

/** Local reviewer tool only; no production route, account identity or persistence authority. */
export async function startStatisticsPreview({port=0}={}){
 if(!Number.isSafeInteger(port)||port<0||port>65535)throw Error('Invalid private preview port');
 // Vite treats 0 as its default 5173, so allocate an actual ephemeral loopback port.
 if(port===0){const probe=createPortProbe();await new Promise((resolve,reject)=>{probe.once('error',reject);probe.listen(0,'127.0.0.1',resolve);});port=probe.address().port;await new Promise((resolve,reject)=>probe.close(error=>error?reject(error):resolve()));}
 const root=fileURLToPath(new URL('../',import.meta.url));
 const password=randomBytes(32).toString('base64url');
 const authorization='Basic '+Buffer.from('reviewer:'+password).toString('base64');
 const expected=Buffer.from(authorization),cacheDir=await mkdtemp(path.join(os.tmpdir(),'statistics-preview-cache-'));
 const requests=[];
 let server;
 try{
  server=await createServer({configFile:false,envFile:false,root,publicDir:false,appType:'custom',cacheDir,
   resolve:{alias:{'@':path.join(root,'src')}},esbuild:{jsx:'automatic'},
   optimizeDeps:{noDiscovery:true,include:['react','react-dom/client','react/jsx-runtime','react/jsx-dev-runtime','decimal.js','zod']},
   server:{host:'127.0.0.1',port,strictPort:true,hmr:false,cors:false,fs:{strict:true,allow:[root],deny:['**/.env','**/.env.*','**/.git/**','**/.aws/**','**/.codex/**']}},
   plugins:[{name:'isolated-statistics-authorization',configureServer(s){s.middlewares.use(async(req,res,next)=>{
    res.once('finish',()=>{if(requests.length===512)requests.shift();requests.push({path:req.url?.split('?')[0],status:res.statusCode});});
    const address=s.httpServer?.address(),host=typeof address==='object'&&address?`127.0.0.1:${address.port}`:null;
    res.setHeader('Cache-Control','no-store');res.setHeader('Referrer-Policy','no-referrer');res.setHeader('X-Frame-Options','DENY');res.setHeader('X-Content-Type-Options','nosniff');
    if(!host||req.headers.host!==host||(req.headers.origin&&req.headers.origin!==`http://${host}`)){res.statusCode=403;res.end('Private origin required');return;}
    const received=Buffer.from(req.headers.authorization||'');
    if(received.length!==expected.length||!timingSafeEqual(received,expected)){res.statusCode=401;res.setHeader('WWW-Authenticate','Basic realm="Private statistics review", charset="UTF-8"');res.end('Reviewer authentication required');return;}
    if(!['GET','HEAD'].includes(req.method)){res.statusCode=405;res.setHeader('Allow','GET, HEAD');res.end('Read-only preview');return;}
    if(['/tests/statistics-workbench/','/tests/statistics-workbench/index.html'].includes(req.url?.split('?')[0])){
     try{const html=await readFile(path.join(root,'tests/statistics-workbench/index.html'),'utf8');res.setHeader('Content-Type','text/html; charset=utf-8');res.end(req.method==='HEAD'?'':await s.transformIndexHtml(req.url,html));}catch(error){next(error);}return;
    }
    next();
   });}}]});
  await server.listen();
  const address=server.httpServer.address();
  return {server,requests,origin:`http://127.0.0.1:${address.port}`,authorization,password,close:async()=>{try{await server.close();}finally{await rm(cacheDir,{recursive:true,force:true});}}};
 }catch(error){try{await server?.close();}finally{await rm(cacheDir,{recursive:true,force:true});}throw error;}
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 const fixture=await startStatisticsPreview({port:4183});
 const directory=await mkdtemp(path.join(os.tmpdir(),'statistics-preview-credentials-'));
 await protectPreviewDirectory(directory);
 const credentialPath=path.join(directory,'password.txt');await writeFile(credentialPath,fixture.password,{mode:0o600});
 console.log(`Private statistics review: ${fixture.origin}/tests/statistics-workbench/`);
 console.log(`Username: reviewer. Password is in owner-only file: ${credentialPath}`);
 console.log('No public route or production account is involved. Do not expose this port.');
 for(const signal of ['SIGINT','SIGTERM'])process.prependOnceListener(signal,async()=>{await rm(directory,{recursive:true,force:true});await fixture.close();process.exit(0);});
}
