import {expect,it} from 'vitest';
import {mobilityWorkflows,prepareMobilityRecovery} from './cohort';

it('converts reciprocal fuel consumption while distinguishing US and imperial gallons',()=>{
 const workflow=mobilityWorkflows(435);
 const packet=workflow.execute({value:'20',fromUnit:'km_per_l',toUnit:'l_per_100km'});
 expect(packet.snapshot.output.result).toBe('5');
 expect(workflow.execute({value:'20',fromUnit:'mpg_us',toUnit:'mpg_imp'}).snapshot.output.result).not.toBe('20');
 expect(prepareMobilityRecovery(packet.snapshot).currentCaptureAvailable).toBe(true);
 expect(workflow.replay(workflow.exportPacket(packet,'json','pro')).snapshot).toEqual(packet.snapshot);
 expect(()=>workflow.execute({value:'0',fromUnit:'km_per_l',toUnit:'l_per_100km'})).toThrow();
});
it('delivers only the supplied dry-air state and refuses absolute-zero input',()=>{
 const workflow=mobilityWorkflows(493);
 const packet=workflow.execute({pressurePa:'101325',temperatureC:'15'});
 expect(packet.snapshot.output.value).toBeCloseTo(1.225,3);
 expect(prepareMobilityRecovery(packet.snapshot).currentCaptureAvailable).toBe(true);
 expect(workflow.replay(workflow.exportPacket(packet,'json','pro')).snapshot).toEqual(packet.snapshot);
 expect(()=>workflow.execute({pressurePa:'101325',temperatureC:'-273.15'})).toThrow();
});
