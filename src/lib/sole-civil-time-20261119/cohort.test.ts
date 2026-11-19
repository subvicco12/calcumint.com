import {describe,expect,it} from 'vitest';
import {prepareCivilTimeRecovery,timeContract,timeWorkflows,toTimeRaw,verifyCivilTimeSnapshot} from './cohort';

const shift={startTime:'22:30',endTime:'02:00',overnight:true,breakMinutes:30};
const goldens=[
  [447,{startDate:'2024-02-29',endDate:'2024-03-05',holidays:['2024-03-01','2024-03-01','2024-03-05']},2],
  [448,{startTime:'23:50',endTime:'00:20',overnight:true},30],
  [449,{...shift,breakMinutes:20},190],
  [450,{shifts:[shift,{startTime:'09:00',endTime:'10:00',overnight:false,breakMinutes:15}]},225],
  [453,{localDateTime:'2024-01-01T00:15',sourceOffsetMinutes:345,targetOffsetMinutes:-480},'2023-12-31T10:30'],
  [454,{referenceInstant:'2024-02-29T23:59:59Z',targetInstant:'2024-03-01T00:00:01Z'},2],
] as const;

describe('civil time private v1 workflows',()=>{
  it.each(goldens)('matches independent literal and recovers exact #%s', (id,input,result)=>{
    const flow=timeWorkflows(id),packet=flow.execute(toTimeRaw(input));
    expect(packet.snapshot.output[timeContract(id).resultKey]).toBe(result);
    expect(prepareCivilTimeRecovery(packet.snapshot)).toMatchObject({catalogId:id,currentCaptureAvailable:true,snapshot:packet.snapshot});
    expect(flow.replay(flow.exportPacket(packet,'json','business'))).toEqual(packet);
    expect(flow.exportPacket(packet,'csv','pro')).toContain('"outputUnit"');
    expect(()=>flow.exportPacket(packet,'json','free')).toThrow();
    expect(()=>verifyCivilTimeSnapshot({...packet.snapshot,calculatorVersion:2})).toThrow();
    expect(()=>verifyCivilTimeSnapshot({...packet.snapshot,output:{...packet.snapshot.output,[timeContract(id).resultKey]:99999}})).toThrow();
  });
  it.each([
    [447,{startDate:'2024-02-29',endDate:'2024-03-02',holidays:['2023-02-29']}],
    [448,{startTime:'23:50',endTime:'00:20',overnight:false}],
    [449,{startTime:'12:00',endTime:'12:30',overnight:false,breakMinutes:31}],
    [450,{shifts:[{...shift,breakMinutes:1.5}]}],
    [450,{shifts:[{...shift,surplus:true}]}],
    [450,{shifts:Array.from({length:32},()=>shift)}],
    [453,{localDateTime:'9999-12-31T23:30',sourceOffsetMinutes:0,targetOffsetMinutes:60}],
    [454,{referenceInstant:'2024-01-01T00:00:01Z',targetInstant:'2024-01-01T00:00:00Z'}],
  ] as const)('refuses invalid #%s input', (id,input)=>expect(()=>timeWorkflows(id).execute(toTimeRaw(input))).toThrow());
  it('reconstructs stable shift editor text from a reordered JSONB object',()=>{
    const reordered={breakMinutes:30,endTime:'02:00',overnight:true,startTime:'22:30'};
    expect(toTimeRaw({shifts:[reordered]})).toEqual(toTimeRaw({shifts:[shift]}));
    const raw={shifts:JSON.stringify([shift])};
    expect(timeWorkflows(450).execute(raw).raw).toEqual(raw);
  });
  it('preserves equal-clock zero with overnight enabled',()=>{
    expect(timeWorkflows(448).execute({startTime:'12:00',endTime:'12:00',overnight:'true'}).snapshot.output.totalMinutes).toBe(0);
  });
  it('refuses precision loss inside structured data and allows corrected batch replay',()=>{
    const flow=timeWorkflows(450),valid=toTimeRaw({shifts:[shift]});
    const invalid={shifts:valid.shifts.replace('"breakMinutes":30','"breakMinutes":30.000000000000001')};
    expect(flow.batch([valid,invalid])[1].error).toBeTruthy();
    expect(flow.replayBatch(flow.exportBatch(flow.batch([valid]),'pro'))[0].packet).toEqual(flow.execute(valid));
  });
});
