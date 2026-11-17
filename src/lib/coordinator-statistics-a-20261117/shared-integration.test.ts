import {expect,it} from 'vitest';
import {statisticsContracts,statisticsWorkflows} from '@/lib/worker1-statistics-a-20261117/cohort';
import {getFactoryContract,getFactoryWorkflows,runFactoryCalculation,factoryResult} from '@/lib/calculator-factory/registry';
import {verifyRegisteredSnapshot} from '@/lib/registered-snapshot-verification';
import {verifyFactoryPacket,verifyFactoryStoredSnapshot} from '@/lib/calculator-factory/completion/business';
import {verifyPrivateFactoryPacket,runPrivateFactoryCalculation} from '@/lib/calculator-factory/private-delivery';
import {factoryDeliveryIdentity} from '@/lib/native-delivery/factory-delivery-catalog';
import {verifyFactoryNineSnapshot} from '@/lib/business/factory-nine-sharing';
import {linearRegressionCalculator,weightedMeanCalculator,percentileCalculator} from '@/calculators/statistics/catalog-batch-4';
import {statisticsBusinessDeliveryProposal} from './contracts';
it.each(statisticsContracts)('shared/private dispatch retains the exact worker namespace and array inputs #$catalogId',c=>{
 const raw=Object.fromEntries(c.fields.map(f=>[f.key,String(f.defaultValue)])),expected=statisticsWorkflows(c.catalogId).execute(raw);
 expect(getFactoryContract(c.catalogId)).toMatchObject({catalogId:c.catalogId,engineId:c.engineId,version:1});
 expect(getFactoryWorkflows(c.catalogId).execute(raw)).toEqual(expected);
 expect(runFactoryCalculation(c.catalogId,1,raw)).toEqual(expected);expect(runPrivateFactoryCalculation(c.catalogId,1,raw)).toEqual(expected);
 expect(verifyFactoryPacket(expected)).toEqual(expected);expect(verifyPrivateFactoryPacket(expected)).toEqual(expected);
 expect(verifyRegisteredSnapshot(expected.snapshot)).toMatchObject({snapshot:expected.snapshot,engineVersion:1,scope:c.scope});
 expect(verifyFactoryStoredSnapshot(expected.snapshot)).toEqual({catalogId:c.catalogId,snapshot:expected.snapshot});
 expect(factoryResult(c.catalogId,raw)).toEqual(expect.objectContaining({primaryResult:expect.objectContaining({value:expected.snapshot.output[c.primaryKey]})}));
 for(const plan of ['pro','business'] as const)expect(getFactoryWorkflows(c.catalogId).replay(getFactoryWorkflows(c.catalogId).exportPacket(expected,'json',plan))).toEqual(expected);
 for(const forged of [{...expected,identity:{...expected.identity,catalogId:299}},{...expected,identity:{...expected.identity,calculatorVersion:2}},{...expected,identity:{...expected.identity,sourceVersion:'factory-wave1-20261112.1/'+c.engineId+'@1'}}])expect(()=>verifyFactoryPacket(forged)).toThrow();
 expect(()=>verifyRegisteredSnapshot({...expected.snapshot,calculatorVersion:2})).toThrow();expect(()=>verifyFactoryStoredSnapshot({...expected.snapshot,output:{...expected.snapshot.output,count:999}})).toThrow();
 // No implicit commercial/native or SQL capability adoption.
 expect(factoryDeliveryIdentity(c.catalogId,1)).toBeUndefined();expect(()=>verifyFactoryNineSnapshot(expected.snapshot)).toThrow(/sharing/);
});
it.each([
 [293,linearRegressionCalculator,{xValues:[1e16,1e16+2],yValues:[0,1]},'slope',.25],
 [294,weightedMeanCalculator,{values:[1e50,1,-1e50],weights:[1,1,1]},'weightedMean',0],
 [295,percentileCalculator,{values:[-1e16,1e16],percentile:50.00000000000001},'percentile',2],
] as const)('historical recovery bypasses capture-only refusal without changing #%s v1 outputs',(id,engine,input,key,value)=>{
 const output=(engine.calculate as (input:object,context:object)=>Record<string,unknown>)(input,{}),snapshot={calculatorSlug:engine.slug,calculatorVersion:1,input,output};
 expect(output[key]).toBe(value);expect(verifyRegisteredSnapshot(snapshot).snapshot).toEqual(snapshot);expect(verifyFactoryStoredSnapshot(snapshot).snapshot).toEqual(snapshot);
 const raw=Object.fromEntries(Object.entries(input).map(([k,v])=>[k,Array.isArray(v)?v.join(','):String(v)]));expect(()=>getFactoryWorkflows(id).execute(raw)).toThrow(/precision/);
 expect(()=>verifyRegisteredSnapshot({...snapshot,output:{...output,[key]:123}})).toThrow();
});
it('prepares exactly four held tuples while leaving Worker 2 and delivery ACLs untouched',()=>{
 expect(statisticsBusinessDeliveryProposal.map(r=>r.catalogId)).toEqual([292,293,294,295]);
 for(const r of statisticsBusinessDeliveryProposal){expect(r.activation).toBe('HELD_NOT_ADOPTED');expect(r.version).toBe(1);expect(r.captureSourceVersion).toBe(statisticsWorkflows(r.catalogId).identity.sourceVersion);}
 for(const id of [296,297,298,299])expect(getFactoryContract(id)).toBeUndefined();
});
