import {describe,it,expect} from 'vitest';
import {conversionPublicationDefinitions} from '@/lib/publication20/conversions';
import {createCalculationSnapshot} from '@/lib/calculation-snapshot';
import {runCalculator} from '@/calculators/engine';
import {verifyRegisteredSnapshot} from '@/lib/registered-snapshot-verification';
import {conversionFactoryDefinitions,getConversionFactoryDefinition,runConversionFactoryCalculation as run,replayConversionFactoryCalculation as replay} from './conversions';
const request=(catalogId=423,value='1',fromUnit='m',toUnit='cm')=>({catalogId,version:1,input:{value,fromUnit,toUnit}});
describe('conversion factory delivery boundary',()=>{
 it('reuses exact metadata and engines for only the twelve selected identities',()=>{
  expect(conversionFactoryDefinitions.map(row=>row.catalogId)).toEqual([423,424,425,427,428,430,431,432,433,434,438,440]);
  for(const row of conversionFactoryDefinitions){const original=conversionPublicationDefinitions.find(item=>item.catalogId===row.catalogId)!;expect(row.definition).toBe(original.definition);expect(row.fields).toBe(original.fields);expect(row.engineId).toBe(original.definition.id);expect(row.version).toBe(1);expect(Object.isFrozen(row)).toBe(true);const units=row.fields[1].options!;expect(row.run(request(row.catalogId,'1',units[0],units[1])).engineId).toBe(row.engineId);}
  for(const id of [429,437,439])expect(getConversionFactoryDefinition(id)).toBeUndefined();
 });
 it('refuses extra fields, revisions, non-string decimals and unit aliases',()=>{
  const good=request();for(const bad of [{...good,version:2},{...good,approved:true},{...good,input:{...good.input,extra:1}},{...good,input:{...good.input,value:1}},request(429),request(423,'1','M','cm'),request(434,'1','kb','B')])expect(()=>run(bad)).toThrow();
  for(const value of ['',' ','0x10','1junk','Infinity','NaN','1e309','1e-999','9007199254740993','0.10000000000000001'])expect(()=>run(request(423,value))).toThrow();
 });
 it('preserves raw decimal provenance, byte case and snapshot replay',()=>{
  const raw=request(434,' +2.00e0 ','MiB','KB'),result=run(raw);expect(result.enteredInput).toEqual(raw.input);expect(result.output.result).toBe(2097.152);expect(result.unit).toBe('KB');expect(replay(raw,JSON.parse(JSON.stringify(result.snapshot)))).toEqual(result);
  expect(()=>replay({...raw,input:{...raw.input,value:'3'}},result.snapshot)).toThrow();expect(()=>replay(raw,{...result.snapshot,output:{result:2097}})).toThrow();expect(()=>replay(raw,{...result.snapshot,calculatorVersion:2})).toThrow();
 });
 it('delegates current tiny/overflow boundaries while retaining historical replay',()=>{
  for(const raw of [request(423,'1e-307','m','km'),request(423,'1e-323','m','m'),request(423,'1e308','km','mm')])expect(()=>run(raw)).toThrow();
  expect((run(request(423,'1e-300','m','km')).output.result as number)/1e-303).toBeCloseTo(1,14);expect(run(request(423,'0')).output.result).toBe(0);
  const entry=getConversionFactoryDefinition(423)!,input={value:Number.MIN_VALUE,fromUnit:'m',toUnit:'km'},output=runCalculator(entry.definition,input).output;
  expect(output.result).toBe(0);expect(()=>verifyRegisteredSnapshot(createCalculationSnapshot({calculatorSlug:entry.definition.slug,calculatorVersion:1,input,output}))).not.toThrow();
 });
 it('retains OWN-427 algebraic negative Kelvin and legitimate affine zero',()=>{expect(run(request(427,'-300','c','k')).output.result).toBeCloseTo(-26.85,12);const raw=request(427,'-273.15','c','k'),result=run(raw);expect(result.output.result).toBe(0);expect(replay(raw,result.snapshot).output.result).toBe(0);});
});
