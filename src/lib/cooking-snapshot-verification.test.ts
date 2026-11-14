import {it,expect} from 'vitest';
import {verifyRegisteredSnapshot} from './registered-snapshot-verification';
import {cookingMeasurementConverter as engine} from '@/calculators/conversion/catalog-batch-4';
import {createCalculationSnapshot} from './calculation-snapshot';
const capture=(value=1)=>{const input=engine.inputSchema.parse({value,fromUnit:'cup_us',toUnit:'ml'});return createCalculationSnapshot({calculatorSlug:engine.slug,calculatorVersion:1,input,output:engine.calculate(input,{})});};
it('verifies an existing cooking v1 historical snapshot without changing its engine or data',()=>{
 const snapshot=capture();const before=JSON.stringify(snapshot);expect(verifyRegisteredSnapshot(snapshot)).toMatchObject({snapshot,engineId:engine.id,engineVersion:1});expect(JSON.stringify(snapshot)).toBe(before);
});
it('rejects substituted versions, fields and outputs instead of upgrading history',()=>{
 const snapshot=capture();for(const bad of [{...snapshot,calculatorVersion:2},{...snapshot,input:{...snapshot.input,unapproved:1}},{...snapshot,output:{result:999}},{...snapshot,output:{...snapshot.output,unapproved:1}}])expect(()=>verifyRegisteredSnapshot(bad)).toThrow();
});
it('retains exact historical subnormal and zero behavior while new capture boundaries remain separate',()=>{
 for(const value of [0,-0,Number.MIN_VALUE,-2])expect(verifyRegisteredSnapshot(capture(value)).snapshot).toEqual(capture(value));
});
