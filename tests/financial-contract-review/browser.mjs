import assert from 'node:assert/strict';
import {mkdir,mkdtemp,readFile,rename,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {startDraftPreview} from '../../scripts/draft-preview.mjs';
import {startBrowser} from '../next-runtime/cdp.mjs';

const root=path.resolve(process.env.CALCUMINT_FINANCIAL_EVIDENCE||'/workspace/work/cloud-batch05-evidence/browser');
await mkdir(root,{recursive:true});const directory=await mkdtemp(path.join(root,'run-'));
const report={journeys:[],limitations:['Synthetic Free/Pro/Business selection; no subscription/auth-provider acceptance.','Source-snapshot private profiles only; no canonical, applicability or qualified acceptance.']};
const reference=new Map();let server,browser;
try{
 server=await startDraftPreview(0);const origin=`http://127.0.0.1:${server.httpServer.address().port}`;
 assert.equal((await fetch(origin+'/tests/financial-contract-review/')).status,401);
 browser=await startBrowser(origin);
 await browser.send('Network.setExtraHTTPHeaders',{headers:{Authorization:'Basic '+Buffer.from('reviewer:'+server.draftPreviewAccessToken).toString('base64')}});
 await browser.send('Browser.setDownloadBehavior',{behavior:'allow',downloadPath:directory});
 const replay=await server.ssrLoadModule('/src/calculators/financial-contracts.ts');
 const key=async(key,code,n)=>{await browser.send('Input.dispatchKeyEvent',{type:'keyDown',key,code,windowsVirtualKeyCode:n});await browser.send('Input.dispatchKeyEvent',{type:'keyUp',key,code,windowsVirtualKeyCode:n});};
 const select=async(selector,index)=>{
  await browser.until(`!!document.querySelector(${JSON.stringify(selector)})`);
  await browser.js(`document.querySelector(${JSON.stringify(selector)}).focus()`);
  await key('Home','Home',36);for(let i=0;i<index;i++)await key('ArrowDown','ArrowDown',40);await key('Tab','Tab',9);
 };
 const profiles=[['21','40'],['32','464'],['36','-50'],['43','384'],['46','-146'],['49','-50'],['468','Over supplied budget'],['470','304'],['472','106']];
 for(const width of [320,1280]){
  await browser.send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width<400});
  for(const [index,[name,witness]] of profiles.entries())for(const [planIndex,plan] of ['free','pro','business'].entries()){
   await browser.visit('/tests/financial-contract-review/');
   await select('#financial-contract',index);await select('#review-plan',planIndex);
   await browser.until(`document.querySelector('#financial-contract').value===${JSON.stringify('private.financial.'+name)}&&document.querySelector('#review-plan').value===${JSON.stringify(plan)}`);
   await browser.click('Calculate');
   await browser.until(`document.querySelector('[data-testid="financial-result"]')?.textContent===${JSON.stringify(witness)}`);
   await browser.click('Save local snapshot');await browser.click('Export JSON');
   const filename=`private-financial-${name}-v1.json`;let snapshot;const end=Date.now()+10000;
   while(Date.now()<end){try{snapshot=JSON.parse(await readFile(path.join(directory,filename),'utf8'));break;}catch{await new Promise(r=>setTimeout(r,50));}}
   assert(snapshot,'Missing actual download '+filename);assert.deepEqual(replay.importFinancialContract(snapshot),snapshot);
   if(reference.has(name))assert.deepEqual(snapshot,reference.get(name),'Mathematical/export parity across plans and viewports');else reference.set(name,snapshot);
   await rename(path.join(directory,filename),path.join(directory,`${width}-${plan}-${filename}`));
   await browser.field('#financial-json','{}');
   assert.equal(await browser.js('!!document.querySelector("[data-testid=financial-output]")'),false);
   assert(await browser.js(`document.querySelector('[data-testid="financial-history"]').textContent.includes(${JSON.stringify(name)})`));
   await browser.click('Calculate');await browser.until('!!document.querySelector("[role=alert]")');
   await browser.click('Load example');await browser.click('Calculate');
   await browser.until(`document.querySelector('[data-testid="financial-result"]')?.textContent===${JSON.stringify(witness)}`);
   assert.equal(await browser.js('document.documentElement.scrollWidth>innerWidth'),false);
   assert(await browser.js(`['financial-contract','review-plan','financial-json'].every(id=>!!document.querySelector('label[for="'+id+'"]'))`));
   if(plan==='business')await writeFile(path.join(directory,`${width}-${name}.png`),Buffer.from((await browser.send('Page.captureScreenshot',{format:'png'})).data,'base64'));
   report.journeys.push({name,width,plan,passed:true});
  }
 }
 assert.deepEqual(browser.errors,[]);assert.deepEqual(browser.network.filter(r=>!r.allowed),[]);
 report.pageErrors=browser.errors;report.network=browser.network;
 await writeFile(path.join(directory,'report.json'),JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({journeys:report.journeys.length,issues:0,directory}));
}finally{await browser?.close();await server?.close();}
