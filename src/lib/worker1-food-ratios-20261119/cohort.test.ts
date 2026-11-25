import {describe,expect,it} from 'vitest';
import {prepareFoodRatioRecovery,ratioWorkflows,verifyFoodRatioSnapshot} from './cohort';
const coffee=ratioWorkflows(504),rice=ratioWorkflows(505);
describe('food ratio v1 private workflows',()=>{
 it.each([
  [coffee,{waterGrams:'600',waterToCoffeeRatio:'16'},37.5],
  [coffee,{waterGrams:'1',waterToCoffeeRatio:'3'},0.333333],
  [coffee,{waterGrams:'1',waterToCoffeeRatio:'2000000'},0.000001],
  [coffee,{waterGrams:'0',waterToCoffeeRatio:'1'},0],
  [rice,{riceAmount:'2.5',waterPerRiceUnit:'1.25'},3.125],
  [rice,{riceAmount:'7',waterPerRiceUnit:'0'},0],
  [rice,{riceAmount:'1e12',waterPerRiceUnit:'1e12'},1e24],
 ] as const)('matches arithmetic and v1 rounding %#',(flow,raw,expected)=>{
  const packet=flow.execute(raw);
  expect(packet.snapshot.output.value).toBe(expected);
  expect(flow.replay(flow.exportPacket(packet,'json','pro'))).toEqual(packet);
  expect(flow.exportPacket(packet,'csv','business')).toContain('outputUnit');
  expect(()=>flow.exportPacket(packet,'json','free')).toThrow();
  expect(verifyFoodRatioSnapshot(packet.snapshot).snapshot).toEqual(packet.snapshot);
  expect(()=>verifyFoodRatioSnapshot({...packet.snapshot,calculatorVersion:2})).toThrow();
  expect(()=>verifyFoodRatioSnapshot({...packet.snapshot,output:{...packet.snapshot.output,value:99}})).toThrow();
 });
 it.each(['','Infinity','-1','0','1e-400','5e-324','1.0000000000000001','1e13','1e-308'])('refuses coffee denominator %s',denominator=>{
  expect(()=>coffee.execute({waterGrams:'600',waterToCoffeeRatio:denominator})).toThrow();
 });
 it('refuses overflowing coffee and invalid rice inputs',()=>{
  expect(()=>coffee.execute({waterGrams:'1e12',waterToCoffeeRatio:'1e-300'})).toThrow();
  expect(()=>rice.execute({riceAmount:'2',waterPerRiceUnit:'-0.1'})).toThrow();
  expect(()=>rice.execute({riceAmount:'2 cups',waterPerRiceUnit:'1'})).toThrow();
 });
 it('opens valid historical subnormal input read-only',()=>{
  const input={riceAmount:5e-324,waterPerRiceUnit:1};
  const snapshot={calculatorSlug:'water-to-rice-ratio-calculator',calculatorVersion:1,input,output:{value:0,steps:['Water-to-Rice Ratio = 0']}};
  expect(prepareFoodRatioRecovery(snapshot).currentCaptureAvailable).toBe(false);
 });
});

it('isolates invalid batch rows and replays corrected exact-version rows',()=>{
 const good={riceAmount:'2.00',waterPerRiceUnit:'1.5'};
 const invalid={riceAmount:'2',waterPerRiceUnit:'-1'};
 const rows=rice.batch([good,invalid]);
 expect(rows[0].packet?.snapshot.output.value).toBe(3);
 expect(rows[1].error).toBeTruthy();
 expect(()=>rice.exportBatch(rows,'pro')).toThrow('Correct every row');
 const corrected=rice.batch([good,{...invalid,waterPerRiceUnit:'0'}]);
 expect(rice.replayBatch(rice.exportBatch(corrected,'pro'))).toEqual(corrected);
 expect(()=>rice.exportBatch(corrected,'free')).toThrow();
});
