import {expect,it} from 'vitest';
import {factoryDownload} from '@/lib/calculator-factory/completion/exports';
import {mobilityContract,mobilityWorkflows,verifyMobilitySnapshot} from './cohort';

const cases: {id:number; raw:Record<string,string>; invalid:Record<string,string>; expected:number}[]=[
 {id:474,raw:{currentWidthMm:'200',currentAspectRatio:'50',currentRimInches:'10',newWidthMm:'250',newAspectRatio:'50',newRimInches:'10'},invalid:{newAspectRatio:'101'},expected:50/454*100},
 {id:532,raw:{semiMajorAxisAu:'4',centralMassSolar:'1'},invalid:{centralMassSolar:'0'},expected:8},
 {id:533,raw:{massKg:'1e20',radiusM:'100000'},invalid:{radiusM:'0'},expected:0.365357},
 {id:534,raw:{value:'2',fromUnit:'au',toUnit:'km'},invalid:{toUnit:'mile'},expected:299195741.4},
];

it.each(cases)('#$id executes, refuses invalid input and preserves versioned workflows',({id,raw,invalid,expected})=>{
 const c=mobilityContract(id);
 const w=mobilityWorkflows(id);
 const packet=w.execute(raw);
 expect(packet.snapshot.output[c.primaryKey]).toBeCloseTo(expected,6);
 expect(()=>w.execute({...raw,...invalid})).toThrow();
 expect(w.batch([raw,{...raw,...invalid}]).map(row=>!!row.packet)).toEqual([true,false]);
 expect(w.scenario([],'A',packet,'','pro')[0].packet).toEqual(packet);
 expect(verifyMobilitySnapshot(packet.snapshot).catalogId).toBe(id);
 expect(()=>verifyMobilitySnapshot({...packet.snapshot,calculatorVersion:2})).toThrow();
 expect(()=>verifyMobilitySnapshot({...packet.snapshot,output:{...packet.snapshot.output,[c.primaryKey]:999}})).toThrow();
 for(const format of ['json','csv','pdf'] as const){
  const bytes=factoryDownload(w,packet,format,'pro',c.title).bytes;
  const decoded=new TextDecoder().decode(bytes);
  if(format==='json') expect(w.replay(decoded)).toEqual(packet);
  else if(format==='csv') expect(decoded).toContain('"output","'+c.primaryKey+'"');
  else expect(decoded).toMatch(/^%PDF-/);
 }
});

it('distinguishes astronomical output units and rejects a nonzero input silently disappearing',()=>{
 const c=mobilityContract(534);
 expect(c.outputUnit?.({toUnit:'pc'})).toBe('pc');
 expect(c.fields.find(f=>f.key==='toUnit')?.options).toEqual(['km','au','ly','pc']);
 const raw={value:'0',fromUnit:'km',toUnit:'pc'};
 expect(mobilityWorkflows(534).execute(raw).snapshot.output.result).toBe(0);
 expect(()=>mobilityWorkflows(534).execute({...raw,value:'1e-400'})).toThrow();
});
