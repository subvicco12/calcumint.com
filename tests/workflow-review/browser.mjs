import assert from 'node:assert/strict';
import {mkdir,mkdtemp,readFile,readdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {startDraftPreview} from '../../scripts/draft-preview.mjs';
import {startBrowser} from '../next-runtime/cdp.mjs';

// Real Chromium, authenticated loopback only. No production/account transport.
const evidenceRoot=path.resolve(process.env.CALCUMINT_WORKFLOW_EVIDENCE||'/workspace/work/cloud-final/browser');
await mkdir(evidenceRoot,{recursive:true});
const directory=await mkdtemp(path.join(evidenceRoot,'run-'));
let server,browser;
const report={journeys:[],limitations:['Private synthetic supplied scenarios only; no canonical acceptance.','No authenticated account persistence, physical device or provider sandbox acceptance.']};
try{
 server=await startDraftPreview(0);
 const origin=`http://127.0.0.1:${server.httpServer.address().port}`;
 const unauth=await fetch(origin+'/tests/workflow-review/');assert.equal(unauth.status,401);
 const authorization='Basic '+Buffer.from('reviewer:'+server.draftPreviewAccessToken).toString('base64');
 browser=await startBrowser(origin);
 await browser.send('Network.setExtraHTTPHeaders',{headers:{Authorization:authorization}});
 await browser.send('Browser.setDownloadBehavior',{behavior:'allow',downloadPath:directory});
 const replay=await server.ssrLoadModule('/src/calculators/private-scenario-workflows.ts');
 for(const width of [320,1280]){
  await browser.send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<400});
  for(const [id,witness] of [['disclosed-lease','256.9375'],['heat-costs','"savings": 220'],['target-trajectory','"firstTargetPeriod": 2']]){
   await browser.visit('/tests/workflow-review/');
   await browser.until('!!document.querySelector("#workflow")');
   // Select with native focus and trusted keyboard events.
   await browser.js('document.querySelector("#workflow").focus()');
   await browser.send('Input.dispatchKeyEvent',{type:'keyDown',key:'Home',code:'Home',windowsVirtualKeyCode:36});
   await browser.send('Input.dispatchKeyEvent',{type:'keyUp',key:'Home',code:'Home',windowsVirtualKeyCode:36});
   const index=['disclosed-lease','heat-costs','target-trajectory'].indexOf(id);
   for(let i=0;i<index;i++){
    await browser.send('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowDown',code:'ArrowDown',windowsVirtualKeyCode:40});
    await browser.send('Input.dispatchKeyEvent',{type:'keyUp',key:'ArrowDown',code:'ArrowDown',windowsVirtualKeyCode:40});
   }
   await browser.send('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
   await browser.send('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
   await browser.until(`document.querySelector('#workflow').value===${JSON.stringify('private.workflow.'+id)}`);
   await browser.click('Calculate');
   await browser.until(`document.querySelector('[data-testid="workflow-output"]')?.textContent.includes(${JSON.stringify(witness)})`);
   await browser.click('Save local snapshot');
   await browser.click('Export JSON');
   const filename=`private-workflow-${id}-v1.json`;
   const deadline=Date.now()+10000;let downloaded;
   while(Date.now()<deadline){try{downloaded=JSON.parse(await readFile(path.join(directory,filename),'utf8'));break;}catch{await new Promise(r=>setTimeout(r,50));}}
   assert(downloaded,'Missing actual download '+filename);
   assert.equal(downloaded.workflowId,'private.workflow.'+id);
   assert.deepEqual(replay.importPrivateWorkflow(downloaded),downloaded);
   await browser.field('#scenario-json','{');
   assert.equal(await browser.js('!!document.querySelector("[data-testid=workflow-output]")'),false);
   assert(await browser.js(`document.querySelector('[data-testid="local-history"]').textContent.includes(${JSON.stringify(witness)})`));
   await browser.click('Calculate');await browser.until('!!document.querySelector("[role=alert]")');
   await browser.click('Load example');await browser.click('Calculate');
   await browser.until(`document.querySelector('[data-testid="workflow-output"]')?.textContent.includes(${JSON.stringify(witness)})`);
   assert.equal(await browser.js('document.documentElement.scrollWidth>innerWidth'),false);
   const labels=await browser.js(`['workflow','scenario-json'].every(id=>!!document.querySelector('label[for="'+id+'"]'))`);assert(labels);
   const shot=await browser.send('Page.captureScreenshot',{format:'png'});
   await writeFile(path.join(directory,`${id}-${width}.png`),Buffer.from(shot.data,'base64'));
   report.journeys.push({id,width,result:'passed',download:filename});
   // Keep each journey's file unique so the next download must really arrive.
   const {rename}=await import('node:fs/promises');
   await rename(path.join(directory,filename),path.join(directory,`${width}-${filename}`));
  }
 }
 assert.deepEqual(browser.errors,[]);
 assert.deepEqual(browser.network.filter(r=>!r.allowed),[]);
 report.network=browser.network;report.pageErrors=browser.errors;
 report.files=(await readdir(directory)).sort();
 await writeFile(path.join(directory,'report.json'),JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({journeys:report.journeys.length,issues:0,directory}));
}finally{
 await browser?.close();await server?.close();
}
