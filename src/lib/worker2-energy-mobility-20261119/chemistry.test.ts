import {expect,it} from 'vitest';
import {getFactoryWorkflows} from '@/lib/calculator-factory/registry';
import {mobilityContract,mobilityWorkflows,prepareMobilityRecovery} from './cohort';

const retainedProfiles=[328,329,331,332,333,334,335,336,337,338,339,340,341,342];

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

it('delivers molecular formula mass and refuses unsupported formula syntax',()=>{
 const workflow=mobilityWorkflows(330);
 const packet=workflow.execute({formula:'Ca(OH)2'});
 expect(packet.snapshot.output.value).toBeCloseTo(74.092,10);
 expect(workflow.replay(workflow.exportPacket(packet,'json','pro')).snapshot).toEqual(packet.snapshot);
 expect(workflow.batch([{formula:'H2O'},{formula:'Mg(OH'},{formula:'H0'},{formula:'Xx'}]).map(row=>!!row.packet)).toEqual([true,false,false,false]);
});
