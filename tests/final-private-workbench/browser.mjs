import assert from 'node:assert/strict';
import {mkdir,mkdtemp,readFile,rename,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {startDraftPreview} from '../../scripts/draft-preview.mjs';
import {startBrowser} from '../next-runtime/cdp.mjs';

const root=path.resolve(process.env.CALCUMINT_WORKBENCH_EVIDENCE||'/workspace/work/cloud-batch06-evidence/browser');
await mkdir(root,{recursive:true});const directory=await mkdtemp(path.join(root,'run-'));
const report={journeys:[],limitations:['Synthetic Free/Pro/Business selection; no subscription/auth-provider acceptance.','Private supplied profiles and preserved original adapters only; no canonical, applicability or qualified acceptance.']};
const reference=new Map();let server,browser;
try{
 server=await startDraftPreview(0);const origin=`http://127.0.0.1:${server.httpServer.address().port}`;
 assert.equal((await fetch(origin+'/tests/final-private-workbench/')).status,401);
 assert.equal((await fetch(origin+'/src/calculators/final-private-workbench.ts')).status,401);
 const authorization='Basic '+Buffer.from('reviewer:'+server.draftPreviewAccessToken).toString('base64');
 assert.equal((await fetch(origin+'/tests/final-private-workbench/',{method:'POST',headers:{Authorization:authorization},body:'{}'})).status,405);
 assert.equal((await fetch(origin+'/tests/final-private-workbench/',{headers:{Authorization:authorization,Origin:'https://untrusted.invalid'}})).status,403);
 report.securityChecks=['unauthenticated fixture401','unauthenticated module401','mutating request405','cross-origin request403'];
 browser=await startBrowser(origin);
 await browser.send('Network.setExtraHTTPHeaders',{headers:{Authorization:'Basic '+Buffer.from('reviewer:'+server.draftPreviewAccessToken).toString('base64')}});
 await browser.send('Browser.setDownloadBehavior',{behavior:'allow',downloadPath:directory});
 const replay=await server.ssrLoadModule('/src/calculators/final-private-workbench.ts');
 const key=async(key,code,n)=>{await browser.send('Input.dispatchKeyEvent',{type:'keyDown',key,code,windowsVirtualKeyCode:n});await browser.send('Input.dispatchKeyEvent',{type:'keyUp',key,code,windowsVirtualKeyCode:n});};
 const select=async(selector,index)=>{
  await browser.until(`!!document.querySelector(${JSON.stringify(selector)})`);
  await browser.js(`document.querySelector(${JSON.stringify(selector)}).focus()`);
  await key('Home','Home',36);for(let i=0;i<index;i++)await key('ArrowDown','ArrowDown',40);await key('Tab','Tab',9);
 };
 const profiles=[['21','40'],['32','464'],['35','170'],['36','-50'],['43','384'],['46','-146'],['49','-50'],['80','100'],['81','120'],['82','150'],['84','200'],['85','0'],['86','0'],['88','1000'],['89','100'],['90','1000'],['91','1000'],['96','217.5'],['125','15'],['126','15'],['127','20'],['133','7500'],['134','12.5'],['468','Over supplied budget'],['469','256.9375'],['470','304'],['472','106'],['488','200'],['516','3.28']];
 const discovery=replay.finalPrivateDiscovery;
 await browser.visit('/tests/final-private-workbench/');
 assert.equal(await browser.js('document.querySelector("#workbench-contract").options.length'),50);
 await browser.field('#workbench-search','198 Marketplace Fee Calculator');
 await browser.until('document.querySelector("#workbench-contract").value==="198"');
 assert.equal(await browser.js('[...document.querySelectorAll("button")].some(b=>b.textContent==="Calculate")'),false);
 assert(await browser.js('document.querySelector("[role=status]").textContent.includes("Blocked")'));
 await browser.field('#workbench-search','no-such-calculator');
 await browser.until('document.querySelector("[role=status]").textContent.includes("No matching")');
 for(const width of [320,1280]){
  await browser.send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width<400});
  for(const [name,witness] of profiles)for(const [planIndex,plan] of ['free','pro','business'].entries()){
   await browser.visit('/tests/final-private-workbench/');
   await browser.field('#workbench-search',name+' '+discovery.find(r=>String(r.masterId)===name).title);await select('#workbench-plan',planIndex);
   await browser.until(`document.querySelector('#workbench-contract').value===${JSON.stringify(name)}&&document.querySelector('#workbench-plan').value===${JSON.stringify(plan)}`);
   await browser.click('Calculate');
   await browser.until(`document.querySelector('[data-testid="workbench-result"]')?.textContent===${JSON.stringify(witness)}`);
   await browser.click('Save scenario');await browser.click('Export JSON');
   const filename=`private-workbench-${name}-v1.json`;let snapshot;const end=Date.now()+10000;
   while(Date.now()<end){try{snapshot=JSON.parse(await readFile(path.join(directory,filename),'utf8'));break;}catch{await new Promise(r=>setTimeout(r,50));}}
   assert(snapshot,'Missing actual download '+filename);assert.deepEqual(replay.importFinalPrivate(snapshot),snapshot);
   if(reference.has(name))assert.deepEqual(snapshot,reference.get(name),'Mathematical/export parity across plans and viewports');else reference.set(name,snapshot);
   await rename(path.join(directory,filename),path.join(directory,`${width}-${plan}-${filename}`));
   await browser.field('#workbench-json','{}');
   assert.equal(await browser.js('!!document.querySelector("[data-testid=workbench-output]")'),false);
   assert(await browser.js(`document.querySelector('[data-testid="workbench-history"]').textContent.includes(${JSON.stringify(name)})`));
   assert.deepEqual(JSON.parse(await browser.js('document.querySelector("[data-testid=workbench-history] pre").textContent')),snapshot,'Saved history is detached from edited input');
   await browser.click('Restore scenario 1');
   await browser.until(`document.querySelector('[data-testid="workbench-result"]')?.textContent===${JSON.stringify(witness)}`);
   assert.deepEqual(JSON.parse(await browser.js('document.querySelector("#workbench-json").value')),snapshot.payload.calculation.input,'Restore original scenario inputs');
   await browser.field('#workbench-json','{}');
   await browser.click('Calculate');await browser.until('!!document.querySelector("[role=alert]")');
   await browser.field('#workbench-import',JSON.stringify(snapshot));await browser.click('Verify and restore snapshot');
   await browser.until(`document.querySelector('[data-testid="workbench-result"]')?.textContent===${JSON.stringify(witness)}`);
   await browser.click('Load example');await browser.click('Calculate');
   await browser.until(`document.querySelector('[data-testid="workbench-result"]')?.textContent===${JSON.stringify(witness)}`);
   assert.equal(await browser.js('document.documentElement.scrollWidth>innerWidth'),false);
   assert(await browser.js(`['workbench-contract','workbench-plan','workbench-json','workbench-search','workbench-import'].every(id=>!!document.querySelector('label[for="'+id+'"]'))`));
   if(plan==='business')await writeFile(path.join(directory,`${width}-${name}.png`),Buffer.from((await browser.send('Page.captureScreenshot',{format:'png'})).data,'base64'));
   report.journeys.push({name,width,plan,passed:true});
  }
 }
 assert.deepEqual(browser.errors,[]);assert.deepEqual(browser.network.filter(r=>!r.allowed),[]);
 report.pageErrors=browser.errors;report.network=browser.network;
 await writeFile(path.join(directory,'report.json'),JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({journeys:report.journeys.length,issues:0,directory}));
}finally{await browser?.close();await server?.close();}
