import {expect,it} from 'vitest';
import {factoryDownload} from '@/lib/calculator-factory/completion/exports';
import {mobilityContract,mobilityWorkflows,prepareMobilityRecovery} from './cohort';

it.each([25,37,45,47,68,71,72,73,75,76,77,83,93,100,106,107,108,465,466,473,3,4,5,6,7,8,11,12,13,14,15,16,17])('#%i retains its private model, assumptions and governed replay',id=>{
 const c=mobilityContract(id),w=mobilityWorkflows(id);
 const raw=Object.fromEntries(c.fields.map(f=>[f.key,String(f.defaultValue)]));
 const p=w.execute(raw);
 expect(c.registered).toBe(false);
 expect(p.snapshot.output[c.primaryKey]).toEqual((c.engine.examples[0].expected as Record<string,unknown>)[c.primaryKey]);
 expect(prepareMobilityRecovery(p.snapshot)).toMatchObject({catalogId:id,currentCaptureAvailable:true});
 expect(w.batch([raw,{...raw,scope:'unreviewed-policy'}]).map(r=>!!r.packet)).toEqual([true,false]);
 expect(w.scenario([],'A',p,'','pro')[0].packet).toEqual(p);
 expect(()=>w.verify({...p,identity:{...p.identity,calculatorVersion:2}})).toThrow();
 for(const format of ['json','csv','pdf'] as const){
  const text=new TextDecoder().decode(factoryDownload(w,p,format,'pro',c.title).bytes);
  if(format==='json')expect(w.replay(text)).toEqual(p);
  if(format==='csv')expect(text).toContain('"output","'+c.primaryKey+'"');
  if(format==='pdf')expect(text).toMatch(/^%PDF-/);
 }
});

it('shows the extra-payment evaluation using original interest savings',()=>{
 const w=mobilityWorkflows(5),c=mobilityContract(5);
 const raw=Object.fromEntries(c.fields.map(f=>[f.key,String(f.defaultValue)]));
 expect(c.primaryKey).toBe('interestSavedVsScheduled');
 expect(w.execute({...raw,principal:'1200',annualRatePercent:'0',termMonths:'3',extraMonthlyPayment:'200'}).snapshot.output.monthsSavedVsScheduled).toBe(1);
 expect(()=>w.execute({...raw,extraMonthlyPayment:'0'})).toThrow();
});
