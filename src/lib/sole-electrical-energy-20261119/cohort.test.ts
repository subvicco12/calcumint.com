import {describe,expect,it} from 'vitest';
import {energyWorkflows,prepareElectricalEnergyRecovery,verifyElectricalEnergySnapshot} from './cohort';

const solar={dailyEnergyKwh:'10',panelWatts:'400',peakSunHours:'5',systemEfficiencyPercent:'80'};
const goldens=[
 [362,{voltageVolts:'120',currentAmps:'12.5'},1500],
 [363,{currentAmps:'8',oneWayLengthMeters:'25',resistanceOhmsPerMeter:'0.02',conductors:'2'},8],
 [364,{voltageVolts:'24',currentAmps:'0.125'},192],
 [365,{floorAreaSquareMeters:'32',ceilingHeightMeters:'2.5',btuPerCubicMeter:'15'},1200],
 [366,solar,7],
] as const;

describe('electrical and energy system private workflows',()=>{
 it.each(goldens)('matches independent literal and immutable replay for #%s',(id,raw,value)=>{
  const flow=energyWorkflows(id),packet=flow.execute(raw);
  expect(packet.snapshot.output.value).toBe(value);
  expect(prepareElectricalEnergyRecovery(packet.snapshot)).toMatchObject({catalogId:id,currentCaptureAvailable:true,snapshot:packet.snapshot});
  expect(flow.replay(flow.exportPacket(packet,'json','pro'))).toEqual(packet);
  expect(flow.exportPacket(packet,'csv','business')).toContain('"outputUnit"');
  expect(()=>flow.exportPacket(packet,'json','free')).toThrow();
  expect(()=>verifyElectricalEnergySnapshot({...packet.snapshot,calculatorVersion:2})).toThrow();
  expect(()=>verifyElectricalEnergySnapshot({...packet.snapshot,output:{...packet.snapshot.output,value:-99}})).toThrow();
 });
 it.each([
  [362,{voltageVolts:'0',currentAmps:'12'}],
  [362,{voltageVolts:'1.0000000000000001',currentAmps:'12'}],
  [363,{...goldens[1][1],conductors:'3'}],
  [363,{...goldens[1][1],conductors:'1.5'}],
  [364,{voltageVolts:'24',currentAmps:'0'}],
  [364,{voltageVolts:'1e100',currentAmps:'1e-250'}],
  [365,{floorAreaSquareMeters:'1e101',ceilingHeightMeters:'2',btuPerCubicMeter:'15'}],
  [366,{...solar,systemEfficiencyPercent:'0'}],
  [366,{...solar,systemEfficiencyPercent:'101'}],
 ] as const)('refuses input boundary #%s',(id,raw)=>expect(()=>energyWorkflows(id).execute(raw)).toThrow());
 it('retains the v1 near-integer solar rule on both sides of its comparison',()=>{
  const flow=energyWorkflows(366);
  const run=(dailyEnergyKwh:string)=>flow.execute({dailyEnergyKwh,panelWatts:'1000',peakSunHours:'1',systemEfficiencyPercent:'100'}).snapshot.output.value;
  expect(run('2')).toBe(2);
  expect(run('2.000000000000001')).toBe(2);
  expect(run('2.00000000000002')).toBe(3);
 });
 it('insulates invalid rows and replays a corrected local batch',()=>{
  const flow=energyWorkflows(366),rows=flow.batch([solar,{...solar,panelWatts:'0'}]);
  expect(rows[1].error).toBeTruthy();
  expect(()=>flow.exportBatch(rows,'pro')).toThrow('Correct every row');
  expect(flow.replayBatch(flow.exportBatch(flow.batch([solar]),'pro'))[0].packet).toEqual(flow.execute(solar));
 });
});
