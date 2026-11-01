/** Explicit agreement only; recorded bytes and historical engine versions are never rewritten. */
import {z} from 'zod';
import type {CalculatorDefinition} from '@/calculators/types';
import {physicsBatch3Definitions} from '@/calculators/physics/catalog-batch-3';
import {runCalculator} from '@/calculators/engine';
import {copyCalculationData,createCalculationSnapshot} from './calculation-snapshot';
import {sameRecordedJson} from './recorded-json-equality';

export const batch22PhysicsReplayBindings=Object.freeze(physicsBatch3Definitions.map(definition=>Object.freeze({slug:definition.slug,version:definition.version})));
const definitions=physicsBatch3Definitions as unknown as readonly CalculatorDefinition<Record<string,unknown>,Record<string,unknown>>[];
const shape=z.object({calculatorSlug:z.string().min(1).max(200),calculatorVersion:z.number().int().positive(),input:z.record(z.string(),z.unknown()),output:z.record(z.string(),z.unknown())}).strict();
export function verifyBatch22PhysicsSnapshot(raw:unknown){
 const clean=copyCalculationData({value:raw},{}).input.value;
 const snapshot=createCalculationSnapshot(shape.parse(clean));
 const binding=batch22PhysicsReplayBindings.find(row=>row.slug===snapshot.calculatorSlug&&row.version===snapshot.calculatorVersion);
 const definition=definitions.find(row=>row.slug===snapshot.calculatorSlug);
 if(!binding||!definition||definition.version!==binding.version)throw Error('This exact immutable version is not in the eleven-physics verification allowlist; no upgrade is applied.');
 const input=definition.inputSchema.parse(snapshot.input);
 if(Object.keys(snapshot.input).some(key=>!Object.hasOwn(input,key)))throw Error('Recorded input contains unsupported fields; original history is unchanged.');
 const output=runCalculator(definition,input).output;
 if(!sameRecordedJson(output,snapshot.output))throw Error('Recorded output does not agree with its exact immutable engine; original history is unchanged.');
 return Object.freeze({snapshot,engineId:definition.id,engineVersion:binding.version,scope:'Exact forward-engine agreement for this recorded input/output only. No full-domain, canonical, qualified, certification or publication acceptance is established.'});
}
