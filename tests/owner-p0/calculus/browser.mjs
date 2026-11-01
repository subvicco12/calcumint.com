import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import net from 'node:net';
import {startDraftPreview} from '../../../scripts/draft-preview.mjs';
import {startBrowser} from '../../next-runtime/cdp.mjs';
const directory=process.env.OWNER_CALCULUS_EVIDENCE||'/tmp/owner-p0-calculus-browser';
await mkdir(directory,{recursive:true});
let server,browser;
const receipt={scope:'isolated private review',journeys:[],fullDomainProof:false};
try{
 const reserve=net.createServer();await new Promise(r=>reserve.listen(0,'127.0.0.1',r));const port=reserve.address().port;await new Promise(r=>reserve.close(r));
 server=await startDraftPreview(port);const origin=`http://127.0.0.1:${port}`;
 browser=await startBrowser(origin);await browser.send('Network.setExtraHTTPHeaders',{headers:{Authorization:'Basic '+Buffer.from('reviewer:'+server.draftPreviewAccessToken).toString('base64')}});
 const math=await server.ssrLoadModule('/src/calculators/canonical-calculus-workflow.ts');
 for(const width of [360,1440]){
  await browser.send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width<400});await browser.visit('/tests/canonical-calculus-workbench/');await browser.until('!!document.querySelector("#cc-operation")');
  await browser.js(`(()=>{const e=document.querySelector('#cc-operation');e.value='limit';e.dispatchEvent(new Event('change',{bubbles:true}));})()`);
  await browser.field('#cc-expression','-2/(x-1)^2');await browser.field('#cc-x','1');await browser.click('Calculate');await browser.until(`document.querySelector('[data-testid=cc-primary]')?.textContent==='−∞'||document.querySelector('[data-testid=cc-primary]')?.textContent==='-∞'`);
  assert((await browser.js('document.querySelector("[data-anchor=true]").textContent')).includes('unbounded'));
  const actual=math.exportCanonicalCalculation({calculation:{operation:'limit',expression:'-2/(x-1)^2',x:'1',direction:'both'},plot:{enabled:true,radius:'1',samples:17}});
  assert.equal(actual.calculation.output.structured.series.length,2);
  assert.equal(await browser.js('document.querySelectorAll("[data-testid=cc-table] tbody tr").length'),17);
  for(const tamper of ['row','source','direction']){
   const forged=structuredClone(actual);
   if(tamper==='row')forged.calculation.output.rows[0].coordinate='999';
   if(tamper==='source')forged.source.nativeBlueprintSHA256='0'.repeat(64);
   if(tamper==='direction')forged.calculation.input.calculation.direction='right';
   await browser.field('#cc-import',JSON.stringify(forged));await browser.click('Verify and restore calculation');await browser.until('!!document.querySelector("[role=alert]")');assert.equal(await browser.js('!!document.querySelector("[data-testid=cc-primary]")'),false);
  }
  assert.equal(await browser.js('document.documentElement.scrollWidth>innerWidth'),false);
  assert(await browser.js('[...document.querySelectorAll("input:not([type=checkbox]),select,textarea")].every(e=>!!document.querySelector(`label[for="${e.id}"]`))'));
  await browser.js('document.querySelector("#cc-expression").focus()');await browser.send('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});await browser.send('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});assert(await browser.js('document.activeElement!==document.body'));
  receipt.journeys.push({width,negativeEvenPole:true,rows:17,segments:2,chartTamperRejected:true,sourceTamperRejected:true,directionTamperRejected:true,labels:true,keyboardFocus:true,noHorizontalOverflow:true});
 }
 assert.deepEqual(browser.errors,[]);assert.deepEqual(browser.network.filter(n=>!n.allowed),[]);await writeFile(path.join(directory,'receipt.json'),JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt));
}catch(error){await writeFile(path.join(directory,'failure.json'),JSON.stringify({error:String(error),receipt},null,2));throw error;}finally{await browser?.close();await server?.close();}
