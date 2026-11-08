import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {randomBytes,timingSafeEqual} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createServer} from 'vite';
import {startBrowser} from '../next-runtime/cdp.mjs';
import {captureFailureScreenshot,instrumentBrowser} from './failure-diagnostics.mjs';
import {journeyReadyExpression} from './journey-readiness.mjs';
import {createJourneyLifecycle} from './journey-lifecycle.mjs';

const root=fileURLToPath(new URL('../../',import.meta.url));
const directory=process.env.BATCH21_BROWSER_RECEIPT||'/workspace/work/batch21-browser';
await mkdir(directory,{recursive:true});
const candidates=['graphing-calculator','function-plotter-2d','volume-calculator','slope-calculator','standard-deviation-calculator','variance-calculator'];
const dedicated=['linear-equation-solver','rref-calculator','equation-solver','derivative-calculator','integral-calculator','limit-calculator','series-calculator','polynomial-calculator','root-finder-calculator','matrix-calculator','function-plotter-3d'];
const {readFile}=await import('node:fs/promises');
const hosted=JSON.parse(await readFile(path.join(root,'docs/calculator-first/hosted-rows.json'),'utf8'));
const launch=hosted.rows.filter(row=>row.calculator_key.startsWith('launch-')).map(row=>row.slug);
assert.equal(launch.length,118);
const extra=['momentum-calculator','pressure-calculator','density-calculator','frequency-calculator','period-calculator','wavelength-calculator','weighted-mean-calculator','percentile-calculator','quartile-calculator','coefficient-of-variation-calculator','expected-value-calculator','bayes-theorem-calculator','odds-calculator','speed-calculator','velocity-calculator','acceleration-calculator','distance-time-calculator','force-calculator','work-calculator','power-calculator','kinetic-energy-calculator','potential-energy-calculator','linear-regression-calculator','interquartile-range-calculator'];
const stats4=['linear-regression-calculator','weighted-mean-calculator','percentile-calculator','quartile-calculator','interquartile-range-calculator','coefficient-of-variation-calculator','expected-value-calculator','bayes-theorem-calculator','odds-calculator'];
const fullCohort=[...candidates,...dedicated,...launch,...extra];
const cohort=process.env.BATCH21_BROWSER_SLUGS?process.env.BATCH21_BROWSER_SLUGS.split(','):fullCohort;
const authorization='Basic '+Buffer.from('reviewer:'+randomBytes(32).toString('base64url')).toString('base64');
const report={createdAt:new Date().toISOString(),cohort,fullCohortSize:fullCohort.length,journeys:[],limitations:['Local Vite source fixture with actual CalculatorInteractive, account actions, presentation, and deterministic engines.','Only Supabase browser transport and Next link use existing synthetic reference fixtures; plan is Pro to observe actual save/export enabled states and capture actual JSON export through a fixture Blob sink. No production persistence or real authentication acceptance.','Headless Chromium at emulated 360/1440 CSS-pixel widths; not physical devices or production Next runtime.']};
let server,browser,lifecycle;
let retiredNetworkRequests=0;
let journey;
const operationTrace=[];
const key=async(key,code,n,modifiers=0)=>{await browser.send('Input.dispatchKeyEvent',{type:'keyDown',key,code,windowsVirtualKeyCode:n,modifiers});await browser.send('Input.dispatchKeyEvent',{type:'keyUp',key,code,windowsVirtualKeyCode:n,modifiers});};
try{
 server=await createServer({configFile:false,envFile:false,root,publicDir:false,appType:'custom',cacheDir:path.join(directory,'vite-cache'),
  resolve:{alias:[{find:'@/lib/supabase/browser',replacement:path.join(root,'tests/release-candidate/synthetic-client.ts')},{find:'next/link',replacement:path.join(root,'tests/release-candidate/link.tsx')},{find:'@',replacement:path.join(root,'src')}]},
  define:{'process.env.NEXT_PUBLIC_SUPABASE_URL':JSON.stringify('https://synthetic.invalid'),'process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY':JSON.stringify('synthetic-reference-fixture')},
  esbuild:{jsx:'automatic'},optimizeDeps:{noDiscovery:true,include:['react','react-dom/client','react/jsx-runtime','react/jsx-dev-runtime','decimal.js','zod']},
  server:{host:'127.0.0.1',port:0,hmr:false,cors:false,fs:{strict:true,allow:[root],deny:['**/.env','**/.env.*','**/.git/**','**/.aws/**','**/.codex/**']}},
  plugins:[{name:'calculator-first-local-browser',resolveId(id){if(id==='/calculator-first-entry.tsx')return '\0calculator-first-entry.tsx';},load(id){if(id==='\0calculator-first-entry.tsx')return `import {createElement as h} from 'react';import {createRoot} from 'react-dom/client';import {CalculatorInteractive} from '/src/components/calculator-interactive';import {useCalculatorPlan} from '/src/components/use-calculator-plan';import {synthetic} from '/tests/release-candidate/synthetic-client';import {verifyBatch21Snapshot} from '/src/lib/batch21-snapshot-replay';window.__verifyBatch21Snapshot=verifyBatch21Snapshot;import '/src/app/globals.css';window.__synthetic=synthetic;window.__downloads=[];URL.createObjectURL=blob=>{blob.text().then(text=>window.__downloads.push({type:blob.type,text}));return 'blob:local-fixture'};const slug=new URLSearchParams(location.search).get('slug');function App(){const plan=useCalculatorPlan();return h('main',{'data-calculator-slug':slug,className:'container',style:{padding:'1rem',maxWidth:1100,margin:'auto'}},h('h1',null,'Local calculator acceptance'),h('output',{id:'plan'},plan),h(CalculatorInteractive,{slug}))}createRoot(document.getElementById('root')).render(h(App));`;},configureServer(s){s.middlewares.use(async(req,res,next)=>{
   const host=`127.0.0.1:${s.httpServer.address().port}`;
   if(req.headers.host!==host||(req.headers.origin&&req.headers.origin!==`http://${host}`)){res.statusCode=403;res.end();return;}
   const received=Buffer.from(req.headers.authorization||''),expected=Buffer.from(authorization);if(received.length!==expected.length||!timingSafeEqual(received,expected)){res.statusCode=401;res.end();return;}
   if(!['GET','HEAD'].includes(req.method)){res.statusCode=405;res.end();return;}
   if(req.url.startsWith('/?')){res.setHeader('Content-Type','text/html');res.end(await s.transformIndexHtml(req.url,'<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><div id="root"></div><script type="module" src="/calculator-first-entry.tsx"></script></body></html>'));return;}next();
  });}}]});
 await server.listen();const origin=`http://127.0.0.1:${server.httpServer.address().port}`;
 assert.equal((await fetch(origin+'/?slug=probability-calculator')).status,401);
 const fixture=await fetch(origin+'/?slug=probability-calculator',{headers:{Authorization:authorization}});assert.equal(fixture.status,200);assert.match(await fixture.text(),/calculator-first-entry/);
 lifecycle=createJourneyLifecycle({maxJourneys:20,async create(){browser=instrumentBrowser(await startBrowser(origin),()=>journey,operationTrace);await browser.send('Network.setExtraHTTPHeaders',{headers:{Authorization:authorization}});return browser;},async verify(instance){assert.deepEqual(instance.errors,[]);assert.deepEqual(instance.network.filter(r=>!r.allowed),[]);retiredNetworkRequests+=instance.network.length;}});
 const baseline=new Map();
 const validExpression='!!document.querySelector(".final-calculator-renderer")||!!document.querySelector(".result-box strong")&&document.querySelector(".result-box strong").textContent!=="Enter valid inputs"';
 const actionsExpression='[...document.querySelectorAll(".account-actions button")].filter(b=>/^(Save calculation|Export CSV|Export JSON|Export PDF)$/.test(b.textContent.trim())).map(b=>({label:b.textContent.trim(),disabled:b.disabled}))';
 const invalid=async()=>{await browser.until('!('+validExpression+')');const actions=await browser.js(actionsExpression);if(actions.length){assert.equal(actions.length,4);assert(actions.every(b=>b.disabled));}return actions.length;};
 for(const width of (process.env.BATCH21_BROWSER_WIDTHS||'360,1440').split(',').map(Number))for(const slug of cohort){
  journey={slug,width};
  await lifecycle.run(journey,async()=>{
  console.log(JSON.stringify(journey));
  await browser.send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width===360});
  const url=origin+`/?slug=${slug}&plan=pro`;
  await browser.send('Page.navigate',{url});
  await browser.until(journeyReadyExpression(url,slug));
  await browser.until(validExpression);
  if(candidates.includes(slug)||stats4.includes(slug))await browser.until('[...document.querySelectorAll(".account-actions button")].some(b=>b.textContent.trim()==="Export JSON"&&!b.disabled)');
  const result=()=>browser.js('document.querySelector(".final-calculator-renderer")?.textContent??document.querySelector(".result-box")?.textContent');
  const initial=await result();if(baseline.has(slug))assert.equal(initial,baseline.get(slug),'Cross-viewport result parity');else baseline.set(slug,initial);
  if(stats4.includes(slug))assert.equal((await browser.js(actionsExpression)).length,4,'Stats4 workflow exposes actual snapshot controls');
  const fields=await browser.js('[...document.querySelectorAll(".calculator-ui input:not([type=checkbox]):not([type=radio]), .calculator-ui textarea")].filter(e=>!e.closest(".account-actions")).map((e,i)=>{e.id="field-"+i;return{id:e.id,value:e.value,type:e.type,label:e.closest("label")?.textContent.trim()}})');
  assert(fields.length>0);assert(fields.every(f=>f.label),'Every input has a wrapping accessible label');
  assert.equal(await browser.js('document.documentElement.scrollWidth>innerWidth+1'),false,`${slug} ${width} initial horizontal overflow`);
  let blankChecks=0,accountChecks=0,zeroChecks=0,malformedChecks=0;
  for(const field of fields.filter(f=>f.value.trim()!=='')){
   await browser.js(`document.getElementById(${JSON.stringify(field.id)}).focus()`);await key('a','KeyA',65,2);await key('Backspace','Backspace',8);
   accountChecks+=await invalid();blankChecks++;
   await browser.field('#'+field.id,field.value);await browser.until(validExpression);assert.equal(await result(),initial,'Recovered result parity');
   if(candidates.includes(slug)&&field.type!=='number'){await browser.field('#'+field.id,'not valid');accountChecks+=await invalid();malformedChecks++;await browser.field('#'+field.id,field.value);await browser.until(validExpression);assert.equal(await result(),initial);}
   if(field.type==='number'){
    await browser.field('#'+field.id,'0');
    // Zero is deliberately observed rather than assumed valid for positive-only dimensions or denominators.
    if(await browser.js(validExpression))zeroChecks++;
    else await invalid();
    await browser.field('#'+field.id,field.value);await browser.until(validExpression);
   }
  }
  if(candidates.includes(slug)){
   await browser.js('[...document.querySelectorAll(".account-actions button")].find(b=>b.textContent.trim()==="Export JSON").click()');
   await browser.until('window.__downloads.length>0');
   const capture=JSON.parse((await browser.js('window.__downloads.find(d=>d.type.includes("json")).text')));
   assert.equal(await browser.js('window.__verifyBatch21Snapshot(JSON.parse(window.__downloads.find(d=>d.type.includes("json")).text)).engineVersion'),capture.calculatorVersion);assert.equal(capture.calculatorSlug,slug);assert(Number.isInteger(capture.calculatorVersion));assert(capture.input&&capture.output);assert(Array.isArray(capture.output.steps)&&capture.output.steps.length>0,'Raw deterministic steps remain in account capture');
   if(slug==='graphing-calculator'||slug==='function-plotter-2d'){assert.equal(capture.output.points.length,81);assert.equal(capture.output.minimum,0);assert.equal(capture.output.maximum,25);}
   if(slug==='volume-calculator'){assert.equal(capture.output.volume,24);assert.equal(capture.output.surfaceArea,52);}
   if(slug==='slope-calculator'){assert.equal(capture.calculatorVersion,2);assert.equal(capture.output.value,2);assert.equal(capture.output.dx,2);assert.equal(capture.output.dy,4);}
   if(slug==='standard-deviation-calculator'||slug==='variance-calculator'){assert.equal(capture.output.variance,19/16);assert.equal(capture.output.mean,2.25);assert.equal(capture.output.count,4);assert.equal(capture.input.kind,'population');}
   await writeFile(path.join(directory,`${slug}-${width}-snapshot.json`),JSON.stringify(capture,null,2));
  }
  if(slug==='standard-deviation-calculator'||slug==='variance-calculator'){
   await browser.js('document.querySelector(".calculator-ui select").focus()');await key('End','End',35);await key('Tab','Tab',9);
   await browser.until('document.querySelector(".calculator-ui select").value==="sample"');
   await browser.js('[...document.querySelectorAll(".account-actions button")].find(b=>b.textContent.trim()==="Export JSON").click()');
   await browser.until('window.__downloads.length===2');
   const sample=JSON.parse(await browser.js('window.__downloads[1].text'));assert.equal(sample.input.kind,'sample');assert.equal(sample.output.kind,'sample');assert.equal(sample.output.variance,19/12);
   await writeFile(path.join(directory,`${slug}-${width}-sample-snapshot.json`),JSON.stringify(sample,null,2));
  }
  if(candidates.includes(slug)&&process.env.BATCH21_SCENARIO_UI==='1'){
   await browser.js('document.querySelector(".calculator-scenarios > details").open=true');
   await browser.click('Capture baseline A');
   await browser.until('[...document.querySelectorAll("button")].some(b=>b.textContent.trim()==="Export scenario set JSON")');
   const count=await browser.js('window.__downloads.length');await browser.click('Export scenario set JSON');await browser.until(`window.__downloads.length>${count}`);
   const setText=await browser.js(`window.__downloads[${count}].text`);const set=JSON.parse(setText);assert.equal(set.calculatorSlug,slug);assert.equal(set.scenarios.length,1);
   await browser.js('document.querySelector(".scenario-recovery").open=true;document.querySelector(".scenario-recovery textarea").id="recover-json"');
   await browser.field('#recover-json',setText);await browser.click('Verify and recover scenario set');
   await browser.until('document.body.innerText.includes("Recovered 1 verified scenario as a separate working set")');
   await writeFile(path.join(directory,`${slug}-${width}-scenario-set.json`),setText);
  }
  if(slug==='graphing-calculator'||slug==='function-plotter-2d'){
   await browser.field('#'+fields[0].id,'1/x');await browser.until(validExpression);
   const lines=await browser.js('[...document.querySelectorAll(".calculator-ui svg path, .calculator-ui svg polyline")].map(e=>({tag:e.tagName,data:e.getAttribute("d")||e.getAttribute("points")}))');
   const segmentCount=lines.reduce((n,l)=>n+(l.tag==='path'?(l.data.match(/M/g)||[]).length:1),0);
   assert(segmentCount>=2,'Reciprocal graph has separate SVG segments across undefined sample');
   for(const line of lines){
    const points=line.tag==='path'?[...line.data.matchAll(/([ML])\s*([-\d.]+)[ ,]+([-\d.]+)/g)].map(m=>({move:m[1]==='M',x:Number(m[2])})) : line.data.trim().split(/\s+/).map((p,i)=>({move:i===0,x:Number(p.split(',')[0])}));
    assert(points.length>1,'Graph path coordinates parsed');for(let i=1;i<points.length;i++)if(!points[i].move)assert(!(points[i-1].x<50&&points[i].x>50),'No SVG line bridges the reciprocal sampled gap');
   }
   await writeFile(path.join(directory,`${slug}-${width}-gap.json`),JSON.stringify({expression:'1/x',lines},null,2));
  }
  await browser.js(`document.getElementById(${JSON.stringify(fields[0].id)}).focus()`);await key('Tab','Tab',9);
  assert(await browser.js('document.activeElement!==document.body&&!!document.activeElement.closest(".calculator-ui")'),'Tab advances to a calculator control');
  assert.equal(await browser.js('document.documentElement.scrollWidth>innerWidth+1'),false,`${slug} ${width} recovered horizontal overflow`);
  assert.deepEqual(await browser.js('window.__synthetic.writes'),[],'Acceptance performs no persistence writes');
  if(candidates.includes(slug))await writeFile(path.join(directory,`${slug}-${width}.png`),Buffer.from((await browser.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true})).data,'base64'));
  report.journeys.push({slug,width,initialRendererText:initial,fields:fields.length,blankChecks,malformedChecks,validZeroChecks:zeroChecks,recoveryParity:true,keyboard:true,labels:true,noHorizontalOverflow:true,actualSnapshotDisabledChecks:accountChecks,scenarioCaptureExportRecover:candidates.includes(slug)&&process.env.BATCH21_SCENARIO_UI==='1'});
  });
 }
 assert.deepEqual(browser.errors,[]);assert.deepEqual(browser.network.filter(r=>!r.allowed),[]);
 report.browserErrors=browser.errors;report.networkRequests=retiredNetworkRequests+browser.network.length;report.browserSessionJourneyLimit=20;report.passed=true;
 await writeFile(path.join(directory,'report.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({directory,journeys:report.journeys.length,blankChecks:report.journeys.reduce((n,j)=>n+j.blankChecks,0),passed:true}));
} catch(error){report.operationFailures=operationTrace;report.failedJourney=journey;report.passed=false;report.error=String(error.stack||error);report.browserErrors=browser?.errors;report.network=browser?.network;console.error(report.error);await writeFile(path.join(directory,'report.json'),JSON.stringify(report,null,2)+'\n');await captureFailureScreenshot(browser,bytes=>writeFile(path.join(directory,'failure.png'),bytes),report);await writeFile(path.join(directory,'report.json'),JSON.stringify(report,null,2)+'\n');throw error;
} finally {if(lifecycle)await lifecycle.close();else await browser?.close();await server?.close();}
