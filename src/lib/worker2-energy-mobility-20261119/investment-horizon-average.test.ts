import {expect,it} from 'vitest';
import {mobilityContract,mobilityWorkflows,prepareMobilityRecovery} from './cohort';

function defaults(id:number){
 return Object.fromEntries(mobilityContract(id).fields.map(f=>[f.key,String(f.defaultValue)]));
}

it('distinguishes reachable, equal and unreachable lump-sum goals',()=>{
 const w=mobilityWorkflows(63),raw=defaults(63);
 const p=w.execute({...raw,beginningValue:'100',targetValue:'121',annualReturnPercent:'10'});
 expect(p.snapshot.output.value).toBeCloseTo(2,8);
 expect(w.execute({...raw,beginningValue:'100',targetValue:'100'}).snapshot.output.value).toBe(0);
 const refusedTarget=w.execute({...raw,beginningValue:'100',targetValue:'121',annualReturnPercent:'0'});
 expect(refusedTarget.snapshot.output).toMatchObject({value:null,details:{status:'no-future-equality'}});
 expect(prepareMobilityRecovery(refusedTarget.snapshot).currentCaptureAvailable).toBe(true);
});

it('keeps the equally weighted, noncompounding same-period mean',()=>{
 const w=mobilityWorkflows(67),raw=defaults(67);
 const p=w.execute({...raw,returns:'[-10,5,20]'});
 expect(p.snapshot.output.value).toBe(5);
 expect(()=>w.execute({...raw,returns:'[]'})).toThrow();
 expect(w.replay(w.exportPacket(p,'json','pro'))).toEqual(p);
});
