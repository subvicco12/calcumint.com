import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {randomBytes,timingSafeEqual} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createServer} from 'vite';
import {startBrowser} from '../next-runtime/cdp.mjs';

const root=fileURLToPath(new URL('../../',import.meta.url));
const directory=process.env.BATCH22_BROWSER_RECEIPT||'/workspace/work/batch22-browser';
await mkdir(directory,{recursive:true});
const {readFile}=await import('node:fs/promises');
const hosted=JSON.parse(await readFile(path.join(root,'docs/calculator-first/hosted-rows.json'),'utf8'));
const previous=JSON.parse(await readFile(path.join(root,'docs/full-product-batch21/validation.json'),'utf8')).browser.journeys;
const closed=JSON.parse(await readFile(path.join(root,'docs/calculator-first/engineering-closure.json'),'utf8')).affectedCalculators;
const publicRows=hosted.rows.filter(row=>row.lifecycle==='published');
const prior=new Set([...previous.map(row=>row.slug),...closed.map(row=>row.slug)]);
const fullCohort=publicRows.filter(row=>!prior.has(row.slug)).map(row=>row.slug).sort();
assert.equal(publicRows.length,209);assert.equal(new Set(previous.map(row=>row.slug)).size,159);assert.equal(closed.length,13);assert.equal(fullCohort.length,43);
assert.deepEqual(fullCohort,["angular-velocity-calculator", "beer-lambert-law-calculator", "capacitance-calculator", "combination-calculator", "concrete-calculator", "correlation-calculator", "coulomb-force-calculator", "current-calculator", "dilution-calculator", "drywall-calculator", "electrical-power-calculator", "flooring-calculator", "free-fall-calculator", "gas-density-calculator", "half-life-calculator", "ideal-gas-law-calculator", "lumber-calculator", "mean-median-mode-range-calculator", "molality-calculator", "molarity-calculator", "molecular-weight-calculator", "moles-calculator", "nernst-equation-calculator", "ohms-law-calculator", "paint-calculator", "percent-composition-calculator", "percentage-of-value-calculator", "permutation-calculator", "ph-calculator", "projectile-motion-calculator", "resistance-calculator", "right-triangle-calculator", "roofing-calculator", "solution-concentration-calculator", "square-footage-calculator", "stoichiometry-calculator", "surface-area-calculator", "tile-calculator", "titration-calculator", "torque-calculator", "triangle-calculator", "unit-conversion-calculator", "voltage-calculator"]);
const physics11=["angular-velocity", "capacitance", "coulomb-force", "current", "electrical-power", "free-fall", "ohms-law", "projectile-motion", "resistance", "torque", "voltage"].map(name=>name+"-calculator");
const cohort=fullCohort;
const authorization='Basic '+Buffer.from('reviewer:'+randomBytes(32).toString('base64url')).toString('base64');
const report={createdAt:new Date().toISOString(),cohort,fullCohortSize:fullCohort.length,journeys:[],limitations:['Local Vite source fixture with actual CalculatorInteractive, account actions, presentation, and deterministic engines.','Only Supabase browser transport and Next link use existing synthetic reference fixtures; plan is Pro to observe actual save/export enabled states ; invalid-state controls are checked only where mounted. No production persistence or real authentication acceptance.','Headless Chromium at emulated 360/1440 CSS-pixel widths; not physical devices or production Next runtime.']};
let server,browser;
const key=async(key,code,n,modifiers=0)=>{await browser.send('Input.dispatchKeyEvent',{type:'keyDown',key,code,windowsVirtualKeyCode:n,modifiers});await browser.send('Input.dispatchKeyEvent',{type:'keyUp',key,code,windowsVirtualKeyCode:n,modifiers});};
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
 const baseline=new Map();
 const validExpression='!!document.querySelector(".final-calculator-renderer")||!!document.querySelector(".result-box strong")&&document.querySelector(".result-box strong").textContent!=="Enter valid inputs"';
 const actionsExpression='[...document.querySelectorAll(".account-actions button")].filter(b=>/^(Save calculation|Export CSV|Export JSON|Export PDF)$/.test(b.textContent.trim())).map(b=>({label:b.textContent.trim(),disabled:b.disabled}))';
 const invalid=async()=>{await browser.until('!('+validExpression+')');const actions=await browser.js(actionsExpression);if(actions.length){assert.equal(actions.length,4);assert(actions.every(b=>b.disabled));}return actions.length;};
 for(const width of (process.env.BATCH22_BROWSER_WIDTHS||'360,1440').split(',').map(Number))for(const slug of cohort){
  console.log(JSON.stringify({slug,width}));
  await browser.send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width===360});
  if(report.journeys.length===0)await browser.send('Page.navigate',{url:origin+`/?slug=${slug}&plan=pro`});else await browser.js(`window.__renderCalculator(${JSON.stringify(slug)})`);
  await browser.until(`document.querySelector('main')?.dataset.slug===${JSON.stringify(slug)}`);
  await browser.until('document.querySelector("#plan")?.textContent==="pro"&&!!document.querySelector(".calculator-ui")');
  await browser.until(validExpression);
  const result=()=>browser.js('document.querySelector(".final-calculator-renderer")?.textContent??document.querySelector(".result-box")?.textContent');
  const initial=await result();if(baseline.has(slug))assert.equal(initial,baseline.get(slug),'Cross-viewport result parity');else baseline.set(slug,initial);
  const fields=await browser.js('[...document.querySelectorAll(".calculator-ui input:not([type=checkbox]):not([type=radio]), .calculator-ui textarea")].filter(e=>!e.closest(".account-actions")).map((e,i)=>{e.id="field-"+i;return{id:e.id,value:e.value,type:e.type,label:e.closest("label")?.textContent.trim()}})');
  assert(fields.length>0);assert(fields.every(f=>f.label),'Every input has a wrapping accessible label');
  assert.equal(await browser.js('document.documentElement.scrollWidth>innerWidth+1'),false,`${slug} ${width} initial horizontal overflow`);
  let blankChecks=0,accountChecks=0,zeroChecks=0,malformedChecks=0,nonfiniteChecks=0;
  for(const field of fields.filter(f=>f.value.trim()!=='')){
   await browser.js(`document.getElementById(${JSON.stringify(field.id)}).focus()`);await key('a','KeyA',65,2);await key('Backspace','Backspace',8);
   accountChecks+=await invalid();blankChecks++;
   await browser.field('#'+field.id,field.value);await browser.until(validExpression);assert.equal(await result(),initial,'Recovered result parity');
   for(const bad of ['not valid','Infinity','1e309']){await browser.js(`document.getElementById(${JSON.stringify(field.id)}).focus()`);await key('a','KeyA',65,2);await browser.send('Input.insertText',{text:bad});accountChecks+=await invalid();if(bad==='not valid')malformedChecks++;else nonfiniteChecks++;await browser.field('#'+field.id,field.value);await browser.until(validExpression);assert.equal(await result(),initial);}
   if(field.type==='number'){
    await browser.field('#'+field.id,'0');
    // Zero is deliberately observed rather than assumed valid for positive-only dimensions or denominators.
    if(await browser.js(validExpression))zeroChecks++;
    else await invalid();
    await browser.field('#'+field.id,field.value);await browser.until(validExpression);
   }
  }
  if(physics11.includes(slug)){
   await browser.until('[...document.querySelectorAll(".account-actions button")].some(b=>b.textContent.trim()==="Export JSON"&&!b.disabled)');
   const count=await browser.js('window.__downloads.length');await browser.js('[...document.querySelectorAll(".account-actions button")].find(b=>b.textContent.trim()==="Export JSON").click()');await browser.until(`window.__downloads.length>${count}`);
   const snapshot=JSON.parse(await browser.js(`window.__downloads[${count}].text`));assert.equal(snapshot.calculatorSlug,slug);assert.equal(snapshot.calculatorVersion,1);assert(Array.isArray(snapshot.output.steps)&&snapshot.output.steps.length>0);assert.equal(await browser.js(`window.__verifyRegisteredSnapshot(JSON.parse(window.__downloads[${count}].text)).engineVersion`),1);
  }
  await browser.js(`document.getElementById(${JSON.stringify(fields[0].id)}).focus()`);await key('Tab','Tab',9);
  assert(await browser.js('document.activeElement!==document.body&&!!document.activeElement.closest(".calculator-ui")'),'Tab advances to a calculator control');
  assert.equal(await browser.js('document.documentElement.scrollWidth>innerWidth+1'),false,`${slug} ${width} recovered horizontal overflow`);
  assert.deepEqual(await browser.js('window.__synthetic.writes'),[],'Acceptance performs no persistence writes');
  report.journeys.push({slug,width,initialRendererText:initial,fields:fields.length,accountControlsPresent:(await browser.js(actionsExpression)).length,blankChecks,malformedChecks,nonfiniteChecks,validZeroChecks:zeroChecks,recoveryParity:true,keyboard:true,labels:true,noHorizontalOverflow:true,actualSnapshotDisabledChecks:accountChecks,exactPhysicsExportReplay:physics11.includes(slug)});
 }
 assert.deepEqual(browser.errors,[]);assert.deepEqual(browser.network.filter(r=>!r.allowed),[]);
 report.browserErrors=browser.errors;report.networkRequests=browser.network.length;report.passed=true;
 await writeFile(path.join(directory,'report.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({directory,journeys:report.journeys.length,blankChecks:report.journeys.reduce((n,j)=>n+j.blankChecks,0),passed:true}));
} catch(error){report.passed=false;report.error=String(error.stack||error);report.browserErrors=browser?.errors;report.network=browser?.network;await writeFile(path.join(directory,'report.json'),JSON.stringify(report,null,2)+'\n');if(browser)await writeFile(path.join(directory,'failure.png'),Buffer.from((await browser.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true})).data,'base64'));throw error;
} finally {await browser?.close();await server?.close();}
