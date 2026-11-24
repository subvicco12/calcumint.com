import {expect,it} from 'vitest';
import {getFactoryWorkflows} from '@/lib/calculator-factory/registry';
import {mobilityContract,mobilityWorkflows,prepareMobilityRecovery} from './cohort';

const retainedProfiles=[284, 285, 286, 287, 288, 289, 291, 300];

it.each(retainedProfiles)('delivers the retained #%i snapshot with exact version replay',id=>{
 const contract=mobilityContract(id);
 const workflow=mobilityWorkflows(id);
 const raw=Object.fromEntries(contract.fields.map(field=>[field.key,String(field.defaultValue)]));
 const packet=workflow.execute(raw);
 expect(packet.snapshot).toEqual(getFactoryWorkflows(id).execute(raw).snapshot);
 expect(prepareMobilityRecovery(packet.snapshot)).toMatchObject({catalogId:id,currentCaptureAvailable:true});
 expect(workflow.replay(workflow.exportPacket(packet,'json','pro')).snapshot).toEqual(packet.snapshot);
 expect(workflow.batch([raw,{...raw,[contract.fields[0].key]:''}]).map(row=>!!row.packet)).toEqual([true,false]);
});
