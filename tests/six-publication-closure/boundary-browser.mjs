import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {randomBytes,timingSafeEqual} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createServer} from 'vite';
import {startBrowser} from '../next-runtime/cdp.mjs';

const root=fileURLToPath(new URL('../../',import.meta.url));
const directory=process.env.SIX_BOUNDARY_BROWSER_RECEIPT||'/workspace/work/six-boundary-browser';
await mkdir(directory,{recursive:true});
const cases=[
 {slug:'volume-calculator',fields:{Length:'1e-200',Width:'1e-200',Height:'1e-200'}},
 {slug:'slope-calculator',fields:{x1:'0',y1:'0',x2:'1e100',y2:'1e-300'}},
 {slug:'standard-deviation-calculator',fields:{Dataset:'1e-200, 2e-200'}},
 {slug:'variance-calculator',fields:{Dataset:'1e-200, 2e-200'}}
];
const fullCohort=cases.map(c=>c.slug),cohort=fullCohort;
const authorization='Basic '+Buffer.from('reviewer:'+randomBytes(32).toString('base64url')).toString('base64');
const report={createdAt:new Date().toISOString(),cohort,fullCohortSize:fullCohort.length,journeys:[],limitations:['Local Vite source fixture with actual CalculatorInteractive, account actions, presentation, and deterministic engines.','Only Supabase browser transport and Next link use existing synthetic reference fixtures; plan is Pro to observe actual save/export enabled states ; invalid-state controls are checked only where mounted. No production persistence or real authentication acceptance.','Headless Chromium at emulated 360/1440 CSS-pixel widths; not physical devices or production Next runtime.']};
let server,browser;

try{
 server=await createServer({configFile:false,envFile:false,root,publicDir:false,appType:'custom',cacheDir:path.join(directory,'vite-cache'),
  resolve:{alias:[{find:'@/lib/supabase/browser',replacement:path.join(root,'tests/release-candidate/synthetic-client.ts')},{find:'next/link',replacement:path.join(root,'tests/release-candidate/link.tsx')},{find:'@',replacement:path.join(root,'src')}]},
  define:{'process.env.NEXT_PUBLIC_SUPABASE_URL':JSON.stringify('https://synthetic.invalid'),'process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY':JSON.stringify('synthetic-reference-fixture')},
  esbuild:{jsx:'automatic'},optimizeDeps:{noDiscovery:true,include:['react','react-dom/client','react/jsx-runtime','react/jsx-dev-runtime','decimal.js','zod']},
  server:{host:'127.0.0.1',port:0,hmr:false,cors:false,fs:{strict:true,allow:[root],deny:['**/.env','**/.env.*','**/.git/**','**/.aws/**','**/.codex/**']}},
  plugins:[{name:'calculator-first-local-browser',resolveId(id){if(id==='/calculator-first-entry.tsx')return '\0calculator-first-entry.tsx';},load(id){if(id==='\0calculator-first-entry.tsx')return `import {createElement as h} from 'react';import {createRoot} from 'react-dom/client';import {CalculatorInteractive} from '/src/components/calculator-interactive';import {useCalculatorPlan} from '/src/components/use-calculator-plan';import {synthetic} from '/tests/release-candidate/synthetic-client';import {verifyRegisteredSnapshot} from '/src/lib/registered-snapshot-verification';window.__verifyRegisteredSnapshot=verifyRegisteredSnapshot;import '/src/app/globals.css';window.__synthetic=synthetic;window.__downloads=[];URL.createObjectURL=blob=>{blob.text().then(text=>window.__downloads.push({type:blob.type,text}));return 'blob:local-fixture'};const slug=new URLSearchParams(location.search).get('slug');function App({slug}){const plan=useCalculatorPlan();return h('main',{'data-slug':slug,className:'container',style:{padding:'1rem',maxWidth:1100,margin:'auto'}},h('h1',null,'Local calculator acceptance'),h('output',{id:'plan'},plan),h(CalculatorInteractive,{slug}))}const mount=createRoot(document.getElementById('root'));window.__renderCalculator=slug=>mount.render(h(App,{key:slug,slug}));window.__renderCalculator(slug);`;},configureServer(s){s.middlewares.use(async(req,res,next)=>{
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
 for(const width of [360,1440])for(const {slug,fields}of cases){
  await browser.send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width===360});
  if(!report.journeys.length)await browser.send('Page.navigate',{url:origin+`/?slug=${slug}&plan=pro`});else await browser.js(`window.__renderCalculator(${JSON.stringify(slug)})`);
  await browser.until(`document.querySelector('main')?.dataset.slug===${JSON.stringify(slug)}&&document.querySelector('#plan')?.textContent==='pro'&&!!document.querySelector('.final-calculator-renderer')`);
  const originals=[];
  for(const [label,value]of Object.entries(fields)){
   const saved=await browser.js(`(()=>{const label=[...document.querySelectorAll('.calculator-ui label')].find(e=>e.textContent.trim()===${JSON.stringify(label)});if(!label)throw Error('Missing label');const input=label.querySelector('input');input.id='boundary-'+${JSON.stringify(label)};return {id:input.id,value:input.value}})()`);
   originals.push(saved);await browser.field('#'+saved.id,value);
  }
  await browser.until(`!!document.querySelector('[role=alert]')&&document.querySelector('[role=alert]').textContent.includes('numeric precision')&&!document.querySelector('.final-calculator-renderer')`);
  const controls=await browser.js(`[...document.querySelectorAll('.account-actions button')].filter(b=>/^(Save calculation|Export CSV|Export JSON|Export PDF)$/.test(b.textContent.trim())).map(b=>({disabled:b.disabled}))`);assert.equal(controls.length,4);assert(controls.every(c=>c.disabled));
  assert.equal(await browser.js('document.documentElement.scrollWidth>innerWidth+1'),false);
  for(const saved of originals)await browser.field('#'+saved.id,saved.value);
  await browser.until(`!!document.querySelector('.final-calculator-renderer')`);assert.deepEqual(await browser.js('window.__synthetic.writes'),[]);
  report.journeys.push({slug,width,underflowRefused:true,disabledControls:4,recovery:true,overflow:false,productionWrites:false});
 }
 assert.deepEqual(browser.errors,[]);assert.deepEqual(browser.network.filter(r=>!r.allowed),[]);
 report.browserErrors=browser.errors;report.passed=true;
 await writeFile(path.join(directory,'report.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({journeys:report.journeys.length,passed:true}));
} catch(error){report.passed=false;report.error=String(error.stack||error);await writeFile(path.join(directory,'report.json'),JSON.stringify(report,null,2)+'\n');throw error;
}finally{await browser?.close();await server?.close();}
