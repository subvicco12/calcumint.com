import {describe,expect,it} from 'vitest';
import {deliveryContract,deliveryWorkflows,prepareVerifiedDeliveryRecovery,verifyVerifiedDeliverySnapshot} from './cohort';
import {calculatorRegistry} from '@/calculators/registry';

const bracket={a:'0',b:'1',c:'0',d:'-4',left:'0',right:'4'};
const witnesses=[
 [162,{payingCustomers:'125',averageMonthlyRevenuePerCustomer:'48'},{value:6000}],
 [163,{monthlyRecurringRevenue:'6250'},{value:75000}],
 [179,{cashBalance:'40000',monthlyBurnRate:'8000'},{value:5}],
 [254,bracket,{root:2,residual:0,iterations:1,bracket:[0,4]}],
 [493,{pressurePa:'86115',temperatureC:'26.85'},{value:1}],
] as const;

describe('verified private delivery v1',()=>{
 it.each(witnesses)('binds registry, computes independently and replays exactly #%s',(id,raw,expected)=>{
  const profile=deliveryContract(id),flow=deliveryWorkflows(id),packet=flow.execute(raw);
  expect(profile.engine).toBe(calculatorRegistry.getById(profile.engineId));
  expect(profile.version).toBe(1);
  expect(packet.snapshot.output).toMatchObject(expected);
  expect(verifyVerifiedDeliverySnapshot(packet.snapshot).snapshot).toEqual(packet.snapshot);
  expect(prepareVerifiedDeliveryRecovery(packet.snapshot)).toMatchObject({currentCaptureAvailable:true,snapshot:packet.snapshot});
  expect(flow.replay(flow.exportPacket(packet,'json','pro'))).toEqual(packet);
  expect(flow.exportPacket(packet,'csv','business')).toContain(`"outputUnit","${profile.unit}"`);
  expect(()=>flow.exportPacket(packet,'json','free')).toThrow();
  expect(()=>verifyVerifiedDeliverySnapshot({...packet.snapshot,calculatorVersion:2})).toThrow();
  expect(()=>flow.verify({...packet,identity:{...packet.identity,sourceVersion:'substitution'}})).toThrow();
 });
 it.each([
  [162,{payingCustomers:'1.2',averageMonthlyRevenuePerCustomer:'48'}],
  [163,{monthlyRecurringRevenue:'-1'}],
  [179,{cashBalance:'40000',monthlyBurnRate:'0'}],
  [254,{...bracket,left:'3'}],
  [493,{pressurePa:'86115',temperatureC:'-101'}],
  [493,{pressurePa:'0',temperatureC:'26.85'}],
 ] as const)('rejects out-of-contract inputs #%s',(id,raw)=>expect(()=>deliveryWorkflows(id).execute(raw)).toThrow());
 it('keeps legitimate zero and a historical positive value rounded to zero',()=>{
  const flow=deliveryWorkflows(179);
  expect(flow.execute({cashBalance:'0',monthlyBurnRate:'1'}).snapshot.output.value).toBe(0);
  const historical=flow.execute({cashBalance:'0.00000001',monthlyBurnRate:'1'}).snapshot;
  expect(historical.output.value).toBe(0);
  expect(verifyVerifiedDeliverySnapshot(historical).snapshot).toEqual(historical);
 });
 it('preserves endpoint root and corrected batch replay',()=>{
  const flow=deliveryWorkflows(254),endpoint={...bracket,left:'2'};
  expect(flow.execute(endpoint).snapshot.output).toMatchObject({root:2,residual:0,iterations:0,bracket:[2,2]});
  expect(()=>flow.exportBatch(flow.batch([endpoint,{...endpoint,right:'0'}]),'pro')).toThrow('Correct every row');
  expect(flow.replayBatch(flow.exportBatch(flow.batch([endpoint]),'pro'))).toEqual(flow.batch([endpoint]));
 });
});
