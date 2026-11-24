import {expect,it} from 'vitest';
import {getFactoryWorkflows} from '@/lib/calculator-factory/registry';
import {mobilityContract,mobilityWorkflows,prepareMobilityRecovery} from './cohort';

it.each([249,250,253,265,266,267,268,269,270,271,272,274,279,280])('captures #%i without changing the retained v1 mathematics',id=>{
 const contract=mobilityContract(id),workflow=mobilityWorkflows(id);
 const raw=Object.fromEntries(contract.fields.map(field=>[field.key,String(field.defaultValue)]));
 const packet=workflow.execute(raw);
 if(id>=265)expect(packet.snapshot).toEqual(getFactoryWorkflows(id).execute(raw).snapshot);
 else expect(packet.snapshot.output).toEqual(contract.engine.calculate(packet.snapshot.input as never,{}));
 expect(prepareMobilityRecovery(packet.snapshot)).toMatchObject({catalogId:id,currentCaptureAvailable:true});
 expect(workflow.replay(workflow.exportPacket(packet,'json','pro')).snapshot).toEqual(packet.snapshot);
 expect(workflow.batch([raw,{...raw,[contract.fields[0].key]:''}]).map(row=>!!row.packet)).toEqual([true,false]);
});
