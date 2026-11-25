import {describe,expect,it} from 'vitest';
import {mobilityContract,mobilityWorkflows} from './cohort';

describe('recovered bounded contracts',()=>{
 it('converts named mass units and refuses force or false zero',()=>{
  expect(mobilityContract(426).engine.id).toBe('private.component.426');
  const workflow=mobilityWorkflows(426);
  const input={value:'1',fromUnit:'lb',toUnit:'g',scope:'named-unit-conversion'};
  const packet=workflow.execute(input);
  expect(packet.snapshot.output).toMatchObject({value:453.59237,unit:'g'});
  expect(workflow.replay(workflow.exportPacket(packet,'json','pro')).snapshot).toEqual(packet.snapshot);
  expect(()=>workflow.execute({...input,fromUnit:'N'})).toThrow();
  expect(()=>workflow.execute({...input,value:'0.000000000000001'})).toThrow();
 });
});
