import {describe,it,expect} from 'vitest';
import {physicsBatch3Definitions} from '@/calculators/physics/catalog-batch-3';
import type {CalculatorDefinition} from '@/calculators/types';
import {runCalculator} from '@/calculators/engine';
import {createCalculationSnapshot,serializeCalculationJson} from './calculation-snapshot';
import {verifyRegisteredSnapshot} from './registered-snapshot-verification';
import {captureScenario} from './scenario-set';
import {serializeScenarioReportJson} from './scenario-report';
import {recoverScenarioSetJson} from './scenario-set-recovery';
const expected=[10,24,12,3,4,2,0.0089875517923,10,19.6,20,3];
describe('Batch22 eleven immutable physics workflow replay bindings',()=>{
 it.each(physicsBatch3Definitions.map((definition,i)=>({definition,expected:expected[i]})))('$definition.slug preserves native artifacts and rejects tampering',({definition,expected})=>{
 const input=definition.examples[0].input;
 const engine=definition as unknown as CalculatorDefinition<Record<string,unknown>,{value:number;steps:readonly string[]}>;
 const output=runCalculator(engine,input).output;
 expect(output.value).toBeCloseTo(expected,12);
 const snapshot=createCalculationSnapshot({calculatorSlug:definition.slug,calculatorVersion:1,input,output});
 const bytes=serializeCalculationJson(snapshot);
 expect(verifyRegisteredSnapshot(JSON.parse(bytes)).snapshot).toEqual(snapshot);
 const rows=captureScenario([],'A',snapshot,'baseline');
 const report=serializeScenarioReportJson(rows);
 expect(serializeScenarioReportJson(recoverScenarioSetJson(report,snapshot))).toBe(report);
 for(const mutate of [(x:{calculatorVersion:number;input:Record<string,unknown>;output:Record<string,unknown>})=>{x.calculatorVersion=2;},(x:{calculatorVersion:number;input:Record<string,unknown>;output:Record<string,unknown>})=>{x.output.value=999;},(x:{calculatorVersion:number;input:Record<string,unknown>;output:Record<string,unknown>})=>{x.output.steps=['tampered'];},(x:{calculatorVersion:number;input:Record<string,unknown>;output:Record<string,unknown>})=>{x.input.extra=1;}]){
 const changed=JSON.parse(bytes);mutate(changed);expect(()=>verifyRegisteredSnapshot(changed)).toThrow();}
 expect(serializeCalculationJson(snapshot)).toBe(bytes);
 for(const field of Object.keys(input)){for(const invalid of [NaN,Infinity,'',null]){const changed=JSON.parse(bytes);changed.input[field]=invalid;expect(()=>verifyRegisteredSnapshot(changed)).toThrow();}}
 });
});
