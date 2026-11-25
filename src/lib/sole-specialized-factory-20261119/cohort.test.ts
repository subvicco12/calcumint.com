import {describe,expect,it} from 'vitest';
import {specializedContract,specializedWorkflows,verifySpecializedFactorySnapshot} from './cohort';
import {calculatorRegistry} from '@/calculators/registry';

const surface={expression:'x+y',minX:'-1',maxX:'1',minY:'-1',maxY:'1'};

describe('specialized private Final profiles',()=>{
 it.each([458,252])('binds exact original registry objects #%s',id=>{
  const profile=specializedContract(id);
  expect(calculatorRegistry.getById(profile.engineId)).toBe(profile.engine);
  expect(profile.version).toBe(1);
 });
 it('retains scalar Fuel Cost output, genuine zero and unit-bearing CSV',()=>{
  const flow=specializedWorkflows(458),packet=flow.execute({fuel:'37.5',price:'1.6'});
  expect(packet.snapshot.output).toEqual({result:60});
  expect(flow.execute({fuel:'0',price:'1.6'}).snapshot.output.result).toBe(0);
  expect(flow.exportPacket(packet,'csv','pro')).toContain('"outputUnit","currency units"');
  expect(()=>flow.execute({fuel:'-1',price:'1.6'})).toThrow();
  expect(()=>flow.exportPacket(packet,'json','free')).toThrow();
  expect(verifySpecializedFactorySnapshot(packet.snapshot).snapshot).toEqual(packet.snapshot);
 });
 it('projects the complete immutable surface and exact extrema',()=>{
  const flow=specializedWorkflows(252),packet=flow.execute(surface);
  const data=packet.snapshot.output;
  expect(data).toMatchObject({minimum:-2,maximum:2,gridSize:17});
  expect(data.points).toHaveLength(289);
  expect((data.points as unknown[])[0]).toEqual({x:-1,y:-1,z:-2});
  expect((data.points as unknown[])[288]).toEqual({x:1,y:1,z:2});
  expect(flow.replay(flow.exportPacket(packet,'json','business'))).toEqual(packet);
  expect(verifySpecializedFactorySnapshot(packet.snapshot).snapshot).toEqual(packet.snapshot);
  expect(()=>verifySpecializedFactorySnapshot({...packet.snapshot,calculatorVersion:2})).toThrow();
  expect(()=>flow.verify({...packet,snapshot:{...packet.snapshot,output:{...data,maximum:3}}})).toThrow();
 });
 it('refuses invalid range and unsupported syntax and replays corrected batch rows',()=>{
  const flow=specializedWorkflows(252);
  expect(()=>flow.execute({...surface,maxX:'-1'})).toThrow();
  expect(()=>flow.execute({...surface,expression:'unknown(x)'})).toThrow();
  const mixed=flow.batch([surface,{...surface,maxY:'-2'}]);
  expect(mixed[1].error).toBeTruthy();
  expect(()=>flow.exportBatch(mixed,'pro')).toThrow('Correct every row');
  const valid=flow.batch([surface]);
  expect(flow.replayBatch(flow.exportBatch(valid,'pro'))).toEqual(valid);
 });
});
