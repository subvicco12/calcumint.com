import {expect,it} from 'vitest';
import {factoryDownload} from '@/lib/calculator-factory/completion/exports';
import {mobilityContract,mobilityWorkflows,prepareMobilityRecovery} from './cohort';

it.each([391,392,393,394,398,399,400,401,411,417])('#%i delivers its immutable engine through the private contract',id=>{
 const c=mobilityContract(id),w=mobilityWorkflows(id);
 const raw=Object.fromEntries(c.fields.map(f=>[f.key,String(f.defaultValue)]));
 const p=w.execute(raw);
 expect(p.snapshot.output[c.primaryKey]).toBeCloseTo((c.engine.examples[0].expected as Record<string,number>)[c.primaryKey],8);
 expect(prepareMobilityRecovery(p.snapshot)).toMatchObject({catalogId:id,currentCaptureAvailable:true});
 expect(w.batch([raw,{...raw,extra:'1'}]).map(r=>!!r.packet)).toEqual([true,false]);
 expect(w.scenario([],'A',p,'','pro')[0].packet).toEqual(p);
 expect(()=>w.verify({...p,identity:{...p.identity,calculatorVersion:2}})).toThrow();
 expect(()=>w.exportPacket(p,'json','free')).toThrow();
 for(const format of ['json','csv','pdf'] as const){
  const text=new TextDecoder().decode(factoryDownload(w,p,format,'pro',c.title).bytes);
  if(format==='json')expect(w.replay(text)).toEqual(p);
  if(format==='csv')expect(text).toContain('"output","'+c.primaryKey+'"');
  if(format==='pdf')expect(text).toMatch(/^%PDF-/);
 }
});

it('checks normalized genotype frequencies and refuses invalid or nonphysical estimates',()=>{
 const w=mobilityWorkflows(417);
 expect(w.execute({allelePFrequency:'0.5'}).snapshot.output).toMatchObject({p2:0.25,twoPq:0.5,q2:0.25});
 expect(()=>w.execute({allelePFrequency:'1.01'})).toThrow();
 expect(()=>mobilityWorkflows(391).execute({tdeeKcal:'1',dailyAdjustmentKcal:'-1'})).toThrow();
 expect(()=>mobilityWorkflows(392).execute({bmi:'1',ageYears:'18',sex:'male'})).toThrow();
});
