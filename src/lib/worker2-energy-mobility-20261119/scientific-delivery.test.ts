import {expect,it} from 'vitest';
import {mobilityWorkflows,prepareMobilityRecovery} from './cohort';

it.each([
 {operation:'sqrt',x:'4',result:'2'},
 {operation:'sin',x:'180',angleMode:'degrees',result:'0'},
 {operation:'pow',x:'-2',y:'3',result:'-8'},
])('delivers exact decimal $operation with explicit optional operands',({result,...input})=>{
 const workflow=mobilityWorkflows(206);
 const raw=Object.fromEntries(Object.entries(input).filter(([,value])=>value!==undefined)) as Record<string,string>;
 const packet=workflow.execute(raw);
 expect(packet.snapshot.output.result).toBe(result);
 expect(prepareMobilityRecovery(packet.snapshot).currentCaptureAvailable).toBe(true);
 expect(workflow.replay(workflow.exportPacket(packet,'json','pro')).snapshot).toEqual(packet.snapshot);
});
it('refuses absent power and angle operands, extra operands, and tangent poles',()=>{
 const workflow=mobilityWorkflows(206);
 const invalid:Record<string,string>[]=[
  {operation:'pow',x:'2'},{operation:'tan',x:'3'},{operation:'sqrt',x:'4',y:'1'},
  {operation:'tan',x:'90',angleMode:'degrees'},{operation:'pow',x:'-2',y:'0.5'},
 ];
 for(const raw of invalid)expect(()=>workflow.execute(raw)).toThrow();
});
