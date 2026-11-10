import assert from 'node:assert/strict';
import path from 'node:path';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {startShortestPublicationPreview} from '../../scripts/shortest-publication-preview.mjs';
import {startBrowser} from '../next-runtime/cdp.mjs';
import {recordedDownload} from '../next-runtime/recorded-download.mjs';
const root=process.cwd(),out=path.resolve(process.env.NEXT_FIVE_UI_REPORT||'docs/next-five-20261110/browser.json');
await mkdir(path.dirname(out),{recursive:true});
const rows=[
 {id:369,slug:'cidr-calculator',value:256,field:'prefixLength',edit:'23',changed:512,target:'512',samples:[512,256,128]},
 {id:375,slug:'raid-capacity-calculator',value:2000,field:'diskSizeGb',edit:'2000',changed:4000,target:'4000',samples:[1000,2000,4000]},
 {id:380,slug:'battery-runtime-calculator',value:4.5,field:'capacityWh',edit:'2000',changed:9,target:'9',samples:[2.25,4.5,9]},
 {id:381,slug:'ups-runtime-calculator',value:1.8,field:'batteryWh',edit:'1200',changed:3.6,target:'3.6',samples:[0.9,1.8,3.6]},
 {id:387,slug:'password-entropy-calculator',value:104.8734216268422,field:'length',edit:'32',changed:209.7468432536844,target:'209.7468432536844',samples:[98.31883277516457,104.8734216268422,111.42801047851985]}
];
const report={kind:'FIVE_CURRENT_CALLER_ENGINE_ANALYSIS_AND_PERSONAL_EXPORTS_SYNTHETIC_ACCOUNT_TRANSPORT',executionSourceRef:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),productionAcceptance:false,genuineAuthenticatedAcceptance:false,hiddenBootstrapRootRemovedBeforeNativeDownloads:true,newScopedEngineeringComplete:0,releaseHold:true,journeys:[],downloads:[]};
let fixture,browser;
try{
 fixture=await startShortestPublicationPreview();browser=await startBrowser(fixture.origin);
 await browser.send('Network.setExtraHTTPHeaders',{headers:{Authorization:fixture.authorization}});await browser.send('Accessibility.enable');
 await browser.send('Page.addScriptToEvaluateOnNewDocument',{source:'Object.defineProperty(window,"__nativeExportBlobFactory",{value:URL.createObjectURL.bind(URL),writable:false});'});
 for(const plan of ['free','pro','business']){
  await browser.visit('/tests/shortest-publication-20/?id=427&plan='+plan);await browser.until('document.querySelector("#plan")?.textContent==='+JSON.stringify(plan));
  await browser.js("(async()=>{window.__mountNextFive=(await import('/tests/execution-recovery-20261109/browser-entry.tsx')).mountTechnology})()");await browser.until('!!window.__mountNextFive');
  for(const row of rows){
   // A native export journey starts from the calculator's own fresh document.
   // Do not aggregate fifteen downloads in a synthetic single-page switcher.
   if(plan==='business'&&row.id!==369){
    await browser.visit('/tests/shortest-publication-20/?id=427&plan='+plan);await browser.until('document.querySelector("#plan")?.textContent==='+JSON.stringify(plan));
    await browser.js("(async()=>{window.__mountNextFive=(await import('/tests/execution-recovery-20261109/browser-entry.tsx')).mountTechnology})()");await browser.until('!!window.__mountNextFive');
   }
   await browser.js('window.__mountNextFive('+JSON.stringify(row.slug)+')');await browser.until('window.__first20Snapshot?.calculatorSlug==='+JSON.stringify(row.slug)+'&&!!document.querySelector("#recovery-technology [aria-label=Analysis]")');
   const snapshot=await browser.js('window.__first20Snapshot');assert.equal(snapshot.output.value,row.value);assert.equal(snapshot.calculatorVersion,1);
   const samples=await browser.js("[...document.querySelectorAll('#recovery-technology [aria-label=\"Relationship samples\"] tbody tr')].map(r=>Number(r.cells[2].textContent))");
   assert.equal(samples.length,3);samples.forEach((v,i)=>assert(Math.abs(v-row.samples[i])<=4*Number.EPSILON*Math.max(1,Math.abs(row.samples[i])),'Independent literal sample '+row.id+'/'+i));
   const ax=await browser.send('Accessibility.getFullAXTree');for(const label of ['Analysis','Relationship samples'])assert(ax.nodes.some(n=>n.name?.value===label),'AX '+label);
   const form='#recovery-technology form[aria-label="Target calculation"]';
   if(plan==='free')assert.equal(await browser.js('!!document.querySelector('+JSON.stringify(form)+')'),false);
   else{
    await browser.field(form+' input',row.target);await browser.js('document.querySelector('+JSON.stringify(form)+').requestSubmit()');await browser.until('document.querySelector('+JSON.stringify(form+' [role=status]')+')?.textContent.includes('+JSON.stringify('Forward verified result: '+row.target)+')');
    await browser.field(form+' input','invalid');await browser.js('document.querySelector('+JSON.stringify(form)+').requestSubmit()');await browser.until('!!document.querySelector('+JSON.stringify(form+' [role=alert]')+')');
    await browser.field(form+' input',row.target);await browser.js('document.querySelector('+JSON.stringify(form)+').requestSubmit()');await browser.until('!!document.querySelector('+JSON.stringify(form+' [role=status]')+')');
   }
   assert.deepEqual(await browser.js('window.__first20Snapshot'),snapshot,'Analysis must not rewrite saved input/output');
   const field='#recovery-technology input[data-technology-field="'+row.field+'"]',original=await browser.js('document.querySelector('+JSON.stringify(field)+').value');
   await browser.field(field,row.edit);await browser.until('window.__first20Snapshot.output?.value==='+row.changed);
   if(plan!=='free')assert.equal(await browser.js('document.querySelector('+JSON.stringify(form+' input')+').value'),'','New input clears stale goal');
   await browser.field(field,'');await browser.until('window.__first20Snapshot.output===null');assert(await browser.js('!!document.querySelector("#recovery-technology [role=alert]")'));
   assert.equal(await browser.js('[...document.querySelectorAll("#recovery-technology button")].filter(b=>/^Export (CSV|JSON|PDF)$/.test(b.textContent.trim())).every(b=>b.disabled)'),true,'Invalid calculation cannot export');
   await browser.field(field,original);await browser.until('window.__first20Snapshot.output?.value==='+row.value);
   if(row.id===369){await browser.field(field,'24.000000000000001');await browser.until('window.__first20Snapshot.output===null');assert.equal(await browser.js('document.querySelector('+JSON.stringify(field)+').getAttribute("aria-invalid")'),'true');await browser.field(field,original);await browser.until('window.__first20Snapshot.output?.value===256');}
   await browser.js('document.querySelector('+JSON.stringify(field)+').focus()');await browser.send('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});await browser.send('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});assert(await browser.js('!!document.activeElement.closest("#recovery-technology")&&document.activeElement.matches(":focus-visible")'));
   for(const [width,height]of[[320,1000],[820,480],[1280,900]]){await browser.send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<1000});assert.equal(await browser.js('document.documentElement.scrollWidth<=innerWidth+1'),true,'No horizontal overflow '+row.id+'/'+width);}
   await browser.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});assert.equal(await browser.js('document.querySelectorAll("#recovery-technology [aria-label=Analysis] animate,#recovery-technology [aria-label=Analysis] animateTransform").length'),0);
   if(plan==='business'){
    // The bootstrap calculator is hidden by mountTechnology. Remove that fixture-only
    // root so the unchanged native-download helper cannot select its hidden duplicate.
    await browser.js("document.querySelector('#root')?.remove()");
    const directory=path.join(path.dirname(out),'downloads',String(row.id));await mkdir(directory,{recursive:true});
    await browser.js('URL.createObjectURL=window.__nativeExportBlobFactory');
    for(const format of ['JSON','CSV','PDF']){
     const filename=row.slug+(format==='PDF'?'-v1.pdf':'.'+format.toLowerCase());
     const keyboardBrowser={...browser,click:async label=>{
      await browser.js(`(()=>{const b=[...document.querySelectorAll('#recovery-technology button')].find(b=>b.textContent.trim()===${JSON.stringify(label)});if(!b||b.disabled)throw Error('Current export unavailable');b.scrollIntoView({behavior:'instant',block:'center'});b.focus();if(document.activeElement!==b)throw Error('Export did not receive focus');})()`);
      await browser.send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,text:'\r'});await browser.send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
     } };
     const download=await recordedDownload(keyboardBrowser,{label:'Export '+format,filename,directory});const bytes=download.bytes;
     if(format==='JSON'){const parsed=JSON.parse(bytes.toString());assert.equal(parsed.calculatorSlug,row.slug);assert.equal(parsed.calculatorVersion,1);assert.deepEqual(parsed.input,snapshot.input);assert.deepEqual(parsed.output,snapshot.output);}
     if(format==='CSV'){assert(bytes.toString().includes(row.slug));assert(bytes.toString().includes(String(row.value)));}
     if(format==='PDF')assert(bytes.toString('latin1').startsWith('%PDF-'));
     report.downloads.push({id:row.id,format,file:path.relative(path.dirname(out),download.file),bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});
    }
   }
   report.journeys.push({id:row.id,version:1,plan,exactPrimary:true,independentSamples:true,unchangedSnapshot:true,goalGateAndRecovery:true,blankRefusalAndRecovery:true,keyboard:true,accessibleTable:true,mobile:true,reducedMotion:true});
  }
 }
 assert.equal(report.journeys.length,15);assert.equal(report.downloads.length,15);assert.deepEqual(browser.errors,[]);assert.deepEqual(browser.network.filter(x=>!x.allowed),[]);report.passed=true;
}catch(error){report.passed=false;report.error=String(error.stack||error);report.browserErrors=browser?.errors;report.failureDOM=await browser?.js("({body:document.body.innerText.slice(-6000),buttons:[...document.querySelectorAll('#recovery-technology button')].map(b=>({text:b.textContent,disabled:b.disabled})),blobFactory:String(URL.createObjectURL)})");throw error;}
finally{
 const files=['tests/next-five-20261110/browser.mjs','src/components/calculator-interactive.tsx','src/components/technology-bounded-analysis.tsx','src/lib/technology-next-five-analysis.ts','src/lib/native-delivery/technology-next-five-catalog.ts','src/lib/native-delivery/technology-next-five-contract.ts'];
 report.sourceHashes=Object.fromEntries(await Promise.all(files.map(async p=>[p,createHash('sha256').update(await readFile(path.join(root,p))).digest('hex')])));await writeFile(out,JSON.stringify(report,null,2)+'\n');await browser?.close();await fixture?.close();
}
console.log(JSON.stringify({passed:report.passed,journeys:report.journeys.length,downloads:report.downloads.length,out}));
