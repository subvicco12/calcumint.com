import {expect,it} from 'vitest';
import {mobilityWorkflows,verifyMobilitySnapshot} from './cohort';

it('captures rectangular prism volume in cubic supplied units',()=>{
 const w=mobilityWorkflows(275);
 const p=w.execute({length:'2',width:'3',height:'5'});
 expect(p.snapshot.output).toMatchObject({volume:30,surfaceArea:62});
 expect(()=>w.execute({length:'2',width:'0',height:'5'})).toThrow();
 expect(verifyMobilitySnapshot(p.snapshot).catalogId).toBe(275);
 expect(w.replay(w.exportPacket(p,'json','pro'))).toEqual(p);
});

it('estimates doubling time from a supplied positive continuous growth rate',()=>{
 const w=mobilityWorkflows(412);
 const p=w.execute({growthConstant:'0.2'});
 expect(p.snapshot.output.value).toBe(3.465736);
 expect(()=>w.execute({growthConstant:'0'})).toThrow();
 expect(verifyMobilitySnapshot(p.snapshot).catalogId).toBe(412);
 expect(w.replay(w.exportPacket(p,'json','pro'))).toEqual(p);
});
