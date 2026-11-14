import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {readBoundedArtifact} from './artifact-file.mjs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
assert(process.argv.length===2||(process.argv.length===3&&process.argv[2]==='--check'),'Only --check is accepted');
const directory=path.resolve('docs/first-five-20261109/authenticated');
const hash=b=>createHash('sha256').update(b).digest('hex');
const receiptBytes=await readFile(directory+'/receipt.json'),receipt=JSON.parse(receiptBytes);
assert.equal(receipt.passed,true);assert.equal(receipt.journeys.length,15);assert.equal(receipt.exports.length,50);
assert.deepEqual(receipt.identities.map(c=>c.masterId),[386,370,371,372,373]);
assert.equal(hash(await readFile('tests/first-five-20261109/authenticated-browser.mjs')),receipt.sourceHashes['tests/first-five-20261109/authenticated-browser.mjs'],'Exact producer bytes');
for(const [p,h] of Object.entries(receipt.copiedSourceHashes))assert.equal(h,receipt.sourceHashes[p],'Actual source-copy binding '+p);
const checks=[];
for(const item of receipt.exports){
 const bytes=await readBoundedArtifact(directory,item.file,item.bytes);assert.equal(hash(bytes),item.sha256);assert.equal(bytes.length,item.bytes);
 const journey=receipt.journeys.find(j=>item.tag.startsWith(j.plan+':#'+j.masterId+' '));assert(journey);
 if(item.tag.endsWith('history CSV')){
  const rows=bytes.toString().replace(/\r/g,'').split('\n');
  for(const row of ['"identity","calculatorSlug","'+journey.slug+'"','"identity","calculatorVersion","1"','"output","value","'+journey.output.value+'"'])assert(rows.includes(row),'Exact CSV row '+row);
 }
 if(item.tag.endsWith('history PDF')){
  const text=execFileSync('pdftotext',['-layout','-','-'],{input:bytes,encoding:'utf8',timeout:10000,maxBuffer:1024*1024});
  const values=[...text.matchAll(/^\s*output\["value"\]\s*=\s*([^\r\n]+)\s*$/gm)].map(m=>m[1].trim());
  assert.deepEqual(values,[String(journey.output.value)],'Exact complete PDF value field');
  assert(text.replace(/\s+/g,'').includes('Calculator:'+journey.slug+'|Engineversion:'));
  assert.deepEqual([...text.matchAll(/Engine\s+version:\s*(\d+)\s*$/gm)].map(m=>Number(m[1])),[1],'Exact complete PDF technical version');
 }
 checks.push({tag:item.tag,file:item.file,sha256:item.sha256});
}
const rawlog=await readFile(directory+'/raw.log');
const report=JSON.stringify({passed:true,scope:'Retained completed native download bytes and copied-source bindings; no new browser run or mathematical proof',receiptSha256:hash(receiptBytes),rawLogSha256:hash(rawlog),verifierSha256:hash(await readFile('tests/first-five-20261109/verify-authenticated-artifacts.mjs')),artifactReaderSha256:hash(await readFile('tests/first-five-20261109/artifact-file.mjs')),journeys:15,completedDownloads:checks.length,exactCsvAndPdfIdentityVersionOutput:true,checks},null,2)+'\n';
if(process.argv[2]==='--check')assert.equal(await readFile(directory+'/verification.json','utf8'),report,'Deterministic retained verification report');
else await writeFile(directory+'/verification.json',report);
console.log('PASS 15 journeys, 50 native files, exact CSV/PDF identity/version/value and producer/copy hashes');
