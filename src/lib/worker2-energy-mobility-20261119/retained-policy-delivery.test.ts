import {expect,it} from 'vitest';
import {mobilityContract,mobilityWorkflows,prepareMobilityRecovery} from './cohort';
import {factoryDownload} from '@/lib/calculator-factory/completion/exports';

it.each([126,133,516])('replays the retained source-bound #%i profile without policy substitution',id=>{
 const c=mobilityContract(id),w=mobilityWorkflows(id);
 const raw=Object.fromEntries(c.fields.map(f=>[f.key,String(f.defaultValue)]));
 const packet=w.execute(raw);
 expect(packet.snapshot.output).toEqual(c.engine.examples[0].expected);
 expect(prepareMobilityRecovery(packet.snapshot).currentCaptureAvailable).toBe(true);
 expect(w.replay(w.exportPacket(packet,'json','pro')).snapshot).toEqual(packet.snapshot);
 expect(factoryDownload(w,packet,'pdf','pro',c.title).bytes.length).toBeGreaterThan(0);
 expect(()=>w.execute({...raw,policyOverride:'enabled'})).toThrow();
});
