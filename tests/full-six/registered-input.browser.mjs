import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {randomBytes,timingSafeEqual} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createServer} from 'vite';
import {startBrowser} from '../next-runtime/cdp.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url));
const directory=process.env.FULL_SIX_BROWSER_RECEIPT||'/tmp/full-six-input-browser';
await mkdir(directory,{recursive:true});
const authorization='Basic '+Buffer.from('reviewer:'+randomBytes(32).toString('base64url')).toString('base64');
const report={scope:'Actual local CalculatorInteractive/account controls; synthetic account transport, not genuine auth or production acceptance',journeys:[],passed:false};
let server,browser;
try{
 server=await createServer({configFile:false,envFile:false,root,publicDir:false,appType:'custom',cacheDir:path.join(directory,'vite-cache'),
  resolve:{alias:[{find:'@/lib/supabase/browser',replacement:path.join(root,'tests/release-candidate/synthetic-client.ts')},{find:'next/link',replacement:path.join(root,'tests/release-candidate/link.tsx')},{find:'@',replacement:path.join(root,'src')}]},
  define:{'process.env.NEXT_PUBLIC_SUPABASE_URL':JSON.stringify('https://synthetic.invalid'),'process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY':JSON.stringify('synthetic-reference-fixture')},
  esbuild:{jsx:'automatic'},optimizeDeps:{noDiscovery:true,include:['react','react-dom/client','react/jsx-runtime','react/jsx-dev-runtime','decimal.js','zod']},
  server:{host:'127.0.0.1',port:0,hmr:false,cors:false,fs:{strict:true,allow:[root],deny:['**/.env','**/.env.*','**/.git/**','**/.aws/**','**/.codex/**']}},
  plugins:[{name:'calculator-first-local-browser',resolveId(id){if(id==='/calculator-first-entry.tsx')return '\0calculator-first-entry.tsx';},load(id){if(id==='\0calculator-first-entry.tsx')return `import {createElement as h} from 'react';import {createRoot} from 'react-dom/client';import {CalculatorInteractive} from '/src/components/calculator-interactive';import {useCalculatorPlan} from '/src/components/use-calculator-plan';import {synthetic} from '/tests/release-candidate/synthetic-client';import {verifyBatch21Snapshot} from '/src/lib/batch21-snapshot-replay';window.__verifyBatch21Snapshot=verifyBatch21Snapshot;import '/src/app/globals.css';window.__synthetic=synthetic;window.__downloads=[];URL.createObjectURL=blob=>{blob.text().then(text=>window.__downloads.push({type:blob.type,text}));return 'blob:local-fixture'};const slug=new URLSearchParams(location.search).get('slug');function App(){const plan=useCalculatorPlan();return h('main',{className:'container',style:{padding:'1rem',maxWidth:1100,margin:'auto'}},h('h1',null,'Local calculator acceptance'),h('output',{id:'plan'},plan),h(CalculatorInteractive,{slug}))}createRoot(document.getElementById('root')).render(h(App));`;},configureServer(s){s.middlewares.use(async(req,res,next)=>{
   const host=`127.0.0.1:${s.httpServer.address().port}`;
   if(req.headers.host!==host||(req.headers.origin&&req.headers.origin!==`http://${host}`)){res.statusCode=403;res.end();return;}
   const received=Buffer.from(req.headers.authorization||''),expected=Buffer.from(authorization);if(received.length!==expected.length||!timingSafeEqual(received,expected)){res.statusCode=401;res.end();return;}
   if(!['GET','HEAD'].includes(req.method)){res.statusCode=405;res.end();return;}
   if(req.url.startsWith('/?')){res.setHeader('Content-Type','text/html');res.end(await s.transformIndexHtml(req.url,'<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><div id="root"></div><script type="module" src="/calculator-first-entry.tsx"></script></body></html>'));return;}next();
  });}}]});
 await server.listen();const origin=`http://127.0.0.1:${server.httpServer.address().port}`;
 assert.equal((await fetch(origin+'/?slug=probability-calculator')).status,401);
 const fixture=await fetch(origin+'/?slug=probability-calculator',{headers:{Authorization:authorization}});assert.equal(fixture.status,200);assert.match(await fixture.text(),/calculator-first-entry/);
 browser=await startBrowser(origin);await browser.send('Network.setExtraHTTPHeaders',{headers:{Authorization:authorization}});
 for(const width of [360,1440])for(const plan of ['free','pro','business']){
  await browser.send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width===360});
  await browser.send('Page.navigate',{url:origin+'/?slug=percentage-of-value-calculator&plan='+plan});
  await browser.until('document.querySelector("#plan")?.textContent==='+JSON.stringify(plan)+'&&!!document.querySelector(".final-calculator-renderer")');
  await browser.js('[...document.querySelectorAll("label")].find(e=>e.querySelector("span")?.textContent==="Value").querySelector("input").id="lossy-value"');
  const initial=await browser.js('document.querySelector(".final-calculator-renderer").textContent');
  for(const text of ['9007199254740993','1e-400','0.10000000000000001']){
   await browser.field('#lossy-value',text);
   await browser.until('!document.querySelector(".final-calculator-renderer")');
   assert.equal(await browser.js('document.querySelector("#lossy-value").value'),text,'Keep rejected caller text');
   const buttons=await browser.js('[...document.querySelectorAll(".account-actions button")].filter(b=>/^(Save calculation|Export CSV|Export JSON|Export PDF)$/.test(b.textContent.trim())).map(b=>({label:b.textContent.trim(),disabled:b.disabled}))');
   assert.deepEqual(buttons.map(b=>b.label),plan==='free'?['Save calculation']:['Save calculation','Export CSV','Export JSON','Export PDF']);
   assert(buttons.every(b=>b.disabled),'Every offered save/export action is denied for invalid values');
   await browser.field('#lossy-value','0');await browser.until('!!document.querySelector(".final-calculator-renderer")');
   assert.match(await browser.js('document.querySelector(".final-calculator-renderer").textContent'),/0/);
   await browser.field('#lossy-value','250');await browser.until('!!document.querySelector(".final-calculator-renderer")');
   assert.equal(await browser.js('document.querySelector(".final-calculator-renderer").textContent'),initial,'Original result recovers');
   report.journeys.push({width,plan,rejectedInput:text,retainedText:true,saveExportDenied:true,zeroRecovery:true,originalResultRecovered:true});
  }
 }
 assert.deepEqual(browser.errors,[]);report.passed=true;
 await writeFile(path.join(directory,'receipt.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({passed:true,journeys:report.journeys.length,directory}));
}finally{await browser?.close();await server?.close();}
