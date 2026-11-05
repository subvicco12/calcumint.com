import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {startCalculatorClosurePreview} from '../../scripts/calculator-closure-preview.mjs';
import {startBrowser} from '../next-runtime/cdp.mjs';
const vectors=JSON.parse(await readFile('tests/calculator-first-20261105/witnesses.json','utf8'));
const directory=process.env.CALCULATOR_CLOSURE_RECEIPT||'/tmp/calculator-first-20261105-browser';await mkdir(directory,{recursive:true});
const report={scope:'Actual launch caller and account actions; synthetic plan/account transport. No genuine authentication, persisted history, canonical approval or lifecycle promotion.',journeys:[],recovery:[],passed:false};
let fixture,browser;
const click=async text=>{await browser.until('[...document.querySelectorAll("button")].some(b=>b.textContent.trim()==='+JSON.stringify(text)+'&&!b.disabled)');await browser.click(text);};
const snapshot='window.__first20Snapshot';
const ready='!!window.__first20Snapshot&&window.__first20Snapshot.output!==null';
async function enter(input){
 const count=await browser.js('[...document.querySelectorAll(".calculator-ui .field-grid input[type=number]")].map((e,i)=>{e.id="closure-field-"+i;return e}).length');
 assert.equal(count,Object.keys(input).length);
 for(const [i,key] of Object.keys(input).entries())await browser.field('#closure-field-'+i,String(input[key]));
 await browser.until(ready+'&&JSON.stringify('+snapshot+'.input)==='+JSON.stringify(JSON.stringify(input)));
}
try{
 fixture=await startCalculatorClosurePreview();assert.equal((await fetch(fixture.origin+'/tests/calculator-first-20261105/')).status,401);
 const origin=fixture.origin.replace('http://','http://reviewer:'+fixture.password+'@');browser=await startBrowser(fixture.origin,[origin]);
 for(const width of [360,1440])for(const plan of ['free','pro','business'])for(const v of vectors){
  console.log(JSON.stringify({catalogId:v.catalogId,width,plan}));
  await browser.send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width===360});
  await browser.send('Page.navigate',{url:origin+`/tests/calculator-first-20261105/?id=${v.catalogId}&plan=${plan}&recovery=1`});
  await browser.until('document.querySelector("#plan")?.textContent==='+JSON.stringify(plan)+'&&'+ready);
  await enter(v.numerical.input);const actual=await browser.js(snapshot);
  assert.equal(actual.calculatorSlug,v.slug);assert.equal(actual.calculatorVersion,v.version);
  assert(Math.abs(actual.output.result-v.numerical.expected)<=Math.max(Number.MIN_VALUE,Math.abs(v.numerical.expected)*1e-14));
  assert.equal(await browser.js('[...document.querySelectorAll(".calculator-ui .field-grid input")].every(e=>e.checkValidity())'),true,'Supported witnesses satisfy native controls');
  assert.equal(await browser.js('document.documentElement.scrollWidth>innerWidth+1'),false);
  const fields=Object.keys(v.numerical.input);
  for(let i=0;i<fields.length;i++){
   await browser.field('#closure-field-'+i,'');await browser.until(snapshot+'.output===null');
   assert.equal(await browser.js('document.querySelector("#closure-field-'+i+'").getAttribute("aria-invalid")'), 'true');
   assert.equal(await browser.js('(()=>{const e=document.querySelector("#closure-field-'+i+'");return !!document.getElementById(e.getAttribute("aria-describedby"))?.textContent})()'),true);
   if(plan!=='free')assert.equal(await browser.js('[...document.querySelectorAll(".account-actions button")].find(b=>b.textContent.trim()==="Export JSON")?.disabled'),true);
   assert.equal(await browser.js('[...document.querySelectorAll(".account-actions button")].find(b=>b.textContent.trim()==="Save calculation")?.disabled'),true);
   await browser.field('#closure-field-'+i,String(v.numerical.input[fields[i]]));await browser.until(ready);
  }
  let exported=false,scenario=false;
  if(plan==='free')assert.equal(await browser.js('[...document.querySelectorAll(".account-actions button")].some(b=>b.textContent.trim()==="Export JSON")'),false);
  else{
   await click('Export JSON');await browser.until('window.__closureDownloads.some(d=>d.type.includes("json"))');
   const captured=JSON.parse(await browser.js('window.__closureDownloads.find(d=>d.type.includes("json")).text'));assert.deepEqual(captured,actual);
   await browser.js('window.__registeredReplay('+JSON.stringify(captured)+')');const forged=structuredClone(captured);forged.output.result+=1;
   assert.equal(await browser.js('(()=>{try{window.__registeredReplay('+JSON.stringify(forged)+');return false}catch{return true}})()'),true);exported=true;
   if(width===360){await browser.js('document.querySelector(".calculator-scenarios > details").open=true');await click('Capture baseline A');const count=await browser.js('window.__closureDownloads.length');await click('Export scenario set JSON');await browser.until('window.__closureDownloads.length>'+count);const capturedSet=JSON.parse(await browser.js('window.__closureDownloads['+count+'].text'));assert.equal(capturedSet.calculatorSlug,v.slug);assert.deepEqual(capturedSet.scenarios[0].input,v.numerical.input);assert.deepEqual(capturedSet.scenarios[0].output,actual.output);
    await browser.js('document.querySelector(".scenario-recovery").open=true;document.querySelector(".scenario-recovery textarea").id="recover-json"');
    await browser.field('#recover-json',JSON.stringify(capturedSet));await click('Verify and recover scenario set');
    await browser.until('document.querySelector(".scenario-recovery").textContent.includes("Recovered 1 verified scenario")');
    const badSet=structuredClone(capturedSet);badSet.scenarios[0].output.result+=1;
    await browser.field('#recover-json',JSON.stringify(badSet));await click('Verify and recover scenario set');
    await browser.until('document.querySelector(".scenario-recovery [role=alert]")?.textContent.includes("Recovery unavailable")');
    assert.equal(await browser.js('document.querySelector(".calculator-scenarios").textContent.includes("Complete snapshot A")'),true);scenario=true;}
  }
  await enter(v.boundary.input);assert.equal((await browser.js(snapshot)).output.result,v.boundary.expected);
  report.journeys.push({catalogId:v.catalogId,engineId:v.engineId,version:v.version,plan,width,input:v.numerical.input,output:actual.output,artifactSHA256:createHash('sha256').update(JSON.stringify(actual)).digest('hex'),allRequiredFieldsRejectedAndRecovered:true,linkedFieldErrors:true,invalidSaveDenied:true,invalidExportDenied:plan!=='free',freeExportAbsent:plan==='free',nativeControlsValid:true,noHorizontalOverflow:true,jsonExportReplayTamper:exported,scenarioCaptureExportRecoveryTamper:scenario,boundary:v.boundary});
 }
 // Client-side identity transition reuses the actual CalculatorInteractive instance.
 await browser.send('Page.navigate',{url:origin+'/tests/calculator-first-20261105/?id=211&plan=pro&recovery=1'});await browser.until(ready+'&&'+snapshot+'.calculatorSlug==="ratio-calculator"');await enter({a:999,b:18});
 await browser.js('(()=>{const e=document.querySelector("select");Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,"value").set.call(e,"216");e.dispatchEvent(new Event("change",{bubbles:true}))})()');
 await browser.until(snapshot+'.calculatorSlug==="average-two-numbers-calculator"');assert.deepEqual((await browser.js(snapshot)).input,{a:10,b:20});report.recovery.push({from:211,to:216,destinationDefaults:true,sharedKeysDoNotLeak:true});
 assert.deepEqual(browser.errors,[]);
 for(const v of vectors){const rows=report.journeys.filter(j=>j.catalogId===v.catalogId);assert.equal(rows.length,6);assert.equal(new Set(rows.map(j=>j.artifactSHA256)).size,1);}
 report.passed=true;await writeFile(path.join(directory,'receipt.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({passed:true,journeys:report.journeys.length,recovery:report.recovery.length,directory}));
}catch(error){await writeFile(path.join(directory,'failure.txt'),String(error));throw error;}finally{await browser?.close();await fixture?.close();}
