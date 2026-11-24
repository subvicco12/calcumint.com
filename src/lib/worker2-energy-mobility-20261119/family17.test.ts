import {expect,it} from 'vitest';
import {factoryDownload} from '@/lib/calculator-factory/completion/exports';
import {mobilityContract,mobilityWorkflows,prepareMobilityRecovery} from './cohort';

it.each([1,18,26,53,56,235,251,276,282,283,388,389,390,395,396])('#%i captures and verifies its original engine and private workflows',id=>{
 const c=mobilityContract(id),w=mobilityWorkflows(id);
 const raw=Object.fromEntries(c.fields.map(f=>[f.key,String(f.defaultValue)]));
 const p=w.execute(raw);
 expect(p.snapshot.output[c.primaryKey]).toEqual((c.engine.examples[0].expected as Record<string,unknown>)[c.primaryKey]);
 expect(prepareMobilityRecovery(p.snapshot)).toMatchObject({catalogId:id,currentCaptureAvailable:true});
 expect(w.batch([raw,{...raw,extra:'1'}]).map(r=>!!r.packet)).toEqual([true,false]);
 expect(w.scenario([],'A',p,'','pro')[0].packet).toEqual(p);
 expect(()=>w.verify({...p,identity:{...p.identity,calculatorVersion:c.version+1}})).toThrow();
 for(const format of ['json','csv','pdf'] as const){
  const text=new TextDecoder().decode(factoryDownload(w,p,format,'pro',c.title).bytes);
  if(format==='json')expect(w.replay(text)).toEqual(p);
  if(format==='csv')expect(text).toContain('"output","'+c.primaryKey+'"');
  if(format==='pdf')expect(text).toMatch(/^%PDF-/);
 }
});

it('distinguishes sample and population dispersion and rejects too few sample values',()=>{
 const w=mobilityWorkflows(283);
 expect(w.execute({values:'[2,4,6]',kind:'population'}).snapshot.output.variance).toBe(8/3);
 expect(w.execute({values:'[2,4,6]',kind:'sample'}).snapshot.output.variance).toBe(4);
 expect(()=>w.execute({values:'[2]',kind:'sample'})).toThrow();
});

it('retains plot points and rejects expressions outside the grammar',()=>{
 const w=mobilityWorkflows(251),raw={minX:'-2',maxX:'2',expression:'x^2'};
 expect(w.execute(raw).snapshot.output).toMatchObject({minimum:0,maximum:4});
 expect(()=>w.execute({...raw,expression:'alert(1)'})).toThrow();
});
