import assert from 'node:assert/strict';
import {mkdir,readFile,unlink} from 'node:fs/promises';
import path from 'node:path';
import {ownerPreviewReadyScript} from './owner-preview-readiness.mjs';
function numerical(actual,expected,where='output'){
 if(typeof expected==='number'){assert.equal(typeof actual,'number',where);assert(Number.isFinite(actual));assert(Math.abs(actual-expected)<=1e-10+1e-12*Math.abs(expected),where+': '+actual+' != '+expected);return;}
 if(expected===null||typeof expected!=='object'){assert.deepEqual(actual,expected,where);return;}
 assert.deepEqual(Object.keys(actual).sort(),Object.keys(expected).sort(),where+' keys');
 for(const key of Object.keys(expected))numerical(actual[key],expected[key],where+'.'+key);
}
/** Runs inside the existing isolated authenticated reviewer journey; no public routes or provider resources. */
export async function verifySourceCalculatorReview({browser,journey,artifacts}){
 const cases=JSON.parse(await readFile(new URL('./source-scope-cases.json',import.meta.url),'utf8'));
 const downloads=path.join(artifacts,'source-downloads');await mkdir(downloads,{recursive:true});await browser.send('Browser.setDownloadBehavior',{behavior:'allow',downloadPath:downloads});
 for(const model of cases)await journey('Source bounded profile #'+model.masterId+' actual engine and immutable reviewer exports',async()=>{
  await browser.visit('/account/calculators?q='+model.masterId);await browser.until(`document.body.innerText.includes('SOURCE_INFORMED_PRIVATE_CONTRACT_PROPOSAL') && !document.body.innerText.includes('Verifying account session')`);
  await browser.click('Private scoped implementation: '+model.title+' (identity and specialist approval pending)');await browser.until(`(${ownerPreviewReadyScript(model)}) && !document.body.innerText.includes('Verifying account session')`);
  for(let index=0;index<model.examples.length;index++){
   if(index){await browser.js(`(()=>{const s=[...document.querySelectorAll('select')].find(s=>s.labels?.[0]?.textContent.includes('Example and calculation mode'));s.value=${index};s.dispatchEvent(new Event('change',{bubbles:true}));})()`);await browser.until(`!document.querySelector('[aria-label="Complete engine output"]')`);}
   await browser.click('Calculate preview');await browser.until(`!!document.querySelector('[aria-label="Complete engine output"]')`);
   const actual=JSON.parse(await browser.js(`document.querySelector('[aria-label="Complete engine output"]').textContent`));numerical(actual,model.examples[index].expected);
  }
  const output=JSON.parse(await browser.js(`document.querySelector('[aria-label="Complete engine output"]').textContent`));
  for(const format of ['JSON','CSV','PDF']){
   const file=path.join(downloads,'review-'+model.slug+'-v1.'+format.toLowerCase());await unlink(file).catch(e=>{if(e.code!=='ENOENT')throw e;});
   await browser.click('Download reviewer '+format);let bytes;const deadline=Date.now()+45000;while(Date.now()<deadline){try{bytes=await readFile(file);if(bytes.length)break;}catch{}await new Promise(r=>setTimeout(r,60));}assert(bytes?.length,model.slug+' '+format+' missing');
   if(format==='JSON'){const snapshot=JSON.parse(bytes.toString());assert.equal(snapshot.calculatorSlug,model.slug);assert.equal(snapshot.calculatorVersion,1);assert.deepEqual(snapshot.input,model.examples.at(-1).input);assert.deepEqual(snapshot.output,output);}
   if(format==='CSV')assert(bytes.toString().includes('"output"'));
   if(format==='PDF')assert(bytes.subarray(0,8).toString().startsWith('%PDF-1.7'));
  }
  if([81,516].includes(model.masterId)){
   for(const width of [320,1280]){await browser.send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:false});assert(await browser.js('document.documentElement.scrollWidth <= innerWidth+1'),'Source preview overflows '+width);}
  }
  const selector='section[aria-label="Engine contract preview"] input[inputmode="decimal"]';
  await browser.field(selector,'not-a-number');await browser.until(`!document.querySelector('[aria-label="Complete engine output"]')`);assert(!await browser.js(`!![...document.querySelectorAll('button')].find(b=>b.textContent==='Download reviewer JSON')`));
  await browser.click('Calculate preview');await browser.until(`!!document.querySelector('p[role="alert"]') && document.activeElement===document.querySelector('p[role="alert"]')`);
  await browser.click('Reset example');await browser.click('Calculate preview');await browser.until(`!!document.querySelector('[aria-label="Complete engine output"]')`);numerical(JSON.parse(await browser.js(`document.querySelector('[aria-label="Complete engine output"]').textContent`)),model.examples.at(-1).expected);
 });
}
