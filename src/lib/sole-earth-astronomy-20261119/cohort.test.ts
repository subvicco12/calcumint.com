import {describe,expect,it} from 'vitest';
import {earthContract,earthResult,earthWorkflows,prepareEarthAstronomyRecovery,verifyEarthAstronomySnapshot} from './cohort';

const goldens=[
 [532,{semiMajorAxisAu:'4',centralMassSolar:'4'},4],
 [533,{massKg:'1e12',radiusM:'133.486'},0.001],
 [534,{value:'1',fromUnit:'au',toUnit:'km'},149597870.7],
 [538,{temperatureC:'-5',windSpeedKmh:'20'},-11.551404],
 [540,{temperatureC:'20',relativeHumidity:'100'},20],
] as const;
describe('private Earth and astronomy v1',()=>{
 it.each(goldens)('retains independent golden and exact replay for #%s',(id,raw,value)=>{
  const flow=earthWorkflows(id),packet=flow.execute(raw);
  expect(packet.snapshot.output[earthContract(id).resultKey]).toBeCloseTo(value,6);
  expect(flow.replay(flow.exportPacket(packet,'json','pro'))).toEqual(packet);
  expect(verifyEarthAstronomySnapshot(packet.snapshot).snapshot).toEqual(packet.snapshot);
  expect(()=>verifyEarthAstronomySnapshot({...packet.snapshot,calculatorVersion:2})).toThrow();
  expect(()=>verifyEarthAstronomySnapshot({...packet.snapshot,output:{...packet.snapshot.output,[earthContract(id).resultKey]:-999}})).toThrow();
  expect(()=>flow.exportPacket(packet,'csv','free')).toThrow();
 });
 it.each([
 [532,{semiMajorAxisAu:'4',centralMassSolar:'0'}],
 [533,{massKg:'1',radiusM:'0'}],
 [534,{value:'1',fromUnit:'mile',toUnit:'au'}],
 [534,{value:'1.7e308',fromUnit:'pc',toUnit:'km'}],
 [538,{temperatureC:'11',windSpeedKmh:'20'}],
 [538,{temperatureC:'0',windSpeedKmh:'4.7'}],
 [540,{temperatureC:'0',relativeHumidity:'0'}],
 [540,{temperatureC:'0',relativeHumidity:'101'}],
 ] as const)('refuses unsupported input for #%s',(id,raw)=>expect(()=>earthWorkflows(id).execute(raw)).toThrow());
 it('keeps historical rounded-zero orbital results readable',()=>{
  const snapshot={calculatorSlug:'orbital-period-calculator',calculatorVersion:1,input:{semiMajorAxisAu:1e-12,centralMassSolar:1},output:{value:0,steps:['Orbital Period = 0']}};
  expect(prepareEarthAstronomyRecovery(snapshot)).toMatchObject({currentCaptureAvailable:false,snapshot});
  expect(()=>earthWorkflows(532).execute({semiMajorAxisAu:'1e-12',centralMassSolar:'1'})).toThrow(/precision/);
 });
 it('exports selected distance units and retains zero distance',()=>{
  const flow=earthWorkflows(534),packet=flow.execute({value:'0',fromUnit:'km',toUnit:'pc'});
  expect(earthResult(packet).primaryResult).toMatchObject({value:0,unit:'pc'});
  expect(flow.exportPacket(packet,'csv','business')).toContain('"outputUnit","pc"');
 });
});
