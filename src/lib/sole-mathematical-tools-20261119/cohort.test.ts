import {describe,expect,it} from 'vitest';
import {mathWorkflows,prepareMathematicalToolsRecovery,verifyMathematicalToolsSnapshot} from './cohort';

const matrix={a11:'1',a12:'2',a21:'0',a22:'1',b11:'3',b12:'0',b21:'4',b22:'2',operation:'multiply'};
const goldens=[
 [240,matrix,{matrix:[[11,4],[4,2]],determinant:6,trace:13}],
 [250,{expression:'2*x+1',start:'-1',end:'2'},{sum:8,terms:[-1,1,3,5],partialSums:[-1,0,3,8]}],
 [257,{a:'13',b:'14',c:'15'},{perimeter:42}],
 [258,{a:'5',b:'12'},{area:30,perimeter:30,angleC:90}],
 [301,{odds:'4',probability:''},{odds:4,probability:0.8,direction:'odds-to-probability'}],
] as const;

describe('registered mathematical tools v1',()=>{
 it.each(goldens)('matches an independent witness and immutable replay for #%s',(id,raw,expected)=>{
  const flow=mathWorkflows(id),packet=flow.execute(raw);
  expect(packet.snapshot.output).toMatchObject(expected);
  if(id===257)expect(packet.snapshot.output.area).toBeCloseTo(84,10);
  expect(prepareMathematicalToolsRecovery(packet.snapshot)).toMatchObject({catalogId:id,currentCaptureAvailable:true,snapshot:packet.snapshot});
  expect(flow.replay(flow.exportPacket(packet,'json','pro'))).toEqual(packet);
  expect(flow.exportPacket(packet,'csv','business')).toContain('"outputUnit"');
  expect(()=>flow.exportPacket(packet,'csv','free')).toThrow();
  expect(()=>verifyMathematicalToolsSnapshot({...packet.snapshot,calculatorVersion:2})).toThrow();
  expect(()=>verifyMathematicalToolsSnapshot({...packet.snapshot,output:{...packet.snapshot.output,steps:['changed']}})).toThrow();
 });
 it.each([
  [240,{...matrix,operation:'inverse'}],
  [240,{...matrix,a11:'1.0000000000000001'}],
  [240,{...matrix,a11:'1e100',a22:'1e100',b11:'1e100',b22:'1e100'}],
  [250,{expression:'x',start:'2',end:'1'}],
  [250,{expression:'x',start:'0',end:'1001'}],
  [250,{expression:'1/(x-1)',start:'0',end:'2'}],
  [257,{a:'1',b:'2',c:'3'}],
  [258,{a:'0',b:'2'}],
  [301,{odds:'4',probability:'0.8'}],
  [301,{odds:'',probability:''}],
  [301,{probability:'1'}],
 ] as const)('refuses unsupported #%s input',(id,raw)=>expect(()=>mathWorkflows(id).execute(raw)).toThrow());
 it('preserves matrix addition and subtraction modes',()=>{
  const flow=mathWorkflows(240);
  expect(flow.execute({...matrix,operation:'add'}).snapshot.output.matrix).toEqual([[4,2],[4,3]]);
  expect(flow.execute({...matrix,operation:'subtract'}).snapshot.output.matrix).toEqual([[-2,2],[-4,-1]]);
 });
 it('retains the full 1,001-term boundary',()=>{
  const output=mathWorkflows(250).execute({expression:'1',start:'0',end:'1000'}).snapshot.output;
  expect(output.sum).toBe(1001);
  expect(output.partialSums).toHaveLength(1001);
 });
 it('reconstructs omitted optional odds from historical input without inventing a field',()=>{
  const flow=mathWorkflows(301),raw={odds:'',probability:'0.75'},packet=flow.execute(raw);
  const restored=flow.execute({probability:'0.75'});
  expect(packet.raw).toEqual(raw);
  expect(restored.snapshot).toEqual(packet.snapshot);
  expect(restored.snapshot.input).toEqual({probability:0.75});
  expect(restored.snapshot.output).toMatchObject({odds:3,probability:0.75,direction:'probability-to-odds'});
  expect(flow.execute({odds:'0'}).snapshot.output.probability).toBe(0);
 });
});
