import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {randomBytes,timingSafeEqual} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createServer} from 'vite';
import {startBrowser} from '../next-runtime/cdp.mjs';

const root=fileURLToPath(new URL('../../',import.meta.url));
const directory=process.env.CALCULATOR_FIRST_BROWSER_RECEIPT||'/workspace/work/calculator-first-browser';
await mkdir(directory,{recursive:true});
const cohort=[['quadratic-formula-calculator','Constant c'],['matrix-determinant-calculator','a (row 1, col 1)'],['system-of-equations-solver','c'],['matrix-inverse-calculator','b'],['complex-number-calculator','First imaginary (b)'],['vector-calculator','Aᵧ'],['sequence-calculator','Common difference (d)'],['z-score-calculator','Mean'],['confidence-interval-calculator','Estimate'],['sample-size-calculator','Expected proportion (0–1)'],['probability-calculator','Probability of A (0–1)'],['binomial-probability-calculator','Successes (k)'],['normal-distribution-calculator','Mean (μ)']];
const authorization='Basic '+Buffer.from('reviewer:'+randomBytes(32).toString('base64url')).toString('base64');
const report={createdAt:new Date().toISOString(),journeys:[],limitations:['Local Vite source fixture with actual CalculatorInteractive, account actions, presentation, and deterministic engines.','Only Supabase browser transport and Next link use existing synthetic reference fixtures; plan is Pro to observe actual save/export enabled states. No production persistence or real authentication acceptance.','Headless Chromium at emulated 360/1440 CSS-pixel widths; not physical devices or production Next runtime.']};
let server,browser;
const key=async(key,code,n,modifiers=0)=>{await browser.send('Input.dispatchKeyEvent',{type:'keyDown',key,code,windowsVirtualKeyCode:n,modifiers});await browser.send('Input.dispatchKeyEvent',{type:'keyUp',key,code,windowsVirtualKeyCode:n,modifiers});};
try{
 server=await createServer({configFile:false,envFile:false,root,publicDir:false,appType:'custom',cacheDir:path.join(directory,'vite-cache'),
  resolve:{alias:[{find:'@/lib/supabase/browser',replacement:path.join(root,'tests/release-candidate/synthetic-client.ts')},{find:'next/link',replacement:path.join(root,'tests/release-candidate/link.tsx')},{find:'@',replacement:path.join(root,'src')}]},
  define:{'process.env.NEXT_PUBLIC_SUPABASE_URL':JSON.stringify('https://synthetic.invalid'),'process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY':JSON.stringify('synthetic-reference-fixture')},
  esbuild:{jsx:'automatic'},optimizeDeps:{noDiscovery:true,include:['react','react-dom/client','react/jsx-runtime','react/jsx-dev-runtime','decimal.js','zod']},
  server:{host:'127.0.0.1',port:0,hmr:false,cors:false,fs:{strict:true,allow:[root],deny:['**/.env','**/.env.*','**/.git/**','**/.aws/**','**/.codex/**']}},
  plugins:[{name:'calculator-first-local-browser',resolveId(id){if(id==='/calculator-first-entry.tsx')return '\0calculator-first-entry.tsx';},load(id){if(id==='\0calculator-first-entry.tsx')return `import {createElement as h} from 'react';import {createRoot} from 'react-dom/client';import {CalculatorInteractive} from '/src/components/calculator-interactive';import {useCalculatorPlan} from '/src/components/use-calculator-plan';import {synthetic} from '/tests/release-candidate/synthetic-client';import '/src/app/globals.css';window.__synthetic=synthetic;const slug=new URLSearchParams(location.search).get('slug');function App(){const plan=useCalculatorPlan();return h('main',{className:'container',style:{padding:'1rem',maxWidth:1100,margin:'auto'}},h('h1',null,'Local calculator acceptance'),h('output',{id:'plan'},plan),h(CalculatorInteractive,{slug}))}createRoot(document.getElementById('root')).render(h(App));`;},configureServer(s){s.middlewares.use(async(req,res,next)=>{
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
 const baseline=new Map();
 for(const width of [360,1440])for(const [slug,zeroLabel] of cohort){
  await browser.send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width===360});
  await browser.send('Page.navigate',{url:origin+`/?slug=${slug}&plan=pro`});
  try{await browser.until('!!document.querySelector("main")',10000);}catch(error){console.error(JSON.stringify({errors:browser.errors,network:browser.network,html:await browser.js('document.documentElement.outerHTML')}));throw error;}
  await browser.until('document.querySelector("#plan")?.textContent==="pro"&&!!document.querySelector(".final-calculator-renderer")&&!!document.querySelector(".account-actions button")');
  const result=()=>browser.js('document.querySelector(".final-calculator-renderer")?.textContent');
  const initial=await result();if(baseline.has(slug))assert.equal(initial,baseline.get(slug),'Cross-viewport result parity');else baseline.set(slug,initial);
  const fields=await browser.js('[...document.querySelectorAll(".calculator-ui input[type=number]")].map((e,i)=>{e.id="numeric-"+i;return{id:e.id,value:e.value,label:e.closest("label")?.textContent.trim()}})');
  assert(fields.length>0);assert(fields.every(f=>f.label),'Every numeric control has a wrapping accessible label');
  assert.equal(await browser.js('document.documentElement.scrollWidth>innerWidth+1'),false,`${slug} ${width} initial horizontal overflow`);
  for(const field of fields){
   await browser.js(`document.getElementById(${JSON.stringify(field.id)}).focus()`);await key('a','KeyA',65,2);await key('Backspace','Backspace',8);
   await browser.until('!document.querySelector(".final-calculator-renderer")');
   assert((await browser.text()).includes('Enter valid inputs'));
   const actions=await browser.js('[...document.querySelectorAll(".account-actions button")].filter(b=>/^(Save calculation|Export CSV|Export JSON|Export PDF)$/.test(b.textContent.trim())).map(b=>({label:b.textContent.trim(),disabled:b.disabled}))');
   assert.equal(actions.length,4,'Observe actual save and all three export actions');assert(actions.every(b=>b.disabled),'Invalid inputs disable every snapshot action');
   await browser.field('#'+field.id,field.value);await browser.until('!!document.querySelector(".final-calculator-renderer")');assert.equal(await result(),initial,'Recovered result parity');
  }
  const zero=fields.find(f=>f.label===zeroLabel);assert(zero,'Known zero-valid accessible field');await browser.field('#'+zero.id,'0');await browser.until('!!document.querySelector(".final-calculator-renderer")');
  assert.equal(await browser.js('[...document.querySelectorAll(".account-actions button")].find(b=>b.textContent.trim()==="Save calculation").disabled'),false,'Explicit valid zero enables actual snapshot action');
  await browser.field('#'+zero.id,zero.value);assert.equal(await result(),initial);
  await browser.js(`document.getElementById(${JSON.stringify(fields[0].id)}).focus()`);await key('Tab','Tab',9);
  assert(await browser.js('document.activeElement!==document.body&&!!document.activeElement.closest(".calculator-ui")'),'Tab advances to a calculator control');
  assert.equal(await browser.js('document.documentElement.scrollWidth>innerWidth+1'),false,`${slug} ${width} recovered horizontal overflow`);
  assert.deepEqual(await browser.js('window.__synthetic.writes'),[],'Acceptance performs no persistence writes');
  await writeFile(path.join(directory,`${slug}-${width}.png`),Buffer.from((await browser.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true})).data,'base64'));
  report.journeys.push({slug,width,numericFields:fields.length,blankChecks:fields.length,validZeroField:zeroLabel,recoveryParity:true,keyboard:true,labels:true,noHorizontalOverflow:true,actualSnapshotActionsDisabled:true});
 }
 assert.deepEqual(browser.errors,[]);assert.deepEqual(browser.network.filter(r=>!r.allowed),[]);
 report.browserErrors=browser.errors;report.networkRequests=browser.network.length;report.passed=true;
 await writeFile(path.join(directory,'report.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({directory,journeys:report.journeys.length,blankChecks:report.journeys.reduce((n,j)=>n+j.blankChecks,0),passed:true}));
} catch(error){report.passed=false;report.error=String(error.stack||error);report.browserErrors=browser?.errors;report.network=browser?.network;await writeFile(path.join(directory,'report.json'),JSON.stringify(report,null,2)+'\n');if(browser)await writeFile(path.join(directory,'failure.png'),Buffer.from((await browser.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true})).data,'base64'));throw error;
} finally {await browser?.close();await server?.close();}
