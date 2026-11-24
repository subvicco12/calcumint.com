import {expect,it} from 'vitest';
import {mobilityContract,mobilityWorkflows,prepareMobilityRecovery} from './cohort';

it.each([[139,30],[140,20]])('#%i preserves explicit supplied-accounting basis', (id,expected)=>{
 const c=mobilityContract(id),w=mobilityWorkflows(id);
 const raw=Object.fromEntries(c.fields.map(f=>[f.key,String(f.defaultValue)]));
 const packet=w.execute(raw);
 expect(c.registered).toBe(false);
 expect(packet.snapshot.output.value).toBeCloseTo(expected,8);
 expect(packet.identity.engineId).toBe('private.business.'+id);
 expect(()=>w.execute({...raw,revenue:'0'})).toThrow();
 expect(()=>w.execute({...raw,scope:'formal-accounting'})).toThrow();
 expect(prepareMobilityRecovery(packet.snapshot).currentCaptureAvailable).toBe(true);
 expect(w.replay(w.exportPacket(packet,'json','pro'))).toEqual(packet);
});
