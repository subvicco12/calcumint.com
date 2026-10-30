import assert from 'node:assert/strict';
import {mkdir,mkdtemp,readFile,rename,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {startDraftPreview} from '../../scripts/draft-preview.mjs';
import {startBrowser} from '../next-runtime/cdp.mjs';

const root=path.resolve(process.env.CALCUMINT_COMPONENT_ENGINEERING_EVIDENCE||'/workspace/work/cloud-batch08-evidence/browser');
await mkdir(root,{recursive:true});const directory=await mkdtemp(path.join(root,'run-'));
const report={journeys:[],limitations:['Synthetic Free/Pro/Business selection; no subscription/auth-provider acceptance.','Private supplied profiles and preserved original adapters only; no canonical, applicability or qualified acceptance.']};
const reference=new Map();let server,browser;
try{
 server=await startDraftPreview(0);const origin=`http://127.0.0.1:${server.httpServer.address().port}`;
 assert.equal((await fetch(origin+'/tests/component-engineering-review/')).status,401);
 assert.equal((await fetch(origin+'/src/calculators/component-contracts.ts')).status,401);
 const authorization='Basic '+Buffer.from('reviewer:'+server.draftPreviewAccessToken).toString('base64');
 assert.equal((await fetch(origin+'/tests/component-engineering-review/',{method:'POST',headers:{Authorization:authorization},body:'{}'})).status,405);
 assert.equal((await fetch(origin+'/tests/component-engineering-review/',{headers:{Authorization:authorization,Origin:'https://untrusted.invalid'}})).status,403);
 assert.equal((await fetch(origin+'/docs/cloud-batch08/implementation-manifest.json')).status,401);
 const manifestReply=await fetch(origin+'/docs/cloud-batch08/implementation-manifest.json',{headers:{Authorization:authorization}});assert.equal(manifestReply.status,200);const inventory=await manifestReply.json();assert.equal(inventory.rows.length,540);assert.deepEqual(inventory.summary.classes,{REGISTERED_IMPLEMENTED:305,PRIVATE_COMPLETE:141,COMPONENT_ONLY:51,CONTRACT_BLOCKED:43,MISSING_ENGINE:0,UNKNOWN:0});
 report.inventoryTransport={rows:inventory.rows.length,classes:inventory.summary.classes};
 report.securityChecks=['unauthenticated fixture401','unauthenticated module401','mutating request405','cross-origin request403','unauthenticated manifest401','authenticated manifest540'];
 browser=await startBrowser(origin);
 await browser.send('Network.setExtraHTTPHeaders',{headers:{Authorization:'Basic '+Buffer.from('reviewer:'+server.draftPreviewAccessToken).toString('base64')}});
 await browser.send('Browser.setDownloadBehavior',{behavior:'allow',downloadPath:directory});
 const replay=await server.ssrLoadModule('/src/calculators/component-contracts.ts');
 const key=async(key,code,n)=>{await browser.send('Input.dispatchKeyEvent',{type:'keyDown',key,code,windowsVirtualKeyCode:n});await browser.send('Input.dispatchKeyEvent',{type:'keyUp',key,code,windowsVirtualKeyCode:n});};
 const select=async(selector,index)=>{
  await browser.until(`!!document.querySelector(${JSON.stringify(selector)})`);
  await browser.js(`document.querySelector(${JSON.stringify(selector)}).focus()`);
  await key('Home','Home',36);for(let i=0;i<index;i++)await key('ArrowDown','ArrowDown',40);await key('Tab','Tab',9);
 };
 const profiles=[["3", "400"], ["4", "3"], ["5", "400"], ["6", "400"], ["7", "400"], ["8", "400"], ["11", "3"], ["12", "1000"], ["13", "10"], ["14", "1"], ["15", "1"], ["16", "1"], ["17", "1"], ["22", "400"], ["24", "2.02"], ["27", "400"], ["28", "3"], ["29", "400"], ["30", "1000"], ["31", "200"], ["33", "1"], ["104", "1000"], ["105", "1000"], ["426", "1000"], ["506", "236.58824"]];
 await browser.visit('/tests/component-engineering-review/');
 assert.equal(await browser.js('document.querySelector("#catalog-identity").options.length'),540);
 await browser.field('#catalog-search','198');
 await browser.until('document.querySelector("#catalog-identity").value==="198"');
 assert.equal(await browser.js('[...document.querySelectorAll("button")].some(b=>b.textContent==="Calculate")'),false);
 assert(await browser.js('document.querySelector("[data-testid=identity-status]").textContent.includes("CONTRACT_BLOCKED")'));
 await browser.field('#catalog-search','no-such-calculator');
 await browser.until('document.querySelector("[role=status]").textContent.includes("No matching")');
 await browser.field('#catalog-search','3');
 await browser.field('#component-json',JSON.stringify({currency:'USD',scope:'supplied-fixed-monthly-no-policy',principal:1200,annualRatePercent:1000,termMonths:1200,extraMonthlyPayment:0}));
 await browser.click('Calculate');await browser.until('!!document.querySelector("[role=alert]")');
 assert.equal(await browser.js('!!document.querySelector("[data-testid=component-result]")'),false);
 report.extremeRateBoundaryRejected=true;
 for(const width of [320,1280]){
  await browser.send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width<400});
  for(const [name,witness] of profiles)for(const [planIndex,plan] of ['free','pro','business'].entries()){
   await browser.visit('/tests/component-engineering-review/');
   await browser.field('#catalog-search',name);await select('#component-plan',planIndex);
   await browser.until(`document.querySelector('#catalog-identity').value===${JSON.stringify(name)}&&document.querySelector('#component-plan').value===${JSON.stringify(plan)}`);
   await browser.click('Calculate');
   await browser.until(`document.querySelector('[data-testid="component-result"]')?.textContent===${JSON.stringify(witness)}`);
   await browser.click('Save scenario');await browser.click('Export JSON');
   const filename=`private-component-${name}-v1.json`;let snapshot;const end=Date.now()+10000;
   while(Date.now()<end){try{snapshot=JSON.parse(await readFile(path.join(directory,filename),'utf8'));break;}catch{await new Promise(r=>setTimeout(r,50));}}
   assert(snapshot,'Missing actual download '+filename);assert.deepEqual(replay.importComponentContract(snapshot),snapshot);
   if(reference.has(name))assert.deepEqual(snapshot,reference.get(name),'Mathematical/export parity across plans and viewports');else reference.set(name,snapshot);
   await rename(path.join(directory,filename),path.join(directory,`${width}-${plan}-${filename}`));
   await browser.field('#component-json','{}');
   assert.equal(await browser.js('!!document.querySelector("[data-testid=component-output]")'),false);
   assert(await browser.js(`document.querySelector('[data-testid="component-history"]').textContent.includes(${JSON.stringify(name)})`));
   assert.deepEqual(JSON.parse(await browser.js('document.querySelector("[data-testid=component-history] pre").textContent')),snapshot,'Saved history is detached from edited input');
   await browser.click('Restore scenario 1');
   await browser.until(`document.querySelector('[data-testid="component-result"]')?.textContent===${JSON.stringify(witness)}`);
   assert.deepEqual(JSON.parse(await browser.js('document.querySelector("#component-json").value')),snapshot.calculation.input,'Restore original scenario inputs');
   await browser.field('#component-json','{}');
   await browser.click('Calculate');await browser.until('!!document.querySelector("[role=alert]")');
   await browser.field('#component-import',JSON.stringify(snapshot));await browser.click('Verify and restore snapshot');
   await browser.until(`document.querySelector('[data-testid="component-result"]')?.textContent===${JSON.stringify(witness)}`);
   await browser.click('Load example');await browser.click('Calculate');
   await browser.until(`document.querySelector('[data-testid="component-result"]')?.textContent===${JSON.stringify(witness)}`);
   assert.equal(await browser.js('document.documentElement.scrollWidth>innerWidth'),false);
   assert(await browser.js(`['catalog-identity','component-plan','component-json','catalog-search','component-import','catalog-class'].every(id=>!!document.querySelector('label[for="'+id+'"]'))`));
   if(plan==='business')await writeFile(path.join(directory,`${width}-${name}.png`),Buffer.from((await browser.send('Page.captureScreenshot',{format:'png'})).data,'base64'));
   report.journeys.push({name,width,plan,passed:true});
  }
 }
 assert.deepEqual(browser.errors,[]);assert.deepEqual(browser.network.filter(r=>!r.allowed),[]);
 report.pageErrors=browser.errors;report.network=browser.network;
 await writeFile(path.join(directory,'report.json'),JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({journeys:report.journeys.length,issues:0,directory}));
}catch(error){await writeFile(path.join(directory,'failure.json'),JSON.stringify({error:String(error),completed:report.journeys.length,pageErrors:browser?.errors,network:browser?.network},null,2)+'\n');throw error;}finally{await browser?.close();await server?.close();}
