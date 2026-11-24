import {expect,it} from 'vitest';
import {mobilityContract,mobilityWorkflows,prepareMobilityRecovery} from './cohort';

it.each([
 [484,16,'chargingEfficiency','0'],
 [518,450,'sleepStart','2026-01-01T23:00'],
 [529,3,'massKg','0'],
 [531,9.80665,'referenceVersion','unknown'],
] as const)('delivers calculator #%i and verifies immutable replay',(id,expected,field,invalid)=>{
 const contract=mobilityContract(id), workflow=mobilityWorkflows(id);
 const raw=Object.fromEntries(contract.fields.map(field=>[field.key,String(field.defaultValue)]));
 const packet=workflow.execute(raw);
 expect(contract).toMatchObject({version:1,registered:false});
 expect(packet.snapshot.output[contract.primaryKey]).toBe(expected);
 expect(workflow.batch([raw,{...raw,[field]:invalid}]).map(row=>!!row.packet)).toEqual([true,false]);
 expect(prepareMobilityRecovery(packet.snapshot)).toMatchObject({catalogId:id,currentCaptureAvailable:true});
 expect(workflow.replay(workflow.exportPacket(packet,'json','pro')).snapshot).toEqual(packet.snapshot);
});
