import {expect,it} from 'vitest';
import {mobilityContract,mobilityWorkflows,prepareMobilityRecovery} from './cohort';

it.each([[246,12],[247,9],[248,2]])('captures the bounded numerical estimate and replay for #%i',(id,witness)=>{
 const contract=mobilityContract(id),workflow=mobilityWorkflows(id);
 const raw=Object.fromEntries(contract.fields.map(field=>[field.key,String(field.defaultValue)]));
 const packet=workflow.execute(raw);
 expect(packet.snapshot.output.value).toBeCloseTo(witness,6);
 expect(prepareMobilityRecovery(packet.snapshot)).toMatchObject({catalogId:id,currentCaptureAvailable:true});
 expect(workflow.replay(workflow.exportPacket(packet,'json','pro')).snapshot).toEqual(packet.snapshot);
 expect(workflow.batch([raw,{...raw,expression:''}]).map(row=>!!row.packet)).toEqual([true,false]);
});

it('keeps directional limit selection and refuses a nonconvergent finite estimate',()=>{
 const w=mobilityWorkflows(248);
 expect(w.execute({expression:'(x^2-1)/(x-1)',x:'1',direction:'left'}).snapshot.output.right).toBeNull();
 expect(()=>w.execute({expression:'1/x',x:'0',direction:'both'})).toThrow();
});
