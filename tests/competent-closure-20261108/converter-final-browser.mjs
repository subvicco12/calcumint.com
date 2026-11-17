import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {startShortestPublicationPreview} from '../../scripts/shortest-publication-preview.mjs';
import {startBrowser} from '../next-runtime/cdp.mjs';
const reportPath=path.resolve(process.env.CONVERTER_FINAL_REPORT||'/tmp/converter-final-browser-report.json');
await mkdir(path.dirname(reportPath),{recursive:true});
const report={kind:'15_REGISTERED_CONVERTER_FINAL_UI_APPLICABILITY_NOT_FULL_CANONICAL_COMPLETION',canonicalAccepted:false,releaseHold:true,journeys:[],limitations:['Synthetic account/plan transport; no genuine provider, production account or publication acceptance.','Renderer migration preserves existing v1 math, domain and source metadata; source/formula/precision competent decisions remain separate.']};
const witnesses=[
 [423,-2.5,'yd','mm',-2286],[424,3,'ft2','cm2',2787.0912],[425,2,'qt_us','ml',1892.705892],
 [427,-40,'c','f',-40],[428,3,'knot','m_s',1.5433333333333333],[429,2,'bar','pa',200000],
 [430,10,'cal','j',41.84],[431,0.002,'mw','w',2000],[432,1.5,'week','h',252],
 [433,100,'grad','deg',90],[434,2,'MiB','KB',2097.152],[437,2,'kg_l','kg_m3',2000],
 [438,250000,'dyn','n',2.5],[439,24,'lbf_in','lbf_ft',2],[440,0.125,'mhz','hz',125000],
];
let fixture,browser;
try{
 fixture=await startShortestPublicationPreview();
 browser=await startBrowser(fixture.origin);await browser.send('Network.setExtraHTTPHeaders',{headers:{Authorization:fixture.authorization}});
 const definitions=await fixture.server.ssrLoadModule('/src/lib/publication20/conversions.ts');
 const engine=await fixture.server.ssrLoadModule('/src/calculators/engine.ts');
 const press=async(key,code,n)=>{await browser.send('Input.dispatchKeyEvent',{type:'keyDown',key,code,windowsVirtualKeyCode:n,...(key==='Enter'?{text:'\r',unmodifiedText:'\r',nativeVirtualKeyCode:13}:{})});await browser.send('Input.dispatchKeyEvent',{type:'keyUp',key,code,windowsVirtualKeyCode:n});};
 const choose=async(field,value)=>{const selector=`[data-publication20-field=${field}]`;await browser.until(`!!document.querySelector(${JSON.stringify(selector)})`);const index=await browser.js(`(()=>{const s=document.querySelector(${JSON.stringify(selector)});s.focus();return [...s.options].findIndex(o=>o.value===${JSON.stringify(value)})})()`);assert(index>=0);await press('Home','Home',36);for(let i=0;i<index;i++)await press('ArrowDown','ArrowDown',40);await press('Tab','Tab',9);await browser.until(`document.querySelector(${JSON.stringify(selector)}).value===${JSON.stringify(value)}`);};
 const keyboardClick=async(label)=>{await browser.js(`(()=>{const b=[...document.querySelectorAll('button')].find(b=>b.textContent.trim()===${JSON.stringify(label)});if(!b||b.disabled)throw Error('Unavailable keyboard button');b.scrollIntoView({block:'center'});b.focus()})()`);assert.equal(await browser.js('document.activeElement.textContent.trim()'),label);await press('Enter','Enter',13);};
 const jobs=[...[...['free','pro','business']].map(plan=>({width:320,plan})),{width:1280,plan:'business'}];
 for(const {width,plan} of jobs)for(const [id,value,fromUnit,toUnit,golden] of witnesses){
  const entry=definitions.conversionPublicationDefinitions.find(e=>e.catalogId===id);
  await browser.send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width===320});
  await browser.visit(`/tests/shortest-publication-20/?id=${id}&plan=${plan}`);
  await browser.until(`document.querySelector('#plan')?.textContent===${JSON.stringify(plan)}&&!!window.__first20Snapshot?.output`);
  await choose('fromUnit',fromUnit);await choose('toUnit',toUnit);await browser.field('[data-publication20-field=value]',String(value));
  const expected=engine.runCalculator(entry.definition,{value,fromUnit,toUnit});
  assert(Math.abs(expected.output.result-golden)<=1e-10*Math.max(1,Math.abs(golden)),'Retained literal witness');
  await browser.until(`window.__first20Snapshot?.input.value===${JSON.stringify(value)}&&window.__first20Snapshot?.input.fromUnit===${JSON.stringify(fromUnit)}&&window.__first20Snapshot?.input.toUnit===${JSON.stringify(toUnit)}`);
  const snapshot=await browser.js('window.__first20Snapshot');assert.deepEqual(snapshot,{calculatorSlug:entry.definition.slug,calculatorVersion:1,input:expected.input,output:expected.output});
  assert.equal(await browser.js('!!document.querySelector("[data-publication20-result] .final-calculator-renderer")'),true);
  assert.equal(await browser.js('!!document.querySelector("[data-publication20-result] .pro-analysis")'),false);
  assert.equal(await browser.js('!!document.querySelector("[data-publication20-result] .result-hero")'),false);
  assert.equal(await browser.js('document.querySelector("[data-publication20-result]").textContent.includes("Advanced Analysis")'),false);
  assert(await browser.js(`document.querySelector('.final-calculator-renderer').textContent.includes(${JSON.stringify(entry.definition.formulas[0].expression)})`));
  assert(await browser.js(`document.querySelector('table.schedule-table').textContent.includes(${JSON.stringify(String(expected.output.result))})`));
  if(id===440)assert(await browser.js('document.querySelector("table.schedule-table").textContent.includes("Hz")'));
  if(id===427)assert(await browser.js('document.querySelector("[data-temperature-scope]").textContent.includes("Algebraic")'));
  await browser.field('[data-publication20-field=value]','');await browser.until('!!document.querySelector(".calculator-ui [role=alert]")');
  assert.equal(await browser.js('window.__first20Snapshot.output'),null);
  await browser.field('[data-publication20-field=value]',String(value));await browser.until('!!window.__first20Snapshot?.output');
  assert.deepEqual(await browser.js('window.__first20Snapshot'),snapshot);
  let exported=false,batch=false;
  if(plan==='free')assert.equal(await browser.js('!!document.querySelector("[aria-label=\\\"Batch conversion\\\"]")'),false);
  else{
   await keyboardClick('Export JSON');await browser.until('window.__shortestDownloads.some(d=>d.type.includes("json"))');
   const artifact=JSON.parse(await browser.js('window.__shortestDownloads.find(d=>d.type.includes("json")).text'));assert.deepEqual(artifact,snapshot);
   const replay=await browser.js('window.__shortestReplay('+JSON.stringify(artifact)+')');assert.deepEqual(replay.snapshot,artifact);exported=true;
   if(width===1280){
    const textarea='[aria-label="Batch conversion"] > label textarea';await browser.field(textarea,String(value)+'\n'+String(value));await keyboardClick('Calculate batch');
    await browser.until('document.querySelector("[aria-label=\\\"Batch conversion\\\"] table")?.textContent.includes("Valid")');
    await keyboardClick('Export batch JSON');await browser.until('window.__shortestDownloads.length>=2');
    const artifact=JSON.parse(await browser.js('window.__shortestDownloads.at(-1).text'));assert.equal(artifact.rows.length,2);for(const row of artifact.rows)assert.deepEqual(row.snapshot,snapshot);batch=true;
   }
  }
  assert.equal(await browser.js('document.documentElement.scrollWidth>innerWidth+1'),false);
  report.journeys.push({catalogId:id,engineId:entry.definition.id,version:1,width,plan,retainedLiteralGolden:true,finalApplicability:true,rawReconciliation:true,errorRecovery:true,keyboardExport:exported,jsonReplay:exported,batchExportPreserved:batch});
 }
 assert.equal(report.journeys.length,60);assert.deepEqual(browser.errors,[]);assert.deepEqual(browser.network.filter(r=>!r.allowed),[]);
 report.passed=true;report.pageErrors=browser.errors;report.unexpectedNetwork=browser.network.filter(r=>!r.allowed);await writeFile(reportPath,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({reportPath,journeys:report.journeys.length}));
}catch(error){report.passed=false;report.error=String(error);report.pageErrors=browser?.errors;await writeFile(reportPath,JSON.stringify(report,null,2)+'\n');throw error;}finally{await browser?.close();await fixture?.close();}
