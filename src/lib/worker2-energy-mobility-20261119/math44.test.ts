import {expect,it} from 'vitest';
import {getFactoryContract,getFactoryWorkflows} from '@/lib/calculator-factory/registry';
import {mobilityContract,mobilityWorkflows,prepareMobilityRecovery} from './cohort';

const ids=[208,209,210,211,212,215,216,218,219,220,221,223,224,225,227,228,230,231,234,255,256,257,258,259,260,261,262,263,264];
it.each(ids)('delivers #%i with exact retained capture parity and replay',id=>{
 const contract=mobilityContract(id), retained=getFactoryContract(id)!;
 const raw=Object.fromEntries(retained.fields.map(field=>[field.key,String(field.defaultValue)]));
 const workflow=mobilityWorkflows(id),packet=workflow.execute(raw);
 expect(packet.snapshot).toEqual(getFactoryWorkflows(id).execute(raw).snapshot);
 expect(prepareMobilityRecovery(packet.snapshot)).toMatchObject({catalogId:id,currentCaptureAvailable:true});
 expect(workflow.replay(workflow.exportPacket(packet,'json','pro')).snapshot).toEqual(packet.snapshot);
 expect(workflow.batch([raw,{...raw,[retained.fields[0].key]:''}]).map(row=>!!row.packet)).toEqual([true,false]);
 expect(contract).toMatchObject({version:1,registered:false});
});
