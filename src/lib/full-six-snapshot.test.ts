import {describe,it,expect} from 'vitest';
import {immutableFullSixArtifact} from '@/lib/full-six/result-contract';
import {createFullSixSnapshot,readFullSixSnapshot,serializeFullSixSnapshot,verifyFullSixRecomputation} from './full-six-snapshot';
const fixture=()=>({protocol:'full-six-artifact-1',scope:'PRIVATE_EXPERIMENTAL',catalogId:283,engineId:'statistics.variance',baselineVersion:1,implementationRevision:'decimal-descriptive-experimental-1',contractSHA256:'a'.repeat(64),inputs:{values:'0.10000000000000001,0.2'},modes:{estimand:'population'},sources:[{sourceId:'NIST-SCALE',contentSHA256:'b'.repeat(64),clause:'Scale definition'}],numericPolicy:{revision:'decimal50-1',precisionDigits:50,rounding:'half-even'},outcome:{status:'finite',values:{variance:{raw:'0.002499999999999999500000000000000025',unit:'m^2',label:'Population variance'}},warnings:[]}});
const binding=(v:ReturnType<typeof fixture>)=>({catalogId:v.catalogId as 283,engineId:v.engineId,baselineVersion:v.baselineVersion,implementationRevision:v.implementationRevision,contractSHA256:v.contractSHA256});
describe('Experimental full-six exact artifact protocol',()=>{
 it('copies and freezes exact decimal strings; plan context is not part of mathematics',async()=>{
  const value=fixture(),snapshot=await createFullSixSnapshot(value);value.inputs.values='mutated';
  expect(snapshot.artifact.inputs.values).toContain('0.10000000000000001');expect(Object.isFrozen(snapshot.artifact.outcome)).toBe(true);
  const copies=await Promise.all(['free','pro','business'].map(()=>createFullSixSnapshot(fixture())));expect(new Set(copies.map(v=>v.sha256)).size).toBe(1);
  expect(await readFullSixSnapshot(serializeFullSixSnapshot(snapshot),binding(fixture()))).toEqual(snapshot);
 });
 it('canonicalizes record key order but preserves original decimal and unit bytes',async()=>{
  const v=fixture(),a=await createFullSixSnapshot(v),b=await createFullSixSnapshot({...v,inputs:Object.fromEntries(Object.entries(v.inputs).reverse())});expect(a.sha256).toBe(b.sha256);
  const changed=await createFullSixSnapshot({...v,inputs:{values:'0.1,0.2'}});expect(changed.sha256).not.toBe(a.sha256);
 });
 it('rejects changed bytes and mismatched exact revisions; no latest fallback',async()=>{
  const v=fixture(),s=await createFullSixSnapshot(v);
  await expect(readFullSixSnapshot(serializeFullSixSnapshot({...s,sha256:'0'.repeat(64)}),binding(v))).rejects.toThrow('digest');
  await expect(readFullSixSnapshot(serializeFullSixSnapshot(s),{...binding(v),implementationRevision:'latest'})).rejects.toThrow('binding');
  await expect(readFullSixSnapshot(serializeFullSixSnapshot(s),{...binding(v),contractSHA256:'c'.repeat(64)})).rejects.toThrow('binding');
 });
 it('does not trust a rehashed forged result as a computation witness',async()=>{
  const original=fixture(),forged=await createFullSixSnapshot({...original,outcome:{...original.outcome,values:{variance:{...original.outcome.values.variance,raw:'0'}}}});
  await expect(verifyFullSixRecomputation(forged,binding(original),()=>original)).rejects.toThrow('Recomputation');
  await expect(verifyFullSixRecomputation(await createFullSixSnapshot(original),binding(original),()=>original)).resolves.toBeUndefined();
 });
 it.each(['vertical-line','degenerate','underdetermined','no-solution','domain-error','precision-unavailable','budget-exhausted','cancelled'])('retains typed %s without manufacturing success',status=>{
  const artifact=immutableFullSixArtifact({...fixture(),outcome:{status,message:'Explicit outcome'}});expect(artifact.outcome.status).toBe(status);expect('values' in artifact.outcome).toBe(false);
 });
 it('rejects nonfinite, invented identity, approval flags, getters and oversized snapshot',async()=>{
  expect(()=>immutableFullSixArtifact({...fixture(),catalogId:276})).toThrow();expect(()=>immutableFullSixArtifact({...fixture(),certified:true})).toThrow();
  expect(()=>immutableFullSixArtifact({...fixture(),outcome:{status:'finite',values:{x:{raw:'NaN',unit:'',label:'x'}},warnings:[]}})).toThrow();
  for(const raw of ['1e999999999999999999999','1e-999999999999999999999'])expect(()=>immutableFullSixArtifact({...fixture(),outcome:{status:'finite',values:{x:{raw,unit:'',label:'x'}},warnings:[]}})).toThrow();
  expect(()=>immutableFullSixArtifact({...fixture(),get evil(){throw Error('Getter executed');}})).toThrow('Unsupported calculation field');
  await expect(readFullSixSnapshot(' '.repeat(2_000_001),binding(fixture()))).rejects.toThrow('size');
  const largeInputs=Object.fromEntries(Array.from({length:10000},(_,i)=>[String(i),'0'.repeat(256)]));
  await expect(createFullSixSnapshot({...fixture(),inputs:largeInputs})).rejects.toThrow('Snapshot size bound');
 });
});
