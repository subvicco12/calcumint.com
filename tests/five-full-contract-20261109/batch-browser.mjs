import assert from 'node:assert/strict';
import path from 'node:path';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {startShortestPublicationPreview} from '../../scripts/shortest-publication-preview.mjs';
import {startBrowser} from '../next-runtime/cdp.mjs';
import {recordedDownload} from '../next-runtime/recorded-download.mjs';
const artifacts=process.env.FIVE_BATCH_REPORT||'/tmp/five-full-contract-browser/receipt.json';await mkdir(artifacts.slice(0,artifacts.lastIndexOf('/')),{recursive:true});
const cases=[{id:370,slug:'bandwidth-calculator',value:80,target:'160',samples:[160,80,40]},{id:371,slug:'download-time-calculator',value:10,target:'20',samples:[20,10,5]},{id:372,slug:'upload-time-calculator',value:10,target:'20',samples:[20,10,5]},{id:373,slug:'data-transfer-calculator',value:100,target:'200',samples:[50,100,200]},{id:386,slug:'base64-size-calculator',value:1336,target:'8',samples:[1332,1332,1332,1336,1336,1336,1340]}];
const report={kind:'FIVE_LOCAL_BATCH_ACTUAL_UI_SYNTHETIC_ACCOUNT_NOT_SERVER_JOB',journeys:[],syntheticAccountTransport:true,downloads:[],nativeBlobApiRestoredFromSameOriginFrame:true,productionAcceptance:false,fullEngineeringComplete:0,releaseHold:true};let fixture,browser;
try{
 fixture=await startShortestPublicationPreview();browser=await startBrowser(fixture.origin);await browser.send('Network.setExtraHTTPHeaders',{headers:{Authorization:fixture.authorization}});await browser.send('Accessibility.enable');

 for(const plan of ['free','pro','business']){
  await browser.visit('/tests/shortest-publication-20/?id=427&plan='+plan);await browser.until('document.querySelector("#plan")?.textContent==='+JSON.stringify(plan));await browser.js("(async()=>{window.__mountFive=(await import('/tests/execution-recovery-20261109/browser-entry.tsx')).mountTechnology})()");await browser.until('!!window.__mountFive');await browser.js(`(()=>{const frame=document.createElement('iframe');frame.hidden=true;document.body.appendChild(frame);URL.createObjectURL=frame.contentWindow.URL.createObjectURL.bind(frame.contentWindow.URL);})()`);
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
   const exported={};
   for(const format of ['JSON','CSV']){const directory=artifacts.slice(0,artifacts.lastIndexOf('/'))+'/downloads/'+plan+'-'+row.id;await mkdir(directory,{recursive:true});const d=await recordedDownload(browser,{label:'Download batch '+format,filename:'technology-'+({370:'bandwidth',371:'download-time',372:'upload-time',373:'data-transfer',386:'base64-size'})[row.id]+'-batch.'+format.toLowerCase(),directory});exported[format]=d.bytes.toString('utf8');report.downloads.push({plan,id:row.id,format,bytes:d.bytes.length,sha256:createHash('sha256').update(d.bytes).digest('hex'),file:path.relative(path.dirname(artifacts),d.file)});}
   const parsed=JSON.parse(exported.JSON);assert.equal(parsed.version,1);assert.equal(parsed.rows.length,2);assert.deepEqual(parsed.rows.map(r=>r.snapshot.output.value),({370:[80,40],371:[80,40],372:[80,40],373:[125,250],386:[8,8]})[row.id]);const columns=({370:['dataMegabytes','timeSeconds'],371:['dataMegabytes','bandwidthMbps'],372:['dataMegabytes','bandwidthMbps'],373:['bandwidthMbps','timeSeconds'],386:['inputBytes']})[row.id];const quoted=v=>'"'+String(v)+'"';const expectedCsv=[['row','calculator_id','calculator_slug','calculator_version',...columns,'result','result_unit'],...parsed.rows.map((r,i)=>[i+1,parsed.engineId,row.slug,1,...columns.map(k=>r.snapshot.input[k]),r.snapshot.output.value,({370:'Mbps',371:'seconds',372:'seconds',373:'MB',386:'encoded bytes'})[row.id]])].map(r=>r.map(quoted).join(',')).join('\r\n');assert.equal(exported.CSV,expectedCsv);
   const replayField=panel+' form[aria-label="Verify batch replay"] textarea';await browser.field(replayField,exported.JSON);await browser.js('document.querySelector('+JSON.stringify(panel+' form[aria-label="Verify batch replay"]')+').requestSubmit()');await browser.until('document.querySelector('+JSON.stringify(panel+' form[aria-label="Verify batch replay"] + [role=status]')+')?.textContent.includes("Verified 2 rows")');parsed.rows[0].snapshot.output.value+=1;await browser.field(replayField,JSON.stringify(parsed));await browser.js('document.querySelector('+JSON.stringify(panel+' form[aria-label="Verify batch replay"]')+').requestSubmit()');await browser.until('!!document.querySelector('+JSON.stringify(panel+' [role=alert]')+')');assert.deepEqual(await browser.js('window.__first20Snapshot'),snapshot);
   const batchAx=await browser.send('Accessibility.getFullAXTree');for(const label of ['Batch results','Batch numeric rows','Batch replay JSON'])assert(batchAx.nodes.some(n=>n.name?.value===label),'AX '+label);
   for(const [width,height]of[[320,1000],[820,480],[1280,900]]){await browser.send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<1000});assert.equal(await browser.js('document.documentElement.scrollWidth<=innerWidth+1'),true,'No horizontal overflow '+row.id+'/'+width);}
   await browser.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});assert.equal(await browser.js('document.querySelectorAll("#recovery-technology [aria-label=Analysis] animate,#recovery-technology [aria-label=Analysis] animateTransform").length'),0);
   report.journeys.push({id:row.id,version:1,plan,primarySnapshotUnchanged:true,independentSamples:true,accessibleRegionAndTable:true,batchRowRecovery:true,exportDenialAndRecovery:true,accessibleBatchTable:true,viewportNoOverflow:true,reducedMotionNoAnimation:true});
  }
 }
 assert.equal(report.journeys.length,15);assert.deepEqual(browser.errors,[]);assert.deepEqual(browser.network.filter(x=>!x.allowed),[]);report.passed=true;
}catch(error){report.passed=false;report.error=String(error.stack||error);report.alerts=await browser?.js('[...document.querySelectorAll("#recovery-technology [role=alert]")].map(e=>e.textContent)');report.browserErrors=browser?.errors;throw error;}finally{
 report.sourceBaseline=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();report.sourceHashes=Object.fromEntries(await Promise.all(['tests/five-full-contract-20261109/batch-browser.mjs','src/components/calculator-interactive.tsx','src/components/technology-five-analysis.tsx','src/lib/technology-five-analysis.ts','src/lib/technology-five-batch.ts','src/components/technology-five-batch.tsx'].map(async p=>[p,createHash('sha256').update(await readFile(p)).digest('hex')])));await writeFile(artifacts,JSON.stringify(report,null,2)+'\n');await browser?.close();await fixture?.close();
}
console.log(JSON.stringify({passed:report.passed,journeys:report.journeys.length,artifacts}));
