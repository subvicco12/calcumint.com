import {expect,it} from 'vitest';
import {factoryDownload} from '@/lib/calculator-factory/completion/exports';
import {mobilityContract,mobilityWorkflows,prepareMobilityRecovery} from './cohort';

it.each([22,24,27,28,29,30,33,104,105,70,74,79,94,101,102,110,113,477,480,141,144,148,149,151,152,153,164,174,175,176,180,183,185,188,189,197,202])('#%i preserves the supplied-input source and bounded delivery contract',id=>{
 const c=mobilityContract(id),w=mobilityWorkflows(id);
 const raw=Object.fromEntries(c.fields.map(f=>[f.key,String(f.defaultValue)]));
 const p=w.execute(raw);
 expect(c.registered).toBe(false);
 expect(p.snapshot.output[c.primaryKey]).toEqual((c.engine.examples[0].expected as Record<string,unknown>)[c.primaryKey]);
 expect(prepareMobilityRecovery(p.snapshot)).toMatchObject({catalogId:id,currentCaptureAvailable:true});
 expect(w.batch([raw,{...raw,scope:'unknown-policy'}]).map(r=>!!r.packet)).toEqual([true,false]);
 expect(w.scenario([],'A',p,'','pro')[0].packet).toEqual(p);
 expect(()=>w.verify({...p,identity:{...p.identity,calculatorVersion:2}})).toThrow();
 for(const format of ['json','csv','pdf'] as const){
  const text=new TextDecoder().decode(factoryDownload(w,p,format,'pro',c.title).bytes);
  if(format==='json')expect(w.replay(text)).toEqual(p);
  if(format==='csv')expect(text).toContain('"output","'+c.primaryKey+'"');
  if(format==='pdf')expect(text).toMatch(/^%PDF-/);
 }
});

it('exposes different refinance and recovery questions using the same immutable component',()=>{
 const cases=[24,33].map(id=>{
  const c=mobilityContract(id),raw=Object.fromEntries(c.fields.map(f=>[f.key,String(f.defaultValue)]));
  return mobilityWorkflows(id).execute(raw).snapshot.output;
 });
 expect(cases[0].value).toBe(cases[0].netLifetimeSavings);
 expect(cases[1].value).toBe(cases[1].breakEvenMonths);
 expect(cases[0].unit).toBe('currency');
 expect(cases[1].unit).toBe('months');
});
