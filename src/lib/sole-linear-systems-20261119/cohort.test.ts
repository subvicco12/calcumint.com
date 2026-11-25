import {describe,expect,it} from 'vitest';
import {linearWorkflows,prepareLinearSystemsRecovery,verifyLinearSystemsSnapshot} from './cohort';
const goldens=[
 [237,{a:'-4',b:'20'},{solution:5}],
 [238,{a:'1',b:'0',c:'4'},{discriminant:-16,root1:null,root2:null,root1Text:'0 + 2i',root2Text:'0 - 2i',vertexY:4}],
 [239,{a:'2',b:'1',c:'7',d:'1',e:'-1',f:'2'},{x:3,y:1,determinant:-3}],
 [241,{a:'4',b:'7',c:'2',d:'6'},{determinant:10}],
 [242,{a:'2',b:'1',c:'0',d:'4'},{m11:0.5,m12:-0.125,m21:-0,m22:0.25,determinant:8}],
 [244,{a:'2',b:'4',c:'1',d:'1',operation:'divide'},{real:3,imaginary:1}],
] as const;

describe('registered linear, quadratic and complex tools v1',()=>{
 it.each(goldens)('matches independent witness and preserves replay for #%s',(id,raw,expected)=>{
  const flow=linearWorkflows(id),packet=flow.execute(raw);
  expect(packet.snapshot.output).toMatchObject(expected);
  expect(prepareLinearSystemsRecovery(packet.snapshot)).toMatchObject({catalogId:id,currentCaptureAvailable:true,snapshot:packet.snapshot});
  expect(flow.replay(flow.exportPacket(packet,'json','pro'))).toEqual(packet);
  expect(flow.exportPacket(packet,'csv','business')).toContain('"outputUnit","dimensionless"');
  expect(()=>flow.exportPacket(packet,'json','free')).toThrow();
  expect(()=>verifyLinearSystemsSnapshot({...packet.snapshot,calculatorVersion:2})).toThrow();
  expect(()=>verifyLinearSystemsSnapshot({...packet.snapshot,output:{...packet.snapshot.output,steps:['changed']}})).toThrow();
 });
 it.each([
  [237,{a:'0',b:'1'}],
  [237,{a:'1e-151',b:'1'}],
  [237,{a:'1.0000000000000001',b:'1'}],
  [238,{a:'0',b:'1',c:'1'}],
  [239,{a:'1',b:'2',c:'3',d:'2',e:'4',f:'7'}],
  [241,{a:'1e151',b:'2',c:'3',d:'4'}],
  [242,{a:'1',b:'2',c:'2',d:'4'}],
  [244,{a:'2',b:'4',c:'0',d:'0',operation:'divide'}],
  [244,{a:'2',b:'4',c:'1',d:'1',operation:'power'}],
 ] as const)('refuses unsupported input for #%s',(id,raw)=>expect(()=>linearWorkflows(id).execute(raw)).toThrow());
 it('preserves determinant zero and corrected batch replay',()=>{
  const flow=linearWorkflows(241),raw={a:'1',b:'2',c:'2',d:'4'};
  expect(flow.execute(raw).snapshot.output.determinant).toBe(0);
  expect(()=>flow.exportBatch(flow.batch([raw,{...raw,a:''}]),'pro')).toThrow('Correct every row');
  expect(flow.replayBatch(flow.exportBatch(flow.batch([raw]),'pro'))[0].packet).toEqual(flow.execute(raw));
 });
 it('retains the linear coefficient threshold and quadratic repeated root',()=>{
  expect(linearWorkflows(237).execute({a:'1e-150',b:'-1e-150'}).snapshot.output.solution).toBe(1);
  expect(linearWorkflows(238).execute({a:'1',b:'-4',c:'4'}).snapshot.output).toMatchObject({root1:2,root2:2,discriminant:0,vertexX:2,vertexY:0});
 });
});
