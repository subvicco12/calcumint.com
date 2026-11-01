/** Explicit agreement only; recorded bytes and historical engine versions are never rewritten. */
import {z} from 'zod';
import type {CalculatorDefinition} from '@/calculators/types';
import {graphingCalculator,functionPlotter2dCalculator} from '@/calculators/advanced-math/catalog-batch-10';
import {volumeCalculator,slopeCalculator} from '@/calculators/geometry/catalog-completion';
import {standardDeviationCalculator,varianceCalculator} from '@/calculators/statistics/catalog-batch-1';
import {runCalculator} from '@/calculators/engine';
import {copyCalculationData,createCalculationSnapshot} from './calculation-snapshot';
import {sameRecordedJson} from './recorded-json-equality';

export const batch21ReplayBindings=Object.freeze([
 {slug:'graphing-calculator',version:1},{slug:'function-plotter-2d',version:1},
 {slug:'volume-calculator',version:1},{slug:'slope-calculator',version:2},
 {slug:'standard-deviation-calculator',version:1},{slug:'variance-calculator',version:1},
].map(binding=>Object.freeze(binding)));
const definitions=[graphingCalculator,functionPlotter2dCalculator,volumeCalculator,slopeCalculator,standardDeviationCalculator,varianceCalculator] as unknown as readonly CalculatorDefinition<Record<string,unknown>,Record<string,unknown>>[];
const shape=z.object({calculatorSlug:z.string().min(1).max(200),calculatorVersion:z.number().int().positive(),input:z.record(z.string(),z.unknown()),output:z.record(z.string(),z.unknown())}).strict();
export function verifyBatch21Snapshot(raw:unknown){
 const clean=copyCalculationData({value:raw},{}).input.value;
 const snapshot=createCalculationSnapshot(shape.parse(clean));
 const binding=batch21ReplayBindings.find(row=>row.slug===snapshot.calculatorSlug&&row.version===snapshot.calculatorVersion);
 const definition=definitions.find(row=>row.slug===snapshot.calculatorSlug);
 if(!binding||!definition||definition.version!==binding.version)throw Error('This exact immutable version is not in the six-calculator verification allowlist; no upgrade is applied.');
 const input=definition.inputSchema.parse(snapshot.input);
 if(Object.keys(snapshot.input).some(key=>!Object.hasOwn(input,key)))throw Error('Recorded input contains unsupported fields; original history is unchanged.');
 const output=runCalculator(definition,input).output;
 if(!sameRecordedJson(output,snapshot.output))throw Error('Recorded output does not agree with its exact immutable engine; original history is unchanged.');
 return Object.freeze({snapshot,engineId:definition.id,engineVersion:binding.version,scope:'Exact forward-engine agreement for this recorded input/output only. No full-domain, canonical, qualified, certification or publication acceptance is established.'});
}
