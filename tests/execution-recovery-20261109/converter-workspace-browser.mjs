import assert from 'node:assert/strict';
import {mkdtemp,readFile,writeFile,rename} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {startShortestPublicationPreview} from '../../scripts/shortest-publication-preview.mjs';
import {startBrowser} from '../next-runtime/cdp.mjs';

const root=fileURLToPath(new URL('../../',import.meta.url));
const directory=await mkdtemp(path.join(os.tmpdir(),'private-converter-native-'));
const output=path.join(root,'docs/execution-recovery-20261109/converters/native-browser-report.json');
const sha=data=>createHash('sha256').update(data).digest('hex');
const sourcePaths=['src/components/private-fixed-factor-review.tsx','src/lib/conversion-successor/fixed-factor-workspace.ts',
 'src/lib/conversion-successor/fixed-factor-private.ts','scripts/shortest-publication-preview.mjs','tests/next-runtime/cdp.mjs'];
const sourceSha256=Object.fromEntries(await Promise.all(sourcePaths.map(async file=>[file,sha(await readFile(path.join(root,file)))])));
const report={kind:'ACTUAL_CHROMIUM_PRIVATE_CONVERTER_WORKSPACE',passed:false,sourceSha256,
 testSha256:sha(await readFile(fileURLToPath(import.meta.url))),journeys:[],
 scope:'Existing BasicAuth loopback preview and CDP; dynamically mounted actual private component with actual React, actual Final renderer, native keyboard, clipboard and Blob download. No production route or calculation change.',
 limitations:['Finite native interaction evidence only; not competent source applicability approval, canonical adoption, certification or whole-domain numerical proof.','Existing 1224-case independent math packet reused; not rerun.'],
 canonicalAdoptionAuthorized:false,competentApproval:false};
let fixture,browser;
const host='#private-converter-browser-root';
const control=async label=>{
 const id=await browser.js(`(()=>{const label=[...document.querySelectorAll('${host} label')].find(e=>e.firstChild?.textContent.trim()===${JSON.stringify(label)});if(!label?.control)throw Error('Missing native label control');return label.control.id})()`);
 return host+' [id='+JSON.stringify(id)+']';
};
async function key(key,code,number,modifiers=0){
 for(const type of ['keyDown','keyUp'])await browser.send('Input.dispatchKeyEvent',{type,key,code,windowsVirtualKeyCode:number,modifiers,...(type==='keyDown'&&key==='Enter'?{text:'\r',unmodifiedText:'\r'}:{})});
}
async function select(label,value){
 const selector=await control(label),index=await browser.js(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});e.scrollIntoView({block:'center',behavior:'instant'});e.focus();return [...e.options].findIndex(o=>o.value===${JSON.stringify(value)})})()`);
 assert(index>=0);await key('Home','Home',36);for(let n=0;n<index;n++)await key('ArrowDown','ArrowDown',40);await key('Tab','Tab',9);
 await browser.until(`document.querySelector(${JSON.stringify(selector)}).value===${JSON.stringify(value)}`);
}
async function button(label){
 assert.equal(await browser.js(`(()=>{const e=[...document.querySelectorAll('${host} button')].find(e=>e.textContent.trim()===${JSON.stringify(label)});if(!e||e.disabled)throw Error('Missing/enabled native button '+${JSON.stringify(label)});e.scrollIntoView({block:'center',behavior:'instant'});e.focus();return document.activeElement===e})()`),true);
 await key('Enter','Enter',13);
}
const exact=()=>browser.js(`document.querySelector('${host} [data-testid=private-factor-exact-result]')?.textContent??null`);
const record=()=>browser.js(`JSON.parse(document.querySelector('${host} [data-testid=private-factor-artifact]').textContent)`);
async function edit(value){await browser.field(await control('Conversion value'),value);}
async function calculate(){await button('Calculate private proposal');await browser.until(`!!document.querySelector('${host} [data-testid=private-factor-exact-result]')`);}
async function fresh(){
 await browser.js(`(()=>{window.__privateConverterRoot?.unmount();localStorage.removeItem('calcumint-private-fixed-factor-workspace-20261109.1');window.__privateConverterRoot=window.__privateCreateRoot(document.querySelector('${host}'));window.__privateConverterRoot.render(window.__privateReact.createElement(window.__privateComponent))})()`);
 await browser.until(`!!document.querySelector('${host} input')`);
}
async function noOverflow(){
 const dimensions=await browser.js(`({viewport:innerWidth,document:document.documentElement.scrollWidth,body:document.body.scrollWidth,widget:document.querySelector('${host}').scrollWidth})`);
 assert(dimensions.document<=dimensions.viewport+1,JSON.stringify(dimensions));return dimensions;
}
async function download(){
 await button('Download workspace JSON');const file=path.join(directory,'private-fixed-factor-workspace.json'),deadline=Date.now()+10000;
 while(Date.now()<deadline){try{return {file,bytes:await readFile(file)};}catch{await new Promise(resolve=>setTimeout(resolve,80));}}
 throw Error('Actual native Blob download did not reach the isolated directory');
}
try{
 fixture=await startShortestPublicationPreview();
 assert.equal((await fetch(fixture.origin+'/tests/shortest-publication-20/')).status,401);
 assert.equal((await fetch(fixture.origin+'/src/components/private-fixed-factor-review.tsx')).status,401);
 const headers={Authorization:fixture.authorization};
 assert.equal((await fetch(fixture.origin+'/tests/shortest-publication-20/',{method:'POST',headers,body:'{}'})).status,405);
 assert.equal((await fetch(fixture.origin+'/tests/shortest-publication-20/',{headers:{...headers,Origin:'https://untrusted.invalid'}})).status,403);
 browser=await startBrowser(fixture.origin,['blob:'+fixture.origin]);
 await browser.send('Network.setExtraHTTPHeaders',{headers});
 await browser.send('Browser.setDownloadBehavior',{behavior:'allow',downloadPath:directory,eventsEnabled:true});
 await browser.send('Browser.grantPermissions',{origin:fixture.origin,permissions:['clipboardReadWrite','clipboardSanitizedWrite']});
 await browser.send('Page.addScriptToEvaluateOnNewDocument',{source:'window.__privateNativeCreateURL=URL.createObjectURL.bind(URL);window.__privateNativeRevokeURL=URL.revokeObjectURL.bind(URL);'});
 await browser.send('Emulation.setDeviceMetricsOverride',{width:320,height:1000,deviceScaleFactor:1,mobile:true});
 await browser.send('Page.navigate',{url:fixture.origin+'/tests/shortest-publication-20/?id=370&plan=business'});
 await browser.until('document.querySelector("#plan")?.textContent==="business"');
 const modules=await browser.js('performance.getEntriesByType("resource").map(e=>e.name)');
 const reactURL=modules.find(url=>/\/react\.js(?:\?|$)/.test(url));
 const clientURL=modules.find(url=>/\/react-dom_client\.js(?:\?|$)/.test(url));
 assert(reactURL&&clientURL,'Existing Vite optimized React modules must be loaded');
 await browser.js(`(async()=>{
  const react=await import(${JSON.stringify(reactURL)}),client=await import(${JSON.stringify(clientURL)});
  const component=await import('/src/components/private-fixed-factor-review.tsx');
  window.__privateReact=react.default??react;window.__privateCreateRoot=client.createRoot??client.default.createRoot;
  window.__privateComponent=component.PrivateFixedFactorReview;
  URL.createObjectURL=window.__privateNativeCreateURL;URL.revokeObjectURL=window.__privateNativeRevokeURL;
  document.querySelector('#root').hidden=true;document.querySelector('#root').inert=true;
  const node=document.createElement('div');node.id='private-converter-browser-root';document.body.append(node);
  window.__privateNativeEvents=[];for(const type of ['keydown','keyup','click'])node.addEventListener(type,event=>{window.__privateNativeEvents.push({type:event.type,key:event.key,trusted:event.isTrusted,target:event.target.tagName,label:event.target.textContent?.slice(0,50)});if(window.__privateNativeEvents.length>30)window.__privateNativeEvents.shift();},true);
 })()`);
 const workspace=await fixture.server.ssrLoadModule('/src/lib/conversion-successor/fixed-factor-workspace.ts');
 const parity=new Map();
 for(const definition of workspace.fixedFactorWorkspaces)for(const plan of ['free','pro','business']){
  console.log(JSON.stringify({catalogId:definition.catalogId,plan,width:320}));
  await fresh();await select('Private converter',definition.engine.id);await select('Synthetic presentation plan',plan);
  const field=await control('Conversion value');await browser.js(`document.querySelector(${JSON.stringify(field)}).focus()`);await key('Tab','Tab',9);
  assert.equal(await browser.js('document.activeElement.tagName'),'SELECT','Value-to-unit keyboard tab order');
  await edit('1.00');await calculate();const A=await record();
  assert.equal(A.artifact.privateId,definition.engine.id);assert.equal(A.artifact.allocatedSuccessorVersion,null);
  assert.equal(Number(await exact()),definition.engine.calculate({value:1,fromUnit:definition.example.fromUnit,toUnit:definition.example.toUnit}).result);
  assert.equal(await browser.js(`!!document.querySelector('${host} .final-calculator-renderer .result-box')`),true);
  assert.equal(await browser.js(`document.querySelector('${host} [data-testid=private-factor-exact-result]').parentElement.textContent.includes(${JSON.stringify(workspace.fixedFactorUnitLabel(definition.example.toUnit))})`),true);
  const aHash=sha(JSON.stringify(A));if(parity.has(definition.catalogId))assert.equal(aHash,parity.get(definition.catalogId));else parity.set(definition.catalogId,aHash);
  // Exercise both native unit controls, including the finite identity exemption.
  await select('From unit',definition.example.toUnit);await edit('5e-324');await calculate();assert.equal(await exact(),'5e-324');
  await select('To unit',definition.example.fromUnit);await button('Calculate private proposal');
  await browser.until(`!!document.querySelector('${host} [role=alert]')`);assert.equal(await exact(),null);
  await select('From unit',definition.example.fromUnit);await select('To unit',definition.example.toUnit);await edit('1.00');await calculate();
  await edit('');assert.equal(await exact(),null);await button('Calculate private proposal');await browser.until(`!!document.querySelector('${host} [role=alert]')`);
  assert.equal(await browser.js(`document.querySelector(${JSON.stringify(field)}).value`),'');
  for(const raw of ['1e','9007199254740993','1e308']){await edit(raw);await button('Calculate private proposal');assert.equal(await exact(),null);}
  await edit('1.00');await calculate();await button('Save current to history');await button('Capture scenario A');
  await edit('2.00');await calculate();await button('Capture scenario B');await button('Compare saved scenarios');
  await browser.until(`!!document.querySelector('${host} table')`);
  const comparison=await browser.js(`document.querySelector('${host} table').textContent`);
  assert.equal(await browser.js(`document.querySelectorAll('${host} table tbody tr').length`),2);
  await button('Restore history 1');assert.deepEqual(await record(),A);await button('Restore scenario B');
  await button('Export workspace JSON');const recovery=await control('Workspace JSON for export or recovery');
  const text=await browser.js(`document.querySelector(${JSON.stringify(recovery)}).value`),parsed=workspace.importFixedFactorWorkspace(text);
  await browser.js(`document.querySelector(${JSON.stringify(recovery)}).focus()`);await key('a','KeyA',65,2);await key('c','KeyC',67,2);
  assert.equal(await browser.js('navigator.clipboard.readText()'),text,'Actual native clipboard copy');
  const actualDownload=await download();assert.deepEqual(workspace.importFixedFactorWorkspace(actualDownload.bytes.toString()),parsed);
  assert.equal(actualDownload.bytes.toString(),text+'\n');await rename(actualDownload.file,path.join(directory,`${definition.catalogId}-${plan}.json`));
  await button('Clear scenarios');await browser.field(recovery,text);await button('Recover verified workspace');await button('Compare saved scenarios');
  assert.equal(await browser.js(`document.querySelector('${host} table').textContent`),comparison);
  const beforeStorage=await browser.js(`localStorage.getItem(${JSON.stringify(workspace.fixedFactorWorkspaceStorageKey)})`);
  const forged=JSON.parse(text);forged.scenarios.B.artifact.snapshot.output.result=0;
  for(const bad of ['{unfinished',JSON.stringify(forged)]){
   await browser.field(recovery,bad);await button('Recover verified workspace');await browser.until(`!!document.querySelector('${host} [role=alert]')`);
   assert.equal(await browser.js(`localStorage.getItem(${JSON.stringify(workspace.fixedFactorWorkspaceStorageKey)})`),beforeStorage);
   assert.equal(await browser.js(`document.querySelector('${host} table').textContent`),comparison);
   assert.equal(await browser.js(`document.querySelector(${JSON.stringify(recovery)}).value`),bad);
  }
  await button('Restore scenario A');assert.deepEqual(await record(),A);
  const dimensions=await noOverflow();
  report.journeys.push({catalogId:definition.catalogId,plan,width:320,artifactSha256:aHash,downloadSha256:sha(actualDownload.bytes),
   actualOutput:A.artifact.snapshot.output,unit:workspace.fixedFactorUnitLabel(definition.example.toUnit),nativeKeyboard:true,nativeClipboard:true,nativeBlobDownload:true,
   controlledUnits:true,identityAndNonidentityRefusal:true,blankAndLossyDraftRecovery:true,immutableHistoryAndAB:true,atomicTamperRecovery:true,noHorizontalOverflow:true,dimensions});
 }
 await browser.send('Emulation.setDeviceMetricsOverride',{width:1280,height:1000,deviceScaleFactor:1,mobile:false});report.desktopDimensions=await noOverflow();
 assert.deepEqual(browser.errors,[]);assert.deepEqual(browser.network.filter(row=>!row.allowed),[]);
 for(const [file,hash] of Object.entries(sourceSha256))assert.equal(sha(await readFile(path.join(root,file))),hash,'Source unchanged during native acceptance');
 report.passed=true;report.browser='Actual isolated headless Chromium/CDP';report.journeyCount=report.journeys.length;report.security={unauthenticated401:true,crossOrigin403:true,post405:true,sourceModulesProtected:true};
 report.nativeBlobURLsRestored=true;report.runtimeErrors=[];report.blockedRequests=[];report.downloadDirectory=directory;
 // New receipt only; never replace earlier retained workflow or numerical evidence.
 await writeFile(output,JSON.stringify(report,null,2)+'\n',{flag:'wx'});
 console.log(JSON.stringify({passed:true,journeys:report.journeys.length,output,reportSha256:sha(await readFile(output)),directory}));
}catch(error){
 const controls=browser?await browser.js(`({active:document.activeElement?.outerHTML,events:window.__privateNativeEvents,inputs:[...document.querySelectorAll('${host} input')].map(e=>({value:e.value}))})`).catch(()=>null):null;
 await writeFile(path.join(directory,'failure.json'),JSON.stringify({error:String(error),completed:report.journeys.length,runtimeErrors:browser?.errors,controls},null,2)+'\n');
 if(browser)try{await writeFile(path.join(directory,'failure.png'),Buffer.from((await browser.send('Page.captureScreenshot',{format:'png'},5000)).data,'base64'));}catch{/* Preserve primary failure. */}
 console.error(JSON.stringify({failureDirectory:directory,completed:report.journeys.length}));throw error;
}finally{await browser?.close();await fixture?.close();}
