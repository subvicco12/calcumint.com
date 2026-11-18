import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {runCalculator} from '/workspace/calcumint-first-release-evidence/src/calculators/engine';
import {frequencyConverter} from '/workspace/calcumint-first-release-evidence/src/calculators/conversion/catalog-batch-3';
import {verifySavedSnapshotWithWave100} from '/workspace/calcumint-first-release-evidence/src/lib/wave100-history-verification';
import {getFactoryWorkflows} from '/workspace/calcumint-first-release-evidence/src/lib/calculator-factory/registry';
const w=getFactoryWorkflows(440),raw={value:'0.125',fromUnit:'mhz',toUnit:'hz'},packet=w.execute(raw),snapshot={calculatorSlug:'frequency-converter',calculatorVersion:1,input:{value:0.125,fromUnit:'mhz',toUnit:'hz'},output:{result:125000}};
assert.deepEqual(runCalculator(frequencyConverter,snapshot.input).output,snapshot.output);
assert.deepEqual(verifySavedSnapshotWithWave100(snapshot).snapshot,snapshot);
assert.deepEqual(w.replay(w.exportPacket(packet,'json','business')),packet);
assert.equal(packet.identity.sourceVersion,'factory-wave1-20261112.1/conversion.frequency@1');
const negatives=[];
for(const [name,record] of [['unknown-v2',{...snapshot,calculatorVersion:2}],['zero-version',{...snapshot,calculatorVersion:0}],['tampered-output',{...snapshot,output:{result:125001}}],['unsupported-units',{...snapshot,input:{...snapshot.input,fromUnit:'rad_s'}}]] as const){assert.throws(()=>verifySavedSnapshotWithWave100(record));negatives.push(name);}
for(const [name,mutate] of [['factory-source-version',(p:any)=>p.identity.sourceVersion+='tamper'],['factory-engine-id',(p:any)=>p.identity.engineId='conversion.time'],['factory-output',(p:any)=>p.snapshot.output.result+=1]] as const){const p=structuredClone(packet);mutate(p);assert.throws(()=>w.replay(JSON.stringify(p)));negatives.push(name);}
const old=JSON.parse(readFileSync('/workspace/calcumint-first-release-evidence/docs/frequency440-acceptance/batch.json','utf8'));
for(const row of old.rows.filter((r:any)=>r.snapshot))assert.deepEqual(verifySavedSnapshotWithWave100(row.snapshot).snapshot,row.snapshot);
writeFileSync('/workspace/calcumint-first-release-package/receipts/exact440-replay.json',JSON.stringify({passed:true,applicationCommit:'49ea243b5be7e1ee9f3cd8af7f936ab784402cf7',identity:packet.identity,retainedHistoricalSnapshots:old.rows.filter((r:any)=>r.snapshot).length,negativeControls:negatives,limitations:['Numerical consistency and exact dispatch only; no source authorship, reviewer, canonical or publication authority.']},null,2)+'\n');
