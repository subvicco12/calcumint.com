import {expect,it} from 'vitest';
import {mobilityContract,mobilityWorkflows,prepareMobilityRecovery} from './cohort';

it('captures dated manually supplied FX and replays every line',()=>{
 const contract=mobilityContract(512),workflow=mobilityWorkflows(512);
 const raw=Object.fromEntries(contract.fields.map(f=>[f.key,String(f.defaultValue)]));
 const packet=workflow.execute(raw);
 expect(packet.snapshot.output.total).toBe(20);
 expect(prepareMobilityRecovery(packet.snapshot).currentCaptureAvailable).toBe(true);
 expect(workflow.replay(workflow.exportPacket(packet,'json','pro')).snapshot).toEqual(packet.snapshot);
 const reciprocal=JSON.parse(raw.lines).map((line:Record<string,unknown>)=>({...line,rate:0.5,direction:'unitsPerReporting'}));
 expect(workflow.execute({...raw,lines:JSON.stringify(reciprocal)}).snapshot.output.total).toBe(20);
 expect(()=>workflow.execute({...raw,lines:JSON.stringify(reciprocal.map((line:Record<string,unknown>)=>({...line,quoteCurrency:'JPY'})))})).toThrow();
});
