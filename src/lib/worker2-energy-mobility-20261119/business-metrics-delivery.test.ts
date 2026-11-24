import {expect,it} from 'vitest';
import {mobilityContract,mobilityWorkflows,prepareMobilityRecovery} from './cohort';

it.each([[162,10000],[163,120000],[170,40],[179,6]])('delivers retained business metric #%i', (id,value)=>{
 const contract=mobilityContract(id);
 const workflow=mobilityWorkflows(id);
 const raw=Object.fromEntries(contract.fields.map(field=>[field.key,String(field.defaultValue)]));
 const packet=workflow.execute(raw);
 expect(packet.snapshot.output.value).toBe(value);
 expect(prepareMobilityRecovery(packet.snapshot).currentCaptureAvailable).toBe(true);
 expect(workflow.replay(workflow.exportPacket(packet,'json','pro')).snapshot).toEqual(packet.snapshot);
 expect(workflow.batch([raw,{...raw,[contract.fields[0].key]:'-1'}]).map(row=>!!row.packet)).toEqual([true,false]);
});
