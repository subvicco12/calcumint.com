import {expect,it} from 'vitest';
import {mobilityContract,mobilityWorkflows,prepareMobilityRecovery} from './cohort';

it.each([[66,10],[111,52000]])('#%i uses the original supplied-input engine', (id,expected)=>{
 const c=mobilityContract(id),w=mobilityWorkflows(id);
 const raw=Object.fromEntries(c.fields.map(f=>[f.key,String(f.defaultValue)]));
 const packet=w.execute(raw);
 expect(c.registered).toBe(false);
 expect(packet.snapshot.output.value).toBeCloseTo(expected,8);
 expect(prepareMobilityRecovery(packet.snapshot).currentCaptureAvailable).toBe(true);
 expect(w.replay(w.exportPacket(packet,'json','pro'))).toEqual(packet);
 expect(()=>w.execute({...raw,scope:'external-policy'})).toThrow();
});
