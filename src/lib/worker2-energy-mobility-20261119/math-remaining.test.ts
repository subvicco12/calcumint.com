import {expect,it} from 'vitest';
import {mobilityWorkflows,prepareMobilityRecovery} from './cohort';

it('presents and replays a bounded bisection result and refuses a non-bracketing interval',()=>{
 const workflow=mobilityWorkflows(254);
 const raw={a:'0',b:'1',c:'0',d:'-2',left:'1',right:'2'};
 const packet=workflow.execute(raw);
 expect(packet.snapshot.output.root).toBeCloseTo(Math.SQRT2,11);
 expect(packet.snapshot.output.bracket).toHaveLength(2);
 expect(workflow.replay(workflow.exportPacket(packet,'json','pro')).snapshot).toEqual(packet.snapshot);
 expect(prepareMobilityRecovery(packet.snapshot)).toMatchObject({catalogId:254,currentCaptureAvailable:true});
 expect(workflow.batch([raw,{...raw,left:'2',right:'3'}]).map(row=>!!row.packet)).toEqual([true,false]);
});

it('presents all tied modes and preserves no-mode and exact-version results',()=>{
 const workflow=mobilityWorkflows(281);
 const packet=workflow.execute({values:'[1, 2, 2, 3, 3, 7]'});
 expect(packet.snapshot.output).toMatchObject({mean:3,median:2.5,modes:[2,3],range:6});
 expect(workflow.execute({values:'[1, 2, 3]'}).snapshot.output.modes).toEqual([]);
 expect(workflow.replay(workflow.exportPacket(packet,'json','pro')).snapshot).toEqual(packet.snapshot);
 expect(prepareMobilityRecovery(packet.snapshot)).toMatchObject({catalogId:281,currentCaptureAvailable:true});
 expect(workflow.batch([{values:'[1, 2]'},{values:'[1, "invalid"]'}]).map(row=>!!row.packet)).toEqual([true,false]);
});
