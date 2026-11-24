import {expect,it} from 'vitest';
import {mobilityContract,mobilityWorkflows,prepareMobilityRecovery} from './cohort';

const vectors=[
 [10,0],[31,200],[38,600],[39,2],[40,3],[41,1.5],[42,10],[44,150],
 [65,0],[109,25],[145,56],[146,120],[147,25],[150,1.5],[154,10],[155,20],
 [157,60],[177,25],[200,50],[203,3],
] as const;

it.each(vectors)('#%i delivers its immutable bounded calculator and exact replay',(id,expected)=>{
 const c=mobilityContract(id),w=mobilityWorkflows(id);
 const raw=Object.fromEntries(c.fields.map(f=>[f.key,String(f.defaultValue)]));
 const packet=w.execute(raw);
 expect(c).toMatchObject({registered:false,version:1});
 expect(c.sourceEvidence[0]).toMatch(/^src\/calculators\/[a-z-]+\.ts$/);
 expect(packet.snapshot.output[c.primaryKey]).toBeCloseTo(expected,8);
 expect(prepareMobilityRecovery(packet.snapshot)).toMatchObject({catalogId:id,currentCaptureAvailable:true});
 expect(w.replay(w.exportPacket(packet,'json','pro')).snapshot).toEqual(packet.snapshot);
 expect(w.batch([raw,{...raw,[c.fields[0].key]:''}]).map(r=>!!r.packet)).toEqual([true,false]);
 expect(()=>w.verify({...packet,identity:{...packet.identity,catalogId:999}})).toThrow();
});
