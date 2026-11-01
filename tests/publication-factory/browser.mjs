import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';import net from 'node:net';
import Decimal from 'decimal.js';
import {startDraftPreview} from '../../scripts/draft-preview.mjs';
import {startBrowser} from '../next-runtime/cdp.mjs';
const directory=process.env.PUBLICATION_FACTORY_BROWSER_ARTIFACTS||'/workspace/work/publication-factory-browser';await mkdir(directory,{recursive:true});
const evidence=JSON.parse(await readFile('docs/publication-factory/contracts-evidence.json','utf8'));
const report={cohort:evidence.rows.map(r=>r.masterId),journeys:[],limits:['Actual local private review app, engines and Blob exports; synthetic plan selection, not authenticated account or production acceptance.','Calculator/plan select changes use DOM change events; fields and buttons use Chromium interactions.','Emulated 360/1440 widths; not physical devices or empirical assistive-technology acceptance.']};
const hash=text=>createHash('sha256').update(text).digest('hex');
function firstNumber(value,parts=[]){if(typeof value==='number'&&value!==0&&Number.isFinite(value))return {parts,value};if(value&&typeof value==='object')for(const [key,child]of Object.entries(value)){const found=firstNumber(child,[...parts,key]);if(found)return found;}}
let server,browser;
try{
 const reserve=net.createServer();await new Promise((resolve,reject)=>{reserve.once('error',reject);reserve.listen(0,'127.0.0.1',resolve);});const port=reserve.address().port;await new Promise(resolve=>reserve.close(resolve));
 server=await startDraftPreview(port);const origin=`http://127.0.0.1:${port}`,headers={Authorization:'Basic '+Buffer.from('reviewer:'+server.draftPreviewAccessToken).toString('base64')};
 assert.equal((await fetch(origin+'/tests/validation-scale/')).status,401);
 browser=await startBrowser(origin);await browser.send('Network.setExtraHTTPHeaders',{headers});await browser.send('Browser.setDownloadBehavior',{behavior:'allow',downloadPath:directory});
 await browser.send('Page.navigate',{url:origin+'/tests/validation-scale/'});await browser.until('!!document.getElementById("cv-adapter")');
 await browser.js(`window.__factoryDownloads=[];const original=URL.createObjectURL.bind(URL);URL.createObjectURL=blob=>{blob.text().then(text=>window.__factoryDownloads.push(text));return original(blob)};`);
 const select=async(id,value)=>{await browser.js(`(()=>{const e=document.getElementById(${JSON.stringify(id)});e.value=${JSON.stringify(value)};e.dispatchEvent(new Event('change',{bubbles:true}))})()`);await browser.until(`document.getElementById(${JSON.stringify(id)})?.value===${JSON.stringify(value)}`);};
 await select('cv-plan','pro');
 const click=async label=>browser.click(label);
 for(const width of [360,1440])for(const row of evidence.rows){
  await browser.send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width===360});
  await select('cv-adapter',row.adapterKey);await click('Clear review history');await click('Clear scenarios');
  const original=await browser.js('document.getElementById("cv-input").value');
  await click('Run contract');await browser.until('!!document.querySelector("[data-testid=cv-value]")');const value=await browser.js('document.querySelector("[data-testid=cv-value]").textContent');
  const labels=await browser.js(`(()=>{const controls=[...document.querySelectorAll('[aria-label="Contract input controls"] input,[aria-label="Contract input controls"] select')];return controls.length>0&&controls.every(e=>[...e.labels].some(l=>l.textContent.trim()))})()`);assert(labels);
  assert.equal(await browser.js('document.documentElement.scrollWidth>innerWidth+1'),false,`${row.masterId} overflow`);
  await click('Save review history');const saved=await browser.js(`localStorage.getItem('calcumint-private-contract-validation-scaled-v2')`);assert(saved);
  const clone=JSON.parse(original),number=firstNumber(clone);assert(number);let parent=clone;for(const key of number.parts.slice(0,-1))parent=parent[key];parent[number.parts.at(-1)]='__LOSSY_NUMERIC_TOKEN__';
  const decimal=new Decimal(number.value).toFixed(),token=(decimal.includes('.')?decimal:decimal+'.')+'0'.repeat(40)+'1';assert.equal(Number(token),number.value);const lossy=JSON.stringify(clone).replace('"__LOSSY_NUMERIC_TOKEN__"',token);
  await browser.field('#cv-input',lossy);await click('Run contract');await browser.until('!document.querySelector("[data-testid=cv-value]")&&!!document.querySelector("[role=alert]")');
  assert.equal(await browser.js('document.getElementById("cv-input").value'),lossy);
  for(const label of ['Save review history','Save scenario','Export validated contract'])assert.equal(await browser.js(`[...document.querySelectorAll('button')].find(b=>b.textContent.trim()===${JSON.stringify(label)}).disabled`),true);
  assert.equal(await browser.js(`localStorage.getItem('calcumint-private-contract-validation-scaled-v2')`),saved);
  await click('Restore record 1');await browser.until(`document.querySelector('[data-testid=cv-value]')?.textContent===${JSON.stringify(value)}`);
  assert.equal(await browser.js(`localStorage.getItem('calcumint-private-contract-validation-scaled-v2')`),saved);
  let before=await browser.js('window.__factoryDownloads.length');await click('Export validated contract');await browser.until(`window.__factoryDownloads.length>${before}`);const packet=JSON.parse(await browser.js('window.__factoryDownloads.at(-1)'));assert.equal(hash(JSON.stringify(packet)),row.witnesses[0].artifactSHA256,'Actual export matches independent exact-engine artifact');
  await click('Save scenario');await click('Save scenario');await click('Compare scenarios');await browser.until('!!document.querySelector("[data-testid=cv-comparison]")');
  before=await browser.js('window.__factoryDownloads.length');await click('Export scenario set JSON');await browser.until(`window.__factoryDownloads.length>${before}`);const scenarioText=await browser.js('window.__factoryDownloads.at(-1)'),scenarios=JSON.parse(scenarioText);assert.equal(scenarios.scenarios.length,2);assert(scenarios.scenarios.every(s=>hash(JSON.stringify(s.packet))===row.witnesses[0].artifactSHA256));
  await click('Clear scenarios');await browser.field('#cv-scenario-import',scenarioText);await click('Recover complete scenario set');await browser.until(`[...document.querySelectorAll('button')].some(b=>b.textContent==='Restore scenario B')`);await click('Restore scenario B');await browser.until(`document.querySelector('[data-testid=cv-value]')?.textContent===${JSON.stringify(value)}`);
  const fake=JSON.parse(JSON.stringify(packet));fake.engineVersion+=1;await browser.field('#cv-import',JSON.stringify(fake));await click('Verify and restore packet');await browser.until('!!document.querySelector("[role=alert]")');assert.equal(await browser.js(`localStorage.getItem('calcumint-private-contract-validation-scaled-v2')`),saved);
  report.journeys.push({masterId:row.masterId,adapterKey:row.adapterKey,version:row.engineVersion,width,lossyInputRefused:true,historyBytesPreserved:true,originalRecovery:true,exactExport:true,scenarioRecovery:true,versionTamperRefused:true,labels:true,overflow:false});
  console.log(JSON.stringify({id:row.masterId,width,passed:true}));
 }
 assert.deepEqual(browser.errors,[]);assert.deepEqual(browser.network.filter(r=>!r.allowed),[]);report.passed=true;report.browserErrors=browser.errors;
 await writeFile(path.join(directory,'report.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({journeys:report.journeys.length,passed:true}));
}catch(error){report.passed=false;report.error=String(error.stack||error);report.browserErrors=browser?.errors;await writeFile(path.join(directory,'report.json'),JSON.stringify(report,null,2)+'\n');throw error;}finally{await browser?.close();await server?.close();}
