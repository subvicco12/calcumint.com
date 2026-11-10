import {describe,it,expect} from 'vitest';
import {converterWorkedExamples} from '../../src/lib/converter-cohort-20261110';
const cases = [
[423,'length-converter',1,'mi','km',1.609344],
[424,'area-converter',1,'acre','m2',4046.8564224],
[425,'volume-converter',1,'gal_us','l',3.785411784],
[427,'temperature-converter',32,'f','c',0],
[428,'speed-converter',60,'mph','km_h',96.56064],
[429,'pressure-converter',1,'atm','kpa',101.325],
[430,'energy-converter',1,'kwh','mj',3.6],
[431,'power-converter',1,'kw','w',1000],
[432,'time-converter',2,'h','min',120],
[433,'angle-converter',180,'deg','rad',Math.PI],
[434,'data-storage-converter',1,'GiB','MiB',1024],
[437,'density-converter',1,'g_cm3','kg_m3',1000],
[438,'force-converter',1,'kn','n',1000],
[439,'torque-converter',1,'lbf_ft','n_m',1.3558179483314004],
[440,'frequency-converter',2.4,'ghz','mhz',2400],
] as const;
describe('registered converter worked example selection',()=>{
 for(const [id,slug,value,from,to,expected] of cases)it(`#${id} exposes its registered example as an actionable source-bound calculation`,()=>{
 const examples=converterWorkedExamples(slug);expect(examples.length).toBeGreaterThan(0);
 const example=examples[0];expect(example.catalogId).toBe(id);expect(example.draft).toEqual({value:String(value),fromUnit:from,toUnit:to});
 expect(example.result).toBeCloseTo(expected,10);expect(example.formulas.length).toBeGreaterThan(0);expect(example.sources.length).toBeGreaterThan(0);
 expect(Object.isFrozen(example.draft)).toBe(true);
 });
 it('does not adopt unsupported or blocked calculators',()=>{expect(converterWorkedExamples('currency-converter')).toEqual([]);expect(converterWorkedExamples('loan-payment-calculator')).toEqual([]);});
});
