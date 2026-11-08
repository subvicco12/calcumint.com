import assert from 'node:assert/strict';
import {mkdir,mkdtemp,readFile,rename,writeFile} from 'node:fs/promises';
import path from 'node:path';
import net from 'node:net';
import {startDraftPreview} from '../../scripts/draft-preview.mjs';
import {startBrowser} from '../next-runtime/cdp.mjs';
const reportPath=path.resolve(process.env.HISTORY_BROWSER_REPORT||'/tmp/calcumint-history-browser-report.json');
await mkdir(path.dirname(reportPath),{recursive:true});
const downloads=await mkdtemp('/tmp/calcumint-history-downloads-');
const report={kind:'15_PRIVATE_SAVED_HISTORY_RECOVERY_NOT_CANONICAL_ACCEPTANCE',releaseHold:true,canonicalAccepted:false,journeys:[],downloads,limitations:['Plan selection is synthetic; no account entitlement, persistent storage or provider acceptance.','Tab-local snapshot recovery only; full canonical scope, applicability and qualified review remain separate.']};
let server,browser;
try{
 const reservation=net.createServer();await new Promise((resolve,reject)=>{reservation.once('error',reject);reservation.listen(0,'127.0.0.1',resolve);});const port=reservation.address().port;await new Promise((resolve,reject)=>reservation.close(e=>e?reject(e):resolve()));
 server=await startDraftPreview(port);assert.equal(server.httpServer.address().port,port);
 browser=await startBrowser(`http://127.0.0.1:${port}`);
 await browser.send('Network.setExtraHTTPHeaders',{headers:{Authorization:'Basic '+Buffer.from('reviewer:'+server.draftPreviewAccessToken).toString('base64')}});
 await browser.send('Browser.setDownloadBehavior',{behavior:'allow',downloadPath:downloads});
 const workflow=await server.ssrLoadModule('/src/calculators/private-scenario-workflows.ts');
 const source=await server.ssrLoadModule('/src/calculators/source-bound-profiles.ts');
 const sourceSnapshot=await server.ssrLoadModule('/src/calculators/source-profile-snapshot.ts');
 const financial=await server.ssrLoadModule('/src/calculators/financial-contracts.ts');
 const groups=[
  {name:'workflow',url:'/tests/workflow-review/',select:'#workflow',input:'#scenario-json',output:'workflow-output',history:'local-history',definitions:workflow.privateWorkflowDefinitions,importer:workflow.importPrivateWorkflow,identity:'workflowId',ids:[469,488,82]},
  {name:'source',url:'/tests/source-profile-review/',select:'#profile',input:'#source-json',output:'profile-output',history:'source-history',plan:'#review-plan',definitions:source.sourceBoundProfiles,importer:sourceSnapshot.importSourceProfile,identity:'profileId',ids:[516,126,133]},
  {name:'financial',url:'/tests/financial-contract-review/',select:'#financial-contract',input:'#financial-json',output:'financial-output',history:'financial-history',plan:'#review-plan',definitions:financial.financialContracts,importer:financial.importFinancialContract,identity:'profileId'},
 ];
 const press=async(key,code,n)=>{await browser.send('Input.dispatchKeyEvent',{type:'keyDown',key,code,windowsVirtualKeyCode:n,...(key==='Enter'?{text:'\r',unmodifiedText:'\r',nativeVirtualKeyCode:13}:{})});await browser.send('Input.dispatchKeyEvent',{type:'keyUp',key,code,windowsVirtualKeyCode:n});};
 const select=async(selector,index)=>{await browser.until(`!!document.querySelector(${JSON.stringify(selector)})`);await browser.js(`document.querySelector(${JSON.stringify(selector)}).focus()`);await press('Home','Home',36);for(let i=0;i<index;i++)await press('ArrowDown','ArrowDown',40);await press('Tab','Tab',9);};
 const text=selector=>browser.js(`document.querySelector(${JSON.stringify(selector)}).textContent`);
 for(const width of [320,1280]){
  await browser.send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width===320});
  for(const group of groups){
   await browser.visit(group.url);
   for(const [index,definition] of group.definitions.entries()){
    await select(group.select,index);await browser.until(`document.querySelector(${JSON.stringify(group.select)}).value===${JSON.stringify(definition.id)}`);
    await browser.click('Load example');await browser.click('Clear local history');
    const input=JSON.parse(await browser.js(`document.querySelector(${JSON.stringify(group.input)}).value`));
    if(group.name==='workflow'){input.currency='SAVED-USD';const key='capitalized' in input?'capitalized':'usefulHeatKWh' in input?'usefulHeatKWh':'initial';input[key]+=100;}
    else if(group.name==='financial'){input.currency='SAVED-USD';input.discountRate=0.01;}
    else if(input.rows){input.rows[0].recordId='saved-row';input.rows[0].units='2.5';}
    else if(input.lines){input.lines[0].id='saved-line';input.lines[0].amount='123.45';}
    else{input.levies[0].id='saved-levy';input.levies[0].assessedValue='176000';}
    await browser.field(group.input,JSON.stringify(input));await browser.click('Calculate');await browser.until(`!!document.querySelector('[data-testid=${group.output}]')`);
    const before=await text(`[data-testid=${group.output}]`);await browser.click('Save local snapshot');
    const packet=JSON.parse(await text(`[data-testid=${group.history}] pre`));assert.deepEqual(group.importer(packet),packet);assert.equal(packet[group.identity],definition.id);
    assert.deepEqual(packet.calculation.input,input);
    const next=(index+1)%group.definitions.length;await select(group.select,next);await browser.field(group.input,'{}');await browser.click('Calculate');await browser.until('!!document.querySelector("[role=alert]")');
    assert.equal(await browser.js(`!!document.querySelector('[data-testid=${group.output}]')`),false);
    const plans=group.plan?['free','pro','business']:['not-offered'];
    for(const [planIndex,plan] of plans.entries()){
     if(group.plan)await select(group.plan,planIndex);
     // Trusted Enter activation demonstrates the native button works by keyboard.
     await browser.js(`(()=>{const e=[...document.querySelectorAll('button')].find(b=>b.textContent==='Restore snapshot 1');if(!e)throw Error('Missing saved recovery control');e.scrollIntoView({block:'center'});e.focus()})()`);
     assert.equal(await browser.js('document.activeElement.textContent'),'Restore snapshot 1');await press('Enter','Enter',13);
     await browser.until(`!!document.querySelector('[data-testid=${group.output}]')`);
     assert.equal(await browser.js(`document.querySelector(${JSON.stringify(group.select)}).value`),definition.id);
     assert.deepEqual(JSON.parse(await browser.js(`document.querySelector(${JSON.stringify(group.input)}).value`)),packet.calculation.input);
     assert.equal(await text(`[data-testid=${group.output}]`),before);assert.equal(await browser.js('!!document.querySelector("[role=alert]")'),false);
     assert.deepEqual(JSON.parse(await text(`[data-testid=${group.history}] pre`)),packet);
     assert.equal(await browser.js(`document.querySelector('[data-testid=${group.history}]').children.length`),1);
     if(group.plan)assert.equal(await browser.js(`document.querySelector(${JSON.stringify(group.plan)}).value`),plan);
     // Editing the draft between recovery attempts must not mutate saved state.
     if(planIndex<plans.length-1){await browser.field(group.input,'{}');await browser.click('Calculate');await browser.until('!!document.querySelector("[role=alert]")');}
    }
    await browser.click('Export JSON');const file=path.join(downloads,`${packet.calculation.calculatorSlug}-v1.json`);let bytes;const deadline=Date.now()+10000;
    while(Date.now()<deadline){try{const candidate=await readFile(file,'utf8');JSON.parse(candidate);bytes=candidate;break;}catch{await new Promise(r=>setTimeout(r,40));}}
    assert(bytes,'Missing complete actual snapshot download');assert.deepEqual(JSON.parse(bytes),packet);assert.deepEqual(group.importer(JSON.parse(bytes)),packet);
    await rename(file,path.join(downloads,`${width}-${group.name}-${index}.json`));assert.equal(await browser.js('document.documentElement.scrollWidth>innerWidth'),false);
    report.journeys.push({masterId:group.ids?.[index]??Number(definition.id.split('.').at(-1)),profileId:definition.id,group:group.name,width,plans,keyboardRestore:true,exactInputOutputRecovered:true,historyUnchanged:true,actualDownloadReplayed:true});
   }
   await writeFile(path.join(downloads,`${width}-${group.name}.png`),Buffer.from((await browser.send('Page.captureScreenshot',{format:'png'})).data,'base64'));
  }
 }
 assert.equal(report.journeys.length,30);assert.deepEqual(browser.errors,[]);assert.deepEqual(browser.network.filter(r=>!r.allowed),[]);
 report.passed=true;report.pageErrors=browser.errors;report.unexpectedNetwork=browser.network.filter(r=>!r.allowed);
 await writeFile(reportPath,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({reportPath,journeys:report.journeys.length,downloads}));
}catch(error){report.passed=false;report.error=String(error);report.pageErrors=browser?.errors;await writeFile(reportPath,JSON.stringify(report,null,2)+'\n');throw error;}finally{await browser?.close();await server?.close();}
