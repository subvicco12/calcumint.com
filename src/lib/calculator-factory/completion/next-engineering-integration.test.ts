import {expect,it} from 'vitest';
import {getFactoryContract,getFactoryWorkflows,factoryResult} from '../registry';
import {factoryDeliveryIdentity} from '@/lib/native-delivery/factory-delivery-catalog';
import {runFactoryEmbedCalculation} from '@/lib/native-delivery/factory-embed-contract';
import {runFactoryAutomationBatch} from '@/lib/native-delivery/factory-automation-contract';
import {verifyRegisteredSnapshot} from '@/lib/registered-snapshot-verification';
import {verifyFactoryStoredSnapshot} from './business';
import {factoryDownload} from './exports';
const ids=[284,285,286,287,288,289,290,291,300,329,333,334,335,336,337,338,339,340,341,342];
it.each(ids)('connects #%i to exact replay, scenarios, export, embed and batch contracts',id=>{
 const contract=getFactoryContract(id);expect(contract,`missing #${id}`).toBeDefined();if(!contract)throw Error('Missing contract');
 const raw=Object.fromEntries(contract.fields.map(f=>[f.key,String(f.defaultValue)])),workflow=getFactoryWorkflows(id),packet=workflow.execute(raw);
 expect(workflow.replay(JSON.stringify(packet))).toEqual(packet);
 expect(verifyRegisteredSnapshot(packet.snapshot).snapshot).toEqual(packet.snapshot);
 expect(verifyFactoryStoredSnapshot(packet.snapshot)).toEqual({catalogId:id,snapshot:packet.snapshot});
 expect(factoryDeliveryIdentity(id,1)).toMatchObject({catalogId:id,engineId:contract.engineId,slug:contract.slug,version:1});
 expect(runFactoryEmbedCalculation(id,1,raw).output).toEqual(packet.snapshot.output);
 expect(runFactoryAutomationBatch({catalogId:id,version:1,rows:[raw]})).toMatchObject([{ok:true,result:{output:packet.snapshot.output}}]);
 expect(workflow.scenario([],'A',packet,'original','pro')[0].packet).toEqual(packet);
 for(const format of ['json','csv','pdf'] as const){const file=factoryDownload(workflow,packet,format,'business',contract.title);expect(file.bytes.length).toBeGreaterThan(20);expect(()=>factoryDownload(workflow,packet,format,'free',contract.title)).toThrow();}
 expect(factoryResult(id,raw).primaryResult.value).toBe(packet.snapshot.output[contract.primaryKey]);
 expect(()=>runFactoryEmbedCalculation(id,2,raw)).toThrow();
 expect(()=>verifyRegisteredSnapshot({...packet.snapshot,calculatorVersion:2})).toThrow();
 expect(()=>workflow.verify({...packet,snapshot:{...packet.snapshot,output:{...packet.snapshot.output,[contract.primaryKey]:123456789}}})).toThrow();
});
it('keeps the complete confidence interval visible in the shared result presentation',()=>{const result=factoryResult(285,{estimate:'100',standardError:'5',confidenceLevel:'0.95'});expect([result.primaryResult,...(result.metrics??[])].map(m=>m.id)).toEqual(expect.arrayContaining(['lowerBound','upperBound','marginOfError']));});
