import {describe,expect,it} from 'vitest';
import {encodePrivateFinalInputs} from './adapter';
import {prepareStructuredFactoryRecovery,structuredWorkflows,verifyStructuredFactorySnapshot} from '@/lib/sole-structured-factory-20261119/cohort';

describe('structured private Final workflows',()=>{
 it('keeps the registered tire geometry and units, and refuses a zero aspect ratio',()=>{
  const flow=structuredWorkflows(474);
  const raw={currentWidthMm:'225',currentAspectRatio:'45',currentRimInches:'17',newWidthMm:'245',newAspectRatio:'40',newRimInches:'18'};
  const packet=flow.execute(raw);
  expect(packet.snapshot.output).toMatchObject({currentDiameterMm:634.3,newDiameterMm:653.2});
  expect(packet.snapshot.output.diameterDifferencePercent).toBeCloseTo(18.9/634.3*100,10);
  expect(flow.exportPacket(packet,'csv','pro')).toContain('"outputUnit","%"');
  expect(()=>flow.execute({...raw,currentAspectRatio:'0'})).toThrow();
  expect(()=>verifyStructuredFactorySnapshot({...packet.snapshot,calculatorVersion:2})).toThrow();
 });
 it('encodes shifts consistently after JSONB key reordering and rejects lossy data',()=>{
  const original={startTime:'22:30',endTime:'02:00',overnight:true,breakMinutes:30};
  const reordered={breakMinutes:30,endTime:'02:00',overnight:true,startTime:'22:30'};
  expect(encodePrivateFinalInputs({shifts:[original]})).toEqual(encodePrivateFinalInputs({shifts:[reordered]}));
  const flow=structuredWorkflows(450),raw=encodePrivateFinalInputs({shifts:[original]});
  const packet=flow.execute(raw);
  expect(packet.snapshot.output.totalMinutes).toBe(180);
  expect(prepareStructuredFactoryRecovery(packet.snapshot)).toMatchObject({currentCaptureAvailable:true,snapshot:packet.snapshot});
  expect(()=>flow.execute({shifts:raw.shifts.replace('30','30.000000000000001')})).toThrow();
 });
 it('binds CSV output unit to the verified selected unit',()=>{
  const flow=structuredWorkflows(534);
  const packet=flow.execute({value:'1',fromUnit:'km',toUnit:'km'});
  expect(flow.exportPacket(packet,'csv','pro')).toContain('"outputUnit","km"');
  const other=flow.execute({value:'1',fromUnit:'au',toUnit:'au'});
  expect(flow.exportPacket(other,'csv','pro')).toContain('"outputUnit","au"');
  expect(()=>flow.exportPacket(other,'csv','free')).toThrow();
 });
 it('preserves the null vector angle and exact complex replay',()=>{
  expect(structuredWorkflows(245).execute({ax:'0',ay:'0',az:'0',bx:'1',by:'0',bz:'0'}).snapshot.output.angleRadians).toBeNull();
  const flow=structuredWorkflows(244),packet=flow.execute({a:'2',b:'4',c:'1',d:'1',operation:'divide'});
  expect(packet.snapshot.output).toMatchObject({real:3,imaginary:1});
  expect(flow.replay(flow.exportPacket(packet,'json','pro'))).toEqual(packet);
 });
});
