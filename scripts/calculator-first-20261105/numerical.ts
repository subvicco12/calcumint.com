import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import vectors from '../../tests/calculator-first-20261105/witnesses.json';
import {calculatorRegistry} from '../../src/calculators/registry';
import {runCalculator} from '../../src/calculators/engine';
import {verifyRegisteredSnapshot} from '../../src/lib/registered-snapshot-verification';
const rows=vectors.map(v=>{
 const def=calculatorRegistry.getBySlug(v.slug)!;assert.equal(def.id,v.engineId);assert.equal(def.version,v.version);
 const witnesses=Object.entries({numerical:v.numerical,boundary:v.boundary}).map(([kind,w])=>{
  const runs=['free','pro','business'].map(()=>runCalculator(def,w.input));
  assert.deepEqual(runs[1],runs[0]);assert.deepEqual(runs[2],runs[0]);
  const output=runs[0].output as {result:number};assert(Number.isFinite(output.result));
  const error=Math.abs(output.result-w.expected);assert(error<=Math.max(Number.MIN_VALUE,Math.abs(w.expected)*1e-14));
  const snapshot={calculatorSlug:v.slug,calculatorVersion:v.version,input:runs[0].input,output};
  verifyRegisteredSnapshot(snapshot);const tampered={...snapshot,output:{result:output.result+1}};assert.throws(()=>verifyRegisteredSnapshot(tampered));
  return {kind,input:runs[0].input,expected:w.expected,output,absoluteError:error,repeatedDeterministicRunsAgree:true,immutableReplay:true,tamperedOutputRejected:true};
 });
 assert.throws(()=>runCalculator(def,v.rejection));
 return {catalogId:v.catalogId,engineId:def.id,version:def.version,slug:v.slug,witnesses,rejectedInput:v.rejection,canonicalAccepted:false,publicationEligible:false};
});
const files=['tests/calculator-first-20261105/witnesses.json','src/calculators/launch-portfolio.ts','src/components/registered-launch-tool.tsx','src/components/ai-result-explanation.tsx'];
const out={kind:'BOUNDED_ENGINEERING_WITNESSES_NOT_QA_APPROVAL',baseline:'4796b3d7679a06f0751cac8cfec687c88f386ae5',sourceHashes:Object.fromEntries(files.map(p=>[p,createHash('sha256').update(readFileSync(p)).digest('hex')])),relativeEngineeringWitnessBudget:'1e-14; no approved full-domain tolerance inferred',rows,counts:{identities:rows.length,numerical:rows.length,boundaries:rows.length,rejections:rows.length,newlyPublicationEligible:0},releaseHold:true};
const text=JSON.stringify(out,null,2)+'\n',p='docs/calculator-first-20261105/numerical.json';
if(process.argv.includes('--check'))assert.equal(readFileSync(p,'utf8'),text);else writeFileSync(p,text);console.log(JSON.stringify(out.counts));
