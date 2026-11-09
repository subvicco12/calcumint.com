import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {startShortestPublicationPreview} from '../../scripts/shortest-publication-preview.mjs';
import {startBrowser} from '../next-runtime/cdp.mjs';
const artifacts=process.env.FIVE_BATCH_REPORT||'/tmp/five-full-contract-browser/receipt.json';await mkdir(artifacts.slice(0,artifacts.lastIndexOf('/')),{recursive:true});
const cases=[{id:370,slug:'bandwidth-calculator',value:80,target:'160',samples:[160,80,40]},{id:371,slug:'download-time-calculator',value:10,target:'20',samples:[20,10,5]},{id:372,slug:'upload-time-calculator',value:10,target:'20',samples:[20,10,5]},{id:373,slug:'data-transfer-calculator',value:100,target:'200',samples:[50,100,200]},{id:386,slug:'base64-size-calculator',value:1336,target:'8',samples:[1332,1332,1332,1336,1336,1336,1340]}];
const report={kind:'FIVE_LOCAL_BATCH_ACTUAL_UI_SYNTHETIC_ACCOUNT_NOT_SERVER_JOB',journeys:[],syntheticAccountTransport:true,productionAcceptance:false,fullEngineeringComplete:0,releaseHold:true};let fixture,browser;
try{
 fixture=await startShortestPublicationPreview();browser=await startBrowser(fixture.origin);await browser.send('Network.setExtraHTTPHeaders',{headers:{Authorization:fixture.authorization}});await browser.send('Accessibility.enable');
 const keyEnter=async()=>{await browser.send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,text:'\r'});await browser.send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});};
 for(const plan of ['free','pro','business']){
  await browser.visit('/tests/shortest-publication-20/?id=370&plan='+plan);await browser.until('document.querySelector("#plan")?.textContent==='+JSON.stringify(plan));await browser.js("(async()=>{window.__mountFive=(await import('/tests/execution-recovery-20261109/browser-entry.tsx')).mountTechnology})()");await browser.until('!!window.__mountFive');
  for(const row of cases){
   await browser.js('window.__mountFive('+JSON.stringify(row.slug)+')');await browser.until('window.__first20Snapshot?.calculatorSlug==='+JSON.stringify(row.slug)+'&&!!document.querySelector("#recovery-technology [aria-label=Analysis]")');
   const snapshot=await browser.js('window.__first20Snapshot');assert.equal(snapshot.output.value,row.value);assert.equal(snapshot.calculatorVersion,1);
   const values=await browser.js("[...document.querySelectorAll('#recovery-technology [aria-label=\"Relationship samples\"] tbody tr')].map(r=>Number(r.cells[2].textContent))");assert.deepEqual(values,row.samples);
   const ax=await browser.send('Accessibility.getFullAXTree');for(const label of ['Analysis','Relationship samples'])assert(ax.nodes.some(n=>n.name?.value===label),'AX '+label);
   const panel='#recovery-technology [aria-label="Bounded batch calculation"]',field=panel+' textarea';
   const draft=row.id===386?'4\n5':'100,10\n100,0';
   await browser.field(field,draft);await browser.js('document.querySelector('+JSON.stringify(field)+').focus()');
   await browser.js('document.querySelector('+JSON.stringify(panel+' form[aria-label="Batch calculation rows"]')+').requestSubmit()');
   await browser.until('!!document.querySelector('+JSON.stringify(panel+' table')+')');
   if(row.id!==386){assert(await browser.js('!!document.querySelector('+JSON.stringify(panel+' [role=alert]')+')'));assert(await browser.js('document.querySelector('+JSON.stringify(panel+' button[type=button]')+').disabled'));await browser.field(field,'100,10\n100,20');await browser.js('document.querySelector('+JSON.stringify(panel+' form[aria-label="Batch calculation rows"]')+').requestSubmit()');await browser.until('!document.querySelector('+JSON.stringify(panel+' [role=alert]')+')');}
   assert.equal(await browser.js('document.querySelector('+JSON.stringify(panel+' button[type=button]')+').disabled'),false);
   assert.deepEqual(await browser.js('window.__first20Snapshot'),snapshot);
   const batchAx=await browser.send('Accessibility.getFullAXTree');for(const label of ['Batch results','Batch numeric rows','Batch replay JSON'])assert(batchAx.nodes.some(n=>n.name?.value===label),'AX '+label);
   for(const [width,height]of[[320,1000],[820,480],[1280,900]]){await browser.send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<1000});assert.equal(await browser.js('document.documentElement.scrollWidth<=innerWidth+1'),true,'No horizontal overflow '+row.id+'/'+width);}
   await browser.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});assert.equal(await browser.js('document.querySelectorAll("#recovery-technology [aria-label=Analysis] animate,#recovery-technology [aria-label=Analysis] animateTransform").length'),0);
   report.journeys.push({id:row.id,version:1,plan,primarySnapshotUnchanged:true,independentSamples:true,accessibleRegionAndTable:true,batchRowRecovery:true,exportDenialAndRecovery:true,accessibleBatchTable:true,viewportNoOverflow:true,reducedMotionNoAnimation:true});
  }
 }
 assert.equal(report.journeys.length,15);assert.deepEqual(browser.errors,[]);assert.deepEqual(browser.network.filter(x=>!x.allowed),[]);report.passed=true;
}catch(error){report.passed=false;report.error=String(error.stack||error);throw error;}finally{
 report.sourceBaseline=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();report.sourceHashes=Object.fromEntries(await Promise.all(['tests/five-full-contract-20261109/batch-browser.mjs','src/components/calculator-interactive.tsx','src/components/technology-five-analysis.tsx','src/lib/technology-five-analysis.ts','src/lib/technology-five-batch.ts','src/components/technology-five-batch.tsx'].map(async p=>[p,createHash('sha256').update(await readFile(p)).digest('hex')])));await writeFile(artifacts,JSON.stringify(report,null,2)+'\n');await browser?.close();await fixture?.close();
}
console.log(JSON.stringify({passed:report.passed,journeys:report.journeys.length,artifacts}));
