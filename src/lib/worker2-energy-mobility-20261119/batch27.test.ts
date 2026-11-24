import {expect,it} from 'vitest';
import {factoryDownload} from '@/lib/calculator-factory/completion/exports';
import {mobilityContract,mobilityWorkflows,prepareMobilityRecovery} from './cohort';

it.each([142,143,165,166,167,169,171,178,182,186,187,190,192,193,196,57,58,59,60,61,62,69,78,114,115])('#%i preserves its exact supplied private inputs, result and account workflows',id=>{
 const c=mobilityContract(id),w=mobilityWorkflows(id);
 const input=Object.fromEntries(c.fields.map(f=>[f.key,String(f.defaultValue)]));
 const p=w.execute(input);
 expect(c.registered).toBe(false);
 expect(p.snapshot.output.value).toEqual((c.engine.examples[0].expected as Record<string,unknown>).value);
 expect(prepareMobilityRecovery(p.snapshot)).toMatchObject({catalogId:id,currentCaptureAvailable:true});
 expect(w.batch([input,{...input,scope:'unknown'}]).map(r=>!!r.packet)).toEqual([true,false]);
 expect(w.scenario([],'A',p,'','pro')[0].packet).toEqual(p);
 expect(()=>w.verify({...p,identity:{...p.identity,calculatorVersion:2}})).toThrow();
 expect(()=>w.exportPacket(p,'json','free')).toThrow();
 for(const format of ['json','csv','pdf'] as const){
  const text=new TextDecoder().decode(factoryDownload(w,p,format,'pro',c.title).bytes);
  if(format==='json')expect(w.replay(text)).toEqual(p);
  if(format==='csv')expect(text).toContain('"output","value"');
  if(format==='pdf')expect(text).toMatch(/^%PDF-/);
 }
});

it('retains zero-base churn as unavailable, not zero',()=>{
 const c=mobilityContract(166);
 const w=mobilityWorkflows(166);
 const raw=Object.fromEntries(c.fields.map(f=>[f.key,String(f.defaultValue)]));
 expect(w.execute({...raw,startingCustomers:'0',lostCustomers:'0'}).snapshot.output.value).toBeNull();
});
