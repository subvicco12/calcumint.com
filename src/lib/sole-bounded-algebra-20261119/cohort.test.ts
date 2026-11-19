import {describe,expect,it} from 'vitest';
import {algebraWorkflows,prepareBoundedAlgebraRecovery,verifyBoundedAlgebraSnapshot} from './cohort';

const goldens=[
 [236,{a:'0',b:'3',c:'-12'},{degree:1,solutions:['4']}],
 [243,{a:'2',b:'0',c:'4',d:'0',e:'4',f:'8'},{rank:2,matrix:[[1,0,2],[0,1,2]]}],
 [245,{ax:'2',ay:'0',az:'0',bx:'0',by:'3',bz:'0'},{dot:0,magnitudeA:2,magnitudeB:3,cross:{x:0,y:0,z:6},angleRadians:Math.PI/2}],
 [249,{first:'9',difference:'-4',n:'5'},{nth:-7,sum:5,terms:[9,5,1,-3,-7]}],
 [253,{a:'1',b:'0',c:'-3',d:'2'},{roots:[-2,1],discriminant:0}],
] as const;

describe('bounded algebra private v1',()=>{
 it.each(goldens)('matches independent literal and exact replay for #%s',(id,raw,expected)=>{
  const flow=algebraWorkflows(id),packet=flow.execute(raw);
  expect(packet.snapshot.output).toMatchObject(expected);
  expect(prepareBoundedAlgebraRecovery(packet.snapshot)).toMatchObject({catalogId:id,currentCaptureAvailable:true,snapshot:packet.snapshot});
  expect(flow.replay(flow.exportPacket(packet,'json','pro'))).toEqual(packet);
  expect(flow.exportPacket(packet,'csv','business')).toContain('"outputUnit","dimensionless"');
  expect(()=>flow.exportPacket(packet,'json','free')).toThrow();
  expect(()=>verifyBoundedAlgebraSnapshot({...packet.snapshot,calculatorVersion:2})).toThrow();
  expect(()=>verifyBoundedAlgebraSnapshot({...packet.snapshot,output:{...packet.snapshot.output,steps:['altered']}})).toThrow();
 });
 it.each([
  [236,{a:'0',b:'0',c:'1'}],
  [243,{...goldens[1][1],a:'1e101'}],
  [243,{...goldens[1][1],a:'1e-320'}],
  [245,{...goldens[2][1],ax:'Infinity'}],
  [245,{...goldens[2][1],ax:'1.0000000000000001'}],
  [249,{...goldens[3][1],n:'0'}],
  [249,{...goldens[3][1],n:'1001'}],
  [249,{...goldens[3][1],n:'2.5'}],
  [253,{...goldens[4][1],a:'0'}],
  [253,{...goldens[4][1],a:'1e-300',b:'1'}],
 ] as const)('refuses unsupported #%s inputs',(id,raw)=>expect(()=>algebraWorkflows(id).execute(raw)).toThrow());
 it('preserves quadratic complex outputs',()=>{
  expect(algebraWorkflows(236).execute({a:'1',b:'0',c:'4'}).snapshot.output.solutions).toEqual(['0 + 2i','0 - 2i']);
 });
 it('preserves a zero-vector undefined angle and true zero products',()=>{
  expect(algebraWorkflows(245).execute({...goldens[2][1],ax:'0'}).snapshot.output).toMatchObject({dot:0,angleRadians:null,cross:{x:0,y:0,z:0}});
 });
 it('allows the 1000th term while retaining the 20-term preview limit',()=>{
  const output=algebraWorkflows(249).execute({first:'1',difference:'1',n:'1000'}).snapshot.output;
  expect(output).toMatchObject({nth:1000,sum:500500});
  expect(output.terms).toHaveLength(20);
 });
 it('accepts a rank-zero matrix and replays a corrected bounded batch',()=>{
  const flow=algebraWorkflows(243),raw={a:'0',b:'0',c:'0',d:'0',e:'0',f:'0'};
  expect(flow.execute(raw).snapshot.output.rank).toBe(0);
  expect(()=>flow.exportBatch(flow.batch([raw,{...raw,a:''}]),'pro')).toThrow('Correct every row');
  expect(flow.replayBatch(flow.exportBatch(flow.batch([raw]),'pro'))[0].packet).toEqual(flow.execute(raw));
 });
});
