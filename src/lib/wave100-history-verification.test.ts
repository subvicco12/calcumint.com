import {expect,it} from 'vitest';
import {getFactoryWorkflows} from './calculator-factory/registry';
import {verifySavedSnapshotWithWave100 as verify,wave100HistoricalBindings} from './wave100-history-verification';
import {calculateNextScience} from './calculator-factory/completion/science-next100';
import {molarityCalculator} from '@/calculators/chemistry/catalog-batch-1';
const vectors:[number,Record<string,string>][]=[
 [254,{a:'0',b:'0',c:'1',d:'-1',left:'0',right:'4'}],[257,{a:'13',b:'14',c:'15'}],[258,{a:'5',b:'12'}],[268,{sides:'4',side:'7'}],[274,{length:'2',width:'3',height:'4'}],[328,{moles:'0.01',solutionVolumeLiters:'0.2'}],[331,{massGrams:'36',molarMass:'18'}],[332,{initialConcentration:'2.04',initialVolume:'0.025',finalVolume:'0.5'}],
];
it.each(vectors)('verifies exact immutable historical output for %s without rewriting input or output',(id,input)=>{
 const snapshot=getFactoryWorkflows(id).execute(input).snapshot,raw=JSON.stringify(snapshot),r=verify(snapshot);expect(r.snapshot).toEqual(snapshot);expect(JSON.stringify(snapshot)).toBe(raw);expect(r.engineVersion).toBe(1);
 expect(()=>verify({...snapshot,calculatorVersion:2})).toThrow();expect(()=>verify({...snapshot,input:{...snapshot.input,extra:1}})).toThrow();expect(()=>verify({...snapshot,output:{...snapshot.output,extra:1}})).toThrow();
 for(const key of Object.keys(snapshot.output))expect(()=>verify({...snapshot,output:{...snapshot.output,[key]:'tampered'}})).toThrow();
});
it('retains witnessed historical underflow rather than applying current capture restrictions',()=>{
 const input={moles:1e-300,solutionVolumeLiters:1e100},output=molarityCalculator.calculate(input,{});expect(output.value).toBe(0);expect(()=>calculateNextScience(328,input)).toThrow();expect(verify({calculatorSlug:molarityCalculator.slug,calculatorVersion:1,input,output}).snapshot.output).toEqual(output);
});
it('delegates original contracts, rejects wrong versions and preserves closed exact identity list',()=>{
 const snapshot=getFactoryWorkflows(221).execute({x:'27'}).snapshot;expect(verify(snapshot).snapshot).toEqual(snapshot);expect(wave100HistoricalBindings).toHaveLength(8);expect(new Set(wave100HistoricalBindings.map(r=>r.slug)).size).toBe(8);expect(wave100HistoricalBindings.every(r=>r.version===1)).toBe(true);expect(()=>verify({...snapshot,calculatorSlug:'unknown'})).toThrow();expect(()=>verify({...snapshot,extra:'substitution'})).toThrow();
});
it('refuses accessor and symbol payloads before executing recorded values',()=>{
 let reads=0;expect(()=>verify({get calculatorSlug(){reads++;return 'molarity-calculator';}})).toThrow();expect(reads).toBe(0);const p=getFactoryWorkflows(328).execute({moles:'1',solutionVolumeLiters:'2'}).snapshot;expect(()=>verify({...p,[Symbol('unrecorded')]:1})).toThrow();
});
