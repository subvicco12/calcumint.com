import assert from 'node:assert/strict';
import {mkdir,mkdtemp,readFile,writeFile,rename} from 'node:fs/promises';
import path from 'node:path';
import net from 'node:net';
import {startDraftPreview} from '../../scripts/draft-preview.mjs';
import {startBrowser} from '../next-runtime/cdp.mjs';
const evidence=process.env.CALCULUS_RECOVERY_EVIDENCE||'/tmp/calcumint-calculus-recovery';
await mkdir(evidence,{recursive:true});
const directory=await mkdtemp(path.join(evidence,'run-'));
const receipt={schemaVersion:1,scope:'Private presentation recovery over unchanged calculus revisions2/3; no canonical acceptance.',journeys:[]};
let server,browser;
try{
 const reserve=net.createServer();await new Promise((resolve,reject)=>{reserve.once('error',reject);reserve.listen(0,'127.0.0.1',resolve);});const port=reserve.address().port;await new Promise((resolve,reject)=>reserve.close(error=>error?reject(error):resolve()));
 server=await startDraftPreview(port,{fixture:'catalog'});const origin=`http://127.0.0.1:${port}`,headers={Authorization:'Basic '+Buffer.from('reviewer:'+server.draftPreviewAccessToken).toString('base64')};
 assert.equal((await fetch(origin+'/tests/calculus-recovery-workbench/')).status,401);
 const math=await server.ssrLoadModule('/src/calculators/canonical-calculus-workflow.ts'),legacy=await server.ssrLoadModule('/src/calculators/private-calculus-successor.ts');
 browser=await startBrowser(origin);await browser.send('Network.setExtraHTTPHeaders',{headers});await browser.send('Browser.setDownloadBehavior',{behavior:'allow',downloadPath:directory});
 async function key(key,code,n){await browser.send('Input.dispatchKeyEvent',{type:'keyDown',key,code,windowsVirtualKeyCode:n,...(key==='Enter'?{text:'\r',unmodifiedText:'\r',nativeVirtualKeyCode:13}:{})});await browser.send('Input.dispatchKeyEvent',{type:'keyUp',key,code,windowsVirtualKeyCode:n});}
 async function select(id,index){await browser.js(`document.querySelector(${JSON.stringify(id)}).focus()`);await key('Home','Home',36);for(let i=0;i<index;i++)await key('ArrowDown','ArrowDown',40);await key('Tab','Tab',9);}
 const value=async expected=>browser.until(`document.querySelector('[data-testid=cc-primary]')?.textContent===${JSON.stringify(expected)}`);
 async function download(name){const end=Date.now()+10000;while(Date.now()<end){try{return JSON.parse(await readFile(path.join(directory,name),'utf8'));}catch{await new Promise(resolve=>setTimeout(resolve,50));}}throw Error('Missing immutable download');}
 for(const width of [320,1280])for(const [index,plan] of ['free','pro','business'].entries()){
  await browser.send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width<400});await browser.visit('/tests/calculus-recovery-workbench/');await browser.until('!!document.querySelector("#cc-operation")');await select('#cc-plan',index);await select('#cc-operation',0);
  await browser.field('#cc-expression','x^2');await browser.field('#cc-x','0.123456789012345678');await key('Enter','Enter',13);await value('0.246913578024691356');
  assert.equal(await browser.js('document.activeElement.dataset.testid'),'cc-primary');
  const expected=math.exportCanonicalCalculation({calculation:{operation:'derivative',expression:'x^2',x:'0.123456789012345678'},plot:{enabled:true,radius:'1',samples:17}},plan);
  await browser.field('#cc-import','{');await browser.click('Verify and restore calculation');await browser.until('document.activeElement.getAttribute("role")==="alert"');await value(expected.calculation.output.core.value);
  await browser.field('#cc-expression','1/0');assert.equal(await browser.js('!!document.querySelector("[data-testid=cc-primary]")'),false);assert.equal(await browser.js('document.querySelector("[data-testid=cc-retained]").textContent'),expected.calculation.output.core.value);
  await browser.js('document.querySelector("#cc-expression").focus()');await key('Enter','Enter',13);await browser.until('document.activeElement.getAttribute("role")==="alert"');
  // Retrying the same rejected expression must announce/focus again.
  await browser.js('document.querySelector("#cc-expression").focus()');await key('Enter','Enter',13);await browser.until('document.activeElement.getAttribute("role")==="alert"');
  assert.equal(await browser.js('[...document.querySelectorAll("button")].find(b=>b.textContent==="Export previous immutable JSON").disabled'),plan==='free');
  await browser.click('Save previous result to history');await browser.until('document.querySelector("[data-testid=cc-history]").children.length>0');
  if(plan!=='free'){await browser.click('Export previous immutable JSON');assert.deepEqual(await download('calculus-contract-v3.json'),expected);await rename(path.join(directory,'calculus-contract-v3.json'),path.join(directory,`retained-${width}-${plan}.json`));}
  await browser.click('Restore previous verified result');await value(expected.calculation.output.core.value);assert.equal(await browser.js('document.querySelector("#cc-expression").value'),'x^2');
  assert.equal(await browser.js('document.documentElement.scrollWidth<=innerWidth'),true);
  receipt.journeys.push({width,plan,keyboardSubmit:true,exactString:true,atomicRejectedImport:true,retainedArtifact:true,history:true,export:plan!=='free',resultAndErrorFocus:true});
 }
 const old=legacy.exportPrivateCalculus({operation:'integral',expression:'x^2',lower:0,upper:3});await select('#cc-plan',1);await browser.field('#cc-import',JSON.stringify(old));await browser.click('Verify and restore calculation');await browser.until('document.querySelector("[data-testid=cc-historical]")?.textContent==="9"');await browser.field('#cc-import','{"calculation":{"calculatorVersion":99}}');await browser.click('Verify and restore calculation');await browser.click('Export immutable JSON');assert.deepEqual(await download('calculus-contract-v2.json'),old);receipt.legacyV2Preserved=true;
 await browser.visit('/tests/catalog-preview/');await browser.until(`!!document.querySelector(${JSON.stringify('a[href="/tests/calculus-recovery-workbench/"]')})`);receipt.catalogDiscovery=true;
 await writeFile(path.join(evidence,'receipt.json'),JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify({passed:true,journeys:receipt.journeys.length,evidence:path.join(evidence,'receipt.json')}));
}finally{await browser?.close();await server?.close();}
