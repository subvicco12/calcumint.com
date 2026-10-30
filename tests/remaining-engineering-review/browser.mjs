import assert from 'node:assert/strict';
import {mkdir,mkdtemp,readFile,rename,writeFile} from 'node:fs/promises';
import path from 'node:path';
import net from 'node:net';
import {startDraftPreview} from '../../scripts/draft-preview.mjs';
import {startBrowser} from '../next-runtime/cdp.mjs';

const root=path.resolve(process.env.CALCUMINT_REMAINING_ENGINEERING_EVIDENCE||'/workspace/work/cloud-batch09-evidence/browser');
await mkdir(root,{recursive:true});const directory=await mkdtemp(path.join(root,'run-'));
const report={journeys:[],limitations:['Synthetic Free/Pro/Business selection; no subscription/auth-provider acceptance.','Private supplied profiles and preserved original adapters only; no canonical, applicability or qualified acceptance.']};
const reference=new Map();let server,browser;
try{
 // Use a nonzero OS-selected port: Vite treats port0 as its default5173.
 const reservation=net.createServer();await new Promise((resolve,reject)=>{reservation.once('error',reject);reservation.listen(0,'127.0.0.1',resolve);});const requestedPort=reservation.address().port;await new Promise((resolve,reject)=>reservation.close(error=>error?reject(error):resolve()));
 server=await startDraftPreview(requestedPort);assert.equal(server.httpServer.address().port,requestedPort);const origin=`http://127.0.0.1:${server.httpServer.address().port}`;
 assert.equal((await fetch(origin+'/tests/remaining-engineering-review/')).status,401);
 assert.equal((await fetch(origin+'/src/calculators/remaining-contracts.ts')).status,401);
 const authorization='Basic '+Buffer.from('reviewer:'+server.draftPreviewAccessToken).toString('base64');
 assert.equal((await fetch(origin+'/tests/remaining-engineering-review/',{method:'POST',headers:{Authorization:authorization},body:'{}'})).status,405);
 assert.equal((await fetch(origin+'/tests/remaining-engineering-review/',{headers:{Authorization:authorization,Origin:'https://untrusted.invalid'}})).status,403);
 assert.equal((await fetch(origin+'/docs/cloud-batch09/implementation-manifest.json')).status,401);
 const manifestReply=await fetch(origin+'/docs/cloud-batch09/implementation-manifest.json',{headers:{Authorization:authorization}});assert.equal(manifestReply.status,200);const inventory=await manifestReply.json();assert.equal(inventory.rows.length,540);assert.deepEqual(inventory.summary.classes,{REGISTERED_IMPLEMENTED:305,PRIVATE_COMPLETE:192,COMPONENT_ONLY:0,CONTRACT_BLOCKED:43,MISSING_ENGINE:0,UNKNOWN:0});
 report.inventoryTransport={rows:inventory.rows.length,classes:inventory.summary.classes};
 report.securityChecks=['unauthenticated fixture401','unauthenticated module401','mutating request405','cross-origin request403','unauthenticated manifest401','authenticated manifest540'];
 browser=await startBrowser(origin);
 await browser.send('Network.setExtraHTTPHeaders',{headers:{Authorization:'Basic '+Buffer.from('reviewer:'+server.draftPreviewAccessToken).toString('base64')}});
 await browser.send('Browser.setDownloadBehavior',{behavior:'allow',downloadPath:directory});
 const replay=await server.ssrLoadModule('/src/calculators/remaining-contracts.ts');
 const key=async(key,code,n)=>{await browser.send('Input.dispatchKeyEvent',{type:'keyDown',key,code,windowsVirtualKeyCode:n});await browser.send('Input.dispatchKeyEvent',{type:'keyUp',key,code,windowsVirtualKeyCode:n});};
 const select=async(selector,index)=>{
  await browser.until(`!!document.querySelector(${JSON.stringify(selector)})`);
  await browser.js(`document.querySelector(${JSON.stringify(selector)}).focus()`);
  await key('Home','Home',36);for(let i=0;i<index;i++)await key('ArrowDown','ArrowDown',40);await key('Tab','Tab',9);
 };
 const profiles=[["25", 400], ["37", 300], ["45", 121], ["47", 21], ["57", 121], ["58", 300], ["59", 121], ["60", 100], ["61", 100], ["62", 10], ["63", 2], ["66", 10], ["67", 0], ["68", 4.761904761904762], ["69", 4.761904761904762], ["70", 13.333333333333334], ["71", 0], ["72", 10], ["73", 100], ["74", 5], ["75", 10], ["76", 21], ["77", 21], ["78", 8], ["79", 12], ["83", 100], ["93", 20], ["94", 80], ["100", 300], ["101", 20], ["102", 20], ["106", 100], ["107", 300], ["108", 300], ["110", 25], ["111", 52000], ["113", 10], ["114", 80], ["115", 125], ["116", 20], ["117", 20], ["118", 80], ["119", 20], ["465", 8], ["466", 7000], ["473", 4.5], ["477", 20], ["480", 8], ["494", 101325], ["528", 183.75], ["537", 101325]];
 await browser.visit('/tests/remaining-engineering-review/');
 assert.equal(await browser.js('document.querySelector("#catalog-identity").options.length'),540);
 await browser.field('#catalog-search','198');
 await browser.until('document.querySelector("#catalog-identity").value==="198"');
 assert.equal(await browser.js('[...document.querySelectorAll("button")].some(b=>b.textContent==="Calculate")'),false);
 assert(await browser.js('document.querySelector("[data-testid=identity-status]").textContent.includes("CONTRACT_BLOCKED")'));
 await browser.field('#catalog-search','no-such-calculator');
 await browser.until('document.querySelector("[role=status]").textContent.includes("No matching")');
 await browser.field('#catalog-search','25');
 await browser.field('#remaining-json',JSON.stringify({scope:'supplied-mathematical-scenario',currency:'USD',balance:1200,annualAprPercent:0,firstPaymentDate:'2027-02-29',targetPaymentDate:'2027-03-31',monthRule:'end-of-month'}));
 await browser.click('Calculate');await browser.until('!!document.querySelector("[role=alert]")');
 assert.equal(await browser.js('!!document.querySelector("[data-testid=remaining-result]")'),false);
 report.invalidCalendarBoundaryRejected=true;
 for(const width of [320,1280]){
  await browser.send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width<400});
  await browser.visit('/tests/remaining-engineering-review/');
  for(const [name,witness] of profiles)for(const [planIndex,plan] of ['free','pro','business'].entries()){
   await browser.field('#catalog-search',name);
   await browser.until(`document.querySelector('#catalog-identity').value===${JSON.stringify(name)}`);
   await browser.click('Load example');await browser.click('Clear scenarios');
   assert.equal(await browser.js('document.querySelector("[data-testid=remaining-history]").children.length'),0);
   assert.equal(await browser.js('!!document.querySelector("[data-testid=remaining-result]")'),false);
   await select('#remaining-plan',planIndex);
   await browser.until(`document.querySelector('#catalog-identity').value===${JSON.stringify(name)}&&document.querySelector('#remaining-plan').value===${JSON.stringify(plan)}`);
   await browser.click('Calculate');
   await browser.until(`Math.abs(Number(document.querySelector('[data-testid="remaining-result"]')?.textContent)-${JSON.stringify(witness)})<=1e-7*Math.max(1,Math.abs(${JSON.stringify(witness)}))`);
   await browser.click('Save scenario');await browser.click('Export JSON');
   const filename=`private-remaining-${name}-v1.json`;let snapshot;const end=Date.now()+10000;
   while(Date.now()<end){try{snapshot=JSON.parse(await readFile(path.join(directory,filename),'utf8'));break;}catch{await new Promise(r=>setTimeout(r,50));}}
   assert(snapshot,'Missing actual download '+filename);assert.deepEqual(replay.importRemainingContract(snapshot),snapshot);
   if(reference.has(name))assert.deepEqual(snapshot,reference.get(name),'Mathematical/export parity across plans and viewports');else reference.set(name,snapshot);
   await rename(path.join(directory,filename),path.join(directory,`${width}-${plan}-${filename}`));
   await browser.field('#remaining-json','{}');
   assert.equal(await browser.js('!!document.querySelector("[data-testid=remaining-output]")'),false);
   assert(await browser.js(`document.querySelector('[data-testid="remaining-history"]').textContent.includes(${JSON.stringify(name)})`));
   assert.deepEqual(JSON.parse(await browser.js('document.querySelector("[data-testid=remaining-history] pre").textContent')),snapshot,'Saved history is detached from edited input');
   await browser.click('Restore scenario 1');
   await browser.until(`Math.abs(Number(document.querySelector('[data-testid="remaining-result"]')?.textContent)-${JSON.stringify(witness)})<=1e-7*Math.max(1,Math.abs(${JSON.stringify(witness)}))`);
   assert.deepEqual(JSON.parse(await browser.js('document.querySelector("#remaining-json").value')),snapshot.calculation.input,'Restore original scenario inputs');
   await browser.field('#remaining-json','{}');
   await browser.click('Calculate');await browser.until('!!document.querySelector("[role=alert]")');
   await browser.field('#remaining-import',JSON.stringify(snapshot));await browser.click('Verify and restore snapshot');
   await browser.until(`Math.abs(Number(document.querySelector('[data-testid="remaining-result"]')?.textContent)-${JSON.stringify(witness)})<=1e-7*Math.max(1,Math.abs(${JSON.stringify(witness)}))`);
   await browser.click('Load example');await browser.click('Calculate');
   await browser.until(`Math.abs(Number(document.querySelector('[data-testid="remaining-result"]')?.textContent)-${JSON.stringify(witness)})<=1e-7*Math.max(1,Math.abs(${JSON.stringify(witness)}))`);
   assert.equal(await browser.js('document.documentElement.scrollWidth>innerWidth'),false);
   assert(await browser.js(`['catalog-identity','remaining-plan','remaining-json','catalog-search','remaining-import','catalog-class'].every(id=>!!document.querySelector('label[for="'+id+'"]'))`));
   if(plan==='business')await writeFile(path.join(directory,`${width}-${name}.png`),Buffer.from((await browser.send('Page.captureScreenshot',{format:'png'})).data,'base64'));
   report.journeys.push({name,width,plan,passed:true});
  }
 }
 assert.deepEqual(browser.errors,[]);assert.deepEqual(browser.network.filter(r=>!r.allowed),[]);
 report.pageErrors=browser.errors;report.network=browser.network;
 await writeFile(path.join(directory,'report.json'),JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({journeys:report.journeys.length,issues:0,directory}));
}catch(error){await writeFile(path.join(directory,'failure.json'),JSON.stringify({error:String(error),completed:report.journeys.length,pageErrors:browser?.errors,network:browser?.network},null,2)+'\n');throw error;}finally{await browser?.close();await server?.close();}
