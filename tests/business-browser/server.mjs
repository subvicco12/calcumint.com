import {createServer} from 'vite';
import {createServer as httpServer} from 'node:http';
import path from 'node:path';
import {readFile} from 'node:fs/promises';
import {randomBytes,timingSafeEqual} from 'node:crypto';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
export async function startBusinessPreview(){
 const root=process.cwd(),adapter=path.join(root,'tests/business-browser/transport.tsx');
 const vite=await createServer({root,configFile:false,envFile:false,appType:'custom',publicDir:false,esbuild:{jsx:'automatic'},optimizeDeps:{noDiscovery:true,include:['react','react-dom/client','react/jsx-runtime','react/jsx-dev-runtime','zod','next/image']},server:{middlewareMode:true,hmr:false,ws:false,fs:{strict:true,allow:[root],deny:['**/.env','**/.env.*','**/.git/**','**/.aws/**','**/.codex/**']}},resolve:{alias:[...['@/lib/supabase/server','@/lib/supabase/admin','next/link','next/navigation','next/cache'].map(find=>({find,replacement:adapter})),{find:'@',replacement:path.join(root,'src')}]}});
 const transport=await vite.ssrLoadModule('/tests/business-browser/transport.tsx');
 const pages={workspace:(await vite.ssrLoadModule('/src/app/business/page.tsx')).default,api:(await vite.ssrLoadModule('/src/app/business/api/page.tsx')).default};
 const actions={...(await vite.ssrLoadModule('/src/app/business/actions.ts')),...(await vite.ssrLoadModule('/src/app/business/api/actions.ts'))};
 const css=(await readFile(path.join(root,'src/app/globals.css'),'utf8')).replace('@import "tailwindcss";','');
 const priorEmbedSecret=process.env.EMBED_SESSION_SECRET;process.env.EMBED_SESSION_SECRET=randomBytes(32).toString('hex');
 const {issueEmbedSession}=await vite.ssrLoadModule('/src/lib/embeds/session.ts');
 const embedToken=issueEmbedSession({configId:'11111111-1111-4111-8111-111111111111',organizationId:'33333333-3333-4333-8333-333333333333',calculatorId:'22222222-2222-4222-8222-222222222222',version:1},process.env.EMBED_SESSION_SECRET);
 const routes={};for(const name of ['events','leads','session'])routes[name]=(await vite.ssrLoadModule(`/src/app/api/embed/[key]/${name}/route.ts`)).POST;
 const token=randomBytes(32).toString('hex'),expected=Buffer.from('Bearer '+token);
 const server=httpServer(async(req,res)=>{try{
  const host=`127.0.0.1:${server.address().port}`;if(req.headers.host!==host||(req.headers.origin&&req.headers.origin!==`http://${host}`)){res.writeHead(403);res.end();return}
  if(!['GET','POST'].includes(req.method)){res.writeHead(405);res.end();return}
  const supplied=Buffer.from(req.headers.authorization||'');if(supplied.length!==expected.length||!timingSafeEqual(supplied,expected)){res.writeHead(401);res.end();return}
  const url=new URL(req.url,'http://127.0.0.1');res.setHeader('Cache-Control','no-store');
  if(url.pathname==='/actual.css'){res.setHeader('Content-Type','text/css');res.end(css);return}
  if(url.pathname==='/embed-review'){res.setHeader('Content-Type','text/html; charset=utf-8');res.end(`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/actual.css"></head><body><div id="root"></div><script>window.process={env:{}};window.__embedToken=${JSON.stringify(embedToken)}</script><script type="module" src="/tests/business-browser/embed.tsx"></script></body></html>`);return}
  const embedRoute=url.pathname.match(/^\/api\/embed\/review-embed\/(events|leads|session)$/);if(embedRoute){let body='';for await(const chunk of req)body+=chunk;const response=await routes[embedRoute[1]](new Request(`http://${host}${req.url}`,{method:'POST',headers:req.headers,body}),{params:Promise.resolve({key:'review-embed'})});res.writeHead(response.status,Object.fromEntries(response.headers));res.end(await response.text());return}
  if(/^\/(?:@|src\/|tests\/|node_modules\/)/.test(url.pathname)){vite.middlewares(req,res,()=>{res.writeHead(404);res.end()});return}
  if(req.method==='POST'&&url.pathname==='/action'){let body='';for await(const chunk of req)body+=chunk;const {name,entries}=JSON.parse(body);if(!actions[name])throw Error('Unknown action');const data=new FormData();for(const [k,v]of entries)data.append(k,v);let result={};try{await actions[name](data)}catch(e){if(e.redirect)result={redirect:e.redirect};else result={error:e.message}}res.setHeader('Content-Type','application/json');res.end(JSON.stringify(result));return}
  const page=url.pathname==='/business/api'?pages.api:pages.workspace;
  let tree=await page({searchParams:Promise.resolve(Object.fromEntries(url.searchParams))});
  // Only Next form dispatch is adapted. Preserve actual page fields and execute actual action exports.
  function forms(node){if(!React.isValidElement(node))return node;const props={...node.props};if(typeof props.action==='function'){props['data-local-action']=Object.keys(actions).find(k=>actions[k]===props.action);props.action=undefined;}if(props.children)props.children=React.Children.map(props.children,forms);return React.cloneElement(node,props)}
  res.setHeader('Content-Type','text/html; charset=utf-8');res.end('<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/actual.css"></head><body>'+renderToStaticMarkup(forms(tree))+`<p id="action-result" role="status"></p><script>document.addEventListener('submit',async e=>{e.preventDefault();const f=e.target;const r=await fetch('/action',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:f.dataset.localAction,entries:[...new FormData(f)]})});const result=await r.json();document.querySelector('#action-result').textContent=result.error||'Action completed';if(result.redirect)location.href=result.redirect;});window.ready=true;</script></body></html>`);
 }catch(e){if(e.redirect){res.writeHead(302,{Location:e.redirect});res.end()}else{res.writeHead(500);res.end(e.stack)}}});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));return {url:`http://127.0.0.1:${server.address().port}`,token,state:transport.state,close:async()=>{await new Promise(r=>server.close(r));await vite.close();if(priorEmbedSecret===undefined)delete process.env.EMBED_SESSION_SECRET;else process.env.EMBED_SESSION_SECRET=priorEmbedSecret}};
}
