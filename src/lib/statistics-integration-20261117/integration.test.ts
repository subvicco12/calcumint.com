import {expect,it} from 'vitest';
import {statisticsContracts as a,statisticsWorkflows as aw} from '@/lib/worker1-statistics-a-20261117/cohort';
import {statisticsContracts as b,statisticsWorkflows as bw} from '@/lib/worker2-statistics-b-20261117/cohort';
import {getFactoryContract,getFactoryWorkflows} from '@/lib/calculator-factory/registry';
import {verifyFactoryPacket,verifyFactoryStoredSnapshot} from '@/lib/calculator-factory/completion/business';
import {verifyRegisteredSnapshot} from '@/lib/registered-snapshot-verification';
import {factoryDeliveryIdentity} from '@/lib/native-delivery/factory-delivery-catalog';
const contracts=[...a,...b];
it.each(contracts)('adopts exact #$catalogId packet, replay and delivery without recapture',c=>{
 const raw=Object.fromEntries(c.fields.map(f=>[f.key,String(f.defaultValue)]));
 const packet=(c.catalogId<=295?aw:bw)(c.catalogId).execute(raw);
 expect(getFactoryContract(c.catalogId)?.engineId).toBe(c.engineId);
 expect(getFactoryWorkflows(c.catalogId).execute(raw)).toEqual(packet);
 expect(verifyFactoryPacket(packet)).toEqual(packet);
 expect(verifyFactoryStoredSnapshot(packet.snapshot).snapshot).toEqual(packet.snapshot);
 expect(verifyRegisteredSnapshot(packet.snapshot)).toMatchObject({snapshot:packet.snapshot,engineVersion:1,scope:expect.any(String)});
 expect(factoryDeliveryIdentity(c.catalogId,1)).toMatchObject({engineId:c.engineId,slug:c.slug});
 expect(()=>verifyFactoryPacket({...packet,identity:{...packet.identity,sourceVersion:'forged'}})).toThrow();
 expect(()=>verifyFactoryStoredSnapshot({...packet.snapshot,calculatorVersion:2})).toThrow();
});
it('keeps blocked298 unavailable',()=>{expect(getFactoryContract(298)).toBeUndefined();expect(factoryDeliveryIdentity(298,1)).toBeUndefined();});
it('routes cancellation history through original v1 while refusing new capture',()=>{
 const snapshot={calculatorSlug:'weighted-mean-calculator',calculatorVersion:1,input:{values:[1e50,1,-1e50],weights:[1,1,1]},output:{weightedMean:0,totalWeight:3,count:3,steps:['Weighted sum = 0','Total weight = 3','Weighted mean = 0']}};
 expect(verifyFactoryStoredSnapshot(snapshot).snapshot).toEqual(snapshot);
 expect(verifyRegisteredSnapshot(snapshot).snapshot).toEqual(snapshot);
 expect(()=>getFactoryWorkflows(294).execute({values:'1e50,1,-1e50',weights:'1,1,1'})).toThrow(/precision/);
});
