import {describe,expect,it} from 'vitest';
import {contributionProjectionReview,retirementAgeDeliveryReview,exportApprovedScopeReview} from './approved-scope-review';
import {verifyLaunchSnapshot,verifyLaunchMappingReviewSnapshot} from '../../launch-snapshot-verification';

const entry={initial:'100',contribution:'25',contributionEveryMonths:'2',timing:'end',monthlyRatePercent:'10',durationMonths:'4',currency:'USD'};

describe('approved scope review',()=>{
 it('projects contributions at explicit intervals and preserves exact replay',()=>{
  const w=contributionProjectionReview;
  const packet=w.execute(entry);
  expect(packet.snapshot.output).toMatchObject({totalContributions:50,projectedGrowth:51.66,finalBalance:201.66});
  expect(w.replay(w.exportPacket(packet,'json','pro'))).toEqual(packet);
  expect(()=>w.replay(JSON.stringify({...packet,snapshot:{...packet.snapshot,output:{finalBalance:0}}}))).toThrow();
  expect(w.execute({...entry,timing:'begin'}).snapshot.output.finalBalance).toBe(213.26);
  expect(w.execute({...entry,durationMonths:'5',timing:'begin',monthlyRatePercent:'0'}).snapshot.output)
   .toEqual({contributionCount:2,totalContributions:50,projectedGrowth:0,finalBalance:150});
  expect(w.scenario([],'A',packet,'Supplied example','pro')[0].packet).toEqual(packet);
  expect(w.batch([entry,{...entry,contributionEveryMonths:'0'}]).map(row=>!!row.packet)).toEqual([true,false]);
 });
 it('labels distinct retirement outcomes through the isolated delivery workflow',()=>{
  const w=retirementAgeDeliveryReview;
  const raw={currentAgeMonths:'480',currency:'USD',initial:'10',initialTarget:'20',steps:'[]',timing:'end'};
  expect(w.execute(raw).snapshot.output.targetStatus).toBe('target-not-met');
  expect(w.execute({...raw,initialTarget:'10'}).snapshot.output.targetStatus).toBe('already-met');
  const packet=w.execute({...raw,steps:'[{"rate":0,"cashflow":-11,"target":20}]'});
  expect(packet.snapshot.output.withdrawalStatus).toBe('unfunded-withdrawal');
  expect(w.replay(w.exportPacket(packet,'json','pro'))).toEqual(packet);
  for(const [id,item] of [[57,contributionProjectionReview.execute(entry)],[82,packet]] as const){
   expect(exportApprovedScopeReview(id,item,'csv','pro')).toContain(item.snapshot.calculatorSlug);
   expect(new TextDecoder().decode((exportApprovedScopeReview(id,item,'pdf','pro') as Uint8Array).slice(0,5))).toBe('%PDF-');
   expect(()=>exportApprovedScopeReview(id,item,'pdf','free')).toThrow();
  }
 });
 it.each([
  ['aspect-ratio-value-calculator',{width:1920,height:1080},16/9],
  ['time-from-distance-speed-calculator',{distance:120,speed:60},2],
  ['distance-calculator',{speed:60,time:2},120],
 ] as const)('verifies the exact mapping witness for %s and refuses alteration',(calculatorSlug,input,result)=>{
  const raw={calculatorSlug,calculatorVersion:1,input,output:{result}};
  expect(verifyLaunchMappingReviewSnapshot(raw).snapshot).toEqual(raw);
  expect(()=>verifyLaunchSnapshot(raw)).toThrow();
  expect(()=>verifyLaunchMappingReviewSnapshot({...raw,calculatorVersion:2})).toThrow();
  expect(()=>verifyLaunchMappingReviewSnapshot({...raw,output:{result:result+1}})).toThrow();
  expect(()=>verifyLaunchMappingReviewSnapshot({...raw,input:{...input,other:1}})).toThrow();
 });
});
