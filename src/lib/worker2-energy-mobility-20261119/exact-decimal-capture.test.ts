import {expect,it} from 'vitest';
import {mobilityWorkflows,prepareMobilityRecovery} from './cohort';

it.each([
 [205,{left:'0.1',right:'0.2',operation:'add'},'0.3',{right:'0',operation:'divide'}],
 [441,{value:'96',fromUnit:'dpi',toUnit:'dppx'},'1',{fromUnit:'px'}],
] as const)('retains exact decimal results for #%i',(id,raw,result,invalid)=>{
 const workflow=mobilityWorkflows(id),packet=workflow.execute(raw);
 expect(packet.snapshot.output.result).toBe(result);
 expect(prepareMobilityRecovery(packet.snapshot)).toMatchObject({catalogId:id,currentCaptureAvailable:true});
 expect(workflow.replay(workflow.exportPacket(packet,'json','pro')).snapshot).toEqual(packet.snapshot);
 expect(()=>workflow.execute({...raw,...invalid})).toThrow();
});
