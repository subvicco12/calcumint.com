import assert from 'node:assert/strict';
import {mkdir,mkdtemp,readFile,rename,writeFile} from 'node:fs/promises';
import path from 'node:path';
import net from 'node:net';
import {startDraftPreview} from '../../scripts/draft-preview.mjs';
import {startBrowser} from '../next-runtime/cdp.mjs';
const reportPath=path.resolve(process.env.COMPONENT_BROWSER_REPORT||'/tmp/calcumint-component-browser-report.json');
await mkdir(path.dirname(reportPath),{recursive:true});
const downloads=await mkdtemp('/tmp/calcumint-component-downloads-');
const report={kind:'25_CURRENT_WORKFLOW_TEXT_BOUNDARIES_NOT_FULL_PRODUCT_ACCEPTANCE',releaseHold:true,journeys:[],downloads,canonicalAccepted:false};
let server,browser;
const lossy=text=>text.replace(/-?\d+(?:\.\d+)?(?=[,}\]])/,n=>Number(n)===0?'1e-400':n+(n.includes('.')?'00000000000000000001':'.00000000000000000001'));
try{
 const reservation=net.createServer();await new Promise((resolve,reject)=>{reservation.once('error',reject);reservation.listen(0,'127.0.0.1',resolve);});const port=reservation.address().port;await new Promise((resolve,reject)=>reservation.close(e=>e?reject(e):resolve()));
 server=await startDraftPreview(port);assert.equal(server.httpServer.address().port,port);
 const origin=`http://127.0.0.1:${port}`;browser=await startBrowser(origin);
 await browser.send('Network.setExtraHTTPHeaders',{headers:{Authorization:'Basic '+Buffer.from('reviewer:'+server.draftPreviewAccessToken).toString('base64')}});
 await browser.send('Browser.setDownloadBehavior',{behavior:'allow',downloadPath:downloads});
 const workbenchModule=await server.ssrLoadModule('/src/calculators/component-contracts.ts');
 await browser.visit('/tests/component-engineering-review/');
 for(const [id,input] of Object.entries(workbenchModule.componentExamples)){
  await browser.field('#catalog-search',id);await browser.until(`document.querySelector('#catalog-identity').value===${JSON.stringify(id)}`);
  await browser.click('Load example');await browser.click('Calculate');await browser.until('!!document.querySelector("[data-testid=component-result]")');
  const draft=lossy(JSON.stringify(input));assert.deepEqual(JSON.parse(draft),input);
  await browser.field('#component-json',draft);await browser.click('Calculate');await browser.until('!!document.querySelector("[role=alert]")');
  assert.equal(await browser.js('!!document.querySelector("[data-testid=component-result]")'),false);
  assert.equal(await browser.js('document.querySelector("#component-json").value'),draft);
  assert.equal(await browser.js('[...document.querySelectorAll("button")].some(b=>b.textContent==="Export JSON")'),false);
  report.journeys.push({masterId:Number(id),validExample:true,lossyRawDigitsRejected:true,rawTextRetained:true,exportSuppressed:true});
 }
 for(const width of [320,1280]){
  await browser.send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width===320});
  await browser.field('#catalog-search','426');await browser.until('document.querySelector("#catalog-identity").value==="426"');
  await browser.click('Load example');await browser.click('Calculate');await browser.click('Clear scenarios');await browser.click('Save scenario');
  for(const [index,plan] of ['free','pro','business'].entries()){
   await browser.js('document.querySelector("#component-plan").focus()');
   for(const [key,code,n] of [['Home','Home',36],...Array.from({length:index},()=>['ArrowDown','ArrowDown',40]),['Tab','Tab',9]]){
    await browser.send('Input.dispatchKeyEvent',{type:'keyDown',key,code,windowsVirtualKeyCode:n});await browser.send('Input.dispatchKeyEvent',{type:'keyUp',key,code,windowsVirtualKeyCode:n});
   }
   await browser.until(`document.querySelector('#component-plan').value===${JSON.stringify(plan)}`);
   await browser.click('Calculate');await browser.until('document.querySelector("[data-testid=component-result]")?.textContent==="1000"');await browser.click('Export JSON');
   const file=path.join(downloads,'private-component-426-v1.json');let bytes;
   const deadline=Date.now()+10000;while(Date.now()<deadline){try{const candidate=await readFile(file,'utf8');JSON.parse(candidate);bytes=candidate;break;}catch{await new Promise(r=>setTimeout(r,40));}}
   assert(bytes,'Actual browser download absent');assert.deepEqual(workbenchModule.importComponentContract(JSON.parse(bytes)),workbenchModule.exportComponentContract(426,workbenchModule.componentExamples[426]));
   await rename(file,path.join(downloads,`${width}-${plan}.json`));
   for(const field of ['masterId','schemaVersion','calculatorVersion']){
    const forged=bytes.replace(new RegExp('("'+field+'"\\s*:\\s*)(\\d+)'),(_,key,n)=>key+n+'.00000000000000001');assert.deepEqual(JSON.parse(forged),JSON.parse(bytes));
    await browser.field('#component-import',forged);await browser.click('Verify and restore snapshot');await browser.until('!!document.querySelector("[role=alert]")');
    assert.equal(await browser.js('!!document.querySelector("[data-testid=component-result]")'),false);
   }
   await browser.click('Restore scenario 1');assert.equal(await browser.js('document.querySelector("[data-testid=component-result]").textContent'),'1000');
   await browser.field('#component-import',bytes);await browser.click('Verify and restore snapshot');await browser.until('document.querySelector("[data-testid=component-result]")?.textContent==="1000"');
   assert.equal(await browser.js('document.documentElement.scrollWidth>innerWidth'),false);
   report.journeys.push({masterId:426,width,plan,actualDownloadReplayed:true,forgedIdentityRevisionRejected:true,historyRecovered:true,canonicalArtifactRestored:true});
  }
  await writeFile(path.join(downloads,`${width}-426.png`),Buffer.from((await browser.send('Page.captureScreenshot',{format:'png'})).data,'base64'));
 }
 assert.deepEqual(browser.errors,[]);assert.deepEqual(browser.network.filter(r=>!r.allowed),[]);
 report.passed=true;report.pageErrors=browser.errors;report.unexpectedNetwork=browser.network.filter(r=>!r.allowed);
 await writeFile(reportPath,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({reportPath,journeys:report.journeys.length,downloads}));
}catch(error){report.passed=false;report.error=String(error);report.pageErrors=browser?.errors;await writeFile(reportPath,JSON.stringify(report,null,2)+'\n');throw error;}finally{await browser?.close();await server?.close();}
