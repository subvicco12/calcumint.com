import {expect,it} from 'vitest';
import {factoryDownload} from '@/lib/calculator-factory/completion/exports';
import {powerContract,powerWorkflows,preparePowerRecovery,verifyPowerSnapshot} from './cohort';

const cases=[
 [475,{kilowatts:'0.7456999'},1,{kilowatts:'-1'}],
 [476,{torqueLbFt:'125',rpm:'10504'},250,{torqueLbFt:'125',rpm:'0'}],
] as const;
it.each(cases)('qualifies bounded private capture #%i across batch, replay, scenarios and exports',(id,raw,reference,invalid)=>{
 const flow=powerWorkflows(id),packet=flow.execute(raw);
 expect(packet.snapshot.output.horsepower).toBeCloseTo(reference,12);
 expect(flow.identity.calculatorVersion).toBe(1);
 expect(verifyPowerSnapshot(packet.snapshot).catalogId).toBe(id);
 expect(()=>verifyPowerSnapshot({...packet.snapshot,calculatorVersion:2})).toThrow();
 expect(()=>flow.execute({...raw,extra:'1'})).toThrow();
 expect(()=>flow.verify({...packet,identity:{...packet.identity,sourceVersion:'other'}})).toThrow();
 expect(flow.batch([raw,invalid]).map(row=>Boolean(row.packet))).toEqual([true,false]);
 const batch=flow.batch([raw,raw]);
 expect(flow.replayBatch(flow.exportBatch(batch,'business'))[0].packet).toEqual(packet);
 expect(()=>flow.batch(Array.from({length:101},()=>raw))).toThrow();
 expect(flow.scenario([],'A',packet,'','pro')[0].packet).toEqual(packet);
 expect(()=>flow.scenario([],'A',packet,'','free')).toThrow();
 for(const format of ['json','csv','pdf'] as const){
  const artifact=factoryDownload(flow,packet,format,'pro',powerContract(id).title);
  const text=new TextDecoder().decode(artifact.bytes);
  expect(artifact.filename).toMatch(new RegExp('-v1\\.'+format+'$'));
  if(format==='json')expect(flow.replay(text)).toEqual(packet);
  if(format==='csv')expect(text).toContain('mechanical hp');
  if(format==='pdf')expect(text).toMatch(/^%PDF-/);
  expect(()=>factoryDownload(flow,packet,format,'free',powerContract(id).title)).toThrow();
 }
});

it('recovers an exact historical record outside the new bounded capture range as read-only',()=>{
 const engine=powerContract(475).engine;
 const input={kilowatts:1e-70};
 const historical={calculatorSlug:engine.slug,calculatorVersion:1,input,
  output:{horsepower:1e-67/745.6999,steps:[`Mechanical horsepower = ${1e-70*1000/745.6999}`]}};
 historical.output.horsepower=1e-70*1000/745.6999;
 expect(preparePowerRecovery(historical).currentCaptureAvailable).toBe(false);
 expect(()=>powerWorkflows(475).execute({kilowatts:'1e-70'})).toThrow();
});
