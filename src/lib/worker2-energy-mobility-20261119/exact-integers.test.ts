import {expect,it} from 'vitest';
import {mobilityWorkflows,prepareMobilityRecovery} from './cohort';

it.each([
 ['add','9007199254740993','1',{result:'9007199254740994'}],
 ['subtract','1','3',{result:'-2'}],
 ['multiply','-7','3',{result:'-21'}],
 ['divmod','-7','3',{quotient:'-2',remainder:'-1'}],
 ['gcd','-8','12',{result:'4'}],
])('replays exact integer %s', (operation,left,right,output)=>{
 const workflow=mobilityWorkflows(232);
 const packet=workflow.execute({operation,left,right});
 expect(packet.snapshot.output).toEqual(output);
 expect(prepareMobilityRecovery(packet.snapshot).currentCaptureAvailable).toBe(true);
 expect(workflow.replay(workflow.exportPacket(packet,'json','pro')).snapshot).toEqual(packet.snapshot);
});
it('refuses division by zero and ambiguous integer text',()=>{
 const workflow=mobilityWorkflows(232);
 expect(()=>workflow.execute({operation:'divmod',left:'7',right:'0'})).toThrow();
 expect(()=>workflow.execute({operation:'add',left:'001',right:'2'})).toThrow();
});
it('preserves the official PCG vector and exact state through replay',()=>{
 const workflow=mobilityWorkflows(233);
 const raw={seed:'42',stream:'54',minimum:'-2147483648',maximum:'2147483647',count:'6'};
 const packet=workflow.execute(raw);
 expect(packet.snapshot.output).toEqual({values:[559678135,-79170551,974992176,64156307,1067743307,1273847918],finalState:'13742400798436595530'});
 expect(workflow.replay(workflow.exportPacket(packet,'json','pro')).snapshot).toEqual(packet.snapshot);
 expect(()=>workflow.execute({...raw,count:'1001'})).toThrow();
});
