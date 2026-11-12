import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {build} from 'esbuild';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
import {startBrowser} from '../next-runtime/cdp.mjs';
import {recordedDownload} from '../next-runtime/recorded-download.mjs';
const out=path.resolve(process.env.COMPLETION_BROWSER_OUT||'/workspace/artifacts/completion-first-20261112/acceptance/browser');
await mkdir(out,{recursive:true});
const report={kind:'REAL_COMPONENT_BROWSER_SYNTHETIC_ACCOUNT_ACTION_TRANSPORT',sourceSHA:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),genuineAuthenticatedAcceptance:false,productionAcceptance:false,canonicalAccepted:false,releaseHold:true,journeys:[],downloads:[]};
const rows=[{id:218,slug:'square-calculator',value:144,field:'x',edit:'3',changed:9,target:'9'},
{id:219,slug:'cube-calculator',value:125,field:'x',edit:'3',changed:27,target:'27'},
{id:220,slug:'square-root-calculator',value:12,field:'x',edit:'9',changed:3,target:'3'},
{id:423,slug:'length-converter',value:0.001,field:'value',edit:'2',changed:0.002},
{id:430,slug:'energy-converter',field:'value',edit:'2'},
{id:431,slug:'power-converter',field:'value',edit:'2'},
{id:432,slug:'time-converter',field:'value',edit:'2'},
{id:438,slug:'force-converter',field:'value',edit:'2'},
{id:440,slug:'frequency-converter',field:'value',edit:'2'}];
let server,browser;
const sourcePaths=['tests/completion-first-20261112/browser.mjs','tests/completion-first-20261112/fixture.tsx','src/components/calculator-factory-portal.tsx','src/components/calculator-factory-workbench.tsx','src/components/calculator-factory-downloads.tsx','src/components/calculator-factory-math-analysis.tsx','src/components/calculator-factory-conversion-methodology.tsx','src/lib/calculator-factory/completion/exports.ts','src/components/calculator-factory-persisted-scenario.tsx','src/lib/calculator-factory/completion/math.ts','src/lib/calculator-factory/completion/conversion-contracts.ts','src/lib/calculator-factory/workflows.ts','src/lib/calculator-factory/registry.ts'];
report.sourceHashes=Object.fromEntries(await Promise.all(sourcePaths.map(async file=>[file,createHash('sha256').update(await readFile(file)).digest('hex')])));
const text=()=>browser.js('document.body.innerText');
try{
 const result=await build({entryPoints:['tests/completion-first-20261112/fixture.tsx'],bundle:true,write:false,outfile:'/tmp/completion-browser.js',platform:'browser',format:'esm',jsx:'automatic',alias:{'@':path.resolve('src')},plugins:[{name:'synthetic-account-action-transport',setup(build){
  build.onResolve({filter:/app\/(?:account|admin\/calculator-factory)\/actions$/},()=>({path:'account-actions',namespace:'synthetic'}));
  build.onLoad({filter:/.*/,namespace:'synthetic'},()=>({contents:`export async function saveCalculationHistory(value){const rows=JSON.parse(localStorage.getItem('synthetic-history')||'[]');rows.push(value);localStorage.setItem('synthetic-history',JSON.stringify(rows));if(window.__loseNextHistory){window.__loseNextHistory=false;throw Error('Synthetic lost confirmation after commit');}return {ok:true};} export async function factoryProjects(){return {projects:[{id:'synthetic-project',name:'Synthetic owned project'}]};} export async function factorySaveScenario(value){localStorage.setItem('synthetic-scenario-'+value.requestId,JSON.stringify(value));return {scenarioId:value.requestId};} export async function factoryRestoreScenario(value){const stored=JSON.parse(localStorage.getItem('synthetic-scenario-'+value.scenarioId)||'null');if(!stored)throw Error('Owned scenario unavailable');return {snapshot:stored.packet.snapshot,catalogId:stored.packet.identity.catalogId};}`,loader:'js'}));
 }}]});
 const bundle=result.outputFiles.find(file=>file.path.endsWith('.js')).contents;const css=result.outputFiles.find(file=>file.path.endsWith('.css'))?.contents||'';
 server=createServer((req,res)=>{if(req.url.startsWith('/bundle.css')){res.setHeader('Content-Type','text/css');res.end(css);}else if(req.url.startsWith('/bundle.js')){res.setHeader('Content-Type','text/javascript');res.end(bundle);}else{res.setHeader('Content-Type','text/html');res.end('<!doctype html><link rel="stylesheet" href="/bundle.css"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{font:16px system-ui;margin:12px;max-width:1100px}*{box-sizing:border-box}input,select,textarea{max-width:100%}table{max-width:100%;border-collapse:collapse}td,th{padding:4px;text-align:left}button{margin:4px}label{display:block}pre{white-space:pre-wrap;overflow-wrap:anywhere}:focus-visible{outline:3px solid #005fcc}</style><p>Synthetic browser account transport; genuine account evidence recorded separately.</p><main id="root"></main><script type="module" src="/bundle.js"></script>');}});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 browser=await startBrowser(`http://127.0.0.1:${server.address().port}`);await browser.send('Accessibility.enable');
 for(const plan of ['free','pro','business'])for(const row of rows){
  await browser.visit('/?plan='+plan);await browser.until('!!document.querySelector("select")');
  await browser.js(`(()=>{const s=document.querySelector('select');s.value='${row.id}';s.dispatchEvent(new Event('change',{bubbles:true}));})()`);
  await browser.until(`document.querySelector('select').value==='${row.id}'`);
  await browser.click('Calculate');await browser.until('!!document.querySelector(`[aria-label="Verified file downloads"]`)');
  assert((await text()).includes(row.slug)||row.id>=400,'Exact identity text');
  if(row.id<400){
   assert(await browser.js('!!document.querySelector(`[aria-label="Arithmetic steps"]`)'));
   await browser.field('form[aria-label="Reverse solve"] input',row.target);await browser.click('Solve target');await browser.until('document.body.innerText.includes("Candidate input values:")');
   await browser.click('Sample graph');await browser.until('!!document.querySelector(`[aria-label="Graph samples"]`)');
   const values=await browser.js('[...document.querySelectorAll(`[aria-label="Graph samples"] tbody tr`)].map(r=>[r.cells[0].textContent,r.cells[1].textContent])');assert.equal(values.length,9);
   if(row.id===220)assert(values.some(r=>r[1].startsWith('Refused:')));
  }else{
   assert((await text()).includes('UCUM 2.2 source release'));assert(await browser.js('!!document.querySelector(`[aria-label="Unit definitions"]`)'));
  }
  // Free has the same authoritative core, with explicit export/scenario entitlement refusal.
  if(plan==='free'){
   await browser.click('Download JSON');await browser.until('document.body.innerText.includes("requires Pro or Business")');
   await browser.click('Capture scenario A');await browser.until('document.body.innerText.includes("requires Pro or Business")');
  }else{
   await browser.click('Capture scenario A');await browser.until('!!document.querySelector(`[aria-label="Captured scenarios"]`)');
   await browser.click('Load owned projects');await browser.until('document.body.innerText.includes("Owned projects loaded.")');
   await browser.field('[aria-label="Persisted project scenarios"] label:nth-of-type(2) input','Browser exact scenario');await browser.click('Save project scenario');await browser.until('document.body.innerText.includes("Saved scenario ")');
   const directory=path.join(out,'downloads',`${row.id}-${plan}`);await mkdir(directory,{recursive:true});
   let packet;
   for(const format of ['json','csv','pdf']){
    const download=await recordedDownload(browser,{label:'Download '+format.toUpperCase(),filename:`${row.slug}-v1.${format}`,directory});
    if(format==='json'){packet=JSON.parse(download.bytes);assert.equal(packet.identity.catalogId,row.id);assert.equal(packet.snapshot.calculatorSlug,row.slug);assert.equal(packet.snapshot.calculatorVersion,1);if(row.value!==undefined)assert.equal(packet.snapshot.output.result,row.value);}
    if(format==='csv'){assert(download.bytes.toString().includes(row.slug));assert(download.bytes.toString().includes(String(packet.snapshot.output.result)));}
    let pdfText;
    if(format==='pdf'){assert(download.bytes.toString('latin1').startsWith('%PDF-'));pdfText=execFileSync('pdftotext',['-layout',download.file,'-'],{encoding:'utf8'});assert(pdfText.includes(row.slug));assert(pdfText.includes(String(packet.snapshot.output.result)));await writeFile(download.file+'.txt',pdfText);}
    report.downloads.push({catalogId:row.id,plan,format,file:download.file,bytes:download.bytes.length,sha256:createHash('sha256').update(download.bytes).digest('hex'),popplerReadback:!!pdfText});
   }
   await browser.field(`input[name="${row.field}"]`,row.edit);await browser.click('Calculate');await browser.click('Capture scenario B');
   assert(await browser.js('document.querySelector(`[aria-label="Captured scenarios"]`).innerText.includes("Scenario B")'));
   // Native JSON is exact replay data, not an unrelated format-specific number.
   const replaySelector='textarea';await browser.field(replaySelector,JSON.stringify(packet));await browser.click('Replay packet');await browser.until('!!document.querySelector(`[aria-label="Verified file downloads"]`)');
   const savedId=await browser.js('document.querySelector(`[aria-label="Persisted project scenarios"] label:nth-of-type(3) input`).value');assert(savedId);
   await browser.visit('/?plan='+plan);await browser.until('!!document.querySelector("select")');
   await browser.js(`(()=>{const s=document.querySelector('select');s.value='${row.id}';s.dispatchEvent(new Event('change',{bubbles:true}));})()`);
   await browser.until('!!document.querySelector(`[aria-label="Persisted project scenarios"]`)');
   await browser.field('[aria-label="Persisted project scenarios"] label:nth-of-type(3) input',savedId);await browser.click('Restore saved scenario');
   await browser.until('!!document.querySelector(`[aria-label="Verified file downloads"]`)');
   assert.equal(await browser.js('document.querySelector('+JSON.stringify(`input[name="${row.field}"]`)+').value'),packet.raw[row.field]);
   assert(await browser.js('!!document.querySelector(`[aria-label="Verified file downloads"]`)'));

  }
  await browser.field(`input[name="${row.field}"]`,'');
  assert.equal(await browser.js('!!document.querySelector(`[aria-label="Verified file downloads"]`)'),false,'Stale downloads disappear on edit');
  await browser.click('Calculate');await browser.until('!!document.querySelector("[role=alert]")');
  assert.equal(await browser.js('!!document.querySelector(`[aria-label="Verified file downloads"]`)'),false);
  await browser.field(`input[name="${row.field}"]`,row.id===218?'12':row.id===219?'5':row.id===220?'144':'1');await browser.click('Calculate');await browser.until('!!document.querySelector(`[aria-label="Verified file downloads"]`)');
  if(row.id===218&&plan==='free'){
   await browser.js('window.__loseNextHistory=true');await browser.click('Save calculation');await browser.until('document.body.innerText.includes("Synthetic lost confirmation")');
   await browser.click('Save calculation');await browser.until('document.body.innerText.includes("Saved to your authenticated calculation history.")');
   const attempts=await browser.js('JSON.parse(localStorage.getItem("synthetic-history"))');assert.equal(attempts.at(-1).requestId,attempts.at(-2).requestId);
   await browser.field('input[name="x"]','3');await browser.click('Calculate');await browser.click('Save calculation');await browser.until('document.body.innerText.includes("Saved to your authenticated calculation history.")');
   const changed=await browser.js('JSON.parse(localStorage.getItem("synthetic-history"))');assert.notEqual(changed.at(-1).requestId,attempts.at(-1).requestId);report.historyLostConfirmationRetry={samePacketSameRequestId:true,changedPacketNewRequestId:true,syntheticTransport:true};
  }
  await browser.js(`document.querySelector('input[name="${row.field}"]').focus()`);await browser.send('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});await browser.send('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});assert(await browser.js('document.activeElement.matches(":focus-visible")'));
  for(const [width,height]of [[320,900],[820,480],[1280,900]]){await browser.send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<1000});assert(await browser.js('document.documentElement.scrollWidth<=innerWidth+1'),`Horizontal overflow ${row.id}/${plan}/${width}`);}
  const ax=await browser.send('Accessibility.getFullAXTree');assert(ax.nodes.some(n=>n.name?.value==='Calculate'));
  report.journeys.push({catalogId:row.id,plan,sourceBoundRealComponent:true,staleInvalidRefusal:true,keyboard:true,mobile:true,mathAnalysis:row.id<400,conversionSource:row.id>=400,persistedSyntheticSaveReloadRestore:plan!=='free',syntheticAuth:true});
 }
 assert.equal(report.journeys.length,27);assert.equal(report.downloads.length,54);assert.deepEqual(browser.errors,[]);report.passed=true;
}catch(error){report.passed=false;report.error=String(error.stack||error);report.failureDOM=await browser?.js('document.body.innerText');throw error;}
finally{
 report.sourceUnchangedDuringRun=(await Promise.all(sourcePaths.map(async file=>createHash('sha256').update(await readFile(file)).digest('hex')===report.sourceHashes[file]))).every(Boolean);if(!report.sourceUnchangedDuringRun){report.passed=false;report.sourceDrift=true;}
 await writeFile(path.join(out,'receipt.json'),JSON.stringify(report,null,2)+'\n');await browser?.close();if(server)await new Promise(resolve=>server.close(resolve));
}
console.log(JSON.stringify({passed:report.passed,journeys:report.journeys.length,downloads:report.downloads.length,out}));
