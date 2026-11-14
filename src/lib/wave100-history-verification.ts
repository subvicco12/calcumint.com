import {z} from 'zod';
import {rootFinderCalculator} from '@/calculators/advanced-math/catalog-batch-8';
import {triangleCalculator,rightTriangleCalculator,surfaceAreaCalculator} from '@/calculators/geometry/catalog-completion';
import {molarityCalculator,molesCalculator,dilutionCalculator} from '@/calculators/chemistry/catalog-batch-1';
import {launchDefinitions} from '@/calculators/launch-portfolio';
import {copyCalculationData,createCalculationSnapshot} from './calculation-snapshot';
import {equalCompletionJson} from '@/calculators/completion-contracts';
import {verifyRegisteredSnapshot} from './registered-snapshot-verification';
import type {CalculatorDefinition} from '@/calculators/types';
const polygon=launchDefinitions.find(row=>row.slug==='polygon-area-calculator'&&row.version===1)!;
const definitions=[rootFinderCalculator,triangleCalculator,rightTriangleCalculator,polygon,surfaceAreaCalculator,molarityCalculator,molesCalculator,dilutionCalculator] as unknown as readonly CalculatorDefinition<Record<string,unknown>,Record<string,unknown>>[];
export const wave100HistoricalBindings=Object.freeze(definitions.map(row=>Object.freeze({engineId:row.id,slug:row.slug,version:row.version})));
const shape=z.object({calculatorSlug:z.string().min(1).max(200),calculatorVersion:z.number().int().positive(),input:z.record(z.string(),z.unknown()),output:z.record(z.string(),z.unknown())}).strict();
/** Exact historical forward agreement only. New-capture narrowing is never applied to saved data. */
export function verifySavedSnapshotWithWave100(raw:unknown){
 const clean=copyCalculationData({value:raw},{}).input.value;
 const snapshot=createCalculationSnapshot(shape.parse(clean));
 const engine=definitions.find(row=>row.slug===snapshot.calculatorSlug);
 if(!engine)return verifyRegisteredSnapshot(snapshot);
 if(engine.version!==snapshot.calculatorVersion)throw Error('Exact historical version unavailable; no version substitution permitted');
 const input=engine.inputSchema.parse(snapshot.input);
 if(Object.keys(snapshot.input).some(key=>!Object.hasOwn(input,key)))throw Error('Unsupported recorded input field');
 const output=engine.calculate(input,{});
 if(!equalCompletionJson(output,snapshot.output))throw Error('Recorded result differs from its exact immutable engine');
 return Object.freeze({snapshot,engineId:engine.id,engineVersion:engine.version,scope:'Exact historical forward-engine agreement only; source authenticity, full domain, canonical acceptance, certification and publication remain unapproved.'});
}
