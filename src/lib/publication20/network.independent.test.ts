import {describe,it,expect} from 'vitest';
import {runCalculator} from '@/calculators/engine';
import {networkPublicationDefinitions} from './network';
const byId=(id:number)=>{const result=networkPublicationDefinitions.find(row=>row.catalogId===id);if(!result)throw Error(`Missing ${id}`);return result;};
describe('five exact registered technical publication callers',()=>{
 it('binds the exact existing identity/version, field and unit contracts',()=>{
  expect(networkPublicationDefinitions.map(row=>row.catalogId)).toEqual([370,371,372,373,374]);
  const identities=['technology.bandwidth','technology.download-time','technology.upload-time','technology.data-transfer','technology.storage-conversion'];
  for(const [index,row] of networkPublicationDefinitions.entries()){
   expect(row.definition.id).toBe(identities[index]);expect(row.definition.version).toBe(1);expect(row.definition.riskClass).toBe('standard');expect(row.primaryKey).toBe('value');
   const shape=(row.definition.inputSchema as unknown as {shape:Record<string,unknown>}).shape;expect(row.fields.map(field=>field.key)).toEqual(Object.keys(shape));
   const input=Object.fromEntries(row.fields.map(field=>[field.key,field.kind==='number'?Number(field.defaultValue):field.defaultValue]));
   expect(row.definition.inputSchema.safeParse(input).success).toBe(true);
   expect(runCalculator(row.definition,input).output.value).toBeGreaterThan(0);
  }
 });
 it.each([
  [370,{dataMegabytes:375,timeSeconds:24},125,'Mbps'],
  [371,{dataMegabytes:375,bandwidthMbps:125},24,'s'],
  [372,{dataMegabytes:0.125,bandwidthMbps:0.5},2,'s'],
  [373,{bandwidthMbps:125,timeSeconds:24},375,'MB'],
  [374,{value:3,fromUnit:'GiB',toUnit:'KiB'},3145728,'KiB'],
 ] as const)('uses independent exact rational witness for catalog #%i', (id,input,expected,unit)=>{
  const row=byId(id),result=runCalculator(row.definition,input).output;
  expect(result.value).toBe(expected);expect(row.outputUnit(input)).toBe(unit);
  expect(result.steps).toEqual([row.definition.title.replace(' Calculator','')+' = '+expected]);
 });
 it('distinguishes decimal transfer MB from binary IEC storage rather than relabeling them',()=>{
  const transfer=byId(373),binary=byId(374);
  expect(transfer.outputUnit({})).toBe('MB');expect(binary.fields.find(f=>f.key==='fromUnit')?.options).toEqual(['B','KiB','MiB','GiB','TiB']);
  expect(binary.fields.find(f=>f.key==='fromUnit')?.options).not.toContain('MB');
  expect(transfer.scope).toMatch(/decimal/);expect(binary.scope).toMatch(/binary/i);
 });
 it('does not coerce zero, blank or nonfinite technical inputs into valid work',()=>{
  for(const row of networkPublicationDefinitions){
   const input=Object.fromEntries(row.fields.map(field=>[field.key,field.kind==='number'?Number(field.defaultValue):field.defaultValue]));
   const key=row.fields.find(f=>f.kind==='number')!.key;
   for(const invalid of [0,-1,'',Infinity,NaN,1e101])expect(row.definition.inputSchema.safeParse({...input,[key]:invalid}).success).toBe(false);
  }
 });
 it('retains immutable underflow witnesses so the caller can refuse false zero without rewriting v1',()=>{
  // Positive exact formula values remain >0 mathematically. The original
  // finite-only v1 engine can underflow, so UI/replay acceptance must not
  // interpret this witnessed zero as a completed positive result.
  expect(runCalculator(byId(373).definition,{bandwidthMbps:Number.MIN_VALUE,timeSeconds:1}).output.value).toBe(0);
  expect(runCalculator(byId(374).definition,{value:Number.MIN_VALUE,fromUnit:'B',toUnit:'TiB'}).output.value).toBe(0);
 });
});
