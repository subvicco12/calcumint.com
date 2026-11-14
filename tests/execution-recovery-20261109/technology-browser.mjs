import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {startShortestPublicationPreview} from '../../scripts/shortest-publication-preview.mjs';
import {startBrowser} from '../next-runtime/cdp.mjs';
const cases=JSON.parse(await readFile('tests/execution-recovery-20261109/technology-cases.json','utf8')).rows;
const report={kind:'19_EXISTING_TECHNOLOGY_CURRENT_CALLER_NATIVE_ACCEPTANCE',newCanonicalAcceptance:false,newPublicationEligible:0,productionWrites:false,releaseHold:true,syntheticTransportOnly:true,journeys:[],limitations:['Actual source UI, engines, keyboard and export/scenario/replay with synthetic account transport; not genuine hosted authentication or competent acceptance.']};
const target=path.resolve(process.env.RECOVERY_TECHNOLOGY_REPORT||'/tmp/recovery-technology-browser.json');await mkdir(path.dirname(target),{recursive:true});
let fixture,browser;
try{
 fixture=await startShortestPublicationPreview();browser=await startBrowser(fixture.origin);
 await browser.send('Network.setExtraHTTPHeaders',{headers:{Authorization:fixture.authorization}});
 const press=async(key,code,n)=>{await browser.send('Input.dispatchKeyEvent',{type:'keyDown',key,code,windowsVirtualKeyCode:n,...(key==='Enter'?{text:'\r',unmodifiedText:'\r',nativeVirtualKeyCode:13}:{})});await browser.send('Input.dispatchKeyEvent',{type:'keyUp',key,code,windowsVirtualKeyCode:n});};
 const button=async label=>{await browser.js(`(()=>{const e=[...document.querySelectorAll('#recovery-technology button')].find(e=>e.textContent.trim()===${JSON.stringify(label)});if(!e||e.matches(':disabled'))throw Error('Unavailable button '+${JSON.stringify(label)});e.scrollIntoView({block:'center'});e.focus()})()`);await press('Enter','Enter',13);};
 for(const plan of ['free','pro','business']){
  await browser.send('Emulation.setDeviceMetricsOverride',{width:320,height:1100,deviceScaleFactor:1,mobile:true});
  await browser.visit('/tests/shortest-publication-20/?id=370&plan='+plan);await browser.until(`document.querySelector('#plan')?.textContent===${JSON.stringify(plan)}&&!!window.__first20Snapshot?.output`);
  await browser.js(`(async()=>{const entry=await import('/tests/execution-recovery-20261109/browser-entry.tsx');window.__recoveryMount=entry.mountTechnology;})()`);
  for(const row of cases){
   await browser.js('window.__shortestDownloads=[];window.__recoveryMount('+JSON.stringify(row.slug)+')');
   await browser.until(`window.__first20Snapshot?.calculatorSlug===${JSON.stringify(row.slug)}&&!!window.__first20Snapshot.output&&!!document.querySelector('#recovery-technology .final-calculator-renderer')`);
   assert.equal(await browser.js("!!document.querySelector('#recovery-technology section[aria-label=\"Calculation result\"] .final-calculator-renderer')"),true);
   const snapshot=await browser.js('window.__first20Snapshot');assert.equal(snapshot.calculatorVersion,row.version);assert(Math.abs(snapshot.output.value-row.expected)<1e-10*Math.max(1,Math.abs(row.expected)));
   assert.equal(await browser.js("document.querySelector('#recovery-technology').textContent.includes('Advanced Analysis')"),false);
   assert.equal(await browser.js("document.querySelector('#recovery-technology').textContent.includes('Goal Solver')"),false);
   const first=await browser.js("document.querySelector('#recovery-technology input[data-technology-field]').getAttribute('data-technology-field')");
   const selector='#recovery-technology input[data-technology-field='+first+']';
   const original=await browser.js('document.querySelector('+JSON.stringify(selector)+').value');
   await browser.field(selector,'');await browser.until("window.__first20Snapshot.output===null&&!!document.querySelector('#recovery-technology [role=alert]')");
   assert.equal(await browser.js('document.querySelector('+JSON.stringify(selector)+').getAttribute("aria-invalid")'),'true');
   await browser.field(selector,original);await browser.until('!!window.__first20Snapshot.output');assert.deepEqual(await browser.js('window.__first20Snapshot'),snapshot);
   let exports=false,scenario=false;
   if(plan==='free'){
    await browser.until("document.querySelector('#recovery-technology .account-actions').textContent.includes('Upgrade to Pro for exports')");assert.equal(await browser.js("[...document.querySelectorAll('#recovery-technology button')].some(b=>b.textContent.trim()==='Export JSON')"),false);assert.equal(await browser.js('window.__shortestDownloads.length'),0);
   }else{
    for(const label of ['Export JSON','Export CSV','Export PDF'])await button(label);
    await browser.until('window.__shortestDownloads.length===3');
    const downloaded=await browser.js('window.__shortestDownloads');
    const json=JSON.parse(downloaded.find(d=>d.type.includes('json')).text);assert.deepEqual(json,snapshot);
    const replay=await browser.js('window.__shortestReplay('+JSON.stringify(json)+')');assert.deepEqual(replay.snapshot,snapshot);
    const tampered={...json,output:{...json.output,value:row.expected+1}};assert.equal(await browser.js(`(()=>{try{window.__shortestReplay(${JSON.stringify(tampered)});return false}catch{return true}})()`),true);
    assert(downloaded.find(d=>d.type.includes('csv')).text.includes(String(snapshot.output.value)));
    assert(downloaded.find(d=>d.type.includes('pdf')).text.startsWith('%PDF-'));exports=true;
    await browser.js("document.querySelector('#recovery-technology .calculator-scenarios > details').open=true");
    await button('Capture baseline A');await browser.until("document.querySelector('#recovery-technology').textContent.includes('Capture notes:')");
    await button('Capture scenario B');
    await button('Export scenario set JSON');await browser.until('window.__shortestDownloads.length===4');
    const scenarios=await browser.js('JSON.parse(window.__shortestDownloads.at(-1).text)');assert(scenarios.scenarios?.length===2||scenarios.rows?.length===2,'Two immutable scenarios');
    await browser.js("document.querySelector('#recovery-technology .scenario-recovery').open=true");
    await browser.field('#recovery-technology .scenario-recovery textarea',JSON.stringify(scenarios));
    await button('Verify and recover scenario set');await browser.until("document.querySelector('#recovery-technology').textContent.includes('Recovered')");scenario=true;
   }
   assert.equal(await browser.js('document.documentElement.scrollWidth>innerWidth+1'),false);
   report.journeys.push({catalogId:row.masterId,slug:row.slug,version:row.version,plan,width:320,literalGolden:true,actualFinalRenderer:true,fieldErrorRecovery:true,keyboardControls:true,mathUnchanged:true,exports,jsonReplay:exports,scenarioRecovery:scenario});
  }
 }
 assert.equal(report.journeys.length,57);assert.deepEqual(browser.errors,[]);assert.deepEqual(browser.network.filter(r=>!r.allowed),[]);
 report.sourceHashes={};for(const name of ['src/components/calculator-interactive.tsx','src/components/technology-input-field.tsx','src/lib/technology-snapshot-verification.ts','src/lib/registered-snapshot-verification.ts','tests/execution-recovery-20261109/technology-browser.mjs'])report.sourceHashes[name]=createHash('sha256').update(await readFile(name)).digest('hex');
 report.passed=true;
}catch(error){report.passed=false;report.error=String(error);report.pageErrors=browser?.errors;throw error;}finally{await writeFile(target,JSON.stringify(report,null,2)+'\n');await browser?.close();await fixture?.close();}
console.log(JSON.stringify({report:target,journeys:report.journeys.length,passed:report.passed}));
