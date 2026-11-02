import assert from 'node:assert/strict';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {startFirst20Preview} from '../../scripts/first20-preview.mjs';
import {startBrowser} from '../next-runtime/cdp.mjs';
const source=JSON.parse(await readFile('docs/first20-publication/wave1-numerical.json','utf8'));
const directory=process.env.FIRST20_BROWSER_RECEIPT||'/tmp/first20-publication-browser';await mkdir(directory,{recursive:true});
const report={scope:'Actual registered caller/action source with read-only prop observation and synthetic account transport; no genuine authentication, production persistence or approval',journeys:[],polygon:[],passed:false};
const digest=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
let fixture,browser;
const q=selector=>'document.querySelector('+JSON.stringify(selector)+')';
const ready='!!window.__first20Snapshot&&window.__first20Snapshot.output!==null';
const click=async text=>{await browser.until('[...document.querySelectorAll("button")].some(b=>b.textContent.trim()==='+JSON.stringify(text)+'&&!b.disabled)');await browser.click(text);};
async function enter(id,input){const fields=await browser.js('[...document.querySelectorAll(".calculator-ui .field-grid input[type=number]")].filter(e=>!e.closest(".account-actions")).map((e,i)=>{e.id="witness-field-"+i;return e.closest("label").textContent.trim()})');const keys=Object.keys(input);assert.equal(fields.length,keys.length);for(let i=0;i<keys.length;i++)await browser.field('#witness-field-'+i,String(input[keys[i]]));await browser.until(ready);await browser.until('JSON.stringify(window.__first20Snapshot.input)==='+JSON.stringify(JSON.stringify(input)));}
try{
 fixture=await startFirst20Preview();assert.equal((await fetch(fixture.origin+'/tests/first20-publication/')).status,401);
 const credentialOrigin=fixture.origin.replace('http://','http://reviewer:'+fixture.password+'@');browser=await startBrowser(fixture.origin,[credentialOrigin]);
 for(const width of [360,1440])for(const plan of ['free','pro','business'])for(const binding of source.bindings){
  const witness=source.witnesses.find(w=>w.masterId===binding.masterId&&w.kind==='numerical'),expected=source.evaluations.find(e=>e.id===witness.id).artifact;
  console.log(JSON.stringify({width,plan,id:binding.masterId}));
  await browser.send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width===360});
  await browser.send('Page.navigate',{url:credentialOrigin+`/tests/first20-publication/?id=${binding.masterId}&plan=${plan}`});
  await browser.until('document.querySelector("#plan")?.textContent==='+JSON.stringify(plan)+'&&'+ready);
  await enter(binding.masterId,witness.input);
  const observed=await browser.js('window.__first20Snapshot');assert.deepEqual(observed,{calculatorSlug:binding.slug,calculatorVersion:1,input:expected.input,output:expected.output});
  const shown=await browser.js('document.querySelector(".result-box strong").textContent');assert.equal(shown,await browser.js('window.__first20Snapshot.output.result.toLocaleString(undefined,{maximumFractionDigits:12})'));
  assert.equal(await browser.js('document.documentElement.scrollWidth>innerWidth+1'),false,'No initial horizontal overflow');
  let exportVerified=false,scenarioVerified=false;
  if(plan==='free')assert.equal(await browser.js('[...document.querySelectorAll(".account-actions button")].some(b=>b.textContent.trim()==="Export JSON")'),false);
  else{
   await click('Export JSON');await browser.until('window.__first20Downloads.some(d=>d.type.includes("json"))');const text=await browser.js('window.__first20Downloads.find(d=>d.type.includes("json")).text'),snapshot=JSON.parse(text);assert.deepEqual(snapshot,observed);
   const replay=await browser.js('window.__first20Replay('+binding.masterId+','+JSON.stringify(snapshot)+')');assert.deepEqual(replay,expected);
   const forged=structuredClone(snapshot);forged.output.result+=1;assert.equal(await browser.js('(()=>{try{window.__first20Replay('+binding.masterId+','+JSON.stringify(forged)+');return false}catch{return true}})()'),true);exportVerified=true;
   if((width===360&&plan==='pro')||(width===1440&&plan==='business')){
    await browser.js('document.querySelector(".calculator-scenarios > details").open=true');await click('Capture baseline A');const count=await browser.js('window.__first20Downloads.length');await click('Export scenario set JSON');await browser.until('window.__first20Downloads.length>'+count);
    const set=JSON.parse(await browser.js('window.__first20Downloads['+count+'].text'));assert.equal(set.calculatorSlug,binding.slug);assert.equal(set.calculatorVersion,1);assert.equal(set.scenarios.length,1);assert.deepEqual(set.scenarios[0].input,witness.input);assert.deepEqual(set.scenarios[0].output,expected.output);scenarioVerified=true;
   }
  }
  const boundary=source.witnesses.find(w=>w.masterId===binding.masterId&&w.kind==='boundary');await enter(binding.masterId,boundary.input);const boundarySnapshot=await browser.js('window.__first20Snapshot');assert.equal(boundarySnapshot.output.result,boundary.expected);
  report.journeys.push({catalogId:binding.masterId,engineId:binding.engineId,version:1,width,plan,input:witness.input,output:expected.output,artifactSHA256:digest(observed),boundaryInput:boundary.input,boundaryResult:boundary.expected,jsonExportAndReplayExecuted:exportVerified,scenarioCaptureExportExecuted:scenarioVerified,freeExportNotOffered:plan==='free',noHorizontalOverflow:true});
 }
 for(const plan of ['free','pro','business']){
  await browser.send('Page.navigate',{url:credentialOrigin+'/tests/first20-publication/?id=268&plan='+plan});await browser.until('document.querySelector("#plan")?.textContent==='+JSON.stringify(plan)+'&&!!'+q('section[aria-label="Regular polygon successor review"]'));
  await browser.js('[...document.querySelectorAll("section input")].forEach((e,i)=>e.id="polygon-field-"+i)');await browser.field('#polygon-field-0','3');await browser.field('#polygon-field-1','1e154');
  await browser.until('!document.querySelector("#successor").textContent.includes("Enter valid")');assert.match(await browser.js('document.querySelector("#legacy").textContent'),/v1 rejects/);
  const value=Number((await browser.js('document.querySelector("#successor").textContent')).replace('Candidate: ',''));assert(Math.abs(value/4.330127018922193e307-1)<1e-14);
  await click('Export review JSON');const snapshot=JSON.parse(await browser.js('window.__first20Downloads[0].text'));assert.equal(snapshot.calculatorVersion,2);assert.equal(await browser.js('window.__polygonReplay('+JSON.stringify(JSON.stringify(snapshot))+').output.result'),value);
  await browser.field('#polygon-field-1','1e308');await browser.until('document.querySelector("#successor").textContent.includes("Enter valid")');assert.equal(await browser.js('[...document.querySelectorAll("button")].find(b=>b.textContent==="Export review JSON").disabled'),true);
  report.polygon.push({plan,input:{sides:3,side:1e154},v1:'REJECTED_UNCHANGED',candidateVersion:2,result:value,jsonReplay:true,trulyNonfiniteRejected:true,registered:false});
 }
 assert.deepEqual(browser.errors,[]);report.passed=true;await writeFile(path.join(directory,'receipt.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({passed:true,journeys:report.journeys.length,polygon:report.polygon.length,directory}));
}catch(error){await writeFile(path.join(directory,'failure.txt'),String(error));if(browser)try{await writeFile(path.join(directory,'failure.png'),Buffer.from((await browser.send('Page.captureScreenshot',{format:'png'},5000)).data,'base64'));}catch{}throw error;}finally{await browser?.close();await fixture?.close();}
