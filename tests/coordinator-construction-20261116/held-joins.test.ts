import {expect,it} from 'vitest';
import {constructionContracts,constructionWorkflows} from '@/lib/worker1-construction-20261116/cohort';
import {verifyRegisteredSnapshot} from '@/lib/registered-snapshot-verification';
import {getFactoryWorkflows,runFactoryCalculation} from '@/lib/calculator-factory/registry';
import {verifyFactoryPacket,verifyFactoryStoredSnapshot} from '@/lib/calculator-factory/completion/business';
import {verifyFactoryNineSnapshot} from '@/lib/business/factory-nine-sharing';
import {runFactoryEmbedCalculation} from '@/lib/native-delivery/factory-embed-contract';
import {runFactoryAutomationBatch} from '@/lib/native-delivery/factory-automation-contract';

it.each(constructionContracts)('held joins preserve source namespace and exact immutable tuple $catalogId',c=>{
 const raw=Object.fromEntries(c.fields.map(f=>[f.key,String(f.defaultValue)]));
 const packet=constructionWorkflows(c.catalogId).execute(raw);
 expect(getFactoryWorkflows(c.catalogId).identity).toEqual(packet.identity);
 expect(runFactoryCalculation(c.catalogId,1,raw)).toEqual(packet);
 expect(verifyFactoryPacket(packet)).toEqual(packet);
 for(const verify of [verifyRegisteredSnapshot,verifyFactoryStoredSnapshot,verifyFactoryNineSnapshot]){
  expect(verify(packet.snapshot).snapshot).toEqual(packet.snapshot);
  expect(()=>verify({...packet.snapshot,calculatorVersion:2})).toThrow();
  expect(()=>verify({...packet.snapshot,output:{...packet.snapshot.output,value:123456789}})).toThrow();
 }
 for(const sourceVersion of ['unapproved',`factory-wave1-20261112.1/${c.engineId}@1`])expect(()=>verifyFactoryPacket({...packet,identity:{...packet.identity,sourceVersion}})).toThrow();
 expect(runFactoryEmbedCalculation(c.catalogId,1,raw)).toMatchObject({packet});
 expect(runFactoryAutomationBatch({catalogId:c.catalogId,version:1,rows:[raw]})[0]).toMatchObject({ok:true,result:{packet}});
});

it.each([
 [348,{areaSquareMeters:'22.5',tileLengthCm:'50',tileWidthCm:'25',wastePercent:'10'}],
 [349,{surfaceAreaSquareFeet:'5760',sheetLengthFeet:'8',sheetWidthFeet:'4',wastePercent:'10'}],
] as const)('held storage reads original199 while native new captures refuse ceiling mismatch #%s',(id,raw)=>{
 const c=constructionContracts.find(row=>row.catalogId===id)!;
 const input=Object.fromEntries(Object.entries(raw).map(([k,v])=>[k,Number(v)]));
 const snapshot={calculatorSlug:c.slug,calculatorVersion:1,input,output:c.engine.calculate(input,{})};
 expect(snapshot.output.value).toBe(199);
 for(const verify of [verifyRegisteredSnapshot,verifyFactoryStoredSnapshot,verifyFactoryNineSnapshot]){
  expect(verify(snapshot).snapshot).toEqual(snapshot);
  expect(()=>verify({...snapshot,output:{...snapshot.output,value:198}})).toThrow();
 }
 expect(()=>runFactoryCalculation(id,1,raw)).toThrow(/Whole-unit rounding/);
 expect(()=>runFactoryEmbedCalculation(id,1,raw)).toThrow();
 expect(runFactoryAutomationBatch({catalogId:id,version:1,rows:[raw]})[0]).toMatchObject({ok:false});
});

it('held joins retain historical underflow zero independently of new capture policy',()=>{
 const c=constructionContracts.find(row=>row.catalogId===343)!;
 const input={lengthMeters:1e-200,widthMeters:1e-200,depthMeters:1e-200,wastePercent:0};
 const snapshot={calculatorSlug:c.slug,calculatorVersion:1,input,output:c.engine.calculate(input,{})};
 expect(snapshot.output.value).toBe(0);
 for(const verify of [verifyRegisteredSnapshot,verifyFactoryStoredSnapshot,verifyFactoryNineSnapshot])expect(verify(snapshot).snapshot).toEqual(snapshot);
 expect(()=>getFactoryWorkflows(343).execute(Object.fromEntries(Object.entries(input).map(([k,v])=>[k,String(v)])))).toThrow(/capture range/);
});
