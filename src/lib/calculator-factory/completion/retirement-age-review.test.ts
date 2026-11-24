import {expect,it} from 'vitest';
import {exportPrivateWorkflow,importPrivateWorkflow} from '@/calculators/private-scenario-workflows';
import {factoryDownload} from './exports';
import {retirementAgeReview as review} from './retirement-age-review';

const raw={currentAgeMonths:'599',currency:'USD',initial:'100',initialTarget:'150',timing:'end',
 steps:'[{"rate":0,"cashflow":25,"target":150},{"rate":0,"cashflow":25,"target":150}]'};
it('reports the exact attained month and replays all periods and source identity',()=>{
 const packet=review.execute(raw);
 expect(packet.snapshot.output).toMatchObject({firstTargetPeriod:2,firstTargetAgeMonths:601,firstShortfallAgeMonths:null});
 expect(review.replay(review.exportPacket(packet,'json','pro'))).toEqual(packet);
 for(const format of ['json','csv','pdf'] as const)expect(factoryDownload(review,packet,format,'pro','Retirement age review').bytes.length).toBeGreaterThan(0);
 expect(()=>review.verify({...packet,snapshot:{...packet.snapshot,output:{...packet.snapshot.output,firstTargetAgeMonths:600}}})).toThrow();
});
it('distinguishes period-zero target, no attainment, and a separate unmet withdrawal',()=>{
 expect(review.execute({...raw,initialTarget:'100',steps:'[]'}).snapshot.output.firstTargetAgeMonths).toBe(599);
 expect(review.execute({...raw,steps:'[]'}).snapshot.output.firstTargetAgeMonths).toBeNull();
 expect(review.execute({...raw,steps:'[{"rate":0,"cashflow":-110,"target":150}]'}).snapshot.output.firstShortfallAgeMonths).toBe(600);
});
it('keeps contribution timing explicit in monthly growth',()=>{
 const steps='[{"rate":0.5,"cashflow":50,"target":210}]';
 expect(review.execute({...raw,initialTarget:'210',timing:'begin',steps}).snapshot.output.firstTargetAgeMonths).toBe(600);
 expect(review.execute({...raw,initialTarget:'210',timing:'end',steps}).snapshot.output.firstTargetAgeMonths).toBeNull();
});
it.each([
 {currentAgeMonths:'-1'},{currentAgeMonths:'599.5'},{currentAgeMonths:'1800'},
 {steps:'[{"rate":-1,"cashflow":0,"target":150}]'},
 {steps:JSON.stringify(Array.from({length:121},()=>({rate:0,cashflow:0,target:150})))},
 {currency:'US dollars'}, {timing:'daily'}
])('refuses out-of-contract input %j',change=>expect(()=>review.execute({...raw,...change} as typeof raw)).toThrow());

it('preserves independently replayable v1 snapshots with no age output',()=>{
 const v1=exportPrivateWorkflow('private.workflow.target-trajectory',{currency:'USD',period:'month',initial:100,initialTarget:150,timing:'end',steps:JSON.parse(raw.steps)});
 expect(v1.calculation.calculatorVersion).toBe(1);
 expect(importPrivateWorkflow(v1)).toEqual(v1);
 expect(v1.calculation.output).not.toHaveProperty('firstTargetAgeMonths');
});
