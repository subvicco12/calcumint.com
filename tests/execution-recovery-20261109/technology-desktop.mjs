import assert from 'node:assert/strict';import {readFile,writeFile,mkdir} from 'node:fs/promises';import {createHash} from 'node:crypto';import path from 'node:path';
import {startShortestPublicationPreview} from '../../scripts/shortest-publication-preview.mjs';import {startBrowser} from '../next-runtime/cdp.mjs';
const out=path.resolve(process.env.RECOVERY_DESKTOP_DIR||'/tmp/recovery-technology-desktop');await mkdir(out,{recursive:true});
const cases=JSON.parse(await readFile('tests/execution-recovery-20261109/technology-cases.json','utf8')).rows;
const report={kind:'19_TECHNOLOGY_DESKTOP_ACCESSIBLE_LAYOUT_COMPLEMENT',passed:false,productionWrites:false,canonicalAccepted:false,releaseHold:true,width:1280,syntheticPlan:'business',journeys:[]};let fixture,browser;
try{
 fixture=await startShortestPublicationPreview();browser=await startBrowser(fixture.origin);await browser.send('Network.setExtraHTTPHeaders',{headers:{Authorization:fixture.authorization}});await browser.send('Emulation.setDeviceMetricsOverride',{width:1280,height:1000,deviceScaleFactor:1,mobile:false});
 await browser.visit('/tests/shortest-publication-20/?id=370&plan=business');await browser.until("document.querySelector('#plan')?.textContent==='business'&&!!window.__first20Snapshot?.output");
 await browser.js("(async()=>{const e=await import('/tests/execution-recovery-20261109/browser-entry.tsx');window.__recoveryMount=e.mountTechnology})()");
 for(const row of cases){
  await browser.js('window.__recoveryMount('+JSON.stringify(row.slug)+')');await browser.until(`window.__first20Snapshot?.calculatorSlug===${JSON.stringify(row.slug)}&&!!window.__first20Snapshot.output`);
  assert.equal(await browser.js("!!document.querySelector('#recovery-technology .final-calculator-renderer')"),true);
  assert.equal(await browser.js("[...document.querySelectorAll('#recovery-technology input,#recovery-technology select')].every(e=>e.labels?.length>0||e.getAttribute('aria-label'))"),true);
  assert.equal(await browser.js('document.documentElement.scrollWidth>innerWidth+1'),false);
  await browser.js("document.querySelector('#recovery-technology input').focus()");await browser.send('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});await browser.send('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
  assert.equal(await browser.js("!!document.activeElement?.closest('#recovery-technology')"),true);
  if([368,383,387].includes(row.masterId)){const screenshot=await browser.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});await writeFile(path.join(out,row.masterId+'.png'),Buffer.from(screenshot.data,'base64'));}
  report.journeys.push({catalogId:row.masterId,version:row.version,finalRenderer:true,noOverflow:true,labels:true,keyboardTraversal:true});
 }
 assert.equal(report.journeys.length,19);assert.deepEqual(browser.errors,[]);assert.deepEqual(browser.network.filter(r=>!r.allowed),[]);report.passed=true;
}catch(error){report.error=String(error);throw error;}finally{report.sourceHashes={};for(const name of ['src/components/calculator-interactive.tsx','src/components/technology-input-field.tsx','tests/execution-recovery-20261109/browser-entry.tsx','tests/execution-recovery-20261109/technology-desktop.mjs'])report.sourceHashes[name]=createHash('sha256').update(await readFile(name)).digest('hex');await writeFile(path.join(out,'report.json'),JSON.stringify(report,null,2)+'\n');await browser?.close();await fixture?.close();}
console.log(JSON.stringify({out,passed:report.passed,journeys:report.journeys.length}));
