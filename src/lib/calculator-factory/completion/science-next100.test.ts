import {describe,it,expect} from 'vitest';
import {calculateNextScience,reverseNextScience,graphNextScience,nextScienceContracts,type NextScienceId} from './science-next100';
import {molarityCalculator,molesCalculator,dilutionCalculator} from '../../../calculators/chemistry/catalog-batch-1';

const cases:[NextScienceId,Record<string,number>,number,number][]=[
 [328,{moles:0.01,solutionVolumeLiters:0.2},0.05,0.5],
 [331,{massGrams:36,molarMass:18},2,4],
 [332,{initialConcentration:2.04,initialVolume:0.025,finalVolume:0.5},0.102,0.204],
];
describe('private science completion captures',()=>{
 for(const [id,input,expected,target] of cases){
  it(`captures exact v1, source witness, inverse and graph for ${id}`,()=>{
   const result=calculateNextScience(id,input);expect(result.snapshot.output.value).toBeCloseTo(expected,14);
   const engine=id===328?molarityCalculator:id===331?molesCalculator:dilutionCalculator;
   expect(result.snapshot.output).toEqual((engine.calculate as (input:unknown,context:object)=>unknown)(input,{}));
   expect(calculateNextScience(id,JSON.parse(JSON.stringify(result.snapshot.input)))).toEqual(result);
   const inverse=reverseNextScience(id,input,target);expect(inverse.replay.snapshot.output.value).toBeCloseTo(target,14);
   expect(Object.isFrozen(result.snapshot.input)).toBe(true);expect(Object.isFrozen(result.snapshot.output.steps)).toBe(true);
   const plot=graphNextScience(id,input,[0,inverse.value,-1,Infinity]);expect(plot[0]).toEqual({x:0,y:0});expect('y' in plot[1]?plot[1].y:undefined).toBeCloseTo(target,14);expect(plot[2]).toHaveProperty('error');expect(plot[3]).toHaveProperty('error');
   expect(()=>calculateNextScience(id,{...input,extra:1})).toThrow();expect(()=>reverseNextScience(id,input,-1)).toThrow();
   expect(()=>graphNextScience(id,input,Array(102).fill(1))).toThrow();
  });
 }
 it('preserves output provenance and explicit unit contracts',()=>{
  expect(nextScienceContracts.map(row=>row.catalogId)).toEqual([328,331,332]);
  expect(nextScienceContracts.map(row=>row.unit)).toEqual(['mol/L','mol','mol/L']);
  expect(calculateNextScience(328,{moles:123456,solutionVolumeLiters:64}).snapshot.output.value).toBe(Number(123456n)/64);
  expect(calculateNextScience(331,{massGrams:123456,molarMass:64}).snapshot.output.value).toBe(1929);
 });
 it('refuses dilution concentration, missing volume and numeric underflow',()=>{
  expect(()=>calculateNextScience(332,{initialConcentration:1,initialVolume:2,finalVolume:1})).toThrow(/Dilution/);
  expect(()=>calculateNextScience(332,{initialConcentration:1,initialVolume:0,finalVolume:1})).toThrow(/Dilution/);
  for(const [id,input] of cases){const key=nextScienceContracts.find(row=>row.catalogId===id)!.solveFor;
   expect(()=>calculateNextScience(id,{...input,[key]:Number.MIN_VALUE})).toThrow();
   expect(()=>calculateNextScience(id,{...input,[key]:NaN})).toThrow();
   expect(reverseNextScience(id,input,0).value).toBe(0);
  }
  expect(()=>calculateNextScience(328,{moles:1e-300,solutionVolumeLiters:1e100})).toThrow(/output/);
  expect(()=>calculateNextScience(332,{initialConcentration:1e-300,initialVolume:1e-100,finalVolume:1e-100})).toThrow(/output/);
  expect(()=>reverseNextScience(328,{moles:1,solutionVolumeLiters:1e100},1e100)).toThrow();
 });
 it('rejects accessors and symbols before evaluating fields',()=>{
  let reads=0;const input={get moles(){reads++;return 1;},solutionVolumeLiters:2};
  expect(()=>calculateNextScience(328,input)).toThrow();expect(reads).toBe(0);
  expect(()=>calculateNextScience(328,{moles:1,solutionVolumeLiters:2,[Symbol('x')]:1})).toThrow();
 });
});
