import {expect,it} from 'vitest';
import {readFileSync} from 'node:fs';
import {physicsQuantityContracts,physicsQuantityWorkflows,verifyPhysicsQuantitySnapshot,preparePhysicsQuantityRecovery} from './cohort';
import {factoryDownload} from '@/lib/calculator-factory/completion/exports';
const cases:[Record<string,string>,number,string][]=[
 [{force:'18',area:'4'},4.5,'Pa'],[{mass:'9',volume:'4'},2.25,'kg/m³'],
 [{cycles:'3.5',time:'2'},1.75,'Hz'],[{frequency:'8'},.125,'s'],
 [{waveSpeed:'18',frequency:'4'},4.5,'m'],
 [{current:'-3',resistance:'4'},-12,'V'],[{voltage:'6',current:'-2'},-12,'W'],
 [{current:'3',resistance:'4'},12,'V'],[{voltage:'-9',resistance:'4'},-2.25,'A'],
 [{voltage:'-9',current:'-4'},2.25,'Ω'],
];
it.each(physicsQuantityContracts)('checks catalog identity, SI result and account-tier parity for #$catalogId',c=>{
 const [raw,expected,unit]=cases[c.catalogId-312],flow=physicsQuantityWorkflows(c.catalogId),p=flow.execute(raw);
 expect(readFileSync('data/catalog/master-catalog-2026.csv','utf8')).toContain(`"${c.catalogId}","Physics","${c.title}"`);
 expect(p.snapshot.calculatorVersion).toBe(1); expect(p.snapshot.output.value).toBe(expected);expect(c.unit).toBe(unit);
 expect(verifyPhysicsQuantitySnapshot(p.snapshot).snapshot).toEqual(p.snapshot);
 expect(()=>verifyPhysicsQuantitySnapshot({...p.snapshot,calculatorVersion:2})).toThrow();
 expect(()=>flow.verify({...p,snapshot:{...p.snapshot,output:{...p.snapshot.output,value:999}}})).toThrow();
 expect(()=>flow.exportPacket(p,'json','free')).toThrow();
 for(const plan of ['pro','business'] as const){
  expect(flow.replay(flow.exportPacket(p,'json',plan))).toEqual(p);
  expect(flow.exportPacket(p,'csv',plan)).toContain(unit);
  expect(factoryDownload(flow,p,'pdf',plan,c.title).bytes.length).toBeGreaterThan(100);
  expect(flow.scenario([], 'A',p,'',plan)).toHaveLength(1);
 }
 expect(flow.batch([raw,{...raw,[c.fields[0].key]:''}]).map(r=>!!r.packet)).toEqual([true,false]);
});
it.each([[312,'area'],[313,'volume'],[314,'time'],[315,'frequency'],[316,'frequency'],[320,'resistance'],[321,'current']] as const)('refuses a zero denominator #%s', (id,key)=>{
 expect(()=>physicsQuantityWorkflows(id).execute({...cases[id-312][0],[key]:'0'})).toThrow();
});
it('retains legitimate zero and opens a historical underflow record read-only',()=>{
 expect(physicsQuantityWorkflows(318).execute({voltage:'1',current:'0'}).snapshot.output.value).toBe(0);
 const c=physicsQuantityContracts.find(x=>x.catalogId===318)!,input={voltage:1e-200,current:1e-200};
 const snapshot={calculatorSlug:c.slug,calculatorVersion:1,input,output:c.engine.calculate(input,{})};
 expect(snapshot.output.value).toBe(0);
 expect(()=>physicsQuantityWorkflows(318).execute({voltage:'1e-200',current:'1e-200'})).toThrow(/magnitude/);
 expect(preparePhysicsQuantityRecovery(snapshot)).toMatchObject({snapshot,currentCaptureAvailable:false});
});
