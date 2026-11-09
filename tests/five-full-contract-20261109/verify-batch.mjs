import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';import path from 'node:path';import {createHash} from 'node:crypto';import {fileURLToPath} from 'node:url';
import {readBoundedArtifact} from '../first-five-20261109/artifact-file.mjs';
import {verifyCapturedSource} from '../acceptance-closure-20261108/receipt-source-path.mjs';
export async function verifyFiveBatchEvidence(directory='docs/five-full-contract-20261109/batch'){
 const r=JSON.parse(await readFile(path.join(directory,'receipt.json'),'utf8'));assert.equal(r.passed,true);assert.equal(r.syntheticAccountTransport,true);assert.equal(r.productionAcceptance,false);assert.equal(r.fullEngineeringComplete,0);assert.equal(r.journeys.length,15);assert.equal(r.downloads.length,30);assert.equal(r.releaseHold,true);
 const ids=[370,371,372,373,386],plans=['free','pro','business'];const names={370:'bandwidth',371:'download-time',372:'upload-time',373:'data-transfer',386:'base64-size'};const expected={370:[80,40],371:[80,40],372:[80,40],373:[125,250],386:[8,8]};
 for(const [p,sha256] of Object.entries(r.sourceHashes))await verifyCapturedSource({path:p,sha256});
 for(const plan of plans)for(const id of ids){
  const journeys=r.journeys.filter(j=>j.id===id&&j.plan===plan);assert.equal(journeys.length,1);for(const key of ['primarySnapshotUnchanged','batchRowRecovery','exportDenialAndRecovery','accessibleBatchTable','viewportNoOverflow'])assert.equal(journeys[0][key],true);
  const files=r.downloads.filter(d=>d.id===id&&d.plan===plan);assert.deepEqual(files.map(d=>d.format).sort(),['CSV','JSON']);const contents={};
  for(const d of files){const bytes=await readBoundedArtifact(directory,d.file,d.bytes);assert.equal(createHash('sha256').update(bytes).digest('hex'),d.sha256,'Exact native file hash');contents[d.format]=bytes.toString('utf8');}
  const batch=JSON.parse(contents.JSON);assert.equal(batch.engineId,'technology.'+names[id]);assert.equal(batch.version,1);assert.equal(batch.schemaVersion,1);assert.deepEqual(batch.rows.map(row=>row.snapshot.output.value),expected[id]);assert(batch.rows.every(row=>row.snapshot.calculatorVersion===1&&row.snapshot.calculatorSlug===names[id]+'-calculator'));
  const fields=id===386?['inputBytes']:id===373?['bandwidthMbps','timeSeconds']:['dataMegabytes',id===370?'timeSeconds':'bandwidthMbps'];const unit=id===386?'encoded bytes':id===373?'MB':id===370?'Mbps':'seconds';
  const csv=[['row','calculator_id','calculator_slug','calculator_version',...fields,'result','result_unit'],...batch.rows.map((row,i)=>[i+1,batch.engineId,row.snapshot.calculatorSlug,1,...fields.map(k=>row.snapshot.input[k]),expected[id][i],unit])].map(row=>row.map(value=>'"'+String(value).replaceAll('"','""')+'"').join(',')).join('\r\n');assert.equal(contents.CSV,csv,'Every CSV identity/value/unit cell');
 }
 return {passed:true,journeys:15,nativeDownloads:30,productionAcceptance:false};
}
if(process.argv[1]===fileURLToPath(import.meta.url))console.log(JSON.stringify(await verifyFiveBatchEvidence()));
